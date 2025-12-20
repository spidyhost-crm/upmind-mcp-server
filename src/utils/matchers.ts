/**
 * Utility functions for searching and matching API endpoints
 */

import type { ApiDocEndpoint } from '../types/apidoc.js';
import { stripHtml } from './formatters.js';

export function calculateRelevance(endpoint: ApiDocEndpoint, query: string): number {
  let score = 0;
  const queryLower = query.toLowerCase();

  if (endpoint.name) {
    const name = endpoint.name.toLowerCase();
    if (name === queryLower) {
      score += 100;
    } else if (name.includes(queryLower)) {
      score += 50;
    }
  }

  if (endpoint.title) {
    const title = endpoint.title.toLowerCase();
    if (title.includes(queryLower)) {
      score += 30;
    }
  }

  if (endpoint.description) {
    const plainDesc = stripHtml(endpoint.description).toLowerCase();
    if (plainDesc.includes(queryLower)) {
      score += 20;
    }
  }

  if (endpoint.group) {
    const group = endpoint.group.toLowerCase();
    if (group.includes(queryLower)) {
      score += 15;
    }
  }

  if (endpoint.groupTitle) {
    const groupTitle = endpoint.groupTitle.toLowerCase();
    if (groupTitle.includes(queryLower)) {
      score += 15;
    }
  }

  return score;
}

export function getMatchedFields(endpoint: ApiDocEndpoint, query: string): string[] {
  const queryLower = query.toLowerCase();
  const matched: string[] = [];

  if (endpoint.name && endpoint.name.toLowerCase().includes(queryLower)) {
    matched.push('name');
  }
  if (endpoint.title && endpoint.title.toLowerCase().includes(queryLower)) {
    matched.push('title');
  }
  if (endpoint.description && stripHtml(endpoint.description).toLowerCase().includes(queryLower)) {
    matched.push('description');
  }
  if (endpoint.group && endpoint.group.toLowerCase().includes(queryLower)) {
    matched.push('group');
  }
  if (endpoint.groupTitle && endpoint.groupTitle.toLowerCase().includes(queryLower)) {
    matched.push('groupTitle');
  }

  return matched;
}

export function findEndpoint(
  endpoints: ApiDocEndpoint[],
  identifier: string
): ApiDocEndpoint | null {
  const identifierLower = identifier.toLowerCase();

  let found = endpoints.find(e => e.name === identifier);
  if (found) return found;

  found = endpoints.find(e => e.name.toLowerCase() === identifierLower);
  if (found) return found;

  found = endpoints.find(e => e.url === identifier);
  if (found) return found;

  found = endpoints.find(e => e.url.toLowerCase() === identifierLower);
  return found || null;
}

export function findSimilarEndpoints(
  endpoints: ApiDocEndpoint[],
  name: string,
  limit: number = 5
): string[] {
  const nameLower = name.toLowerCase();
  const similar: Array<{ name: string; score: number }> = [];

  for (const endpoint of endpoints) {
    const endpointNameLower = endpoint.name.toLowerCase();
    if (endpointNameLower.includes(nameLower) || nameLower.includes(endpointNameLower)) {
      const score = calculateSimilarity(nameLower, endpointNameLower);
      similar.push({ name: endpoint.name, score });
    }
  }

  return similar
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.name);
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
