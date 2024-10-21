import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface CreateTableButtonProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const CreateTableButton: React.FC<CreateTableButtonProps> = ({ setIsModalOpen }) => {
  return (
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600 transition-colors flex items-center"
    >
      <FaPlus className="mr-2" /> Create New Table
    </button>
  );
};

export default CreateTableButton;
