import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { setPaginatedInventories } from '../..';
import { useCreate, useFetch } from '../../../../hooks';

interface NewInventoryProps extends MainDialogProps {
  setPage: (page: number) => void;
}

const initialValues: InventoryFormValues = {
  name: '',
  description: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

/**
 * Renders a dialog component for creating a new inventory.
 *
 * @param {React.FC<MainDialogProps>} visible - Indicates whether the dialog is visible or not.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setVisible - Function to set the visibility of the dialog.
 * @return {React.ReactElement} The rendered dialog component.
 */
const NewInventory: React.FC<NewInventoryProps> = ({
  visible,
  setVisible,
  setPage,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const { fetchData: fetchPaginatedInventories } = useFetch(
    `/inventory?page=${0}&pageSize=${10}`,
    setPaginatedInventories
  );

  const { data, loading, error, createData, resetState } =
    useCreate('/inventory');

  const onSubmit = async (values: InventoryFormValues) => {
    const inventory = {
      name: values.name,
      description: values.description,
    };

    await createData(inventory);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('Inventory created!');
      setVisible(false);
      setPage(0);
      resetState();
      setRequestSent(false);
      fetchPaginatedInventories();
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
      header="New Inventory"
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      maskClassName="create-new-mask"
      id="new-inventory-dialog"
    >
      <div className="form-wrapper mt-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => {
            return (
              <Form>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-x-6">
                  <Field name="name">
                    {({ field, meta }: FieldProps) => (
                      <div className="mb-5 w-full">
                        <TextField
                          {...field}
                          variant="outlined"
                          fullWidth
                          label="Inventory Name"
                          error={meta.touched && meta.error ? true : false}
                          helperText={<ErrorMessage name="name" />}
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <Field name="description">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-5 w-full">
                      <textarea
                        id="description"
                        rows={5}
                        {...field}
                        placeholder="What is this inventory about.."
                        className={`w-full px-4 py-2 bg-transparent border rounded transition-colors duration-300 ease-in-out ${
                          meta.touched && meta.error
                            ? 'border-[#d32f2f] placeholder:text-[#d32f2f] dark:border-[#d32f2f] focus:outline-none focus-visible:outline-none'
                            : 'border-[#bababa] dark:border-gray-700 placeholder:text-[color:var(--text-secondary)] hover:border-gray-700 dark:hover:border-gray-200'
                        }`}
                      />
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-[#d32f2f] text-[0.75rem] ml-[14px] font-normal tracking-wide leading-relaxed"
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
                      <span>Creating Inventory...</span>
                    </>
                  ) : (
                    'Create Inventory'
                  )}
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Dialog>
  );
};
export default NewInventory;
