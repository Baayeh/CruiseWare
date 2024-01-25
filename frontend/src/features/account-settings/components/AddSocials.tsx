import { TextField } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { setBusiness } from '..';
import { useCreate, useFetch } from '../../../hooks';

interface AddSocialsProps extends MainDialogProps {
  businessID: number | null;
}

type InitialValues = {
  Twitter: string;
  Facebook: string;
  LinkedIn: string;
  Instagram: string;
  Tiktok: string;
};

const initialValues = {
  Twitter: '',
  Facebook: '',
  LinkedIn: '',
  Instagram: '',
  Tiktok: '',
} as InitialValues;

const AddSocials: React.FC<AddSocialsProps> = ({
  visible,
  setVisible,
  businessID,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const { fetchData: fetchBusinessData } = useFetch('/business', setBusiness);

  // Add social
  const { data, loading, error, createData, resetState } =
    useCreate('/business/socials');

  const onSubmit = async (values: InitialValues) => {
    // console.log('Form values: ', values);

    const body = Object.entries(values)
      .filter((entry) => {
        // Check if the property value is not empty.
        const [_key, value] = entry;
        return value !== '';
      })
      .reduce((obj: { [key: string]: any }, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    const newData = {
      businessID,
      ...body,
    };
    // console.log('New Data: ', newData);
    await createData(newData);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('Account added!');
      setVisible(false);
      resetState();
      setRequestSent(false);
      fetchBusinessData();
    }
  }, [data, requestSent, resetState]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  return (
    <Dialog
      header="Add Social Accounts"
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      maskClassName="create-new-mask"
      id="new-supplier-dialog"
    >
      <div className="mt-4">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form>
            <Field name="Twitter">
              {({ field }: FieldProps) => (
                <div className="mb-5 w-full">
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Twitter"
                  />
                </div>
              )}
            </Field>
            <Field name="Facebook">
              {({ field }: FieldProps) => (
                <div className="mb-5 w-full">
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Facebook"
                  />
                </div>
              )}
            </Field>
            <Field name="LinkedIn">
              {({ field }: FieldProps) => (
                <div className="mb-5 w-full">
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="LinkedIn"
                  />
                </div>
              )}
            </Field>
            <Field name="Instagram">
              {({ field }: FieldProps) => (
                <div className="mb-5 w-full">
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Instagram"
                  />
                </div>
              )}
            </Field>
            <Field name="Tiktok">
              {({ field }: FieldProps) => (
                <div className="mb-5 w-full">
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Tiktok"
                  />
                </div>
              )}
            </Field>
            <button
              type="submit"
              className="custom-btn loading-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Adding Account...</span>
                </>
              ) : (
                'Add Account'
              )}
            </button>
          </Form>
        </Formik>
      </div>
    </Dialog>
  );
};

export default AddSocials;
