import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getExtractedDataById, updateExtractedDataById } from 'apiSdk/extracted-data';
import { Error } from 'components/error';
import { extractedDataValidationSchema } from 'validationSchema/extracted-data';
import { ExtractedDataInterface } from 'interfaces/extracted-data';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PdfFileInterface } from 'interfaces/pdf-file';
import { getPdfFiles } from 'apiSdk/pdf-files';

function ExtractedDataEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ExtractedDataInterface>(
    () => (id ? `/extracted-data/${id}` : null),
    () => getExtractedDataById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ExtractedDataInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateExtractedDataById(id, values);
      mutate(updated);
      resetForm();
      router.push('/extracted-data');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ExtractedDataInterface>({
    initialValues: data,
    validationSchema: extractedDataValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Extracted Data
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="data" mb="4" isInvalid={!!formik.errors?.data}>
              <FormLabel>Data</FormLabel>
              <Input type="text" name="data" value={formik.values?.data} onChange={formik.handleChange} />
              {formik.errors.data && <FormErrorMessage>{formik.errors?.data}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<PdfFileInterface>
              formik={formik}
              name={'pdf_file_id'}
              label={'Select Pdf File'}
              placeholder={'Select Pdf File'}
              fetcher={getPdfFiles}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.file_path}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'extracted_data',
  operation: AccessOperationEnum.UPDATE,
})(ExtractedDataEditPage);
