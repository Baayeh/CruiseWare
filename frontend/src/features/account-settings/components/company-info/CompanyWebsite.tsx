import { TextField } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import * as Yup from 'yup';
import { selectBusiness, setBusiness } from '../..';
import { useAppSelector, useFetch, useUpdate } from '../../../../hooks';

const companyWebsiteSchema = Yup.object().shape({
  company_website: Yup.string()
    .min(3, 'Company website must be at least 10 characters')
    .required('Company website is required'),
});

const CompanyWebsite = () => {
  const [showField, setShowField] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // fetch business data
  const { business } = useAppSelector(selectBusiness);
  const { fetchData } = useFetch('/business', setBusiness);
  useEffect(() => {
    fetchData();
  }, []);

  const companyWebsite = {
    company_website: business?.website ? business.website : '',
  };

  // update company name
  const { data, loading, error, updateData, resetState } = useUpdate(
    '/business',
    'PATCH'
  );

  const _updateCompanyWebsite = async (value: { company_website: string }) => {
    const body = {
      id: business?.id,
      website: value.company_website,
    };

    await updateData({ businessData: body });
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('Website updated successfully');
      resetState();
      setRequestSent(false);
      setShowField(false);
      fetchData();
    }
  }, [data, requestSent]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  return (
    <>
      {showField ? (
        <div className="form_wrapper mt-2 pr-6 py-4">
          <Formik
            initialValues={companyWebsite}
            validationSchema={companyWebsiteSchema}
            onSubmit={_updateCompanyWebsite}
          >
            <Form>
              <div className="flex items-center justify-between gap-x-10">
                <Field name="company_website">
                  {({ field, meta }: FieldProps) => (
                    <div className="w-full">
                      <TextField
                        type="text"
                        variant="outlined"
                        fullWidth
                        label="Company Website"
                        {...field}
                        error={meta.touched && meta.error ? true : false}
                        helperText={
                          meta.touched && meta.error ? meta.error : ''
                        }
                      />
                    </div>
                  )}
                </Field>
                <div className="w-[10rem]">
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
              </div>
            </Form>
          </Formik>
        </div>
      ) : (
        <div className="border-t border-[color:var(--border-color)] flex w-full justify-between items-center pr-6 py-4">
          <p className="text-sm font-normal text-[color:var(--text-secondary)]">
            Website
          </p>
          <p>{business?.website ? business.website : 'Not Set'}</p>
          <button
            type="button"
            className="rounded-full hover:bg-[color:var(--border-color)] p-2"
            onClick={() => setShowField(true)}
          >
            <span>
              <MdOutlineModeEditOutline />
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default CompanyWebsite;
