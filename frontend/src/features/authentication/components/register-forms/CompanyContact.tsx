import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, FormikErrors } from 'formik';
import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select, { SingleValue } from 'react-select';

interface IndustryProps {
  value: string;
  label: string;
}

interface CompanySizeProps {
  value: string;
  label: string;
}

/**
 * Render a form section for the company contact information.
 *
 * @param {Function} setFieldValue - A function to set form field values.
 * @return {JSX.Element} The rendered form section.
 */
const CompanyContact = ({
  setFieldValue,
}: {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<RegisterFormValues>>;
}) => {
  const [phone, _] = useState('');
  const [industry, setIndustry] = useState<IndustryProps | null>(null);
  const [companySize, setCompanySize] = useState<CompanySizeProps | null>(null);

  const industryOptions = [
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'construction', label: 'Construction' },
    { value: 'education', label: 'Education' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'technology', label: 'Technology' },
  ];

  const companySizeOptions = [
    { value: 'sole_Proprietorship', label: '1' },
    { value: 'small', label: '2 - 10' },
    { value: 'medium', label: '11 - 50' },
    { value: 'large', label: '51 - 100' },
    { value: 'enterprise', label: '101+' },
  ];

  const handleIndustryOptions = (industry: SingleValue<IndustryProps>) => {
    setIndustry(industry);
    if (industry) {
      setFieldValue('company_industry', industry.value);
    }
  };

  const handleCompanySizeOptions = (
    companySize: SingleValue<CompanySizeProps>
  ) => {
    setCompanySize(companySize);
    if (companySize) {
      setFieldValue('company_size', companySize.value);
    }
  };

  return (
    <section className="lg:w-[70%]" data-aos="fade-right">
      <h1 className="text-2xl sm:text-3xl mb-5">Company Information</h1>
      <Field name="company_email">
        {({ field, meta }: FieldProps) => (
          <div className="mb-5">
            <TextField
              variant="outlined"
              fullWidth
              label="Company Email"
              {...field}
              error={meta.touched && meta.error ? true : false}
              helperText={meta.touched && meta.error ? meta.error : ''}
            />
          </div>
        )}
      </Field>
      <div className="flex flex-col sm:flex-row sm:gap-x-4">
        <Field name="company_phone">
          {() => {
            return (
              <div className="mb-5 w-full">
                <div className="inline-flex flex-col align-top w-full">
                  <div className="inline-flex box-border">
                    <PhoneInput
                      defaultCountry="ng"
                      value={phone}
                      onChange={(phone) =>
                        setFieldValue('company_phone', phone)
                      }
                      style={{ height: '100%', width: '100%' }}
                      inputStyle={{
                        height: '100%',
                        width: '100%',
                        padding: '1rem 8px',
                        backgroundColor: 'transparent',
                        color: '#e8e8e8',
                        fontSize: '1rem',
                      }}
                      countrySelectorStyleProps={{
                        buttonStyle: {
                          height: '100%',
                          padding: '0 8px',
                        },
                        dropdownStyleProps: {
                          style: {
                            top: '3.8rem',
                            zIndex: 50,
                          },
                          listItemStyle: {
                            padding: '1rem',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Field>
        <Field name="company_industry">
          {({ meta }: FieldProps) => (
            <div className="mb-5 w-full">
              <div className="inline-flex flex-col align-top w-full">
                <div className="inline-flex box-border">
                  <Select
                    options={industryOptions}
                    placeholder="Select Industry"
                    isClearable
                    value={industry}
                    onChange={handleIndustryOptions}
                    classNames={{
                      control: () =>
                        `!bg-transparent !shadow-none !outline-none !border-[#e8e8e8] !hover:border-[#e8e8e8] !h-full !py-[0.6rem] !px-[14px]  ${
                          meta.touched && meta.error ? '!border-red-500' : ''
                        }`,
                      container: () => '!w-full',
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
                          width: '100%',
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
                <ErrorMessage
                  name="company_industry"
                  component="p"
                  className="text-red-500 text-xs leading-7 tracking-wider mx-[14px] mt-1"
                />
              </div>
            </div>
          )}
        </Field>
      </div>
      <div>
        <Field name="company_size">
          {({ meta }: FieldProps) => (
            <div className="mb-5">
              <div className="inline-flex flex-col align-top w-full">
                <div className="inline-flex box-border">
                  <Select
                    options={companySizeOptions}
                    placeholder="Select Company Size"
                    isClearable
                    value={companySize}
                    onChange={handleCompanySizeOptions}
                    classNames={{
                      control: () =>
                        `!bg-transparent !shadow-none !outline-none !border-[#e8e8e8] !hover:border-[#e8e8e8] !h-full !py-3 !px-[14px]  ${
                          meta.touched && meta.error ? '!border-red-500' : ''
                        }`,
                      container: () => '!w-full',
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
                <ErrorMessage
                  name="company_size"
                  component="p"
                  className="text-red-500 text-xs leading-7 tracking-wider mx-[14px] mt-1"
                />
              </div>
            </div>
          )}
        </Field>
      </div>
      <Field name="company_description">
        {({ field, meta }: FieldProps) => (
          <div className="mb-5 w-full">
            <textarea
              id=""
              cols={30}
              rows={5}
              placeholder="Company Description"
              aria-label="description"
              className={`${
                meta.touched && meta.error
                  ? 'border-red-500 text-red-500 focus-visible:border-red-500 placeholder:text-red-500'
                  : 'border-[#e8e8e8]'
              } p-3 w-full bg-transparent border rounded-md outline-none`}
              {...field}
            />
            <ErrorMessage
              name="company_description"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        )}
      </Field>
    </section>
  );
};
export default CompanyContact;
