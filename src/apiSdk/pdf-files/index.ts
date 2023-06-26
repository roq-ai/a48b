import axios from 'axios';
import queryString from 'query-string';
import { PdfFileInterface, PdfFileGetQueryInterface } from 'interfaces/pdf-file';
import { GetQueryInterface } from '../../interfaces';

export const getPdfFiles = async (query?: PdfFileGetQueryInterface) => {
  const response = await axios.get(`/api/pdf-files${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPdfFile = async (pdfFile: PdfFileInterface) => {
  const response = await axios.post('/api/pdf-files', pdfFile);
  return response.data;
};

export const updatePdfFileById = async (id: string, pdfFile: PdfFileInterface) => {
  const response = await axios.put(`/api/pdf-files/${id}`, pdfFile);
  return response.data;
};

export const getPdfFileById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/pdf-files/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePdfFileById = async (id: string) => {
  const response = await axios.delete(`/api/pdf-files/${id}`);
  return response.data;
};
