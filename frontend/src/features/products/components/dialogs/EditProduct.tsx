import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { setPaginatedProducts } from '../..';
import { useAppSelector, useFetch, useUpdate } from '../../../../hooks';
import { selectInventory, setAllInventories } from '../../../inventories';
import ImageUpload from '../ImageUpload';

interface FormValues {
  description?: string;
  fullDescription?: string;
  price?: string;
  photo?: File | null;
  quantity?: number;
}

interface EditProductProps extends MainDialogProps {
  item: ProductProps | null;
  setPage: (page: number) => void;
}

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  fullDescription: Yup.string().required('Full description is required'),
  price: Yup.string().required('Price is required'),
  quantity: Yup.number()
    .min(1, 'Quantity must be greater than 0')
    .required('Quantity is required'),
});

/**
 * Renders a form for editing a product.
 *
 * @param {EditProductProps} visible - Whether the form is visible or not.
 * @param {function} setVisible - Function to control the visibility of the form.
 * @param {Product} item - The product to be edited.
 * @return {ReactElement} The rendered form component.
 */
const EditProduct: React.FC<EditProductProps> = ({
  visible,
  setVisible,
  item,
  setPage,
}) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const { allInventories } = useAppSelector(selectInventory);

  const { fetchData: fetchInventories } = useFetch(
    '/inventory',
    setAllInventories
  );

  const [requestSent, setRequestSent] = useState(false);
  const { data, loading, error, updateData, resetState } = useUpdate(
    `/product/${item?.id}`,
    'PATCH'
  );

  const { fetchData } = useFetch(
    `/product?page=${0}&pageSize=${10}`,
    setPaginatedProducts
  );

  // find inventory associated with product
  const inventory = allInventories
    ? allInventories.find((i) => i.id === item?.inventoryId)
    : null;

  const initialValues: FormValues = {
    description: item?.description,
    fullDescription: item?.fullDescription,
    price: item?.price,
    photo: null,
    quantity: item?.quantity,
  };

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();

    formData.append('description', values.description!);
    formData.append('fullDescription', values.fullDescription!);
    formData.append('price', values.price!);
    formData.append('quantity', values.quantity!.toString());
    files && formData.append('photo', files![0]);

    await updateData(formData);
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
      setVisible(false);
      setPage(0);
      resetState();
      setRequestSent(false);
      fetchData();
    }
  }, [data, requestSent, resetState]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  // fetch full inventory list
  useEffect(() => {
    fetchInventories();
  }, []);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  return (
    <Dialog
      header="Edit Product"
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      blockScroll={false}
      maskClassName="create-new-mask"
      id="new-inventory-dialog"
    >
      <div className="form-wrapper mt-4">
        <div className="grid sm:grid-cols-2 sm:gap-x-6 mb-5">
          <div className="productName">
            <TextField
              value={item?.name}
              variant="outlined"
              fullWidth
              label="Product Name"
              disabled
            />
          </div>
          <div className="inventory">
            <TextField
              value={inventory?.name}
              variant="outlined"
              fullWidth
              label="Inventory Name"
              disabled
            />
          </div>
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
                      <span>Updating Product...</span>
                    </>
                  ) : (
                    'Update Product'
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
export default EditProduct;
