/**
 * Documentation cache for Upmind API documentation
 * Fetches and caches API data from apidocs.upmind.com
 */

import type { ApiDocEndpoint, ApiDocProject, CachedDocumentation } from '../types/apidoc.js';

export class DocumentationCache {
  private cache: CachedDocumentation | null = null;
  private fetchPromise: Promise<void> | null = null;

  private readonly config = {
    ttl: 60 * 60 * 1000, // 1 hour
    urls: {
      data: 'https://apidocs.upmind.com/api_data.json',
      project: 'https://apidocs.upmind.com/api_project.json',
    },
  };

  async getDocumentation(): Promise<CachedDocumentation> {
    if (this.cache && this.isCacheValid()) {
      return this.cache;
    }

    if (this.fetchPromise) {
      await this.fetchPromise;
      return this.cache!;
    }

    this.fetchPromise = this.refreshCache();

    try {
      await this.fetchPromise;
      return this.cache!;
    } catch (error) {
      if (this.cache) {
        console.error('Using stale cache due to fetch error:', error);
        return this.cache;
      }
      throw error;
    } finally {
      this.fetchPromise = null;
    }
  }

  async refreshCache(): Promise<void> {
    try {
      const [endpointsResponse, projectResponse] = await Promise.all([
        fetch(this.config.urls.data),
        fetch(this.config.urls.project),
      ]);

      if (!endpointsResponse.ok) {
        throw new Error(`Failed to fetch API data: ${endpointsResponse.statusText}`);
      }

      if (!projectResponse.ok) {
        throw new Error(`Failed to fetch project data: ${projectResponse.statusText}`);
      }

      const endpoints = (await endpointsResponse.json()) as ApiDocEndpoint[];
      const project = (await projectResponse.json()) as ApiDocProject;

      const groups = this.extractGroups(endpoints);

      this.cache = {
        endpoints,
        project,
        groups,
        lastFetched: Date.now(),
      };

      console.error(`Documentation cache refreshed: ${endpoints.length} endpoints, ${groups.length} groups`);
    } catch (error) {
      console.error('Failed to refresh documentation cache:', error);
      throw error;
    }
  }

  private isCacheValid(): boolean {
    if (!this.cache) return false;
    const age = Date.now() - this.cache.lastFetched;
    return age < this.config.ttl;
  }

  private extractGroups(endpoints: ApiDocEndpoint[]): string[] {
    const groupSet = new Set<string>();
    for (const endpoint of endpoints) {
      groupSet.add(endpoint.group);
    }
    return Array.from(groupSet).sort();
  }
}
