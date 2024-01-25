import { FormHelperText, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { setPaginatedProducts } from '../..';
import { useAppSelector, useCreate, useFetch } from '../../../../hooks';
import { selectInventory, setAllInventories } from '../../../inventories';
import ImageUpload from '../ImageUpload';

interface NewProductProps extends MainDialogProps {
  setPage: (page: number) => void;
}

const initialValues: ProductFormValues = {
  name: '',
  description: '',
  fullDescription: '',
  price: '',
  photo: null,
  quantity: 1,
  inventoryId: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  fullDescription: Yup.string().required('Full description is required'),
  price: Yup.string().required('Price is required'),
  quantity: Yup.number()
    .min(1, 'Quantity must be greater than 0')
    .required('Quantity is required'),
  inventoryId: Yup.number().required('Inventory is required'),
});

/**
 * Renders a new product dialog component.
 *
 * @param {MainDialogProps} visible - A boolean indicating if the dialog is visible or not.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setVisible - A function to set the visibility of the dialog.
 * @return {React.ReactElement} The JSX element representing the new product dialog component.
 */
const NewProduct: React.FC<NewProductProps> = ({
  visible,
  setVisible,
  setPage,
}) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const { allInventories } = useAppSelector(selectInventory);

  const { fetchData: fetchInventories } = useFetch(
    '/inventory/unpaginated',
    setAllInventories
  );

  const [requestSent, setRequestSent] = useState(false);
  const { data, loading, error, createData, resetState } =
    useCreate('/product');

  const { fetchData: fetchPaginatedProducts } = useFetch(
    `/product?page=${0}&pageSize=${10}`,
    setPaginatedProducts
  );

  const onSubmit = async (values: ProductFormValues) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('fullDescription', values.fullDescription);
    formData.append('price', values.price);
    formData.append('quantity', values.quantity.toString());
    formData.append('inventoryId', values.inventoryId.toString());
    formData.append('photo', files![0]);

    await createData(formData);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success('Product created!');
      setVisible(false);
      setPage(0);
      resetState();
      setRequestSent(false);
      fetchPaginatedProducts();
    }
  }, [data, requestSent, resetState]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  useEffect(() => {
    fetchInventories();
  }, []);

  return (
    <Dialog
      header="New Product"
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
                <div className="grid sm:grid-cols-2 sm:gap-x-6">
                  <Field name="name">
                    {({ field, meta }: FieldProps) => (
                      <div className="mb-5 w-full">
                        <TextField
                          {...field}
                          variant="outlined"
                          fullWidth
                          label="Product Name"
                          error={meta.touched && meta.error ? true : false}
                          helperText={<ErrorMessage name="name" />}
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="inventoryId">
                    {({ field, meta }: FieldProps) => (
                      <div>
                        <label
                          htmlFor="countries"
                          className="mb-2 text-sm font-medium text-gray-900 dark:text-white hidden"
                        >
                          Select an option
                        </label>
                        <select
                          id="countries"
                          className={`bg-[color:var(--secondary-bg)] border   text-sm rounded block w-full px-4 py-[1.1rem] hover:border-[#0f172a] focus:border-[#0f172a]  dark:placeholder-gray-400  dark:focus:border-[#f4f4f4] ${
                            meta.touched && meta.error
                              ? 'border-[#d32f2f] focus:outline-none focus-visible:outline-none text-[#d32f2f]'
                              : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-[#f4f4f4]'
                          }`}
                          {...field}
                        >
                          <option value="">Select an inventory</option>
                          {allInventories && allInventories.length === 0 ? (
                            <option value="">
                              No inventories! Create one.
                            </option>
                          ) : null}

                          {allInventories &&
                            allInventories.map((inventory) => (
                              <option key={inventory.id} value={inventory.id}>
                                {inventory.name}
                              </option>
                            ))}
                        </select>
                        {meta.touched && meta.error && (
                          <FormHelperText error sx={{ marginLeft: '1rem' }}>
                            {meta.error}
                          </FormHelperText>
                        )}
                      </div>
                    )}
                  </Field>
                </div>
                <Field name="description">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-5 w-full">
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        label="Product Summary"
                        error={meta.touched && meta.error ? true : false}
                        helperText={<ErrorMessage name="description" />}
                      />
                    </div>
                  )}
                </Field>
                <Field name="fullDescription">
                  {({ field, meta }: FieldProps) => (
                    <div className="mb-2 w-full">
                      <textarea
                        id="description"
                        rows={3}
                        {...field}
                        placeholder="What is the product about.."
                        className={`w-full px-4 py-2 bg-transparent border rounded transition-colors duration-300 ease-in-out ${
                          meta.touched && meta.error
                            ? 'border-[#d32f2f] placeholder:text-[#d32f2f] dark:border-[#d32f2f] focus:outline-none focus-visible:outline-none'
                            : 'border-[#bababa] dark:border-gray-700 placeholder:text-[color:var(--text-secondary)] hover:border-gray-700 dark:hover:border-gray-200'
                        }`}
                      />
                      <ErrorMessage
                        name="fullDescription"
                        component="p"
                        className="text-[#d32f2f] text-[0.75rem] ml-[14px] font-normal tracking-wide leading-relaxed"
                      />
                    </div>
                  )}
                </Field>
                <ImageUpload setFiles={setFiles} />
                <div className="flex flex-col sm:flex-row sm:justify-between gap-x-6">
                  <Field name="price">
                    {({ field, meta }: FieldProps) => (
                      <div className="mb-5 w-full">
                        <TextField
                          type="number"
                          {...field}
                          variant="outlined"
                          fullWidth
                          label="Unit Price"
                          error={meta.touched && meta.error ? true : false}
                          helperText={<ErrorMessage name="price" />}
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="quantity">
                    {({ field, meta }: FieldProps) => (
                      <div className="mb-5 w-full">
                        <TextField
                          type="number"
                          {...field}
                          variant="outlined"
                          fullWidth
                          label="Quantity"
                          error={meta.touched && meta.error ? true : false}
                          helperText={<ErrorMessage name="quantity" />}
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <button
                  type="submit"
                  className="custom-btn loading-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner" />
                      <span>Creating Product...</span>
                    </>
                  ) : (
                    'Create Product'
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
export default NewProduct;
