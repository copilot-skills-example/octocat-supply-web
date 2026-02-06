// OctoCAT Supply Search Types

export type OctoCATRecordType = 'product' | 'supplier' | 'order';

export interface SearchMatch {
  recordType: OctoCATRecordType;
  recordId: number;
  mainText: string;
  detailText?: string;
  metaInfo?: Record<string, unknown>;
}

export interface SearchBoxConfig {
  inputHint?: string;
  matchHandler?: (match: SearchMatch) => void;
  containerStyle?: string;
}

export interface SearchAPIResponse {
  term: string;
  items: SearchMatch[];
}
