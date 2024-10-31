import React from 'react';
import { FaEdit } from 'react-icons/fa';

interface EditIconProps {
  onClick: () => void;
}

const EditIcon: React.FC<EditIconProps> = ({ onClick }) => {
  return (
    <FaEdit
    className="text-gray-500 cursor-pointer text-xl"
    onClick={onClick}
    />
  );
};

export default EditIcon;
