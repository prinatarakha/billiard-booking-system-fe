import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import CreateTableModal from '@/components/CreateTableModal';

interface Table {
  id: number;
  number: number;
  brand: 'MRSUNG' | 'Xingjue' | 'Diamond';
}

interface CreateTableButtonProps {
  onCreateTable: (newTable: Omit<Table, 'id'>) => void;
}

const CreateTableButton: React.FC<CreateTableButtonProps> = ({ onCreateTable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTable = (newTable: Omit<Table, 'id'>) => {
    onCreateTable(newTable);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600 transition-colors flex items-center"
      >
        <FaPlus className="mr-2" /> Create New Table
      </button>

      {isModalOpen && (
        <CreateTableModal
          onClose={() => setIsModalOpen(false)}
          onCreateTable={handleCreateTable}
        />
      )}
    </>
  );
};

export default CreateTableButton;
