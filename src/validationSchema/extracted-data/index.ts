import * as yup from 'yup';

export const extractedDataValidationSchema = yup.object().shape({
  data: yup.string().required(),
  pdf_file_id: yup.string().nullable().required(),
});
