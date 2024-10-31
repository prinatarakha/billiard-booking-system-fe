import React, { useState } from 'react';
import { Table, TableBrand } from '@/types';
import { TABLE_BRANDS_TO_LABEL } from '@/app/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import Select from 'react-select';
import Button from '../../../../components/Button';
import DeleteIcon from '../../../../components/DeleteIcon';
import EditIcon from '../../../../components/EditIcon';
import { deleteTable } from '@/api/tables';
import { useRouter } from 'next/navigation';
import NumberInput from '../../../../components/NumberInput';

interface TableDetailsProps {
  table: Table | null;
  isLoading: boolean;
  isUpdating: boolean;
  onUpdate: () => void;
  updateTableInput: { number: number, brand: TableBrand } | null;
  onTableInputChange: (input: { number?: number, brand?: TableBrand }) => void;
  onCancelUpdate: () => void;
}

const TableDetails: React.FC<TableDetailsProps> = ({ table, isLoading, isUpdating, onUpdate, updateTableInput, onTableInputChange, onCancelUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!table || !table.id) return;
    if (!window.confirm(`Are you sure you want to delete table with number ${table.number}?`)) return;

    const result = await deleteTable(table.id);
    if (!result) {
      alert("Failed to delete table");
    } else {
      router.push('/tables');
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Table Details</h2>
        <div className='flex space-x-4 items-center'>
          {!isEditing && table && (
            <EditIcon onClick={() => setIsEditing(true)}/>
          )}
          <DeleteIcon onClick={handleDelete} />
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : table ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">ID</p>
            <p className="text-sm font-bold text-gray-700 font-mono rounded"><span className="bg-gray-200 px-2 py-1 rounded-sm">{table.id}</span></p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Number</p>
            {isEditing ? (
              <div className="flex-col space-y-1">
                <NumberInput 
                  value={updateTableInput?.number || table.number}
                  onChange={(number: number) => onTableInputChange({ number })}
                  min={1}
                />
                <p className="text-xs text-gray-400">Table number must be unique.</p>
              </div>
            ) : (
              <p className="text-lg font-semibold text-gray-700">{table.number}</p>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Brand</p>
            {isEditing ? (
              <Select
                value={{ value: updateTableInput?.brand || table.brand, label: TABLE_BRANDS_TO_LABEL[updateTableInput?.brand || table.brand] }}
                onChange={(e) => onTableInputChange({ brand: e?.value as TableBrand })}
                options={Object.entries(TABLE_BRANDS_TO_LABEL).map(([value, label]) => ({ value: value as TableBrand, label }))}
                className="text-lg font-semibold text-gray-700 w-full"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-700">{TABLE_BRANDS_TO_LABEL[table.brand]}</p>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
            <p className="text-lg font-semibold text-gray-700">{table.updatedAt.toLocaleString()}</p>
          </div>
          {isEditing && (
            <div className="col-span-2 flex justify-end mt-4">
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    onCancelUpdate();
                  }}
                  type='secondary'
                  buttonTitle={"Cancel"}
                />
                <Button
                  disabled={isUpdating}
                  onClick={onUpdate}
                  type='primary'
                  buttonTitle={isUpdating ? 'Saving...' : 'Save'}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-700">Table not found</p>
      )}
    </div>
  );
};

export default TableDetails;
