import React from 'react';
import dayjs from 'dayjs';
import { TableOccupation } from '@/types';
import Table from './Table';
import Link from 'next/link';

type Props = {
  data: TableOccupation[];
  sortColumn: keyof TableOccupation | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: keyof TableOccupation) => void;
};

const TableOccupationsTable: React.FC<Props> = ({
  data,
  sortColumn,
  sortDirection,
  handleSort,
}) => {
  const formatDate = (date: string | Date) => {
    return dayjs(date).format('DD MMM YYYY HH:mm');
  };

  const columns = [
    { key: 'id' as keyof TableOccupation, header: 'ID', render: (value: string) => <span className="font-mono text-xs">{value}</span> },
    { key: 'tableId' as keyof TableOccupation, header: 'Table ID', render: (value: string) => <Link href={`/tables/${value}`}><span className="font-mono text-xs underline hover:text-blue-600 transition-colors duration-200">{value}</span></Link> },
    { key: 'startedAt' as keyof TableOccupation, header: 'Started At', render: (value: Date) => formatDate(value) },
    { key: 'finishedAt' as keyof TableOccupation, header: 'Finished At', render: (value: Date | null) => value ? formatDate(value) : '-' },
    { key: 'createdAt' as keyof TableOccupation, header: 'Created At', render: (value: Date) => formatDate(value) },
    { key: 'updatedAt' as keyof TableOccupation, header: 'Updated At', render: (value: Date) => formatDate(value) },
  ];

  return (
    <Table<TableOccupation>
      data={data}
      columns={columns}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      handleSort={handleSort}
    />
  );
};

export default TableOccupationsTable;
