import React from 'react';
import { Table } from '@/types';
import { TABLE_BRANDS_TO_LABEL } from '@/app/constants';
const TablesGrid: React.FC<{ tables: Table[] }> = ({ tables }) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tables.map((table) => (
        <div key={table.id} className="bg-white p-4 rounded shadow-md border border-gray-200">
          <div className="w-full h-32 bg-green-600 rounded mb-3 flex items-center justify-center">
            <span className="text-4xl text-white">#{table.number}</span>
          </div>
          <p className="text-sm text-gray-600"><span className="font-semibold">Brand:</span> {TABLE_BRANDS_TO_LABEL[table.brand]}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Last Updated:</span> {table.updatedAt.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default TablesGrid;
