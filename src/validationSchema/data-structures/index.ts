import * as yup from 'yup';

export const dataStructureValidationSchema = yup.object().shape({
  rows: yup.number().integer().required(),
  columns: yup.number().integer().required(),
  pdf_file_id: yup.string().nullable().required(),
});
