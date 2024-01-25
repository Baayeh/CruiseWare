import TextField from '@mui/material/TextField';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiEditFill } from 'react-icons/ri';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import * as Yup from 'yup';
import { BusinessLocation, selectBusiness, setBusiness } from '..';
import { useAppSelector, useFetch } from '../../../hooks';
import { selectAuth } from '../../authentication';
import AddSocials from './AddSocials';
import EditSocials from './EditSocials';
import Socials from './Socials';
import CompanyDesc from './company-info/CompanyDesc';
import CompanyIndustry from './company-info/CompanyIndustry';
import CompanyName from './company-info/CompanyName';
import CompanyPhone from './company-info/CompanyPhone';
import CompanyRegStatus from './company-info/CompanyRegStatus';
import CompanySize from './company-info/CompanySize';
import CompanyWebsite from './company-info/CompanyWebsite';

/**
 * Represents the company information.
 *
 * @interface CompanyInfoProps
 * @property {string} company_name - The name of the company.
 * @property {Object} company_address - The address of the company.
 * @property {string} company_address.street - The street of the company address.
 * @property {string} company_address.city - The city of the company address.
 * @property {string} company_address.state - The state of the company address.
 * @property {string} company_address.digital_address - The digital address of the company.
 * @property {string} company_phone - The phone number of the company.
 * @property {string} company_email - The email address of the company.
 * @property {string} company_type - The type of the company.
 * @property {string} company_description - The description of the company.
 */
interface CompanyInfoProps {
  company_name: string;
  company_address: {
    street: string;
    city: string;
    state: string;
    timezone: string;
    country: string;
  };
  company_phone: string;
  company_email: string;
  company_type: string;
  company_description: string;
}

const companyInfoSchema = Yup.object().shape({
  company_name: Yup.string()
    .min(3, 'Company name must be at least 3 characters')
    .required('Company name is required'),
  company_address: Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    timezone: Yup.string().required('Timezone is required'),
    country: Yup.string().required('Country is required'),
  }),
  company_email: Yup.string()
    .email('Invalid email')
    .required('Company Email is required'),
  company_type: Yup.string().required('Company type is required'),
  company_description: Yup.string()
    .min(5, 'Company description must be at least 5 characters')
    .required('Company description is required'),
});

