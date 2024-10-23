import React from 'react';
import dayjs from 'dayjs';
import { TableOccupation } from '@/types';
import Table from './Table';

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
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMM YYYY HH:mm');
  };

  const columns = [
    { key: 'id' as keyof TableOccupation, header: 'ID' },
    { key: 'tableId' as keyof TableOccupation, header: 'Table ID' },
    { key: 'startedAt' as keyof TableOccupation, header: 'Started At', render: (value: string) => formatDate(value) },
    { key: 'finishedAt' as keyof TableOccupation, header: 'Finished At', render: (value: string) => formatDate(value) },
    { key: 'createdAt' as keyof TableOccupation, header: 'Created At', render: (value: string) => formatDate(value) },
    { key: 'updatedAt' as keyof TableOccupation, header: 'Updated At', render: (value: string) => formatDate(value) },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      handleSort={handleSort}
    />
  );
};

export default TableOccupationsTable;
