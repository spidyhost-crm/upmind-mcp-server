/**
 * Tool: get_endpoint_details
 * Get detailed information about a specific API endpoint
 */

import type { CachedDocumentation, ApiDocEndpoint } from '../types/apidoc.js';
import { findEndpoint, findSimilarEndpoints } from '../utils/matchers.js';

export interface GetEndpointDetailsParams {
  name: string;
}

export interface GetEndpointDetailsResult {
  endpoint: ApiDocEndpoint;
}

export function getEndpointDetails(
  docs: CachedDocumentation,
  params: GetEndpointDetailsParams
): GetEndpointDetailsResult | { error: string; suggestions?: string[] } {
  const { name } = params;

  const endpoint = findEndpoint(docs.endpoints, name);

  if (!endpoint) {
    const suggestions = findSimilarEndpoints(docs.endpoints, name, 5);
    return {
      error: `Endpoint '${name}' not found`,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }

  return {
    endpoint,
  };
}
