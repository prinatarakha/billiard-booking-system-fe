'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getTable } from '@/api/tables';
import { Table, TableOccupation } from '@/types';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { TABLE_BRANDS_TO_LABEL } from '@/app/constants';
import TableOccupationsTable from '@/components/TableOccupationsTable';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TableDetailPage() {
  const { tableId } = useParams();
  const [table, setTable] = useState<Table | null>(null);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [isLoadingOccupations, setIsLoadingOccupations] = useState(true);
  const [sortColumn, setSortColumn] = useState<keyof TableOccupation | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchTable = async () => {
      setIsLoadingTable(true);
      const fetchedTable = await getTable(tableId as string);
      if (fetchedTable) {
        setTable(fetchedTable);
      }
      setIsLoadingTable(false);
    };

    fetchTable();
    // Simulate loading occupations
    setTimeout(() => setIsLoadingOccupations(false), 200);
  }, [tableId]);

  const handleSort = (column: keyof TableOccupation) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sampleOccupations: TableOccupation[] = [
    {
      id: "occ-001",
      tableId: table?.id.toString() || '',
      startedAt: new Date("2023-04-15T14:30:00Z"),
      finishedAt: new Date("2023-04-15T15:45:00Z"),
      createdAt: new Date("2023-04-15T14:29:50Z"),
      updatedAt: new Date("2023-04-15T15:45:05Z")
    },
    {
      id: "occ-002",
      tableId: table?.id.toString() || '',
      startedAt: new Date("2023-04-16T10:15:00Z"),
      finishedAt: new Date("2023-04-16T11:45:00Z"),
      createdAt: new Date("2023-04-16T10:14:30Z"),
      updatedAt: new Date("2023-04-16T11:45:15Z")
    },
    // Add more sample occupations as needed
  ];

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
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Table Details</h2>
            {isLoadingTable ? (
              <LoadingSpinner />
            ) : table ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">ID</p>
                  <p className="text-sm font-bold text-gray-700 font-mono rounded"><span className="bg-gray-200 px-2 py-1  rounded-sm">{table.id}</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">Number</p>
                  <p className="text-lg font-semibold text-gray-700">{table.number}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">Brand</p>
                  <p className="text-lg font-semibold text-gray-700">{TABLE_BRANDS_TO_LABEL[table.brand]}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                  <p className="text-lg font-semibold text-gray-700">{table.updatedAt.toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">Table not found</p>
            )}
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col flex-grow overflow-hidden">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Table Occupations</h2>
            <div className="overflow-x-auto flex-grow rounded-lg">
              {isLoadingOccupations ? (
                <LoadingSpinner />
              ) : (
                <TableOccupationsTable
                  data={sampleOccupations}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  handleSort={handleSort}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
