import React from 'react';
import dayjs from 'dayjs';
import { TableOccupation } from '@/types';
import GenericTable from '@/components/GenericTable';
import EditIcon from '@/components/EditIcon';
import DeleteIcon from '@/components/DeleteIcon';

type Props = {
  onEdit: (tableOccupation: TableOccupation) => void;
  onDelete: (tableOccupationId: string) => void;
  data: TableOccupation[];
  sortColumn: keyof TableOccupation | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: keyof TableOccupation) => void;
  page: number;
  limit: number;
};

const TableOccupationsTable: React.FC<Props> = ({
  onEdit,
  onDelete,
  data,
  sortColumn,
  sortDirection,
  handleSort,
  page,
  limit,
}) => {
  const formatDate = (date: string | Date) => {
    return dayjs(date).format('DD MMM YYYY HH:mm');
  };

  const columns = [
    { key: 'rowNumber' as keyof TableOccupation, header: 'No.', render: (value: number) => value, className: 'w-12' },
    { key: 'startedAt' as keyof TableOccupation, header: 'Started At', render: (value: Date) => formatDate(value) },
    { key: 'finishedAt' as keyof TableOccupation, header: 'Finished At', render: (value: Date | null) => value ? formatDate(value) : '-' },
    { key: 'createdAt' as keyof TableOccupation, header: 'Created At', render: (value: Date) => formatDate(value) },
    { key: 'updatedAt' as keyof TableOccupation, header: 'Updated At', render: (value: Date) => formatDate(value) },
    { key: 'actions' as keyof TableOccupation, header: 'Actions', 
      render: (value: {occupation: TableOccupation, rowNumber: number}) => <div className="flex items-center justify-center space-x-4">
        <EditIcon onClick={() => onEdit(value.occupation)} />
        <DeleteIcon onClick={() => handleDelete(value)} />
      </div>,
      className: 'justify-center w-12'
    },
  ];

  const handleDelete = (value: {occupation: TableOccupation, rowNumber: number}) => {
    // Implement the delete functionality here
    if (window.confirm(`Are you sure you want to delete this table occupation #${value.rowNumber}?`)) {
      onDelete(value.occupation.id);
    }
  };

  return (
    <GenericTable<TableOccupation>
      data={data.map((item, index) => {
        const rowNumber = (page - 1) * limit + index + 1;
        return {
          ...item,
          rowNumber,
          actions: { occupation: item, rowNumber },
        };
      })}
      columns={columns}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      handleSort={handleSort}
    />
  );
};

export default TableOccupationsTable;
