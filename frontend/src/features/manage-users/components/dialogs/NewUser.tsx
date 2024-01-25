import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { setAllUsers } from '../..';
import { useAppSelector, useCreate, useFetch } from '../../../../hooks';
import { selectRole, setAllRoles } from '../../../settings';

interface NewUserProps extends MainDialogProps {
  setActiveItem: (item: UserProps | null) => void;
}

const initialValues: UserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  roleId: 0,
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
    .required('Email is required'),
  roleId: Yup.number().required('Role is required'),
});

const NewUser: React.FC<NewUserProps> = ({
  visible,
  setVisible,
  setActiveItem,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const { allRoles } = useAppSelector(selectRole);
  const { fetchData: fetchAllRoles } = useFetch('/roles', setAllRoles);
  const { fetchData: fetchAllUsers } = useFetch('/users', setAllUsers);

  const { data, loading, error, createData, resetState } = useCreate('/users');

  const onSubmit = async (values: UserFormValues) => {
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      roleId: values.roleId,
    };

    await createData(data);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('User created!');
      setVisible(false);
      resetState();
      setRequestSent(false);
      setActiveItem(null);
      fetchAllUsers();
    }
  }, [data, requestSent, resetState]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  useEffect(() => {
    fetchAllRoles();
  }, []);

  return (
    <Dialog
      header="New User"
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
                <div className="flex justify-between gap-x-4">
                  <Field name="firstName">
                    {({ field, meta }: FieldProps) => (
                      <div className="mb-5 w-full">
                        <TextField
                          {...field}
                          variant="outlined"
                          fullWidth
                          required
                          label="First Name"
                          error={meta.touched && meta.error ? true : false}
                          helperText={<ErrorMessage name="firstName" />}
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="lastName">
                    {({ field, meta }: FieldProps) => (
                      <div className="mb-5 w-full">
                        <TextField
                          {...field}
                          variant="outlined"
                          fullWidth
                          required
                          label="Last Name"
                          error={meta.touched && meta.error ? true : false}
                          helperText={<ErrorMessage name="lastName" />}
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Field name="email">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5 w-full">
                          <TextField
                            {...field}
                            variant="outlined"
                            fullWidth
                            required
                            label="Email"
                            error={meta.touched && meta.error ? true : false}
                            helperText={<ErrorMessage name="email" />}
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                  <div className="col-span-1">
                    <Field name="roleId">
                      {({ field, meta }: FieldProps) => (
                        <div>
                          <label
                            htmlFor="receivers"
                            className="mb-2 text-sm font-medium text-gray-900 dark:text-white hidden"
                          >
                            Select an option
                          </label>
                          <select
                            id="receivers"
                            className={`bg-[color:var(--secondary-bg)] border   text-sm rounded block w-full px-4 py-[1.1rem] hover:border-[#0f172a] focus:border-[#0f172a]  dark:placeholder-gray-400  dark:focus:border-[#f4f4f4] ${
                              meta.touched && meta.error
                                ? 'border-[#d32f2f] focus:outline-none focus-visible:outline-none text-[#d32f2f]'
                                : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-[#f4f4f4]'
                            }`}
                            {...field}
                          >
                            <option value="">Select Role</option>
                            {allRoles && allRoles.length === 0 ? (
                              <option value="">No roles! Create one.</option>
                            ) : null}

                            {allRoles &&
                              allRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                          </select>
                          {meta.touched && meta.error && (
                            <FormHelperText error sx={{ marginLeft: '1rem' }}>
                              {meta.error}
                            </FormHelperText>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="custom-btn loading-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      'Create User'
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Dialog>
  );
};

export default NewUser;
