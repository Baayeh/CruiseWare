import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { setAllRoles } from '../..';
import { useCreate, useFetch } from '../../../../hooks';

const initialValues: RoleFormValues = {
  roleName: '',
  roleDescription: '',
};

const validationSchema = Yup.object().shape({
  roleName: Yup.string().required('Name is required'),
  roleDescription: Yup.string().required('Description is required'),
});

const NewRoleDialog: React.FC<MainDialogProps> = ({ visible, setVisible }) => {
  const [requestSent, setRequestSent] = useState(false);
  const { fetchData: fetchAllRoles } = useFetch('/roles', setAllRoles);

  // create role
  const { data, loading, error, createData, resetState } = useCreate('/roles');

  const onSubmit = async (values: RoleFormValues) => {
    const role = {
      roleName: values.roleName,
      roleDescription: values.roleDescription,
    };

    await createData(role);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
      setVisible(false);
      resetState();
      setRequestSent(false);
      fetchAllRoles();
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
      header="New Role"
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
          <Form>
            <Field name="roleName">
              {({ field, meta }: FieldProps<RoleFormValues>) => (
                <div className="mb-5 w-full">
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    required
                    label="Role Name"
                    error={meta.touched && meta.error ? true : false}
                    helperText={<ErrorMessage name="roleName" />}
                  />
                </div>
              )}
            </Field>
            <Field name="roleDescription">
              {({ field, meta }: FieldProps) => (
                <div className="mb-5 w-full">
                  <textarea
                    id="description"
                    rows={5}
                    {...field}
                    placeholder="What is this role about.."
                    className={`w-full px-4 py-2 bg-transparent border rounded transition-colors duration-300 ease-in-out ${
                      meta.touched && meta.error
                        ? 'border-[#d32f2f] placeholder:text-[#d32f2f] dark:border-[#d32f2f] focus:outline-none focus-visible:outline-none'
                        : 'border-[#bababa] dark:border-gray-700 placeholder:text-[color:var(--text-secondary)] hover:border-gray-700 dark:hover:border-gray-200'
                    }`}
                  />
                  <ErrorMessage
                    name="roleDescription"
                    component="p"
                    className="text-[#d32f2f] text-[0.75rem] ml-[14px] font-normal tracking-wide leading-relaxed"
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
                  <span>Creating Role...</span>
                </>
              ) : (
                'Create Role'
              )}
            </button>
          </Form>
        </Formik>
      </div>
    </Dialog>
  );
};

export default NewRoleDialog;
