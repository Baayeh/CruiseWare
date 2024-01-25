/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, FormikErrors } from 'formik';
import { InputSwitch } from 'primereact/inputswitch';
import { useState } from 'react';
import Select from 'react-select';
import TimezoneSelect from 'react-timezone-select';
import useCountries from '../../hooks/useCountries';

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
};

/**
 * Renders the form to get company information.
 *
 * @param {Function} setFieldValue - A function to set form field values.
 * @return {JSX.Element} The rendered form to get the company information.
 */
const CompanyInfo = ({
  setFieldValue,
}: {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<RegisterFormValues>>;
}) => {
  const [tz, setTz] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [country, setCountry] = useState<CountrySelectValue | null>(null);

  const { getAll } = useCountries();

  const handleTimezone = (newValue: any) => {
    setTz(newValue.value);
    setFieldValue('company_timezone', newValue.value);
  };

  const handleCountry = (newValue: CountrySelectValue) => {
    setCountry(newValue);
    setFieldValue('company_country', newValue.label);
  };

  return (
    <section data-aos="fade-right">
      <h1 className="text-2xl sm:text-3xl mb-5">Company Information</h1>
      <section className="lg:flex lg:gap-x-10">
        <div className="w-full">
          <Field name="company_name">
            {({ field, meta }: FieldProps) => (
              <div className="mb-5">
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Company Name"
                  {...field}
                  error={meta.touched && meta.error ? true : false}
                  helperText={meta.touched && meta.error ? meta.error : ''}
                />
              </div>
            )}
          </Field>
          <div className="flex flex-col sm:flex-row sm:gap-x-4">
            <Field name="company_state">
              {({ field, meta }: FieldProps) => (
                <div className="mb-5 w-full">
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="State/Region"
                    {...field}
                    error={meta.touched && meta.error ? true : false}
                    helperText={meta.touched && meta.error ? meta.error : ''}
                  />
                </div>
              )}
            </Field>
            <Field name="company_city">
              {({ field, meta }: FieldProps) => (
                <div className="mb-5 w-full">
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="City"
                    {...field}
                    error={meta.touched && meta.error ? true : false}
                    helperText={meta.touched && meta.error ? meta.error : ''}
                  />
                </div>
              )}
            </Field>
          </div>
          <Field name="company_street">
            {({ field, meta }: FieldProps) => (
              <div className="mb-5 w-full">
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Street"
                  {...field}
                  error={meta.touched && meta.error ? true : false}
                  helperText={meta.touched && meta.error ? meta.error : ''}
                />
              </div>
            )}
          </Field>
        </div>

        <div className="w-full">
          <Field name="company_country">
            {({ meta }: FieldProps) => (
              <div className="mb-5 w-full">
                <Select
                  placeholder="Country"
                  name="company_country"
                  isClearable
                  options={getAll()}
                  value={country}
                  onChange={handleCountry}
                  formatOptionLabel={(option: any) => (
                    <div className="flex flex-row items-center gap-3">
                      <div>{option.flag}</div>
                      <div>
                        {option.label},
                        <span className="text-neutral-500 ml-1">
                          {option.region}
                        </span>
                      </div>
                    </div>
                  )}
                  classNames={{
                    control: () =>
                      `!bg-transparent !shadow-none !outline-none !border-[#e8e8e8] !hover:border-[#e8e8e8] !h-full !py-[0.51rem] !px-[14px]  ${
                        meta.touched && meta.error ? '!border-red-500' : ''
                      }`,
                    input: () =>
                      `!text-[#e8e8e8] !h-[1.4375em] !block !w-full !bg-transparent ${
                        meta.touched && meta.error ? '!text-red-500' : ''
                      }`,
                    singleValue: () => '!text-[#e8e8e8]',
                    placeholder: () =>
                      `!text-[#e8e8e8] ${
                        meta.touched && meta.error ? '!text-red-500' : ''
                      }`,
                    menu: () => '!bg-[#141926f3]',
                    dropdownIndicator: () =>
                      `!text-[#e8e8e8] ${
                        meta.touched && meta.error ? '!text-red-500' : ''
                      }`,
                    indicatorSeparator: () =>
                      `!bg-[#e8e8e8] ${
                        meta.touched && meta.error ? '!bg-red-500' : ''
                      }`,
                  }}
                  styles={{
                    option: (base, { isSelected }) => {
                      return {
                        ...base,
                        color: isSelected
                          ? 'rgba(20, 25, 38, 0.9529411765)'
                          : '#e8e8e8',
                        backgroundColor: isSelected ? '#e8e8e8' : '',
                        ':hover': {
                          backgroundColor: '#e8e8e8',
                          color: 'rgba(20, 25, 38, 0.9529411765)',
                        },
                      };
                    },
                  }}
                />
                <ErrorMessage
                  name="company_country"
                  component="p"
                  className="text-red-500 text-[0.68rem] tracking-wider mx-[14px] mt-1"
                />
              </div>
            )}
          </Field>
          <Field name="company_timezone">
            {({ meta }: FieldProps) => (
              <div className="mb-5 w-full">
                <TimezoneSelect
                  placeholder="Select Timezone"
                  value={tz}
                  onChange={handleTimezone}
                  labelStyle="abbrev"
                  displayValue="UTC"
                  isSearchable
                  classNames={{
                    control: () =>
                      `!bg-transparent !shadow-none !outline-none !border-[#e8e8e8] !hover:border-[#e8e8e8] !h-full !py-[0.51rem] !px-[14px]  ${
                        meta.touched && meta.error ? '!border-red-500' : ''
                      }`,
                    input: () =>
                      `!text-[#e8e8e8] !h-[1.4375em] !block !w-full !bg-transparent ${
                        meta.touched && meta.error ? '!text-red-500' : ''
                      }`,
                    singleValue: () => '!text-[#e8e8e8]',
                    placeholder: () =>
                      `!text-[#e8e8e8] ${
                        meta.touched && meta.error ? '!text-red-500' : ''
                      }`,
                    menu: () => '!bg-[#141926f3]',
                    dropdownIndicator: () =>
                      `!text-[#e8e8e8] ${
                        meta.touched && meta.error ? '!text-red-500' : ''
                      }`,
                    indicatorSeparator: () =>
                      `!bg-[#e8e8e8] ${
                        meta.touched && meta.error ? '!bg-red-500' : ''
                      }`,
                  }}
                  styles={{
                    option: (base, { isSelected }) => {
                      return {
                        ...base,
                        color: isSelected
                          ? 'rgba(20, 25, 38, 0.9529411765)'
                          : '#e8e8e8',
                        backgroundColor: isSelected ? '#e8e8e8' : '',
                        ':hover': {
                          backgroundColor: '#e8e8e8',
                          color: 'rgba(20, 25, 38, 0.9529411765)',
                        },
                      };
                    },
                  }}
                />
              </div>
            )}
          </Field>
          <div className="mb-6 mt-9">
            <Field name="company_regStatus">
              {({ field, meta }: FieldProps) => (
                <>
                  <div className="flex justify-between items-center">
                    <p>Is the company registered?</p>
                    <InputSwitch {...field} checked={meta.value} />
                  </div>
                  <ErrorMessage
                    name="company_regStatus"
                    component={'div'}
                    className="text-red-500 text-sm mt-2"
                  />
                </>
              )}
            </Field>
          </div>
        </div>
      </section>
    </section>
  );
};
export default CompanyInfo;
