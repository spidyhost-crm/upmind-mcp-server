/**
 * Type definitions for apidocjs documentation structure
 */

export interface ApiDocField {
  group: string;
  type: string;
  optional: boolean;
  field: string;
  description: string;
  defaultValue?: string;
  size?: string;
  allowedValues?: string[];
}

export interface ApiDocHeader {
  group: string;
  type: string;
  optional: boolean;
  field: string;
  description: string;
}

export interface ApiDocPermission {
  name: string;
  title: string;
}

export interface ApiDocSampleRequest {
  url: string;
}

export interface ApiDocEndpoint {
  group: string;
  version: string;
  type: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  title: string;
  description: string;
  name: string;
  permission?: ApiDocPermission[];
  parameter?: {
    fields: Record<string, ApiDocField[]>;
  };
  success?: {
    fields: Record<string, ApiDocField[]>;
  };
  error?: {
    fields: Record<string, ApiDocField[]>;
  };
  header?: {
    fields: Record<string, ApiDocHeader[]>;
  };
  filename: string;
  groupTitle: string;
  sampleRequest?: ApiDocSampleRequest[];
}

export interface ApiDocProject {
  name: string;
  version: string;
  description: string;
  title: string;
  url: string;
  sampleUrl?: string;
  defaultVersion: string;
  apidoc: string;
  generator: {
    name: string;
    time: string;
    url: string;
    version: string;
  };
}

export interface CachedDocumentation {
  endpoints: ApiDocEndpoint[];
  project: ApiDocProject;
  groups: string[];
  lastFetched: number;
}

export interface SearchResult {
  name: string;
  title: string;
  group: string;
  groupTitle: string;
  type: string;
  url: string;
  description: string;
  matchedFields: string[];
  relevanceScore: number;
}

export interface GroupInfo {
  name: string;
  title: string;
  endpointCount?: number;
}

export interface EndpointSummary {
  name: string;
  title: string;
  type: string;
  url: string;
  description: string;
}
