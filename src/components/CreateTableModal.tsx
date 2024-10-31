import { TABLE_BRANDS_TO_LABEL } from '@/app/constants';
import { Table, TableBrand } from '@/types';
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Select from 'react-select';

interface CreateTableModalProps {
  onClose: () => void;
  defaultNumber?: number;
  onCreateTable: (newTable: Pick<Table, 'number' | 'brand'>) => void;
}

const CreateTableModal: React.FC<CreateTableModalProps> = ({ defaultNumber = 1, onClose, onCreateTable }) => {
  const [number, setNumber] = useState<number>(0);
  const [brand, setBrand] = useState<TableBrand>('mrsung');

  useEffect(() => {
    setNumber(defaultNumber);
  }, [defaultNumber])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTable({ number, brand });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96 text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-100">Create New Table</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="number" className="block mb-1 text-sm">Table Number:</label>
            <input
              type="number"
              id="number"
              value={number}
              onChange={(e) => setNumber(Math.max(1, parseInt(e.target.value)))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-gray-500"
              required
              min="1"
            />
          </div>
          <div>
            <label htmlFor="brand" className="block mb-1 text-sm">Brand:</label>
            <Select
              id="brand"
              value={{ value: brand, label: TABLE_BRANDS_TO_LABEL[brand] }}
              onChange={(option) => setBrand(option?.value as TableBrand)}
              options={[
                { value: 'mrsung', label: 'MRSUNG' },
                { value: 'xingjue', label: 'Xingjue' },
                { value: 'diamond', label: 'Diamond' }
              ] as { value: TableBrand; label: string }[]}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#374151',
                  borderColor: '#4B5563',
                  '&:hover': {
                    borderColor: '#6B7280',
                  },
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#4B5563' : '#374151',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#6B7280',
                  },
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'white',
                }),
              }}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500 transition-colors"
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTableModal;
