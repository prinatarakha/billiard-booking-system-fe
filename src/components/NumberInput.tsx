import React from 'react';

interface NumberInputProps {
  min?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ min = 1, value, onChange, className }) => {  
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={className || `text-lg font-semibold text-gray-700 w-full border-gray-300 px-3 py-2 border rounded focus:outline-none focus:border-gray-500`}
      min={min}
    />
  );
};

export default NumberInput;
