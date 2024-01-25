import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { setPaginatedInventories } from '../..';
import { useFetch, useUpdate } from '../../../../hooks';

/**
 * Represents the form values for a specific form.
 *
 * @typedef {object} FormValues
 * @property {string} [description] - The description value.
 */
interface FormValues {
  description?: string;
}

interface EditInventoryProps extends MainDialogProps {
  item: InventoryProps | null;
  setPage: (page: number) => void;
}

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
});

/**
 * Renders a component for editing an inventory.
 *
 * @param {React.FC<EditInventoryProps>} props - The component props.
 * @param {boolean} props.visible - Determines if the component is visible.
 * @param {function} props.setVisible - Callback to set the visibility of the component.
 * @param {Item} props.item - The inventory item to edit.
 * @return {React.ReactElement} The rendered component.
 */
const EditInventory: React.FC<EditInventoryProps> = ({
  visible,
  setVisible,
  item,
  setPage,
}) => {
  const [requestSent, setRequestSent] = useState(false);

  const { data, loading, error, updateData, resetState } = useUpdate(
    `/inventory/${item?.id}`,
    'PATCH'
  );

  const { fetchData: fetchPaginatedInventories } = useFetch(
    `/inventory?page=${0}&pageSize=${10}`,
    setPaginatedInventories
  );

  const initialValues: FormValues = {
    description: item!.description,
  };

  const onSubmit = async (values: FormValues) => {
    await updateData({ ...values });
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
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
      header="Edit Inventory"
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      maskClassName="create-new-mask"
      id="new-inventory-dialog"
    >
      <div className="form-wrapper mt-4">
        <div className="mb-5 w-full">
          <TextField
            value={item?.name}
            disabled
            variant="outlined"
            fullWidth
            label="Inventory Name"
          />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => {
            return (
              <Form>
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
                      <span>Updating Inventory...</span>
                    </>
                  ) : (
                    'Update Inventory'
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
export default EditInventory;
