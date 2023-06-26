import { PdfFileInterface } from 'interfaces/pdf-file';
import { GetQueryInterface } from 'interfaces';

export interface ExtractedDataInterface {
  id?: string;
  data: string;
  pdf_file_id: string;
  created_at?: any;
  updated_at?: any;

  pdf_file?: PdfFileInterface;
  _count?: {};
}

export interface ExtractedDataGetQueryInterface extends GetQueryInterface {
  id?: string;
  data?: string;
  pdf_file_id?: string;
}
