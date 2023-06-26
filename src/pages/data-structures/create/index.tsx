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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createDataStructure } from 'apiSdk/data-structures';
import { Error } from 'components/error';
import { dataStructureValidationSchema } from 'validationSchema/data-structures';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PdfFileInterface } from 'interfaces/pdf-file';
import { getPdfFiles } from 'apiSdk/pdf-files';
import { DataStructureInterface } from 'interfaces/data-structure';

function DataStructureCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DataStructureInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDataStructure(values);
      resetForm();
      router.push('/data-structures');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DataStructureInterface>({
    initialValues: {
      rows: 0,
      columns: 0,
      pdf_file_id: (router.query.pdf_file_id as string) ?? null,
    },
    validationSchema: dataStructureValidationSchema,
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
            Create Data Structure
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="rows" mb="4" isInvalid={!!formik.errors?.rows}>
            <FormLabel>Rows</FormLabel>
            <NumberInput
              name="rows"
              value={formik.values?.rows}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('rows', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.rows && <FormErrorMessage>{formik.errors?.rows}</FormErrorMessage>}
          </FormControl>
          <FormControl id="columns" mb="4" isInvalid={!!formik.errors?.columns}>
            <FormLabel>Columns</FormLabel>
            <NumberInput
              name="columns"
              value={formik.values?.columns}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('columns', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.columns && <FormErrorMessage>{formik.errors?.columns}</FormErrorMessage>}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'data_structure',
  operation: AccessOperationEnum.CREATE,
})(DataStructureCreatePage);
