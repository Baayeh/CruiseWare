import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserAlt } from 'react-icons/fa';
import { MdOutlineModeEditOutline, MdPassword } from 'react-icons/md';
import * as Yup from 'yup';
import { useAppDispatch, useUpdate } from '../../../../hooks';
import { updateUserInfo } from '../../../authentication';

/**
 * Account information properties.
 *
 * @interface AccountInfoProps
 * @property {string} f_name - The first name of the account holder.
 */
interface AccountInfoProps {
  f_name: string;
  l_name: string;
}

/**
 * Security properties.
 *
 * @interface SecurityInfoProps
 * @property {string} current_password - The current password for the account.
 * @property {string} new_password - The new password for the account.
 * @property {string} confirm_password - The confirmation of the new password for the account.
 */
interface SecurityInfoProps {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

/**
 * Security information values.
 *
 * @type {SecurityInfoProps}
 */
const securityInfoValues: SecurityInfoProps = {
  current_password: '',
  new_password: '',
  confirm_new_password: '',
};

const accountInfoSchema = Yup.object().shape({
  f_name: Yup.string().required('First name is required'),
  l_name: Yup.string().required('Last name is required'),
});

const securityInfoSchema = Yup.object().shape({
  current_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Please enter your current password'),
  new_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Please enter your new password'),
  confirm_new_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .oneOf([Yup.ref('new_password'), ''], 'Passwords must match')
    .required('Please confirm new password'),
});

/**
 * Renders a form component for updating personal information and security details.
 *
 * @returns {JSX.Element} The rendered form component.
 */
const PersonalInfo = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [requestSent, setRequestSent] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<AccountInfoProps | null>(null);
  const dispatch = useAppDispatch();
  const [showNameField, setShowNameField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  // update user info
  const { data, loading, error, updateData, resetState } = useUpdate(
    '/users/update',
    'PATCH'
  );

  // update user password
  const {
    data: dataPassword,
    loading: loadingPassword,
    error: errorPassword,
    updateData: updateDataPassword,
    resetState: resetStatePassword,
  } = useUpdate('/users/password/update', 'PATCH');

  const accountInfoValues: AccountInfoProps = {
    f_name: user?.firstName ? user.firstName : '',
    l_name: user?.lastName ? user.lastName : '',
  };

  const _updateAccountInfo = async (values: AccountInfoProps) => {
    const body = {
      firstName: values.f_name,
      lastName: values.l_name,
    };

    await updateData(body);
    setUpdatedUser(values);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('Name updated successfully');
      resetState();
      setRequestSent(false);
      const updateUser = {
        ...user,
        firstName: updatedUser?.f_name,
        lastName: updatedUser?.l_name,
      };
      localStorage.setItem('user', JSON.stringify(updateUser));
      dispatch(updateUserInfo(updateUser));
      setShowNameField(false);
    }
  }, [data, requestSent, resetState, dispatch, updatedUser]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
      setRequestSent(false);
      setUpdatedUser(null);
    }
  }, [error, data, resetState]);

  const _updateSecurityInfo = async (
    values: SecurityInfoProps,
    { resetForm }: { resetForm: () => void }
  ) => {
    const body = {
      oldPassword: values.current_password,
      newPassword: values.new_password,
      retypeNewPassword: values.confirm_new_password,
    };

    await updateDataPassword(body);
    resetForm();
    setRequestSent(true);
  };

  useEffect(() => {
    if (dataPassword && requestSent) {
      toast.success(dataPassword);
      resetStatePassword();
      setRequestSent(false);
      setShowPasswordField(false);
    }
  }, [dataPassword, requestSent, resetStatePassword]);

  useEffect(() => {
    if (errorPassword && !dataPassword) {
      toast.error(errorPassword);
      resetStatePassword();
      setRequestSent(false);
    }
  }, [errorPassword, dataPassword, resetStatePassword]);

  return (
    <section className="w-[40rem]">
      <div className="text-center mt-3">
        <h3 className="text-3xl font-normal">Personal Info</h3>
        <p className="text-[color:var(--text-secondary)]">
          Personal data and preferences across Cruise products and services.
        </p>
      </div>
      <div
        id="basic_info"
        className="my-10 border border-[color:var(--border-color)] rounded-md pl-7 pt-7 pb-1"
      >
        <h2 className="text-xl">Basic Info</h2>
        <p className="text-sm text-[color:var(--text-secondary)]">
          Some info may be visible to other people using Cruise services.
        </p>
        <div className="flex items-center gap-x-10 mt-5">
          <div className="my-3">
            <p className="text-sm text-[color:var(--text-secondary)] mb-1">
              Your Role
            </p>
            <span className="text-sm p-2 rounded bg-[color:var(--border-color)] font-medium">
              {user?.role}
            </span>
          </div>
          <div className="my-3">
            <p className="text-sm text-[color:var(--text-secondary)] mb-1">
              Email
            </p>
            <span className="text-sm p-2 rounded bg-[color:var(--border-color)] font-medium">
              {user?.email}
            </span>
          </div>
        </div>
        {showNameField ? (
          <div className="form_wrapper mt-5 border-t border-[color:var(--border-color)] pr-6 py-4">
            <p className="text-sm text-[color:var(--text-secondary)] mb-6">
              Modifications made to your name will be visible throughout your
              Cruise Account.
            </p>
            <Formik
              initialValues={accountInfoValues}
              validationSchema={accountInfoSchema}
              onSubmit={_updateAccountInfo}
            >
              {() => {
                return (
                  <Form>
                    <div className="full-name">
                      <Field name="f_name">
                        {({ field, meta }: FieldProps) => (
                          <div className="mb-5">
                            <TextField
                              variant="outlined"
                              fullWidth
                              label="First Name"
                              {...field}
                              error={meta.touched && meta.error ? true : false}
                              helperText={
                                meta.touched && meta.error ? meta.error : ''
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <FaUserAlt
                                      className={
                                        meta.touched && meta.error
                                          ? 'text-[#fb3434]'
                                          : 'text-gray-400'
                                      }
                                    />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        )}
                      </Field>
                      <Field name="l_name">
                        {({ field, meta }: FieldProps) => (
                          <div className="mb-5">
                            <TextField
                              variant="outlined"
                              fullWidth
                              label="Last Name"
                              {...field}
                              error={meta.touched && meta.error ? true : false}
                              helperText={
                                meta.touched && meta.error ? meta.error : ''
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <FaUserAlt
                                      className={
                                        meta.touched && meta.error
                                          ? 'text-[#fb3434]'
                                          : 'text-gray-400'
                                      }
                                    />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="custom-btn loading-btn !w-[10rem]"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="spinner" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          'Save'
                        )}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        ) : (
          <div className="mt-5 border-t border-[color:var(--border-color)] flex w-full justify-between items-center pr-6 py-4">
            <p className="text-sm font-normal">Name</p>
            <p>
              {user?.firstName} {user?.lastName}
            </p>
            <button
              type="button"
              className="rounded-full hover:bg-[color:var(--border-color)] p-2"
              onClick={() => setShowNameField(true)}
            >
              <span>
                <MdOutlineModeEditOutline />
              </span>
            </button>
          </div>
        )}
      </div>

      <div
        id="security"
        className="my-10 border border-[color:var(--border-color)] rounded-md pl-7 pt-7 pb-1"
      >
        <h2 className="font-semibold text-lg">Password & Security</h2>
        <p className="text-sm text-[color:var(--text-secondary)]">
          A strong password is essential for securing your Cruise account.
        </p>

        {showPasswordField ? (
          <div className="form_wrapper mt-4 pr-6 py-4">
            <Formik
              initialValues={securityInfoValues}
              validationSchema={securityInfoSchema}
              onSubmit={_updateSecurityInfo}
            >
              {() => {
                return (
                  <Form>
                    <Field name="current_password">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5">
                          <TextField
                            type="password"
                            variant="outlined"
                            fullWidth
                            label="Current Password"
                            {...field}
                            error={meta.touched && meta.error ? true : false}
                            helperText={
                              meta.touched && meta.error ? meta.error : ''
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <MdPassword
                                    className={
                                      meta.touched && meta.error
                                        ? 'text-[#fb3434]'
                                        : 'text-gray-400'
                                    }
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="new_password">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5">
                          <TextField
                            type="password"
                            variant="outlined"
                            fullWidth
                            label="New Password"
                            {...field}
                            error={meta.touched && meta.error ? true : false}
                            helperText={
                              meta.touched && meta.error ? meta.error : ''
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <MdPassword
                                    className={
                                      meta.touched && meta.error
                                        ? 'text-[#fb3434]'
                                        : 'text-gray-400'
                                    }
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="confirm_new_password">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5">
                          <TextField
                            type="password"
                            variant="outlined"
                            fullWidth
                            label="Confirm Password"
                            {...field}
                            error={meta.touched && meta.error ? true : false}
                            helperText={
                              meta.touched && meta.error ? meta.error : ''
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <MdPassword
                                    className={
                                      meta.touched && meta.error
                                        ? 'text-[#fb3434]'
                                        : 'text-gray-400'
                                    }
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      )}
                    </Field>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="custom-btn loading-btn !w-auto"
                        disabled={loadingPassword}
                      >
                        {loadingPassword ? (
                          <>
                            <div className="spinner" />
                            <span>Updating password...</span>
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        ) : (
          <div className="flex w-full justify-between items-center pr-6 py-4">
            <span>********</span>
            <button
              type="button"
              className="rounded-full hover:bg-[color:var(--border-color)] p-2"
              onClick={() => setShowPasswordField(true)}
            >
              <span>
                <MdOutlineModeEditOutline />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonalInfo;
