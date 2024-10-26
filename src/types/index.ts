export type TableBrand = 'mrsung' | 'xingjue' | 'diamond';

export interface Table {
  id: string;
  number: number;
  brand: TableBrand;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableSnakeCase {
  id: string;
  number: number;
  brand: TableBrand;
  created_at: string;
  updated_at: string;
}

export interface TableOccupation {
  id: string;
  tableId: string;
  startedAt: Date;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableOccupationSnakeCase {
  id: string;
  table_id: string;
  started_at: string;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}
