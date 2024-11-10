import dayjs from 'dayjs';

/**
 * Formats the time difference in seconds to a string in the format of "Xh Ym Zs"
 * @param diffInSeconds - The time difference in seconds
 * @returns The formatted time difference string
 */
export const formatTimeDifference = (diffInSeconds: number): string => {
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
};

export const getTimeDifferenceInSeconds = (date1: Date | string, date2: Date | string): number => {
  return dayjs(date1).diff(dayjs(date2), 'second');
}; 