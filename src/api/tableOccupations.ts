import { TableOccupation } from "@/types";
import { GetTableOccupationsResponse, GetTableOccupationsResponseSnakeCase, PaginationParams, SortParams, TableOccupationFilterParams } from "@/types/dto";
import axios from "axios";
import { snakeCase } from "change-case";

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
