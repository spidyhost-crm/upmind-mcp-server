/**
 * Tool: list_api_groups
 * Lists all API groups/categories in the Upmind API documentation
 */

import type { CachedDocumentation, GroupInfo } from '../types/apidoc.js';

export interface ListGroupsParams {
  includeCount?: boolean;
}

export interface ListGroupsResult {
  groups: GroupInfo[];
  totalGroups: number;
}

export function listApiGroups(
  docs: CachedDocumentation,
  params: ListGroupsParams
): ListGroupsResult {
  const { includeCount = true } = params;

  const groups: GroupInfo[] = docs.groups.map(group => {
    const groupEndpoints = docs.endpoints.filter(e => e.group === group);
    const sample = groupEndpoints[0];

    const groupInfo: GroupInfo = {
      name: group,
      title: sample?.groupTitle || group,
    };

    if (includeCount) {
      groupInfo.endpointCount = groupEndpoints.length;
    }

    return groupInfo;
  });

  return {
    groups,
    totalGroups: groups.length,
  };
}
