import axios from 'axios';
import queryString from 'query-string';
import { DataStructureInterface, DataStructureGetQueryInterface } from 'interfaces/data-structure';
import { GetQueryInterface } from '../../interfaces';

export const getDataStructures = async (query?: DataStructureGetQueryInterface) => {
  const response = await axios.get(`/api/data-structures${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDataStructure = async (dataStructure: DataStructureInterface) => {
  const response = await axios.post('/api/data-structures', dataStructure);
  return response.data;
};

export const updateDataStructureById = async (id: string, dataStructure: DataStructureInterface) => {
  const response = await axios.put(`/api/data-structures/${id}`, dataStructure);
  return response.data;
};

export const getDataStructureById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/data-structures/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDataStructureById = async (id: string) => {
  const response = await axios.delete(`/api/data-structures/${id}`);
  return response.data;
};
