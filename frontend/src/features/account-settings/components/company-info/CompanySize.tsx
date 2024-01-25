import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import Select, { SingleValue } from 'react-select';
import * as Yup from 'yup';
import { selectBusiness, setBusiness } from '../..';
import { useAppSelector, useFetch, useUpdate } from '../../../../hooks';

enum SIZE {
  SOLE_PROPRIETORSHIP = 'sole_Proprietorship',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise',
}

interface CompanySizeProps {
  value: string;
  label: string;
}

const companySizeSchema = Yup.object().shape({
  company_size: Yup.string()
    .oneOf(
      [
        SIZE.SOLE_PROPRIETORSHIP,
        SIZE.SMALL,
        SIZE.MEDIUM,
        SIZE.LARGE,
        SIZE.ENTERPRISE,
      ],
      'Invalid company size'
    )
    .required('Company size is required'),
});

const CompanySize = () => {
  const [showField, setShowField] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [size, setSize] = useState<CompanySizeProps | null>(null);

  const companySizeOptions = [
    { value: 'sole_Proprietorship', label: '1' },
    { value: 'small', label: '2 - 10' },
    { value: 'medium', label: '11 - 50' },
    { value: 'large', label: '51 - 100' },
    { value: 'enterprise', label: '101+' },
  ];

  // const handleCompanySizeOptions = (
  //   companySize: SingleValue<CompanySizeProps>
  // ) => {
  //   setSize(companySize);
  //   if (companySize) {
  //     setFieldValue('company_size', companySize.value);
  //   }
  // };

  // fetch business data
  const { business } = useAppSelector(selectBusiness);
  const { fetchData } = useFetch('/business', setBusiness);
  useEffect(() => {
    fetchData();
  }, []);

  const companySize = {
    company_size: business?.size ? business.size : '',
  };

  // update company name
  const { data, loading, error, updateData, resetState } = useUpdate(
    '/business',
    'PATCH'
  );

  const _updateCompanySize = async (value: { company_size: string }) => {
    const body = {
      id: business?.id,
      size: value.company_size,
    };

    await updateData({ businessData: body });
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('Size updated successfully');
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

  console.log(size);

  return (
    <>
      {showField ? (
        <div className="form_wrapper mt-2 pr-6 py-4">
          <Formik
            initialValues={companySize}
            validationSchema={companySizeSchema}
            onSubmit={_updateCompanySize}
          >
            <Form>
              <div className="flex items-center justify-between gap-x-10">
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
                              value={size}
                              onChange={() => setSize(size)}
                              classNames={{
                                control: () =>
                                  `!bg-transparent !shadow-none !outline-none !border-[#e8e8e8] !hover:border-[#e8e8e8] !h-full !py-3 !px-[14px]  ${
                                    meta.touched && meta.error
                                      ? '!border-red-500'
                                      : ''
                                  }`,
                                container: () => '!w-full',
                                input: () =>
                                  `!text-[#e8e8e8] !h-[1.4375em] !block !w-full !bg-transparent ${
                                    meta.touched && meta.error
                                      ? '!text-red-500'
                                      : ''
                                  }`,
                                singleValue: () => '!text-[#e8e8e8]',
                                placeholder: () =>
                                  `!text-[#e8e8e8] ${
                                    meta.touched && meta.error
                                      ? '!text-red-500'
                                      : ''
                                  }`,
                                menu: () => '!bg-[#141926] !z-30',
                                dropdownIndicator: () =>
                                  `!text-[#e8e8e8] ${
                                    meta.touched && meta.error
                                      ? '!text-red-500'
                                      : ''
                                  }`,
                                indicatorSeparator: () =>
                                  `!bg-[#e8e8e8] ${
                                    meta.touched && meta.error
                                      ? '!bg-red-500'
                                      : ''
                                  }`,
                              }}
                              styles={{
                                option: (base, { isSelected }) => {
                                  return {
                                    ...base,
                                    color: isSelected
                                      ? 'rgba(20, 25, 38)'
                                      : '#e8e8e8',
                                    backgroundColor: isSelected
                                      ? '#e8e8e8'
                                      : '',
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
            Size
          </p>
          <p className="capitalize">{business?.size}</p>
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

export default CompanySize;
