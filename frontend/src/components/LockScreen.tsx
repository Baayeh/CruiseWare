import { InputAdornment, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaUserAlt } from 'react-icons/fa';
import { HiPower } from 'react-icons/hi2';
import { MdPassword } from 'react-icons/md';
import { RiCloseCircleLine, RiCloseFill } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
  selectAuth,
  setCredentials,
  setIsLocked,
} from '../features/authentication';
import { useAppDispatch, useAppSelector, useAuth } from '../hooks';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Please enter your password'),
});

const LockScreen = () => {
  const [currentTime, setCurrentTime] = useState(moment().format('LT'));
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const { user } = useAppSelector(selectAuth);
  const { pathname } = useLocation();
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const { message, logoutUser } = useAuth();

  const { data, loginUser, access, refresh, error, auth, resetState } =
    useAuth();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);

  const dispatch = useAppDispatch();

  const initialValues: LoginFormValues = {
    email: user?.email ? user.email : '',
    password: '',
  };

  const onSubmit = async (values: LoginFormValues) => {
    const user = {
      email: values.email,
      password: values.password,
    };

    await loginUser(user);
    setRequesting(true);
  };

  const handleLogout = async () => {
    await logoutUser(refreshToken);
    setRequesting(true);
  };

  useEffect(() => {
    if (message && requesting) {
      toast.success(message);
      localStorage.clear();
      resetState();
      setRequesting(false);
      dispatch(setIsLocked(false));
      navigate('/login');
    }
  }, [message, requesting]);

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
      dispatch(setIsLocked(false));
      setRequesting(false);
      navigate(pathname);
    }
  }, [data, requesting, dispatch]);

  useEffect(() => {
    if (error && !auth) {
      toast.error(error);
      resetState();
      setRequesting(false);
    }
  }, [error, auth]);

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (
        event.key === 'Enter' ||
        event.key === 'NumpadEnter' ||
        event.key === ' '
      ) {
        setIsComponentVisible(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format('LT'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="lock-screen"
      className="grid place-items-center h-screen bg-[var(--glass-bg)] fixed inset-0 z-40"
    >
      {isComponentVisible ? (
        <div className="flex flex-col items-center relative">
          <div className="w-[3rem] h-[3rem] flex justify-center items-center rounded-full bg-[color:var(--border-color)]">
            <FaUserAlt size={25} />
          </div>
          <p className="mt-2">{user?.firstName + ' ' + user?.lastName}</p>

          {/* Form */}
          <div className="form-wrapper mt-5">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {() => {
                return (
                  <Form>
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
                  </Form>
                );
              }}
            </Formik>
          </div>

          <div className="absolute -bottom-[13rem] flex items-center gap-x-8">
            <button
              type="button"
              className="flex flex-col items-center"
              onClick={() => handleLogout()}
            >
              <div className="w-[2rem] h-[2rem] flex justify-center items-center mb-2">
                <span>
                  <HiPower size={25} />
                </span>
              </div>
              <p className="text-sm">Logout</p>
            </button>
            <button
              type="button"
              className="flex flex-col items-center"
              onClick={() => setIsComponentVisible(false)}
            >
              <div className="w-[2rem] h-[2rem] flex justify-center items-center mb-2">
                <span>
                  <RiCloseCircleLine size={25} />
                </span>
              </div>
              <p className="text-sm">Cancel</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center relative">
          <h1 className="text-6xl">{currentTime}</h1>
          <p className="text-sm">{moment().format('dddd, MMMM Do')}</p>
          <p className="text-[color:var(--text-secondary)] mt-[10rem] animate__animated animate__pulse animate__infinite">
            Press enter or spacebar to unlock
          </p>
          <p className="text-[color:var(--text-secondary)] text-xs absolute -bottom-[13rem]">
            © Cruise Ware - v1.0 | Powered by Cruise
          </p>
        </div>
      )}
    </div>
  );
};

export default LockScreen;
