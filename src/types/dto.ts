import { Table, TableOccupation, TableOccupationSnakeCase, TableSnakeCase } from ".";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface GetTablesParams {
  pagination: PaginationParams;
}

export interface PaginationResponseSnakeCase {
  page: number;
  limit: number;
  count: number;
  total_pages: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  count: number;
  totalPages: number;
}

export interface GetTablesResponseSnakeCase extends PaginationResponseSnakeCase {
  tables: TableSnakeCase[];
}

export interface GetTablesResponse extends PaginationResponse {
  tables: Table[];
}

export interface SortParams {
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

export interface TableOccupationFilterParams {
  tableId?: string;
}

export interface GetTableOccupationsResponseSnakeCase extends PaginationResponseSnakeCase {
  table_occupations: TableOccupationSnakeCase[];
}

export interface GetTableOccupationsResponse extends PaginationResponse {
  tableOccupations: TableOccupation[];
}
