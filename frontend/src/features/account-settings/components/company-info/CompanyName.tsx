import { TextField } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import * as Yup from 'yup';
import { useAppDispatch, useUpdate } from '../../../../hooks';
import { updateCompanyInfo } from '../../../authentication';

const companyNameSchema = Yup.object().shape({
  company_name: Yup.string()
    .min(3, 'Company name must be at least 3 characters')
    .required('Company name is required'),
});

const CompanyName = () => {
  const [showField, setShowField] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [newName, setNewName] = useState('');
  const dispatch = useAppDispatch();
  const business = JSON.parse(localStorage.getItem('company') || '{}');

  const companyName = {
    company_name: business?.businessName ? business.businessName : '',
  };

  // update company name
  const { data, loading, error, updateData, resetState } = useUpdate(
    '/business',
    'PATCH'
  );

  const _updateCompanyName = async (value: { company_name: string }) => {
    const body = {
      id: business?.businessID,
      name: value.company_name,
    };

    await updateData({ businessData: body });
    setNewName(value.company_name);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent && newName) {
      toast.success('Name updated successfully');
      resetState();
      setRequestSent(false);
      setShowField(false);
      const updatedInfo = {
        ...business,
        businessName: newName ? newName : '',
      };

      localStorage.setItem('company', JSON.stringify(updatedInfo));
      dispatch(updateCompanyInfo(updatedInfo));
    }
  }, [newName, data, requestSent]);

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
            initialValues={companyName}
            validationSchema={companyNameSchema}
            onSubmit={_updateCompanyName}
          >
            <Form>
              <div className="flex items-center justify-between gap-x-10">
                <Field name="company_name">
                  {({ field, meta }: FieldProps) => (
                    <div className="w-full">
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
        <div className="mt-5 border-t border-[color:var(--border-color)] flex w-full justify-between items-center pr-6 py-4">
          <p className="text-sm font-normal text-[color:var(--text-secondary)]">
            Name
          </p>
          <p>{business?.businessName}</p>
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

export default CompanyName;
