import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { Table, TableOccupation } from '@/types';
import GenericTable from '@/components/GenericTable';
import Link from 'next/link';
import EditIcon from '@/components/EditIcon';
import DeleteIcon from '@/components/DeleteIcon';

type Props = {
  data: TableOccupation[];
  tableOptions: {id: string, number: string}[];
  sortColumn: keyof TableOccupation | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: keyof TableOccupation) => void;
  page: number;
  limit: number;
  onEdit: (tableOccupation: TableOccupation) => void;
  onDelete: (tableOccupationId: string) => void;
};

const TableOccupationsTable: React.FC<Props> = ({
  data,
  tableOptions,
  sortColumn,
  sortDirection,
  handleSort,
  page,
  limit,
  onEdit,
  onDelete,
}) => {
  const formatDate = (date: string | Date) => {
    return dayjs(date).format('DD MMM YYYY HH:mm');
  };

  const handleDelete = (value: {occupation: TableOccupation, rowNumber: number}) => {
    // Implement the delete functionality here
    if (window.confirm(`Are you sure you want to delete this table occupation #${value.rowNumber}?`)) {
      onDelete(value.occupation.id);
    }
  };

  const columns = [
    { key: 'rowNumber' as keyof TableOccupation, header: 'No.', render: (value: number) => value, className: 'w-12' },
    { key: 'table' as keyof TableOccupation, header: 'Table', render: (tableOption: {id: string, number: number}) => <Link href={`/tables/${tableOption.id}`}><span className="underline hover:text-blue-600 transition-colors duration-200">Table {tableOption.number}</span></Link> },
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

  const tableOptionsMap = useMemo(() => new Map(tableOptions.map(option => [option.id, option])), [tableOptions]);

  return (
    <GenericTable<TableOccupation>
      data={data.map((item, index) => {
        const rowNumber = (page - 1) * limit + index + 1;
        return {
          ...item,
          rowNumber,
          table: tableOptionsMap.get(item.tableId),
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
