/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import TextField from '@mui/material/TextField';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { setPaginatedSuppliers } from '../..';
import { useFetch, useUpdate } from '../../../../hooks';

interface EditSupplierProps extends MainDialogProps {
  supplier: SupplierProps | null;
  setPage: (page: number) => void;
  setActiveItem: (item: SupplierProps | null) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, 'The name must be at least 5 characters long.')
    .required('Name is required'),
  phone: Yup.string()
    .matches(
      /^\+(?:[0-9] ?){6,14}[0-9]$/,
      'Phone number must be a valid number'
    )
    .required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  email: Yup.string()
    .email('Invalid email address')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'The email address must be a valid email address.'
    )
    .nullable(),
  contactName: Yup.string()
    .min(5, 'The name must be at least 5 characters long.')
    .nullable(),
  contactPhone: Yup.string()
    .matches(
      /^\+(?:[0-9] ?){6,14}[0-9]$/,
      'Phone number must be a valid number'
    )
    .nullable(),
  contactEmail: Yup.string()
    .email('Invalid email address')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'The email address must be a valid email address.'
    )
    .nullable(),
});

const EditSupplierDialog: React.FC<EditSupplierProps> = ({
  supplier,
  visible,
  setVisible,
  setPage,
  setActiveItem,
}) => {
  const [requestSent, setRequestSent] = useState(false);

  const { data, loading, error, updateData, resetState } = useUpdate(
    `/supplier/${supplier?.id}`,
    'PUT'
  );

  const { fetchData: fetchPaginatedSuppliers } = useFetch(
    `/supplier?page=${0}&pageSize=${10}`,
    setPaginatedSuppliers
  );

  const initialValues = {
    name: supplier?.name ? supplier.name : '',
    phone: supplier?.phone ? supplier.phone : '',
    address: supplier?.address ? supplier.address : '',
    email: supplier?.email ? supplier.email : '',
    contactName: supplier?.contactName ? supplier.contactName : '',
    contactPhone: supplier?.contactPhone ? supplier.contactPhone : '',
    contactEmail: supplier?.contactEmail ? supplier.contactEmail : '',
  };

  const onSubmit = async (values: SupplierFormValues) => {
    const body = Object.entries(values)
      .filter((entry) => {
        // Check if the property value is not empty.
        const [_key, value] = entry;
        return value !== '' && value !== null;
      })
      .reduce((obj: { [key: string]: any }, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    await updateData(body);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
      setVisible(false);
      setActiveItem(null);
      setPage(0);
      resetState();
      setRequestSent(false);
      fetchPaginatedSuppliers();
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
      header="Edit Supplier"
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      maskClassName="create-new-mask"
      id="new-inventory-dialog"
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
                        label="Supplier's Name"
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
                        label="Supplier's Email"
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
                        placeholder="+1 555 555 5555"
                        fullWidth
                        label="Supplier's Phone"
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
                        label="Supplier's Address"
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="address" />}
                      />
                    </div>
                  )}
                </Field>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-x-6">
                  <Field name="contactName">
                    {({ field, meta }: FieldProps) => (
                      <div className="mb-5 w-full">
                        <TextField
                          {...field}
                          variant="outlined"
                          fullWidth
                          label="Contact Person's Name"
                          error={meta.touched && meta.error ? true : false}
                          helperText={<ErrorMessage name="contactName" />}
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="contactPhone">
                    {({ field, meta }: FieldProps) => (
                      <div className="mb-5 w-full">
                        <TextField
                          {...field}
                          variant="outlined"
                          fullWidth
                          placeholder="+1 555 555 5555"
                          label="Contact Person's Phone"
                          error={meta.touched && meta.error ? true : false}
                          helperText={<ErrorMessage name="contactPhone" />}
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <Field name="contactEmail">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-5 w-full">
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        label="Contact Person's Email"
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="contactEmail" />}
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
                      <span>Updating Supplier...</span>
                    </>
                  ) : (
                    'Update Supplier'
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

export default EditSupplierDialog;
