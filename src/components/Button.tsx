import React from 'react';

interface ButtonProps {
  disabled?: boolean;
  className?: string;
  type: 'primary' | 'secondary' | 'danger'
  buttonTitle: React.JSX.Element | string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ disabled = false, className, type, buttonTitle, onClick }) => {
  let defaultClass = "";
  if (type === 'primary') {
    defaultClass = "bg-zinc-700 text-white hover:bg-zinc-600 transition-colors";
  } else if (type === 'secondary') {
    defaultClass = "border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50";
  } else if (type === 'danger') {
    defaultClass = "bg-red-700 text-white hover:bg-red-600 transition-colors";
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className ?? ""} ${defaultClass} px-4 py-2 rounded flex items-center`}
    >
      {buttonTitle}
    </button>
  );
};

export default Button;
