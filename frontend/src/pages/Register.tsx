/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik, FormikErrors } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import {
  AccountInfo,
  CompanyContact,
  CompanyInfo,
  StepButtons,
  Welcome,
  setCredentials,
} from '../features/authentication';
import { useAuth } from '../hooks';
import { useAppDispatch } from '../hooks/useStore';

enum STEPS {
  WELCOME = 0,
  ACCOUNT_INFO = 1,
  COMPANY_INFO = 2,
  COMPANY_CONTACT = 3,
  CONFIRMATION = 4,
}

enum SIZE {
  SOLE_PROPRIETORSHIP = 'sole_Proprietorship',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise',
}

const initialValues: RegisterFormValues = {
  f_name: '',
  l_name: '',
  email: '',
  password: '',
  company_name: '',
  company_street: '',
  company_city: '',
  company_state: '',
  company_country: '',
  company_timezone: '',
  company_phone: '',
  company_email: '',
  company_industry: '',
  company_description: '',
  company_regStatus: false,
  company_size: '',
  terms_agreed: false,
};

const validationSchema = [
  Yup.object().shape({
    terms_agreed: Yup.boolean().oneOf(
      [true],
      'You must agree to the terms and conditions'
    ),
  }),
  Yup.object().shape({
    f_name: Yup.string().required('First name is required'),
    l_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Please enter your password'),
  }),
  Yup.object().shape({
    company_name: Yup.string()
      .min(3, 'Company name must be at least 3 characters')
      .required('Company name is required'),
    company_street: Yup.string().required('Street is required'),
    company_city: Yup.string().required('City is required'),
    company_state: Yup.string().required('State is required'),
    company_country: Yup.string().required('Country is required'),
  }),
  Yup.object().shape({
    company_email: Yup.string()
      .email('Invalid email')
      .required('Company Email is required'),
    company_industry: Yup.string().required('Company type is required'),
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
    company_description: Yup.string()
      .min(5, 'Company description must be at least 5 characters')
      .required('Company description is required'),
  }),
];

const renderForm = (
  step: STEPS,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<RegisterFormValues>>
) => {
  switch (step) {
    case STEPS.WELCOME:
      return <Welcome />;
    case STEPS.ACCOUNT_INFO:
      return <AccountInfo />;
    case STEPS.COMPANY_INFO:
      return <CompanyInfo setFieldValue={setFieldValue} />;
    case STEPS.COMPANY_CONTACT:
      return <CompanyContact setFieldValue={setFieldValue} />;
    default:
      return <Welcome />;
  }
};

const Register = () => {
  const [step, setStep] = useState(STEPS.WELCOME);
  const currentValidationSchema = validationSchema[step];
  const isLastStep = step === STEPS.COMPANY_CONTACT;
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();

  const { data, loading, createUser, access, refresh, error, resetState } =
    useAuth();

  const dispatch = useAppDispatch();

  const goToPreviousStep = () => {
    setStep((value) => value - 1);
  };

  const _submitForm = async (values: RegisterFormValues, actions: any) => {
    actions.setSubmitting(false);

    const user = {
      firstName: values.f_name,
      lastName: values.l_name,
      email: values.email,
      password: values.password,
    };

    const businessContact = {
      name: values.company_name,
      email: values.company_email,
      phone: values.company_phone,
      address: {
        street: values.company_street,
        city: values.company_city,
        state: values.company_state,
        country: values.company_country,
        timezone:
          values.company_timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const businessData = {
      industry: values.company_industry,
      regStatus: values.company_regStatus,
      size: values.company_size,
      description: values.company_description,
    };

    await createUser({ user, businessContact, businessData });
    setRequesting(true);
  };

  const onSubmit = (values: RegisterFormValues, actions: any) => {
    if (isLastStep) {
      _submitForm(values, actions);
    } else {
      setStep((value) => value + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (data && requesting) {
      toast.success('Account created successfully');

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
      navigate('/overview');
    }
  }, [data, requesting, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="register">
      <p className="text-gray-500 lg:w-[70%] lg:mx-auto lg:mb-3">
        <span className="font-semibold text-[#e8e8e8]">Step {step + 1}</span> /{' '}
        {Object.keys(STEPS).filter((key) => isNaN(Number(key))).length}
      </p>

      <div className="form-wrapper">
        <Formik
          initialValues={initialValues}
          validationSchema={currentValidationSchema}
          onSubmit={onSubmit}
        >
          {({ isValid, isSubmitting, setFieldValue }) => {
            return (
              <Form>
                {renderForm(step, setFieldValue)}
                <StepButtons
                  step={step}
                  isSubmitting={isSubmitting}
                  isLoading={loading}
                  isValid={isValid}
                  isLastStep={isLastStep}
                  goToPreviousStep={goToPreviousStep}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </section>
  );
};
export default Register;
