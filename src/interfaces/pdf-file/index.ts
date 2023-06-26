import { DataStructureInterface } from 'interfaces/data-structure';
import { ExtractedDataInterface } from 'interfaces/extracted-data';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PdfFileInterface {
  id?: string;
  file_path: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;
  data_structure?: DataStructureInterface[];
  extracted_data?: ExtractedDataInterface[];
  user?: UserInterface;
  _count?: {
    data_structure?: number;
    extracted_data?: number;
  };
}

export interface PdfFileGetQueryInterface extends GetQueryInterface {
  id?: string;
  file_path?: string;
  user_id?: string;
}
