'use client';

import { TIMESTAMP_INPUT_FORMAT } from '@/app/constants';
import { TableOccupation } from '@/types';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface UpdateTableOccupationModalProps {
  onClose: () => void;
  tableOccupation: TableOccupation | null;
  isLoadingUpdate: boolean;
  onSubmit: (data: {startedAt?: Date, finishedAt?: Date | null}) => Promise<void>;
}

const UpdateTableOccupationModal: React.FC<UpdateTableOccupationModalProps> = ({ onClose, tableOccupation, onSubmit }) => {
  const [startedAt, setStartedAt] = useState<string>("");
  const [finishedAt, setFinishedAt] = useState<string>("");

  const resetInputs = () => {
    setStartedAt("");
    setFinishedAt("");
  }

  useEffect(() => {
    if (!tableOccupation) {
      resetInputs()
    } else {
      setStartedAt(dayjs(tableOccupation.startedAt).format(TIMESTAMP_INPUT_FORMAT));
      setFinishedAt(tableOccupation.finishedAt 
        ? dayjs(tableOccupation.finishedAt).format(TIMESTAMP_INPUT_FORMAT)
        : ""
      );
    }
  }, [tableOccupation]);
  
  const handleSubmit = (e: React.FormEvent) => {
    onSubmit({
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      finishedAt: finishedAt ? new Date(finishedAt) : null,
    });
    e.preventDefault();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  if (!tableOccupation) return; // won't show the modal

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center" onClick={handleOverlayClick}>
      <div className="bg-gray-800 p-6 rounded-lg w-96 text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-100">Update Table Occupation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tableId" className="block mb-1 text-sm">ID<span className="text-red-500 ml-1 text-sm">*</span></label>
            <input
              type="text"
              value={tableOccupation.id}
              disabled
              className="w-full px-3 py-2 bg-gray-800 text-gray-400 font-mono text-sm border border-gray-600 rounded focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label htmlFor="tableId" className="block mb-1 text-sm">Table ID<span className="text-red-500 ml-1 text-sm">*</span></label>
            <input
              type="text"
              value={tableOccupation.tableId}
              disabled
              className="w-full px-3 py-2 bg-gray-800 text-gray-400 font-mono text-sm border border-gray-600 rounded focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label htmlFor="startedAt" className="block mb-1 text-sm">Started At<span className="text-red-500 ml-1 text-sm">*</span></label>
            <input
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-gray-500"
              required
            />
            <p className='text-xs text-gray-400 mt-1'>Must be after the current time.</p>
          </div>
          <div>
            <label htmlFor="finishedAt" className="block mb-1 text-sm">Finished At</label>
            <input
              type="datetime-local"
              value={finishedAt}
              onChange={(e) => setFinishedAt(e.target.value)}
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTableOccupationModal;