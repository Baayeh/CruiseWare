import { TextField } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { InputSwitch } from 'primereact/inputswitch';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import * as Yup from 'yup';
import { selectBusiness, setBusiness } from '../..';
import { useAppSelector, useFetch, useUpdate } from '../../../../hooks';

const companyRegSchema = Yup.object().shape({
  regNumber: Yup.string()
    .min(10, 'Registration number must be at least 10 characters')
    .nullable(),
});

const CompanyRegStatus = () => {
  const [showField, setShowField] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // fetch business data
  const { business } = useAppSelector(selectBusiness);
  const { fetchData } = useFetch('/business', setBusiness);
  useEffect(() => {
    fetchData();
  }, []);

  const companyReg = {
    regNumber: business?.regNumber ? business.regNumber : '',
    regStatus: business?.regStatus ? business.regStatus : false,
  };

  // update company reg info
  const { data, loading, error, updateData, resetState } = useUpdate(
    '/business',
    'PATCH'
  );

  const _updateCompanyReg = async (values: {
    regNumber: string;
    regStatus: boolean;
  }) => {
    const body = Object.entries(values)
      .filter((entry) => {
        // Check if the property value is not empty
        const [_key, value] = entry;
        return value !== '' && value !== null;
      })
      .reduce((obj: { [key: string]: any }, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    const updatedBody = {
      id: business?.id,
      ...body,
    };

    await updateData({ businessData: updatedBody });
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('Registration Info updated');
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
            initialValues={companyReg}
            validationSchema={companyRegSchema}
            onSubmit={_updateCompanyReg}
          >
            {({ values }) => {
              return (
                <Form>
                  <div className="">
                    {!business?.regNumber && (
                      <div className="mb-6">
                        <Field name="regStatus">
                          {({ field, meta }: FieldProps) => (
                            <>
                              <div className="flex items-center gap-x-10">
                                <p>Is the company registered?</p>
                                <InputSwitch {...field} checked={meta.value} />
                              </div>
                            </>
                          )}
                        </Field>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-x-10">
                      <Field name="regNumber">
                        {({ field, meta }: FieldProps) => (
                          <div className="w-full">
                            <TextField
                              type="text"
                              variant="outlined"
                              fullWidth
                              disabled={!values.regStatus}
                              label="Company Registration Number"
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
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      ) : (
        <div className="border-t border-[color:var(--border-color)] flex w-full justify-between items-center pr-6 py-4">
          <div>
            <p className="text-xs text-[color:var(--text-secondary)] font-normal mb-2">
              Registration Status
            </p>
            <p
              className={`px-2 py-1 rounded-full text-sm text-center dark:text-slate-900 font-semibold ${
                business?.regStatus ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {business?.regStatus ? 'registered' : 'unregistered'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[color:var(--text-secondary)] font-normal mb-2">
              Registration Number
            </p>
            <p>{business?.regNumber ? business.regNumber : 'Not Set'}</p>
          </div>
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

export default CompanyRegStatus;
