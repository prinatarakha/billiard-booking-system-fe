import { Table, TableSnakeCase } from '@/types';
import { GetTablesResponse, GetTablesResponseSnakeCase, PaginationParams } from '@/types/dto';
import axios from 'axios';

export async function getTables(params: { pagination: PaginationParams }): Promise<GetTablesResponse|null> {
  try {
    const { page, limit } = params.pagination;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tables`, {
      params: {
        page,
        limit,
      },
    });
    const data: GetTablesResponseSnakeCase = response.data;
    const result: GetTablesResponse = {
      page: data.page,
      limit: data.limit,
      count: data.count,
      totalPages: data.total_pages,
      tables: data.tables.map(table => ({
        id: table.id,
        number: table.number,
        brand: table.brand,
        createdAt: new Date(table.created_at),
        updatedAt: new Date(table.updated_at),
      })),
    };
    return result;
  } catch (error) {
    console.error('Error fetching tables:', error);
    return null;
  }
}

export async function createTable(newTable: Pick<Table, 'number' | 'brand'>): Promise<Table|null> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tables`, newTable);
    const data: TableSnakeCase = response.data;
    const result: Table = {
      id: data.id,
      number: data.number,
      brand: data.brand,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
    return result;
  } catch (error) {
    console.error('Error creating table:', error);
    return null;
  }
}
