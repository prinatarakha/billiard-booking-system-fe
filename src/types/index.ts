export type TableBrand = 'mrsung' | 'xingjue' | 'diamond';

export interface Table {
  id: number;
  number: number;
  brand: TableBrand;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface TableSnakeCase {
  id: number;
  number: number;
  brand: TableBrand;
  created_at: string;
  updated_at: string;
}

