import { PdfFileInterface } from 'interfaces/pdf-file';
import { GetQueryInterface } from 'interfaces';

export interface DataStructureInterface {
  id?: string;
  rows: number;
  columns: number;
  pdf_file_id: string;
  created_at?: any;
  updated_at?: any;

  pdf_file?: PdfFileInterface;
  _count?: {};
}

export interface DataStructureGetQueryInterface extends GetQueryInterface {
  id?: string;
  pdf_file_id?: string;
}
