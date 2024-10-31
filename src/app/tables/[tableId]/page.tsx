'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getTable, updateTables } from '@/api/tables';
import { Table, TableBrand, TableOccupation } from '@/types';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { DEFAULT_LIMIT_OPTIONS } from '@/app/constants';
import TableOccupationsTable from '@/components/TableOccupationsTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getTableOccupations } from '@/api/tableOccupations';
import TablePagination from '@/components/TablePagination';
import TableDetails from './_components/TableDetails';
import Button from '@/components/Button';
import { FaPlus } from 'react-icons/fa';

export default function TableDetailPage() {
  const { tableId } = useParams();
  const [table, setTable] = useState<Table | null>(null);
  const [updateTableInput, setUpdateTableInput] = useState<{ number: number, brand: TableBrand } | null>(null);
  const [isUpdatingTable, setIsUpdatingTable] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT_OPTIONS[1].value);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tableOccupations, setTableOccupations] = useState<TableOccupation[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [isLoadingOccupations, setIsLoadingOccupations] = useState(true);
  const [sortColumn, setSortColumn] = useState<keyof TableOccupation>('startedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTable = async () => {
    setIsLoadingTable(true);
    const fetchedTable = await getTable(tableId as string);
    if (fetchedTable) {
      setTable(fetchedTable);
    }
    setIsLoadingTable(false);
  };

  const fetchTableOccupations = async () => {
    setIsLoadingOccupations(true);
    const fetchedTableOccupations = await getTableOccupations({
      pagination: { page: page, limit: limit },
      filter: { tableId: tableId as string },
      sort: { sortColumn: sortColumn, sortDirection: sortDirection },
    });
    if (fetchedTableOccupations) {
      setTableOccupations(fetchedTableOccupations.tableOccupations);
      setCount(fetchedTableOccupations.count);
      setTotalPages(fetchedTableOccupations.totalPages);
    }
    setIsLoadingOccupations(false);
  };

  useEffect(() => {
    fetchTable();
  }, [tableId]);

  useEffect(() => {
    if (table) {
      setUpdateTableInput(table);
    }
  }, [table]);

  useEffect(() => {
    if (tableId) fetchTableOccupations();
  }, [page, limit, tableId, sortColumn, sortDirection]);

  const handleSort = (column: keyof TableOccupation) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleUpdateTable = async () => {
    // check if there is any change
    if (table?.brand === updateTableInput?.brand && table?.number === updateTableInput?.number) {
      setIsUpdatingTable(false);
      return;
    }
    
    setIsUpdatingTable(true);
    const result = await updateTables([{ id: tableId as string, number: updateTableInput?.number, brand: updateTableInput?.brand }]);
    if (result.error || !result.tables) {
      alert(result.error || 'Failed to update table');
      setIsUpdatingTable(false);
      return;
    }
    setTable(result.tables[0]);
    setIsUpdatingTable(false);
  };

  const handleTableInputChange = (input: { number?: number, brand?: TableBrand }) => {
    if (updateTableInput) {
      setUpdateTableInput({ ...updateTableInput, ...input });
    }
  };

  const handleCancelUpdate = () => {
    if (table) setUpdateTableInput(table);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-hidden">
        <div className="flex mb-6">
          <Link href="/tables" className="text-gray-600 hover:text-gray-800 py-2 px-4 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Table {table?.number}</h1>
        </div>

        <div className="flex flex-col h-auto">
          <TableDetails 
            table={table} 
            isUpdating={isUpdatingTable} 
            onUpdate={handleUpdateTable} 
            updateTableInput={updateTableInput} 
            onTableInputChange={handleTableInputChange}
            isLoading={isLoadingTable} 
            onCancelUpdate={handleCancelUpdate}
          />
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col flex-grow overflow-hidden">
            <div className='flex justify-between items-center mb-4'>
              <h2 className="text-2xl font-semibold text-gray-700">Table Occupations</h2>
              <Button  
              onClick={() => {}}
              type='primary'
              buttonTitle={<FaPlus/>}
              />
            </div>
            <div className="overflow-x-auto flex-grow rounded-lg">
              {isLoadingOccupations ? (
                <LoadingSpinner />
              ) : tableOccupations.length ? (
                <>
                  <TableOccupationsTable
                    data={tableOccupations}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    handleSort={handleSort}
                  />
                  <TablePagination
                    page={page}
                    limit={limit}
                    count={count}
                    totalPages={totalPages}
                    setPage={setPage}
                    setLimit={setLimit}
                  />
                </>
              ) : (
                <p className="text-gray-700">No table occupations found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
