'use client'

import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Sidebar from '@/components/Sidebar';
import TableOccupationsTable from './_components/TableOccupationsTable';
import { Table, TableOccupation } from '@/types';
import { createTableOccupation, deleteTableOccupation, getTableOccupations, updateTableOccupation } from '@/api/tableOccupations';
import LoadingSpinner from '@/components/LoadingSpinner';
import TablePagination from '@/components/TablePagination';
import { DEFAULT_LIMIT_OPTIONS } from '../constants';
import { getTables } from '@/api/tables';
import Button from '@/components/Button';
import { FaPlus } from 'react-icons/fa';
import CreateTableOccupationModal from './_components/CreateTableOccupationModal';
import { CreateTableOccupationPayload } from '@/types/dto';
import dayjs from 'dayjs';
import UpdateTableOccupationModal from './_components/UpdateTableOccupationModal';

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

  const fetchedRef = useRef(false);
  const [tableOptions, setTableOptions] = useState<{id: string, number: string}[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const defaultTableOccupation: CreateTableOccupationPayload = {
    tableId: '',
    startedAt: null,
    finishedAt: null,
  };
  const [newTableOccupation, setNewTableOccupation] = useState<CreateTableOccupationPayload>(defaultTableOccupation);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTableOccupationToUpdate, setSelectedTableOccupationToUpdate] = useState<TableOccupation | null>(null);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

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

  const handleNewTableOccupationChanges = (data: {tableId?: string, startedAt?: Date | null, finishedAt?: Date | null}) => {
    setNewTableOccupation(prev => ({ ...prev, ...data }));
  };

  const handleCreateTableOccupationSubmit = async () => {
    setIsLoadingCreate(true);

    if (!newTableOccupation.tableId) {
      alert('Table is required');
      setIsLoadingCreate(false);
      return;
    }

    if (dayjs(newTableOccupation.startedAt).isBefore(dayjs().add(1, "minute"))) {
      if (window.confirm("Started at must be after current time, do you want to set it to current time?")) {
        handleNewTableOccupationChanges({startedAt: dayjs().add(10, "seconds").toDate()});
      } else {
        alert("Please change the 'Started At' value!");
        setIsLoadingCreate(false);
        return;
      }
    }

    const result = await createTableOccupation(newTableOccupation);
    if (!result.tableOccupation || result.error) {
      alert(result.error || "Failed to create table occupation");
      setIsLoadingCreate(false);
      return;
    }

    setIsLoadingCreate(false);
    setIsCreateModalOpen(false);
    setNewTableOccupation(defaultTableOccupation);
    fetchTableOccupations();
  };

  const handleDeleteTableOccupation = async (tableOccupationId: string) => {
    const result = await deleteTableOccupation(tableOccupationId);
    if (!result.tableOccupation || result.error) {
      alert(result.error || "Failed to delete table occupation");
      return;
    }

    if (tableOccupations.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      await fetchTableOccupations();
    }
  }

  const handleEditIconClick = (tableOccupation: TableOccupation) => {
    setSelectedTableOccupationToUpdate(tableOccupation);
    setIsUpdateModalOpen(true);
  }

  const handleUpdateTableOccupation = async ({tableId, startedAt, finishedAt}: {tableId?: string, startedAt?: Date, finishedAt?: Date | null}) => {
    if (!selectedTableOccupationToUpdate ||
      (startedAt === undefined && finishedAt === undefined && !tableId)
    ) return;

    if ((
        !startedAt || dayjs(startedAt).isSame(dayjs(selectedTableOccupationToUpdate.startedAt))
      ) && (
        finishedAt === undefined || 
        (finishedAt === null && selectedTableOccupationToUpdate.finishedAt === null) ||
        dayjs(finishedAt).isSame(dayjs(selectedTableOccupationToUpdate.finishedAt))
      ) && (
        !tableId || 
        tableId === selectedTableOccupationToUpdate.tableId
      )
    ) {
      alert("No changes made!");
      return;
    }

    setIsLoadingUpdate(true);
    const result = await updateTableOccupation(selectedTableOccupationToUpdate.id, {tableId, startedAt, finishedAt});
    if (!result.tableOccupation || result.error) {
      alert(result.error || "Failed to update table occupation");
      setIsLoadingUpdate(false);
      return;
    }
    setIsLoadingUpdate(false);
    setIsUpdateModalOpen(false);
    await fetchTableOccupations();
  }
  
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedTableOccupationToUpdate(null);
  }

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
            <Button  
              onClick={() => setIsCreateModalOpen(true)}
              type='primary'
              buttonTitle={<FaPlus/>}
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
                onEdit={handleEditIconClick}
                onDelete={handleDeleteTableOccupation}
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

          {isCreateModalOpen && (
            <CreateTableOccupationModal
              onClose={() => setIsCreateModalOpen(false)}
              tableOptions={tableOptions}
              tableOccupation={newTableOccupation}
              onChanges={handleNewTableOccupationChanges}
              isLoadingCreate={isLoadingCreate}
              onSubmit={handleCreateTableOccupationSubmit}
            />
          )}

          {isUpdateModalOpen && (
            <UpdateTableOccupationModal
              onClose={handleCloseUpdateModal}
              tableOccupation={selectedTableOccupationToUpdate}
              isLoadingUpdate={isLoadingUpdate}
              onSubmit={handleUpdateTableOccupation}
              tableOptions={tableOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TableOccupations;
