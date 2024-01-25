import { FormHelperText } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import noSelectionSvg from '../../../../assets/images/no-selection.svg';
import { useAppSelector, useCreate, useFetch } from '../../../../hooks';
import { selectInventory, setAllInventories } from '../../../inventories';
import { selectSupplier, setAllSuppliers } from '../../../suppliers';

interface NewInboundFormProps {
  products: NewInboundProduct[] | [];
}

const initialValues: { supplierId: number } = {
  supplierId: 0,
};

const validationSchema = Yup.object().shape({
  supplierId: Yup.number()
    .min(1, 'Select a supplier')
    .required('Supplier is required'),
});

const NewInboundForm: React.FC<NewInboundFormProps> = ({ products }) => {
  const { allInventories } = useAppSelector(selectInventory);
  const navigate = useNavigate();
  const { allSuppliers } = useAppSelector(selectSupplier);
  const { data, loading, error, createData } = useCreate('/inbounds');

  const { fetchData: getSuppliers } = useFetch('/supplier', setAllSuppliers);

  const { fetchData: fetchInventories } = useFetch(
    '/inventory/unpaginated',
    setAllInventories
  );

  const getInventoryName = (inventoryID: number) => {
    const inventory = allInventories?.find((inv) => inv.id === inventoryID);
    return inventory ? inventory.name : null;
  };

  const onSubmit = async (values: { supplierId: number }) => {
    const formattedProducts = products.map((item) => {
      const product = {
        productID: item.product.id,
        inventoryID: item.product.inventoryId,
        quantity: item.quantity,
      };

      return product;
    });

    const data = {
      products: formattedProducts,
      supplierId: values.supplierId,
    };

    await createData(data);
  };

  useEffect(() => {
    fetchInventories();
    getSuppliers();
  }, []);

  useEffect(() => {
    if (data) {
      toast.success(data);
      navigate('/orders/inbound');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const getContent = () => {
    let content;

    if (!products || products?.length === 0) {
      content = (
        <>
          <img
            src={noSelectionSvg}
            alt="No selected supplier"
            className="w-[15rem] mx-auto"
          />
          <p className="mt-4">
            Add products from the list on the left to continue!
          </p>
        </>
      );
    } else {
      content = (
        <>
          <h3 className="text-xl mb-7">Create Inbound Order</h3>
          <table className="w-full mb-5">
            <thead>
              <tr className="text-left bg-slate-300 dark:bg-slate-700">
                <th>Product</th>
                <th>Inventory</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.product.id}>
                  <td>{item.product.name}</td>
                  <td>{getInventoryName(item.product.inventoryId)}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form>
              <div className="flex items-center justify-between">
                <Field name="supplierId">
                  {({ field, meta }: FieldProps) => (
                    <div>
                      <label
                        htmlFor="suppliers"
                        className="mb-2 text-sm font-medium text-gray-900 dark:text-white hidden"
                      >
                        Select an option
                      </label>
                      <select
                        id="suppliers"
                        className={`bg-[color:var(--secondary-bg)] border   text-sm rounded block w-full px-4 py-[1.1rem] hover:border-[#0f172a] focus:border-[#0f172a]  dark:placeholder-gray-400  dark:focus:border-[#f4f4f4] ${
                          meta.touched && meta.error
                            ? 'border-[#d32f2f] focus:outline-none focus-visible:outline-none text-[#d32f2f]'
                            : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-[#f4f4f4]'
                        }`}
                        {...field}
                      >
                        <option value="">Select Supplier</option>
                        {allSuppliers && allSuppliers.length === 0 ? (
                          <option value="">No suppliers! Create one.</option>
                        ) : null}

                        {allSuppliers &&
                          allSuppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
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
                <div>
                  <button
                    type="submit"
                    className="custom-btn loading-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      'Create Inbound Order'
                    )}
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        </>
      );
    }

    return content;
  };

  return (
    <div
      className={`hidden col-span-3 border border-[color:var(--border-color)] rounded-lg px-4 pt-9 pb-6 min-h-[390px] lg:sticky top-[6rem] self-start shadow ${
        !products || products?.length === 0
          ? 'lg:grid place-content-center'
          : 'lg:block'
      }`}
    >
      {getContent()}
    </div>
  );
};

export default NewInboundForm;
