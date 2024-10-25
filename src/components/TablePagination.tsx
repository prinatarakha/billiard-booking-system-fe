import { DEFAULT_LIMIT_OPTIONS } from '@/app/constants';
import React from 'react';
import Select from 'react-select';

interface TablePaginationProps {
  page: number;
  limit: number;
  count: number;
  totalPages: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  customSelectStyles?: any;
  limitOptions?: { value: number, label: string }[];
}

const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  limit,
  count,
  totalPages,
  setPage,
  setLimit,
  customSelectStyles,
  limitOptions,
}) => {
  const selectedLimitOptions = limitOptions || DEFAULT_LIMIT_OPTIONS;

  const defaultSelectStyles = {
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

  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="text-sm text-gray-700">
        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, count)} of {count} entries
      </div>
      <div className="flex items-center space-x-2">
        <Select
          options={selectedLimitOptions}
          onChange={(option) => {
            setLimit(option ? option.value : 10);
            setPage(1);
          }}
          defaultValue={selectedLimitOptions[1]}
          placeholder="Items per page"
          className="w-32"
          styles={customSelectStyles || defaultSelectStyles}
        />
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
