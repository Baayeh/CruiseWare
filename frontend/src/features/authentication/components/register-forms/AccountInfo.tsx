import { InputAdornment, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { FaUserAlt } from 'react-icons/fa';
import { MdEmail, MdPassword } from 'react-icons/md';
import { Link } from 'react-router-dom';

/**
 * Renders the account information form.
 *
 * @return {JSX.Element} The rendered account information form.
 */
const AccountInfo = () => {
  return (
    <>
      <section className="lg:w-[70%]" data-aos="fade-right">
        <div className="register-title">
          <p className="uppercase text-gray-500 font-semibold">
            Start for free
          </p>
          <h1>Create new account</h1>
          <p className="my-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#ff5722] hover:underline">
              Login
            </Link>
          </p>
        </div>
        <div className="full-name">
          <Field name="f_name">
            {({ field, meta }: FieldProps) => (
              <div className="mb-5 w-full">
                <TextField
                  variant="outlined"
                  fullWidth
                  label="First Name"
                  {...field}
                  error={meta.touched && meta.error ? true : false}
                  helperText={meta.touched && meta.error ? meta.error : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <FaUserAlt
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
          <Field name="l_name">
            {({ field, meta }: FieldProps) => (
              <div className="mb-5 w-full">
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Last Name"
                  {...field}
                  error={meta.touched && meta.error ? true : false}
                  helperText={meta.touched && meta.error ? meta.error : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <FaUserAlt
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
        </div>

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
      </section>
    </>
  );
};
export default AccountInfo;
