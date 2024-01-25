/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { setPaginatedSuppliers } from '../..';
import { useCreate, useFetch } from '../../../../hooks';

interface NewSupplierProps extends MainDialogProps {
  setPage: (page: number) => void;
  setActiveItem: (item: SupplierProps | null) => void;
}

const initialValues: SupplierFormValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  addContact: false,
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
  addContact: Yup.boolean(),
  contactName: Yup.string().when('addContact', ([addContact], schema) => {
    return addContact ? schema.required('Contact name is required') : schema;
  }),
  contactEmail: Yup.string().when('addContact', ([addContact], schema) => {
    if (addContact) {
      return schema
        .email('Invalid email address')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
        .test('email-or-phone', 'Email or phone is required', function (value) {
          return !!value || !!this.parent.contactPhone;
        });
    }
    return schema;
  }),
  contactPhone: Yup.string().when('addContact', ([addContact], schema) => {
    if (addContact) {
      return schema
        .matches(
          /^\+(?:[0-9] ?){6,14}[0-9]$/,
          'Phone number must be a valid number'
        )
        .test('email-or-phone', 'Email or phone is required', function (value) {
          return !!value || !!this.parent.contactEmail;
        });
    }
    return schema;
  }),
});

const NewSupplierDialog: React.FC<NewSupplierProps> = ({
  visible,
  setVisible,
  setPage,
  setActiveItem,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const { fetchData: fetchPaginatedSuppliers } = useFetch(
    `/supplier?page=${0}&pageSize=${10}`,
    setPaginatedSuppliers
  );

  const { data, loading, error, createData, resetState } =
    useCreate('/supplier');

  const onSubmit = async (values: SupplierFormValues) => {
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
      toast.success('Supplier created!');
      setVisible(false);
      setPage(0);
      resetState();
      setRequestSent(false);
      setActiveItem(null);
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
      header="New Supplier"
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
          {({ values }) => {
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
                        required
                        fullWidth
                        placeholder="+1 555 555 5555"
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
                        required
                        label="Supplier's Address"
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="address" />}
                      />
                    </div>
                  )}
                </Field>

                <Field name="addContact">
                  {({ field }: FieldProps) => (
                    <div className="flex justify-end items-center mb-5 text-sm">
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={values.addContact}
                            color="primary"
                          />
                        }
                        label="Add Supplier's Contact Details"
                      />
                    </div>
                  )}
                </Field>

                {values.addContact && (
                  <>
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
                  </>
                )}
                <button
                  type="submit"
                  className="custom-btn loading-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner" />
                      <span>Creating Supplier...</span>
                    </>
                  ) : (
                    'Create Supplier'
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

export default NewSupplierDialog;
