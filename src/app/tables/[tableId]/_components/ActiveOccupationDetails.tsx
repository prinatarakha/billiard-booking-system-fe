import React, { useEffect, useState } from 'react';
import { TableOccupation } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '../../../../components/Button';
import DeleteIcon from '../../../../components/DeleteIcon';
import dayjs from 'dayjs';
import { UpdateTableOccupationPayload } from '@/types/dto';

interface ActiveOccupationDetailsProps {
  tableId: string;
  tableOccupation: TableOccupation | null;
  isLoading: boolean;
  onDelete: () => void;
}

const ActiveOccupationDetails: React.FC<ActiveOccupationDetailsProps> = ({ tableId, tableOccupation, isLoading, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateTableOccupationInput, setUpdateTableOccupationInput] = useState<UpdateTableOccupationPayload | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Add timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Active Occupation</h2>
        {tableOccupation && (
          <div className='flex space-x-4 items-center'>
            {/* TODO: Add edit functionality */}
            {/* TODO: Add close occupation functionality */}
            {!tableOccupation.finishedAt && 
            dayjs(currentTime).isAfter(dayjs(tableOccupation.startedAt)) && ( 
              <Button
                onClick={() => {}}
                type='secondary'
                buttonTitle='Close'
              />
            )}
            <DeleteIcon onClick={onDelete} />
          </div>
        )}
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : tableOccupation ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">ID</p>
            <p className="text-sm font-bold text-gray-700 font-mono rounded"><span className="bg-gray-200 px-2 py-1 rounded-sm">{tableOccupation.id}</span></p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Started At</p>
            {isEditing ? (
              <div className="flex-col space-y-1">
                {/* <NumberInput 
                  value={updateTableOccupationInput?.startedAt || tableOccupation.startedAt}
                  onChange={(number: number) => onTableInputChange({ number })}
                  min={1}
                /> */}
                <p className="text-xs text-gray-400">Table number must be unique.</p>
              </div>
            ) : (
              <p className="text-lg font-semibold text-gray-700">{dayjs(tableOccupation.startedAt).format('DD MMM YYYY hh:mm:ss A')}</p>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
            <p className="text-lg font-semibold text-gray-700">{tableOccupation.finishedAt ? `Occupied until ${dayjs(tableOccupation.finishedAt).format('DD MMM YYYY hh:mm:ss A')}` : 'Open Table'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">
              {tableOccupation.finishedAt ? 'Time Left' : 'Occupation Time'}
            </p>
            <p className="text-lg font-semibold text-gray-700">
              {(() => {
                if (dayjs(currentTime).isBefore(dayjs(tableOccupation.startedAt))) {
                  return 'Not started yet';
                }

                let diffInSeconds = 0;
                if (tableOccupation.finishedAt) { // fixed time occupation -> find the time left until the finishedAt time
                  diffInSeconds = dayjs(tableOccupation.finishedAt).diff(dayjs(currentTime), 'second');
                  if (diffInSeconds <= 0) return 'Time is up';
                } else { // open table -> find the occupation time starting from the startedAt time
                  diffInSeconds = dayjs(currentTime).diff(dayjs(tableOccupation.startedAt), 'second');
                }

                const hours = Math.floor(diffInSeconds / 3600);
                const minutes = Math.floor((diffInSeconds % 3600) / 60);
                const seconds = diffInSeconds % 60;

                const parts = [];
                if (hours > 0) parts.push(`${hours}h`);
                if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
                parts.push(`${seconds}s`);

                return parts.join(' ');
              })()}
            </p>
          </div>
          {isEditing && (
            <div className="col-span-2 flex justify-end mt-4">
              {/* <div className="flex space-x-2">
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
              </div> */}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-700">Table has no active occupation</p>
      )}
    </div>
  );
};

export default ActiveOccupationDetails;
