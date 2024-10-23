import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  sortColumn: keyof T | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: keyof T) => void;
};

function Table<T>({ data, columns, sortColumn, sortDirection, handleSort }: Props<T>) {
  const renderSortIcon = (column: keyof T) => {
    if (sortColumn !== column) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center">
                  <span>{column.header}</span>
                  <span className="ml-2">
                    {renderSortIcon(column.key)}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr 
              key={index}
              className={`
                ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                hover:bg-gray-100 transition-colors duration-150 ease-in-out
              `}
            >
              {columns.map((column, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
