import axios from 'axios';
import queryString from 'query-string';
import { ExtractedDataInterface, ExtractedDataGetQueryInterface } from 'interfaces/extracted-data';
import { GetQueryInterface } from '../../interfaces';

export const getExtractedData = async (query?: ExtractedDataGetQueryInterface) => {
  const response = await axios.get(`/api/extracted-data${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createExtractedData = async (extractedData: ExtractedDataInterface) => {
  const response = await axios.post('/api/extracted-data', extractedData);
  return response.data;
};

export const updateExtractedDataById = async (id: string, extractedData: ExtractedDataInterface) => {
  const response = await axios.put(`/api/extracted-data/${id}`, extractedData);
  return response.data;
};

export const getExtractedDataById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/extracted-data/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteExtractedDataById = async (id: string) => {
  const response = await axios.delete(`/api/extracted-data/${id}`);
  return response.data;
};
