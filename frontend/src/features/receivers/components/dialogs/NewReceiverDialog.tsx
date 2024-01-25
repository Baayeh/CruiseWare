/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import TextField from '@mui/material/TextField';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { setPaginatedReceivers } from '../..';
import { useCreate, useFetch } from '../../../../hooks';

interface NewReceiverProps extends MainDialogProps {
  setPage: (page: number) => void;
  setActiveItem: (item: ReceiverProps | null) => void;
}

const initialValues: ReceiverFormValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .matches(
      /^\+(?:[0-9] ?){6,14}[0-9]$/,
      'Phone number must be a valid number'
    )
    .required('Phone is required'),
  address: Yup.string().required('Address is required'),
  email: Yup.string()
    .email('Invalid email address')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
    .nullable(),
});

const NewReceiverDialog: React.FC<NewReceiverProps> = ({
  visible,
  setVisible,
  setPage,
  setActiveItem,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const { fetchData: fetchPaginatedReceivers } = useFetch(
    `/receiver?page=${0}&pageSize=${10}`,
    setPaginatedReceivers
  );

  const { data, loading, error, createData, resetState } =
    useCreate('/receiver');

  const onSubmit = async (values: ReceiverFormValues) => {
    const body = Object.entries(values)
      .filter((entry) => {
        // Check if the property value is not empty or a boolean.
        const [_key, value] = entry;
        return value !== '' && typeof value !== 'boolean';
      })
      .reduce((obj: { [key: string]: any }, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    await createData(body);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('Receiver created!');
      setVisible(false);
      setPage(0);
      resetState();
      setRequestSent(false);
      setActiveItem(null);
      fetchPaginatedReceivers();
    }
  }, [data, requestSent, resetState]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  return (
    <Dialog
      header="New Receiver"
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      maskClassName="create-new-mask"
      id="new-supplier-dialog"
    >
      <div className="form-wrapper mt-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => {
            return (
              <Form>
                <Field name="name">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-5 w-full">
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        required
                        label="Receiver's Name"
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="name" />}
                      />
                    </div>
                  )}
                </Field>
                <Field name="email">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-5 w-full">
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        label="Receiver's Email"
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="email" />}
                      />
                    </div>
                  )}
                </Field>
                <Field name="phone">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-5 w-full">
                      <TextField
                        {...field}
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="+1 555 555 5555"
                        label="Receiver's Phone"
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="phone" />}
                      />
                    </div>
                  )}
                </Field>
                <Field name="address">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-5 w-full">
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Eg. 123 Main Street, New York, NY 10001"
                        required
                        label="Receiver's Address"
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="address" />}
                      />
                    </div>
                  )}
                </Field>
                <button
                  type="submit"
                  className="custom-btn loading-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner" />
                      <span>Creating Receiver...</span>
                    </>
                  ) : (
                    'Create Receiver'
                  )}
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Dialog>
  );
};

export default NewReceiverDialog;
