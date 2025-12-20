/**
 * Tool: get_group_endpoints
 * Get all API endpoints within a specific group/category
 */

import type { CachedDocumentation, ApiDocEndpoint, EndpointSummary } from '../types/apidoc.js';
import { truncateDescription } from '../utils/formatters.js';

export interface GetGroupEndpointsParams {
  group: string;
  includeDetails?: boolean;
}

export interface GetGroupEndpointsResult {
  group: string;
  groupTitle: string;
  endpoints: EndpointSummary[] | ApiDocEndpoint[];
  totalEndpoints: number;
}

export function getGroupEndpoints(
  docs: CachedDocumentation,
  params: GetGroupEndpointsParams
): GetGroupEndpointsResult | { error: string; availableGroups: string[] } {
  const { group, includeDetails = false } = params;

  const groupEndpoints = docs.endpoints.filter(
    e => e.group.toLowerCase() === group.toLowerCase()
  );

  if (groupEndpoints.length === 0) {
    return {
      error: `Group '${group}' not found`,
      availableGroups: docs.groups,
    };
  }

  const sample = groupEndpoints[0];

  if (includeDetails) {
    return {
      group: sample.group,
      groupTitle: sample.groupTitle,
      endpoints: groupEndpoints,
      totalEndpoints: groupEndpoints.length,
    };
  }

  const summaries: EndpointSummary[] = groupEndpoints.map(endpoint => ({
    name: endpoint.name,
    title: endpoint.title,
    type: endpoint.type,
    url: endpoint.url,
    description: truncateDescription(endpoint.description, 150),
  }));

  return {
    group: sample.group,
    groupTitle: sample.groupTitle,
    endpoints: summaries,
    totalEndpoints: summaries.length,
  };
}
