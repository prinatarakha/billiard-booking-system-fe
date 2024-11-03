'use client'

import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Sidebar from '@/components/Sidebar';
import TableOccupationsTable from './_components/TableOccupationsTable';
import { Table, TableOccupation } from '@/types';
import { getTableOccupations } from '@/api/tableOccupations';
import LoadingSpinner from '@/components/LoadingSpinner';
import TablePagination from '@/components/TablePagination';
import { DEFAULT_LIMIT_OPTIONS } from '../constants';
import { getTables } from '@/api/tables';

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

  useEffect(() => {
    fetchTableOccupations();
  }, [page, limit, sortColumn, sortDirection]);

  useEffect(() => {
    if (page !== 1) setPage(1);
    else fetchTableOccupations();
  }, [selectedTableId]);

  // Generate unique table IDs for the dropdown
  // TODO: Hit an API to get all tables (just the IDs and numbers) without the need of pagination
  const fetchedRef = useRef(false);
  const [tableOptions, setTableOptions] = useState<{id: string, number: string}[]>([]);
  const fetchTableOptions = async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    setIsLoading(true);
    let page = 1;
    const limit = 25; // fetch 25 tables at a time
    let hasMorePages = true;
    const updatedTables: Table[] = [];

    while (hasMorePages) {
      const data = await getTables({ pagination: { page, limit } });
      if (!data) break;

      updatedTables.push(...data.tables);
      hasMorePages = page < data.totalPages;
      page++;
    }

    setTableOptions(updatedTables.map(({id, number}) => ({ id, number: number.toString() })));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTableOptions();
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
              options={tableOptions.map(({id, number}) => ({ value: id, label: `Table ${number}` }))}
              onChange={(option) => setSelectedTableId(option ? option.value : null)}
              isClearable
              placeholder="Filter by Table"
              className="w-54"
              styles={customSelectStyles}
            />
          </div>

          <div className="overflow-auto flex-grow">
            {isLoading || (!tableOptions.length && tableOccupations.length) ? (
              <LoadingSpinner />
            ) : (
              <TableOccupationsTable
                data={tableOccupations}
                tableOptions={tableOptions}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSort={handleSort}
                page={page}
                limit={limit}
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
