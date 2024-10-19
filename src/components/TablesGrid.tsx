import React from 'react';

interface Table {
  id: number;
  number: number;
  brand: 'MRSUNG' | 'Xingjue' | 'Diamond';
}

const TablesGrid: React.FC<{ tables: Table[] }> = ({ tables }) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tables.map((table) => (
        <div key={table.id} className="bg-white p-4 rounded shadow-md border border-gray-200">
          <div className="w-full h-32 bg-green-600 rounded mb-3 flex items-center justify-center">
            <span className="text-4xl text-white">#{table.number}</span>
          </div>
          <p className="text-sm text-gray-600"><span className="font-semibold">ID:</span> {table.id}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Brand:</span> {table.brand}</p>
        </div>
      ))}
    </div>
  );
};

export default TablesGrid;
