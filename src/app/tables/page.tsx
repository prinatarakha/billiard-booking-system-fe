'use client';

import TablesGrid from '@/components/TablesGrid';
import Sidebar from '@/components/Sidebar';
import CreateTableButton from '@/components/CreateTableButton';
import { useState, useEffect, useRef } from 'react';
import CreateTableModal from '@/components/CreateTableModal';
import { getTables, createTable } from '@/api/tables';
import { Table } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchTables = async () => {
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

      setTables(updatedTables);
      setIsLoading(false);
    };

    fetchTables();
  }, []);

  const handleCreateTable = async (newTable: Pick<Table, 'number' | 'brand'>) => {
    const createdTable = await createTable(newTable);
    if (!createdTable) {
      alert('Failed to create table');
      return;
    }

    setTables(prevTables => [...prevTables, createdTable]);
    setIsModalOpen(false);
  };
  
  return (<>
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Tables</h1>
          <CreateTableButton setIsModalOpen={setIsModalOpen} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          {isLoading ? (
            <LoadingSpinner size="large" />
          ) : (
            <TablesGrid tables={tables} />
          )}
        </div>
      </div>
    </div>

    {isModalOpen && (
      <CreateTableModal
        onClose={() => setIsModalOpen(false)}
        onCreateTable={handleCreateTable}
      />
    )}
    </>
  );
}
