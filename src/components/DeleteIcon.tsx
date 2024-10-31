import React from 'react';
import { FaTrash } from 'react-icons/fa';

interface DeleteIconProps {
  onClick: () => void;
}

const DeleteIcon: React.FC<DeleteIconProps> = ({ onClick }) => {
  return (
    <FaTrash 
    className="text-red-700 cursor-pointer text-lg"
    onClick={onClick}
    />
  );
};

export default DeleteIcon;
