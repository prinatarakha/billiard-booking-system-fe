import React from 'react';
import { Table } from '@/types';
import { TABLE_BRANDS_TO_LABEL } from '@/app/constants';
import { useRouter } from 'next/navigation';
import NumberInput from '@/components/NumberInput';

interface TablesGridComponents {
  isEditing?: boolean;
  tables: Table[];
  onTableChanges: (table: Table, index: number) => void;
}

const TablesGrid: React.FC<TablesGridComponents> = ({ isEditing = false, tables, onTableChanges }) => {
  const router = useRouter();
  
  const handleClick = (tableId: string) => {
    if (isEditing) return;
    router.push(`/tables/${tableId}`);
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tables.map((table, index) => (
        <div onClick={() => handleClick(table.id)} key={table.id} className={`${!isEditing && "cursor-pointer"}`}>
          <div className="bg-white p-4 rounded shadow-md border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
            <div className="h-32 bg-green-600 rounded mb-3 flex items-center justify-center">
              {isEditing ? (
                <div className='flex items-center px-2 rounded-md bg-green-700'>
                  <span className="text-4xl text-white">#</span>
                  <NumberInput
                  className='text-4xl text-white bg-green-700 py-2 w-16 focus:outline-none'
                  value={table.number} 
                  onChange={(number: number) => onTableChanges({...table, number}, index)}
                  min={1}
                  />
                </div>
              ) : (
                <span className="text-4xl text-white">#{table.number}</span>
              )}
            </div>
            <p className="text-sm text-gray-600"><span className="font-semibold">Brand:</span> {TABLE_BRANDS_TO_LABEL[table.brand]}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Last Updated:</span> {table.updatedAt.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TablesGrid;
