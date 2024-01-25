import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import * as Yup from 'yup';
import { selectBusiness, setBusiness } from '../..';
import { useAppSelector, useFetch, useUpdate } from '../../../../hooks';

const companyDescSchema = Yup.object().shape({
  company_description: Yup.string()
    .min(5, 'Company description must be at least 5 characters')
    .required('Company description is required'),
});

const CompanyDesc = () => {
  const [showField, setShowField] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // fetch business data
  const { business } = useAppSelector(selectBusiness);
  const { fetchData } = useFetch('/business', setBusiness);
  useEffect(() => {
    fetchData();
  }, []);

  const companyDesc = {
    company_description: business?.description ? business.description : '',
  };

  // update company name
  const { data, loading, error, updateData, resetState } = useUpdate(
    '/business',
    'PATCH'
  );

  const _updateCompanyDesc = async (value: { company_description: string }) => {
    const body = {
      id: business?.id,
      description: value.company_description,
    };

    await updateData({ businessData: body });
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('Description updated successfully');
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
            initialValues={companyDesc}
            validationSchema={companyDescSchema}
            onSubmit={_updateCompanyDesc}
          >
            <Form>
              <div className="flex items-center justify-between gap-x-10">
                <Field name="company_description">
                  {({ field, meta }: FieldProps) => (
                    <div className="w-full">
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
            Description
          </p>
          <p>
            {business && business?.description.length > 50
              ? business?.description.slice(0, 50) + '...'
              : business?.description}
          </p>
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

export default CompanyDesc;
