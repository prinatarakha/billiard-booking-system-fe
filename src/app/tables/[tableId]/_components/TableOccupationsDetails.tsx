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
import { createTableOccupation, deleteTableOccupation } from "@/api/tableOccupations";
import { CreateTableOccupationPayload } from "@/types/dto";

interface TableOccupationsDetailsProps {
  tableId: string;
  fetchTableOccupations: () => Promise<void>;
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
  fetchTableOccupations,
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
  const [newTableOccupation, setNewTableOccupation] = useState<CreateTableOccupationPayload>({
    tableId: tableId as string,
    startedAt: null,
    finishedAt: null,
  });
  const [isLoadingCreateTableOccupation, setIsLoadingCreateTableOccupation] = useState<boolean>(false);

  const handleTableOccupationChanges = (data: { startedAt?: Date | null, finishedAt?: Date | null }) => {
    setNewTableOccupation({
      ...newTableOccupation,
      ...data,
    });
  }

  const handleCreateTableOccupation = async () => {
    setIsLoadingCreateTableOccupation(true);

    if (dayjs(newTableOccupation.startedAt).isBefore(dayjs().add(1, "minute"))) {
      if (window.confirm("Started at must be after current time, do you want to set it to current time?")) {
        handleTableOccupationChanges({startedAt: dayjs().add(10, "seconds").toDate()});
      } else {
        alert("Please change the 'Started At' value!");
        setIsLoadingCreateTableOccupation(false);
        return;
      }
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
  }

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

  return (<>
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col flex-grow overflow-hidden">
      <div className='flex justify-between items-center mb-4'>
        <h2 className="text-2xl font-semibold text-gray-700">Table Occupations</h2>
        <Button  
          onClick={() => setIsCreateModalOpen(true)}
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
  </>)

}

export default TableOccupationsDetails;