import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface CreateTableModalProps {
  onClose: () => void;
  onCreateTable: (newTable: { number: number; brand: 'MRSUNG' | 'Xingjue' | 'Diamond' }) => void;
}

const CreateTableModal: React.FC<CreateTableModalProps> = ({ onClose, onCreateTable }) => {
  const [number, setNumber] = useState<number>(0);
  const [brand, setBrand] = useState<'MRSUNG' | 'Xingjue' | 'Diamond'>('MRSUNG');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTable({ number, brand });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Table</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="number" className="block mb-2">Table Number:</label>
            <input
              type="number"
              id="number"
              value={number}
              onChange={(e) => setNumber(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="brand" className="block mb-2">Brand:</label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value as 'MRSUNG' | 'Xingjue' | 'Diamond')}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="MRSUNG">MRSUNG</option>
              <option value="Xingjue">Xingjue</option>
              <option value="Diamond">Diamond</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
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
