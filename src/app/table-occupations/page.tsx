'use client'

import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import Sidebar from '@/components/Sidebar';
import TableOccupationsTable from '@/components/TableOccupationsTable';
import { TableOccupation } from '@/types';
import { getTableOccupations } from '@/api/tableOccupations';
import LoadingSpinner from '@/components/LoadingSpinner';
import TablePagination from '@/components/TablePagination';
import { DEFAULT_LIMIT_OPTIONS } from '../constants';

const TableOccupations: React.FC = () => {
  const [tableOccupations, setTableOccupations] = useState<TableOccupation[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof TableOccupation | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT_OPTIONS[1].value);
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
      setCount(fetchedTableOccupations.count);
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

          <TablePagination
            page={page}
            limit={limit}
            count={count}
            totalPages={totalPages}
            setPage={setPage}
            setLimit={setLimit}
            customSelectStyles={customSelectStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default TableOccupations;
