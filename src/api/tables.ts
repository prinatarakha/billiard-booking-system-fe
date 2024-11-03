import { Table, TableBrand, TableSnakeCase } from '@/types';
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

export async function createTable(newTable: Pick<TableSnakeCase, 'number' | 'brand'>): Promise<Table|null> {
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

export async function getTable(tableId: string): Promise<Table | null> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tables/${tableId}`);
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
    console.error('Error fetching table:', error);
    return null;
  }
}

export async function updateTables(tables: { id: string, number?: number, brand?: TableBrand }[]): Promise<{tables?: Table[], error?: string}> {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tables`, {tables});
    const data: TableSnakeCase[] = response.data.updated_tables;
    const result: Table[] = data.map(table => ({
      id: table.id,
      number: table.number,
      brand: table.brand,
      createdAt: new Date(table.created_at),
      updatedAt: new Date(table.updated_at),
    }));
    return { tables: result };
  } catch (error: any) {
    console.error('Error updating tables:', error);
    return { error: error.response?.data.message || 'Failed to update tables' };
  }
}

export async function deleteTable(tableId: string): Promise<Table | null> {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tables/${tableId}`);
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
    console.error('Error deleting table:', error);
    return null;
  }
}