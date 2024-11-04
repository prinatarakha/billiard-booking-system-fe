import { TIMESTAMP_INPUT_FORMAT } from '@/app/constants';
import { TableOccupation } from '@/types';
import { CreateTableOccupationPayload } from '@/types/dto';
import dayjs from 'dayjs';
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Select from 'react-select';

interface CreateTableOccupationModalProps {
  onClose: () => void;
  tableOccupation: CreateTableOccupationPayload;
  onChanges: (data: {tableId?: string, startedAt?: Date | null, finishedAt?: Date | null}) => void;
  isLoadingCreate: boolean;
  onSubmit: () => void;
  tableOptions: {id: string, number: string}[];
}

const CreateTableOccupationModal: React.FC<CreateTableOccupationModalProps> = ({ onClose, tableOccupation, onChanges, isLoadingCreate, onSubmit, tableOptions, }) => {
  const handleSubmit = (e: React.FormEvent) => {
    onSubmit();
    e.preventDefault();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#374151',
      borderColor: '#4B5563',
      padding: '0.25rem 0',
      '&:hover': {
        borderColor: '#6B7280',
      },
    }),
    option: (provided: any, state: { isSelected: any; }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#52525b' : '#374151',
      color: '#e5e7eb',
      '&:hover': {
        backgroundColor: '#71717a',
        color: '#ffffff',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#e5e7eb',
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#e5e7eb',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#e5e7eb',
    }),
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center" onClick={handleOverlayClick}>
      <div className="bg-gray-800 p-6 rounded-lg w-96 text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-100">Create New Table Occupation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tableId" className="block mb-1 text-sm">Table<span className="text-red-500 ml-1 text-sm">*</span></label>
            <input
              type="text"
              value={tableOccupation.tableId}
              disabled
              className="hidden"
            />
            <Select
              options={tableOptions.map(({id, number}) => ({ value: id, label: `Table ${number}` }))}
              onChange={(option) => onChanges({tableId: option ? option.value : undefined})}
              value={tableOptions.find(({id}) => id === tableOccupation.tableId)?.number ? {
                value: tableOccupation.tableId,
                label: `Table ${tableOptions.find(({id}) => id === tableOccupation.tableId)?.number}`
              } : null}
              placeholder="Select Table"
              styles={customSelectStyles}
            />
            {tableOccupation.tableId && <p className='text-xs text-gray-400 mt-1'>Selected Table ID: <span className='text-[11px] font-mono'>{tableOccupation.tableId}</span></p>}
          </div>
          <div>
            <label htmlFor="startedAt" className="block mb-1 text-sm">Started At</label>
            <input
              type="datetime-local"
              value={tableOccupation.startedAt ? dayjs(tableOccupation.startedAt).format(TIMESTAMP_INPUT_FORMAT) : ""}
              onChange={(e) => onChanges({startedAt: e.target.value ? new Date(e.target.value) : null})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-gray-500"
            />
            <p className='text-xs text-gray-400 mt-1'>Value must be after the current time. If no value is provided, the current time will be used.</p>
          </div>
          <div>
            <label htmlFor="finishedAt" className="block mb-1 text-sm">Finished At</label>
            <input
              type="datetime-local"
              value={tableOccupation.finishedAt ? dayjs(tableOccupation.finishedAt).format(TIMESTAMP_INPUT_FORMAT) : ""}
              onChange={(e) => onChanges({finishedAt: e.target.value ? new Date(e.target.value) : null})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-gray-500"
            />
            <p className='text-xs text-gray-400 mt-1'>Clear the value of this field to mark the occupation as <span className="italic">open table</span>.</p>
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTableOccupationModal;