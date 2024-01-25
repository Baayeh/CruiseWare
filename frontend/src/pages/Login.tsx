import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdEmail, MdPassword } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { setCredentials } from '../features/authentication';
import { useAuth } from '../hooks';
import { useAppDispatch } from '../hooks/useStore';

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Please enter your password'),
});

const Login = () => {
  const { data, loading, loginUser, access, refresh, error, auth, resetState } =
    useAuth();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);

  const dispatch = useAppDispatch();

  const onSubmit = async (values: LoginFormValues) => {
    const user = {
      email: values.email,
      password: values.password,
    };

    await loginUser(user);
    setRequesting(true);
  };

  useEffect(() => {
    if (data && requesting) {
      toast.success('Logged in successfully');
      const user = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        role: data?.roleName,
      };

      const company = {
        businessID: data?.businessID,
        businessName: data?.businessName,
        businessEmail: data?.businessEmail,
        businessPhone: data?.businessPhone,
        businessAddress: data?.businessAddress[0],
      };

      dispatch(setCredentials({ user, company, access, refresh }));
      resetState();
      navigate('/overview');
    }
  }, [data, requesting, dispatch]);

  useEffect(() => {
    if (error && !auth) {
      toast.error(error);
      resetState();
    }
  }, [error, auth]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="login" data-aos="fade-right">
      <div className="login-title">
        <h1>Welcome back</h1>
        <p className="my-4">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>

      <div className="form-wrapper">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => {
            return (
              <Form>
                <Field name="email">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-5">
                      <TextField
                        {...field}
                        label="Your email"
                        variant="outlined"
                        fullWidth
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="email" />}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <MdEmail
                                className={
                                  meta.touched && meta.error
                                    ? 'text-[#fb3434]'
                                    : 'text-[#e8e8e8]'
                                }
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  )}
                </Field>
                <Field name="password">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-5">
                      <TextField
                        type="password"
                        {...field}
                        label="Your password"
                        variant="outlined"
                        fullWidth
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="password" />}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <MdPassword
                                className={
                                  meta.touched && meta.error
                                    ? 'text-[#fb3434]'
                                    : 'text-[#e8e8e8]'
                                }
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  )}
                </Field>
                <button
                  className="custom-btn loading-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    'Login to your account'
                  )}
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </section>
  );
};
export default Login;
