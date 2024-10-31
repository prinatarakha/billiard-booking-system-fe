'use client';

import TablesGrid from '@/components/TablesGrid';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect, useRef } from 'react';
import CreateTableModal from '@/components/CreateTableModal';
import { getTables, createTable, updateTables } from '@/api/tables';
import { Table } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import { FaPlus } from 'react-icons/fa';
import EditIcon from '@/components/EditIcon';

type EditedTable = Table & { isChanged: boolean };

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedTables, setEditedTables] = useState<EditedTable[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  // useRef is a React hook that allows you to create a mutable object which persists for the full lifetime of the component. 
  // It can be used to store a value that does not cause re-renders when updated. 
  // Here, fetchedRef is initialized to false and is used to track whether the tables have already been fetched.
  const fetchedRef = useRef(false);

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

  useEffect(() => {
    fetchTables();
  }, []);
  
  useEffect(() => {
    setEditedTables(tables.map(t => ({...t, isChanged: false})));
  }, [tables]);

  const handleCreateTable = async (newTable: Pick<Table, 'number' | 'brand'>) => {
    const createdTable = await createTable(newTable);
    if (!createdTable) {
      alert('Failed to create table');
      return;
    }

    setTables(prevTables => [...prevTables, createdTable]);
    setIsModalOpen(false);
  };

  const handleTableChanges = (table: Table, index: number) => {
    const originalTable = tables[index];
    // use keys of originalTable to prevent comparing 'isChanged'
    const isChanged = Object.keys(originalTable).some((key) => {
      return (table as any)[key] != (originalTable as any)[key];
    });
    const updatedTables = [...editedTables];
    updatedTables[index] = {...table, isChanged: isChanged};
    console.log(updatedTables[index]);
    setEditedTables(updatedTables);
  }

  const handleExitEditMode = () => {
    setEditedTables(tables.map(t => ({...t, isChanged: false})));
    setIsEditing(false);
  }

  const handleSaveChanges = async () => {
    const updatedTables = editedTables
      .filter((t => t.isChanged))
      .map((t) => ({id: t.id, number: t.number, brand: t.brand}));

    if (!updatedTables.length) {
      setIsEditing(false);
      return;
    }

    const result = await updateTables(updatedTables);
    if (result.error) {
      alert(result.error);
    } else {
      fetchedRef.current = false;
      await fetchTables();
      setIsEditing(false);
    }
  }
  
  return (<>
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Tables</h1>
          <div className='flex space-x-4 items-center'>
            {!isEditing && (
              <EditIcon 
              onClick={() => setIsEditing(true)}
              />
            )}
            <Button  
            onClick={() => setIsModalOpen(true)}
            type='primary'
            buttonTitle={<FaPlus/>}
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          {isLoading ? (
            <LoadingSpinner size="large" />
          ) : (
            <div className='flex-col space-y-4'>
              {isEditing && (
                <div className='flex bg-yellow-100 border rounded-lg p-2 justify-between items-center'>
                  <p className="text-sm font-medium text-gray-700 ml-2">You are in edit mode</p>
                  <div className='flex space-x-2'>
                    <Button 
                    onClick={handleExitEditMode}
                    type='secondary'
                    buttonTitle={"Cancel"}
                    />
                    <Button 
                    onClick={handleSaveChanges}
                    type='primary'
                    buttonTitle={"Save"}
                    />
                  </div>
                </div>
              )}
              <TablesGrid 
              tables={isEditing ? editedTables : tables} 
              isEditing={isEditing} 
              onTableChanges={handleTableChanges} 
              />
            </div>
          )}
        </div>
      </div>
    </div>

    {isModalOpen && (
      <CreateTableModal
        onClose={() => setIsModalOpen(false)}
        defaultNumber={tables.length + 1}
        onCreateTable={handleCreateTable}
      />
    )}
    </>
  );
}
