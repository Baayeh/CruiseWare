import { FormHelperText } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { setPaginatedOutbounds } from '../../..';
import { useFetch, useUpdate } from '../../../../../hooks';

interface UpdateOutboundOrderProps extends MainDialogProps {
  setPage: (page: number) => void;
  position: 'top' | 'bottom' | 'left' | 'right';
  outboundItem: OutboundOrderProps | null;
  setOutboundItem: (item: OutboundOrderProps | null) => void;
}

const orderStatuses = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipping', value: 'shipping' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Canceled', value: 'canceled' },
];

const UpdateOrderStatus: React.FC<UpdateOutboundOrderProps> = ({
  setPage,
  position,
  outboundItem,
  setVisible,
  visible,
  setOutboundItem,
}) => {
  const { data, loading, error, updateData } = useUpdate(
    `/outbounds/${outboundItem?.id}`,
    'PUT'
  );

  // fetch paginated list of outbound orders
  const { fetchData } = useFetch(
    `/outbounds?page=${0}&pageSize=${10}`,
    setPaginatedOutbounds
  );

  const updateStatus = async (body: { orderStatus: string }) => {
    await updateData(body);
  };

  useEffect(() => {
    if (data) {
      toast.success(data);
      setVisible(false);
      setPage(0);
      fetchData();
      setOutboundItem(null);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const initialValues: { orderStatus: string } = {
    orderStatus: outboundItem?.orderStatus || '',
  };

  const validationSchema = Yup.object().shape({
    orderStatus: Yup.string()
      .oneOf(
        ['pending', 'processing', 'shipping', 'delivered', 'canceled'],
        'Invalid status'
      )
      .required('Status is required'),
  });

  return (
    <Dialog
      header="Update Outbound Status"
      visible={visible}
      onHide={() => setVisible(false)}
      position={position}
      draggable={false}
      resizable={false}
      maskClassName="delete-mask"
      id="delete-dialog"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={updateStatus}
      >
        <Form>
          <div className="">
            <Field name="orderStatus">
              {({ field, meta }: FieldProps) => (
                <div className="px-5">
                  <label
                    htmlFor="orderStatus"
                    className="mb-2 text-sm font-medium text-gray-900 dark:text-white hidden"
                  >
                    Select an option
                  </label>
                  <select
                    id="orderStatus"
                    className={`bg-[color:var(--secondary-bg)] border   text-sm rounded block w-full px-4 py-[1.1rem] hover:border-[#0f172a] focus:border-[#0f172a]  dark:placeholder-gray-400  dark:focus:border-[#f4f4f4] ${
                      meta.touched && meta.error
                        ? 'border-[#d32f2f] focus:outline-none focus-visible:outline-none text-[#d32f2f]'
                        : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-[#f4f4f4]'
                    }`}
                    {...field}
                  >
                    <option value="">Select Order Status</option>

                    {orderStatuses &&
                      orderStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
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
            <div className="mt-5 px-5 pt-4 border-t border-[color:var(--border-color)]">
              <button
                type="submit"
                className="w-full rounded px-4 py-2 border dark:border-gray-600 bg-[color:var(--border-color)] hover:border-[--text-primary] hover:dark:hover:border-[--text-primary] transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:hover:border-[color:var(--border-color)] disabled:text-[color:var(--text-secondary)]"
                disabled={loading}
              >
                {loading ? 'Updating status...' : 'Update Status'}
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default UpdateOrderStatus;
