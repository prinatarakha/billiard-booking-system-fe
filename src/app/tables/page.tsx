'use client';

import TablesGrid from '@/components/TablesGrid';
import Sidebar from '@/components/Sidebar';
import CreateTableButton from '@/components/CreateTableButton';
import { useState } from 'react';
interface Table {
  id: number;
  number: number;
  brand: 'MRSUNG' | 'Xingjue' | 'Diamond';
}

// Sample data
const sampleTables: Table[] = [
  { id: 1, number: 1, brand: 'MRSUNG' },
  { id: 2, number: 2, brand: 'Xingjue' },
  { id: 3, number: 3, brand: 'Diamond' },
  { id: 4, number: 4, brand: 'MRSUNG' },
  { id: 5, number: 5, brand: 'Xingjue' },
];

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>(sampleTables);

  const handleCreateTable = (newTable: Omit<Table, 'id'>) => {
    setTables([...tables, { ...newTable, id: tables.length + 1 }]);
  };

  
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Tables</h1>
          <CreateTableButton onCreateTable={handleCreateTable} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <TablesGrid tables={tables} />
        </div>
      </div>
    </div>
  );
}
