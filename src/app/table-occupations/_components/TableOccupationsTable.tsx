import React from 'react';
import dayjs from 'dayjs';
import { Table, TableOccupation } from '@/types';
import GenericTable from '@/components/GenericTable';
import Link from 'next/link';

type Props = {
  data: TableOccupation[];
  tableOptions: {id: string, number: string}[];
  sortColumn: keyof TableOccupation | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: keyof TableOccupation) => void;
  page: number;
  limit: number;
};

const TableOccupationsTable: React.FC<Props> = ({
  data,
  tableOptions,
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
    { key: 'table' as keyof TableOccupation, header: 'Table', render: (tableOption: {id: string, number: number}) => <Link href={`/tables/${tableOption.id}`}><span className="underline hover:text-blue-600 transition-colors duration-200">Table {tableOption.number}</span></Link> },
    { key: 'startedAt' as keyof TableOccupation, header: 'Started At', render: (value: Date) => formatDate(value) },
    { key: 'finishedAt' as keyof TableOccupation, header: 'Finished At', render: (value: Date | null) => value ? formatDate(value) : '-' },
    { key: 'createdAt' as keyof TableOccupation, header: 'Created At', render: (value: Date) => formatDate(value) },
    { key: 'updatedAt' as keyof TableOccupation, header: 'Updated At', render: (value: Date) => formatDate(value) },
  ];

  const tableOptionsMap = new Map(tableOptions.map(option => [option.id, option]));

  return (
    <GenericTable<TableOccupation>
      data={data.map((item, index) => ({
        ...item,
        rowNumber: (page - 1) * limit + index + 1, // Calculate row number
        table: tableOptionsMap.get(item.tableId),
      }))}
      columns={columns}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      handleSort={handleSort}
    />
  );
};

export default TableOccupationsTable;
