import { Table, TableSnakeCase } from ".";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface GetTablesParams {
  pagination: PaginationParams;
}

export interface GetTablesResponseSnakeCase {
  page: number;
  limit: number;
  count: number;
  total_pages: number;
  tables: TableSnakeCase[];
}

export interface GetTablesResponse {
  page: number;
  limit: number;
  count: number;
  totalPages: number;
  tables: Table[];
}
