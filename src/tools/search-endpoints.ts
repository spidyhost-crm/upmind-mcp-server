/**
 * Tool: search_endpoints
 * Search Upmind API endpoints by keyword
 */

import type { CachedDocumentation, SearchResult } from '../types/apidoc.js';
import { calculateRelevance, getMatchedFields } from '../utils/matchers.js';
import { truncateDescription } from '../utils/formatters.js';

export interface SearchEndpointsParams {
  query: string;
  limit?: number;
}

export interface SearchEndpointsResult {
  results: SearchResult[];
  totalFound: number;
  query: string;
}

export function searchEndpoints(
  docs: CachedDocumentation,
  params: SearchEndpointsParams
): SearchEndpointsResult {
  const { query, limit = 10 } = params;

  const scoredResults: Array<SearchResult> = [];

  for (const endpoint of docs.endpoints) {
    const score = calculateRelevance(endpoint, query);

    if (score > 0) {
      scoredResults.push({
        name: endpoint.name,
        title: endpoint.title,
        group: endpoint.group,
        groupTitle: endpoint.groupTitle,
        type: endpoint.type,
        url: endpoint.url,
        description: truncateDescription(endpoint.description, 150),
        matchedFields: getMatchedFields(endpoint, query),
        relevanceScore: score,
      });
    }
  }

  scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const results = scoredResults.slice(0, limit);

  return {
    results,
    totalFound: scoredResults.length,
    query,
  };
}