const CompanyInfo = () => {
  const { company } = useAppSelector(selectAuth);

  // fetch business data
  const { business } = useAppSelector(selectBusiness);
  const { fetchData: fetchBusinessData } = useFetch('/business', setBusiness);
  useEffect(() => {
    fetchBusinessData();
  }, []);

  const companyInfoValues: CompanyInfoProps = {
    company_name: company?.businessName ? company.businessName : '',
    company_address: {
      street: company?.businessAddress.street
        ? company.businessAddress.street
        : '',
      city: company?.businessAddress.city ? company.businessAddress.city : '',
      state: company?.businessAddress.state
        ? company.businessAddress.state
        : '',
      timezone: company?.businessAddress.timezone
        ? company.businessAddress.timezone
        : '',
      country: company?.businessAddress.country
        ? company.businessAddress.country
        : '',
    },
    company_phone: company?.businessPhone ? company.businessPhone : '',
    company_email: company?.businessEmail ? company.businessEmail : '',
    company_type: 'Insurance',
    company_description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat doloremque, natus neque mollitia labore vel commodi harum nulla nobis voluptates fugit et sunt obcaecati praesentium recusandae explicabo, aut dolor qui repellendus tempora. Sed ea explicabo molestias.',
  };

  const _updateCompanyInfo = (values: CompanyInfoProps) => {
    console.log(values);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add socials
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  return (
    <section className="">
      <div className="text-center mt-3">
        <h3 className="text-3xl font-normal">Company Profile</h3>
        <p className="text-[color:var(--text-secondary)]">
          Organization data and preferences across Cruise products and services.
        </p>
      </div>
      <div className="my-10 border border-[color:var(--border-color)] rounded-md pl-7 pt-7 pb-1">
        <div className="flex justify-between items-center pr-6">
          <h2 className="font-semibold text-lg">Company Information</h2>
          <p className="text-xs font-semibold bg-[color:var(--text-secondary)] text-white dark:text-slate-900 px-3 py-1 rounded">
            {company?.businessEmail}
          </p>
        </div>

        <CompanyName />
        <CompanyPhone />
        <CompanyWebsite />
        <CompanyIndustry />
        <CompanyRegStatus />
        <CompanyDesc />
        <CompanySize />

        <div className="form_wrapper mt-2">
          <Formik
            initialValues={companyInfoValues}
            validationSchema={companyInfoSchema}
            onSubmit={_updateCompanyInfo}
          >
            {({ setFieldValue, values }) => {
              // console.log(formik)

              return (
                <Form>
                  <Field name="company_name">
                    {({ field, meta }: FieldProps) => (
                      <div className="mb-5">
                        <TextField
                          variant="outlined"
                          fullWidth
                          label="Company Name"
                          {...field}
                          error={meta.touched && meta.error ? true : false}
                          helperText={
                            meta.touched && meta.error ? meta.error : ''
                          }
                        />
                      </div>
                    )}
                  </Field>

                  <div className="flex flex-col sm:flex-row sm:gap-x-4">
                    <Field name="company_address.street">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5 w-full">
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="Street"
                            {...field}
                            error={meta.touched && meta.error ? true : false}
                            helperText={
                              meta.touched && meta.error ? meta.error : ''
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="company_address.city">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5 w-full">
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="City"
                            {...field}
                            error={meta.touched && meta.error ? true : false}
                            helperText={
                              meta.touched && meta.error ? meta.error : ''
                            }
                          />
                        </div>
                      )}
                    </Field>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:gap-x-4">
                    <Field name="company_address.state">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5 w-full">
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="State/Region"
                            {...field}
                            error={meta.touched && meta.error ? true : false}
                            helperText={
                              meta.touched && meta.error ? meta.error : ''
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="company_address.timezone">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5 w-full">
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="Timezone"
                            {...field}
                            error={meta.touched && meta.error ? true : false}
                            helperText={
                              meta.touched && meta.error ? meta.error : ''
                            }
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="company_address.country">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5 w-full">
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="Country"
                            {...field}
                            error={meta.touched && meta.error ? true : false}
                            helperText={
                              meta.touched && meta.error ? meta.error : ''
                            }
                          />
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

                  <div className="contact_contact mt-10">
                    <h2 className="font-semibold text-lg mb-3">
                      Company Contact
                    </h2>

                    <Field name="company_email">
                      {({ field, meta }: FieldProps) => (
                        <div className="mb-5">
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="Company Email"
                            {...field}
                            error={meta.touched && meta.error ? true : false}
                            helperText={
                              meta.touched && meta.error ? meta.error : ''
                            }
                          />
                        </div>
                      )}
                    </Field>

                    <div className="flex flex-col sm:flex-row sm:gap-x-4">
                      <Field name="company_phone">
                        {() => {
                          return (
                            <div className="mb-5 w-full">
                              <PhoneInput
                                // defaultCountry="ng"
                                value={values.company_phone}
                                onChange={() =>
                                  setFieldValue(
                                    'company_phone',
                                    values.company_phone
                                  )
                                }
                                style={{ height: '100%' }}
                                inputStyle={{
                                  height: '100%',
                                  width: '100%',
                                  padding: '1rem 8px',
                                  backgroundColor: 'transparent',
                                  color: '#7f8ea3',
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
                          );
                        }}
                      </Field>
                      <Field name="company_type">
                        {({ field, meta }: FieldProps) => (
                          <div className="mb-5 w-full">
                            <TextField
                              variant="outlined"
                              fullWidth
                              label="Company Type"
                              {...field}
                              error={meta.touched && meta.error ? true : false}
                              helperText={
                                meta.touched && meta.error ? meta.error : ''
                              }
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="bg-[color:var(--accent-primary)] w-full sm:w-auto p-3 text-white rounded-md hover:bg-orange-600 transition-colors duration-300 ease-in-out"
                    >
                      Update Record
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
          C C C C C C C C
        </div>
      </div>

      <div className="border border-[color:var(--border-color)] rounded-md p-3">
        <div className="mb-10">
          <h2 className="font-semibold text-lg">Working Hours</h2>
          <div>
            {business &&
              business.businessLocations.map((location) => (
                <BusinessLocation key={location.id} location={location} />
              ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-6">
            <h2 className="font-semibold text-lg">Company Socials</h2>
            {business && business.businessSocials ? (
              <button
                type="button"
                className="border border-dotted border-[color:var(--border-color)] p-1 rounded text-sm hover:text-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-all duration-300 ease-in-out"
                onClick={() => setEditVisible(true)}
              >
                <span>
                  <RiEditFill />
                </span>
              </button>
            ) : null}
          </div>

          <div className="socials mt-2">
            {business && business.businessSocials ? (
              <Socials socials={business.businessSocials} />
            ) : (
              <div className="flex items-center gap-x-3 text-[color:var(--text-secondary)] mt-2">
                <p>No socials added.</p>
                <button
                  title="Add a social account"
                  type="button"
                  className="border border-dotted border-[color:var(--border-color)] p-1 rounded text-sm hover:text-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-all duration-300 ease-in-out"
                  onClick={() => setVisible(true)}
                >
                  <span>
                    <AiOutlinePlus />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {visible && (
        <AddSocials
          visible={visible}
          setVisible={setVisible}
          businessID={business ? business.id : null}
        />
      )}
      {editVisible && (
        <EditSocials
          visible={editVisible}
          setVisible={setEditVisible}
          businessID={business ? business.id : null}
          socials={business!.businessSocials}
        />
      )}
    </section>
  );
};

export default CompanyInfo;
