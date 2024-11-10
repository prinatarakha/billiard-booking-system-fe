import { TableOccupation, TableOccupationSnakeCase } from "@/types";
import { CreateTableOccupationPayload, CreateTableOccupationPayloadSnakeCase, GetTableOccupationsResponse, GetTableOccupationsResponseSnakeCase, PaginationParams, SortParams, TableOccupationFilterParams, UpdateTableOccupationPayload, UpdateTableOccupationPayloadSnakeCase } from "@/types/dto";
import axios from "axios";
import { snakeCase } from "change-case";
import dayjs from "dayjs";

export async function getTableOccupations(params: { 
  pagination: PaginationParams,
  sort?: SortParams,
  filter?: TableOccupationFilterParams,
}): Promise<GetTableOccupationsResponse | null> {
  try {
    const queryParams: any = {
      ...params.pagination,
    };
    if (params.sort) queryParams.sort = `${snakeCase(params.sort.sortColumn)}:${params.sort.sortDirection}`;
    if (params.filter) {
      if (params.filter.tableId) queryParams.table_id = params.filter.tableId;
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/table-occupations`, {
      params: queryParams,
    });
    const data: GetTableOccupationsResponseSnakeCase = response.data;
    const result: GetTableOccupationsResponse = {
      page: data.page,
      limit: data.limit,
      count: data.count,
      totalPages: data.total_pages,
      tableOccupations: data.table_occupations.map(tableOccupation => ({
        id: tableOccupation.id,
        tableId: tableOccupation.table_id,
        startedAt: new Date(tableOccupation.started_at),
        finishedAt: tableOccupation.finished_at ? new Date(tableOccupation.finished_at) : null,
        createdAt: new Date(tableOccupation.created_at),
        updatedAt: new Date(tableOccupation.updated_at),
      })),
    };
    return result;
  } catch (error) {
    console.error('Error fetching table occupations:', error);
    return null;
  }
}

export async function createTableOccupation(params: CreateTableOccupationPayload): Promise<{tableOccupation?: TableOccupation, error?: string}> {
  try {
    const payload: CreateTableOccupationPayloadSnakeCase = {
      table_id: params.tableId,
      started_at: params.startedAt && dayjs(params.startedAt).isAfter(dayjs()) ? params.startedAt.toISOString() : undefined,
      finished_at: params.finishedAt ? params.finishedAt.toISOString() : undefined,
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/table-occupations`, payload);
    const data: TableOccupationSnakeCase = response.data;
    const tableOccupation: TableOccupation = {
      id: data.id,
      tableId: data.table_id,
      startedAt: new Date(data.started_at),
      finishedAt: data.finished_at ? new Date(data.finished_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
    return { tableOccupation };
  } catch (error: any) {
    console.error('Error creating table occupation:', error.response?.data);
    return { error: error.response?.data?.message || "Failed to create table occupation"};
  }
}

export async function deleteTableOccupation(tableOccupationId: string): Promise<{tableOccupation?: TableOccupation, error?: string}> {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/table-occupations/${tableOccupationId}`);
    const data: TableOccupationSnakeCase = response.data;
    const tableOccupation: TableOccupation = {
      id: data.id,
      tableId: data.table_id,
      startedAt: new Date(data.started_at),
      finishedAt: data.finished_at ? new Date(data.finished_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
    return { tableOccupation };
  } catch (error: any) {
    console.error('Error deleting table occupation:', error);
    return { error: error.response?.data?.message || "Failed to delete table occupation" };
  }
}

export async function updateTableOccupation(tableOccupationId: string, params: UpdateTableOccupationPayload): Promise<{tableOccupation?: TableOccupation, error?: string}> {
  try {
    const payload: UpdateTableOccupationPayloadSnakeCase = {
      table_id: params.tableId,
      started_at: params.startedAt ? params.startedAt.toISOString() : undefined,
    }
    if (params.finishedAt !== undefined) {
      payload.finished_at = params.finishedAt ? params.finishedAt.toISOString() : null;
    }
    
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/table-occupations/${tableOccupationId}`, payload);
    const data: TableOccupationSnakeCase = response.data;
    const tableOccupation: TableOccupation = {
      id: data.id,
      tableId: data.table_id,
      startedAt: new Date(data.started_at),
      finishedAt: data.finished_at ? new Date(data.finished_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
    return { tableOccupation };
  } catch (error: any) {
    console.error('Error updating table occupation:', error);
    return { error: error.response?.data?.message || "Failed to update table occupation" };
  }
}
