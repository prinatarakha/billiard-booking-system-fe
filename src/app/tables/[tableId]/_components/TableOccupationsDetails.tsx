'use client';

import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { TableOccupation } from "@/types";
import { FaPlus } from "react-icons/fa";
import TableOccupationsTable from "./TableOccupationsTable";
import TablePagination from "@/components/TablePagination";
import CreateTableOccupationModal from "./CreateTableOccupationModal";
import { useState } from "react";
import dayjs from "dayjs";
import { createTableOccupation, deleteTableOccupation, updateTableOccupation } from "@/api/tableOccupations";
import { CreateTableOccupationPayload } from "@/types/dto";
import UpdateTableOccupationModal from "./UpdateTableOccupationModal";

interface TableOccupationsDetailsProps {
  tableId: string;
  isTableOccupied: boolean;
  fetchTableOccupations: () => Promise<void>;
  fetchActiveOccupation: () => Promise<void>;
  isLoadingOccupations: boolean;
  tableOccupations: TableOccupation[];
  sortColumn: keyof TableOccupation | null;
  sortDirection: "asc" | "desc";
  handleSort: (column: keyof TableOccupation) => void;
  page: number;
  limit: number;
  count: number;
  totalPages: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const TableOccupationsDetails: React.FC<TableOccupationsDetailsProps> = ({
  tableId,
  isTableOccupied,
  fetchTableOccupations,
  fetchActiveOccupation,
  isLoadingOccupations,
  tableOccupations,
  sortColumn,
  sortDirection,
  handleSort,
  page,
  limit,
  count,
  totalPages,
  setPage,
  setLimit,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newTableOccupation, setNewTableOccupation] = useState<CreateTableOccupationPayload>({
    tableId: tableId as string,
    startedAt: null,
    finishedAt: null,
  });
  const [isLoadingCreateTableOccupation, setIsLoadingCreateTableOccupation] = useState<boolean>(false);
  const [isLoadingUpdateTableOccupation, setIsLoadingUpdateTableOccupation] = useState<boolean>(false);
  const [selectedTableOccupationToUpdate, setSelectedTableOccupationToUpdate] = useState<TableOccupation | null>(null);

  const handleTableOccupationChanges = (data: { startedAt?: Date | null, finishedAt?: Date | null }) => {
    setNewTableOccupation({
      ...newTableOccupation,
      ...data,
    });
  }

  const handleCreateTableOccupation = async () => {
    setIsLoadingCreateTableOccupation(true);

    if (dayjs(newTableOccupation.startedAt).isBefore(dayjs()) && 
      !window.confirm("Started at must be after current time, do you want to set it to current time?")
    ) {
      alert("Please change the 'Started At' value!");
      setIsLoadingCreateTableOccupation(false);
      return;
    }

    const result = await createTableOccupation(newTableOccupation);
    if (!result.tableOccupation || result.error) {
      alert(result.error || "Failed to create table occupation");
      setIsLoadingCreateTableOccupation(false);
      return;
    }

    setIsLoadingCreateTableOccupation(false);
    setIsCreateModalOpen(false);
    handleTableOccupationChanges({ // reset data
      startedAt: null,
      finishedAt: null,
    });

    await fetchTableOccupations();
    await fetchActiveOccupation();
  }

  const handleDeleteTableOccupation = async (tableOccupationId: string) => {
    const result = await deleteTableOccupation(tableOccupationId);
    if (!result.tableOccupation || result.error) {
      alert(result.error || "Failed to delete table occupation");
      return;
    }

    if (page === 1 && sortColumn === 'startedAt' && sortDirection === 'desc') {
      await fetchActiveOccupation();
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

  const handleUpdateTableOccupation = async ({startedAt, finishedAt}: {startedAt?: Date, finishedAt?: Date | null}) => {
    if (!selectedTableOccupationToUpdate ||
      (startedAt === undefined && finishedAt === undefined)
    ) return;

    if ((
        !startedAt || dayjs(startedAt).isSame(dayjs(selectedTableOccupationToUpdate.startedAt))
      ) && (
        finishedAt === undefined || 
        (finishedAt === null && selectedTableOccupationToUpdate.finishedAt === null) ||
        dayjs(finishedAt).isSame(dayjs(selectedTableOccupationToUpdate.finishedAt))
      )
    ) {
      alert("No changes made!");
      return;
    }

    setIsLoadingUpdateTableOccupation(true);
    const result = await updateTableOccupation(selectedTableOccupationToUpdate.id, {startedAt, finishedAt});
    if (!result.tableOccupation || result.error) {
      alert(result.error || "Failed to update table occupation");
      setIsLoadingUpdateTableOccupation(false);
      return;
    }
    setIsLoadingUpdateTableOccupation(false);
    setIsUpdateModalOpen(false);
    await fetchTableOccupations();

    if (page === 1 && 
      sortColumn === 'startedAt' && 
      sortDirection === 'desc' && 
      tableOccupations.length && 
      tableOccupations[0].id === selectedTableOccupationToUpdate.id
    ) {
      await fetchActiveOccupation();
    }
    setSelectedTableOccupationToUpdate(null);
  }
  
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedTableOccupationToUpdate(null);
  }

  return (<>
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col flex-grow overflow-hidden">
      <div className='flex justify-between items-center mb-4'>
        <h2 className="text-2xl font-semibold text-gray-700">Table Occupations</h2>
        <Button  
          onClick={() => setIsCreateModalOpen(true)}
          type='primary'
          buttonTitle={<FaPlus/>}
          disabled={isTableOccupied}
        />
      </div>
      <div className="overflow-x-auto flex-grow rounded-lg">
        {isLoadingOccupations ? (
          <LoadingSpinner />
        ) : tableOccupations.length ? (
          <>
            <TableOccupationsTable
              onEdit={handleEditIconClick}
              onDelete={handleDeleteTableOccupation}
              data={tableOccupations}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              handleSort={handleSort}
              page={page}
              limit={limit}
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

    {isCreateModalOpen && (
      <CreateTableOccupationModal
        onClose={() => setIsCreateModalOpen(false)}
        tableOccupation={newTableOccupation}
        onChanges={handleTableOccupationChanges}
        isLoadingCreate={isLoadingCreateTableOccupation}
        onSubmit={handleCreateTableOccupation}
      />
    )}
    
    {isUpdateModalOpen && (
      <UpdateTableOccupationModal
        onClose={handleCloseUpdateModal}
        tableOccupation={selectedTableOccupationToUpdate}
        isLoadingUpdate={isLoadingUpdateTableOccupation}
        onSubmit={handleUpdateTableOccupation}
      />
    )}
  </>)

}

export default TableOccupationsDetails;