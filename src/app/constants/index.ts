import { TableBrand } from "@/types";

export const TABLE_BRANDS_TO_LABEL: Record<TableBrand, string> = {
  mrsung: 'MRSUNG',
  xingjue: 'Xingjue',
  diamond: 'Diamond'
};

export const DEFAULT_LIMIT_OPTIONS = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];
