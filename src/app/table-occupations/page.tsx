'use client'

import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import Sidebar from '@/components/Sidebar';
import TableOccupationsTable from '@/components/TableOccupationsTable';
import { TableOccupation } from '@/types';
import { getTableOccupations } from '@/api/tableOccupations';
import LoadingSpinner from '@/components/LoadingSpinner';

// Sample data (replace this with your actual data fetching logic)
// const tableOccupations: TableOccupation[] = [
//   {
//     id: "occ-001",
//     tableId: "table-01-table-01-table-01-table-01-table-01",
//     startedAt: new Date("2023-04-15T14:30:00Z"),
//     finishedAt: new Date("2023-04-15T15:45:00Z"),
//     createdAt: new Date("2023-04-15T14:29:50Z"),
//     updatedAt: new Date("2023-04-15T15:45:05Z")
//   },
//   {
//     id: "occ-002",
//     tableId: "table-02-table-02-table-02-table-02-table-02",
//     startedAt: new Date("2023-04-15T16:00:00Z"),
//     finishedAt: new Date("2023-04-15T17:30:00Z"),
//     createdAt: new Date("2023-04-15T15:59:45Z"),
//     updatedAt: new Date("2023-04-15T17:30:10Z")
//   },
//   {
//     id: "occ-003",
//     tableId: "table-01",
//     startedAt: new Date("2023-04-16T10:15:00Z"),
//     finishedAt: new Date("2023-04-16T11:45:00Z"),
//     createdAt: new Date("2023-04-16T10:14:30Z"),
//     updatedAt: new Date("2023-04-16T11:45:15Z")
//   },
//   {
//     id: "occ-004",
//     tableId: "table-03",
//     startedAt: new Date("2023-04-16T13:00:00Z"),
//     finishedAt: new Date("2023-04-16T14:30:00Z"),
//     createdAt: new Date("2023-04-16T12:59:40Z"),
//     updatedAt: new Date("2023-04-16T14:30:05Z")
//   },
//   {
//     id: "occ-005",
//     tableId: "table-02",
//     startedAt: new Date("2023-04-16T15:45:00Z"),
//     finishedAt: new Date("2023-04-16T17:15:00Z"),
//     createdAt: new Date("2023-04-16T15:44:50Z"),
//     updatedAt: new Date("2023-04-16T17:15:10Z")
//   }
// ];

const TableOccupations: React.FC = () => {
  const [tableOccupations, setTableOccupations] = useState<TableOccupation[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof TableOccupation | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTableOccupations = async () => {
      setIsLoading(true); // Set loading to true before fetching
      const fetchedTableOccupations = await getTableOccupations({ 
        pagination: { page: page, limit: limit },
        sort: sortColumn ? { sortColumn, sortDirection } : undefined,
        filter: selectedTableId ? { tableId: selectedTableId } : undefined,
      });
      if (!fetchedTableOccupations) {
        alert('Failed to fetch table occupations');
        setIsLoading(false);
        return;
      }
      setTableOccupations(fetchedTableOccupations.tableOccupations);
      setTotalPages(fetchedTableOccupations.totalPages);
      setIsLoading(false);
    };
    fetchTableOccupations();
  }, [page, limit, sortColumn, sortDirection, selectedTableId]);

  // Generate unique table IDs for the dropdown
  // TODO: Hit an API to get all tables (just the IDs and numbers) without the need of pagination
  const tableIdOptions = useMemo(() => {
    const uniqueTableIds = Array.from(new Set(tableOccupations.map(item => item.tableId)));
    return uniqueTableIds.map(id => ({ value: id, label: id }));
  }, []);

  // Items per page options
  const limitOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
  ];

  const handleSort = (column: keyof TableOccupation) => {
    if (sortColumn == column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#f3f4f6',
      borderColor: '#d1d5db',
      '&:hover': {
        borderColor: '#9ca3af',
      },
    }),
    option: (provided: any, state: { isSelected: any; }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4b5563' : '#f3f4f6',
      color: state.isSelected ? 'white' : '#1f2937',
      '&:hover': {
        backgroundColor: '#9ca3af',
        color: 'white',
      },
    }),
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Table Occupations</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <Select
              options={tableIdOptions}
              onChange={(option) => setSelectedTableId(option ? option.value : null)}
              isClearable
              placeholder="Filter by Table ID"
              className="w-64"
              styles={customSelectStyles}
            />
          </div>

          <div className="overflow-auto flex-grow">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <TableOccupationsTable
                data={tableOccupations}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSort={handleSort}
              />
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, tableOccupations.length)} of {tableOccupations.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Select
                options={limitOptions}
                onChange={(option) => {
                  setLimit(option ? option.value : 10);
                  setPage(1);
                }}
                defaultValue={limitOptions[1]}
                placeholder="Items per page"
                className="w-32"
                styles={customSelectStyles}
              />
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOccupations;
