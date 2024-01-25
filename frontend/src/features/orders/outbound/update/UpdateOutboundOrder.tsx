import { TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import Select, { SingleValue } from 'react-select';
import { setPaginatedOutbounds } from '../..';
import noSelectionSvg from '../../../../assets/images/no-selection.svg';
import { useAppSelector, useFetch, useUpdate } from '../../../../hooks';
import { selectProduct, setAllProducts } from '../../../products';
import { selectReceiver, setAllReceivers } from '../../../receivers';
import UpdateOrderStatus from './dialogs/UpdateOrderStatus';

interface UpdateOutboundOrderProps extends MainDialogProps {
  outboundItem: OutboundOrderProps | null;
  setOutboundItem: (item: OutboundOrderProps | null) => void;
  setPage: (page: number) => void;
}

interface ProductSelectProps {
  label: string;
  value: number;
}

const UpdateOutboundOrder: React.FC<UpdateOutboundOrderProps> = ({
  outboundItem,
  setOutboundItem,
  setPage,
  visible,
  setVisible,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [orderStatusVisible, setOrderStatusVisible] = useState(false);
  const [product, setProduct] = useState<ProductSelectProps | null>(null);
  const [receiver, setReceiver] = useState<ProductSelectProps | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [requestSent, setRequestSent] = useState(false);

  const { data, loading, error, updateData, resetState } = useUpdate(
    `/outbounds/${outboundItem?.id}`,
    'PUT'
  );

  // fetch paginated list of outbound orders
  const { fetchData } = useFetch(
    `/outbounds?page=${0}&pageSize=${10}`,
    setPaginatedOutbounds
  );

  const handleUpdate = async () => {
    const body = {
      receiverId: receiver?.value,
      quantity: quantity,
      productId: product?.value,
    };

    await updateData(body);
    setRequestSent(true);
  };

  useEffect(() => {
    if (requestSent) {
      setRequestSent(false);
      toast.success(data);
      setPage(0);
      setOutboundItem(null);
      setVisible(false);
      fetchData();
      resetState();
    }
  }, [data, resetState, requestSent]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // fetch all products
  const { allProducts } = useAppSelector(selectProduct);
  const { fetchData: fetchAllProducts } = useFetch('/product', setAllProducts);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const productOptions = allProducts?.map((p) => {
    return {
      label: p.name,
      value: p.id,
    };
  });

  // fetch all receivers
  const { allReceivers } = useAppSelector(selectReceiver);
  const { fetchData: fetchAllReceivers } = useFetch(
    '/receiver',
    setAllReceivers
  );

  useEffect(() => {
    fetchAllReceivers();
  }, []);

  const receiverOptions = allReceivers?.map((r) => {
    return {
      label: r.name,
      value: r.id,
    };
  });

  useEffect(() => {
    const product = allProducts?.find((p) => p.id === outboundItem?.productId);
    const receiver = allReceivers?.find(
      (r) => r.id === outboundItem?.receiverId
    );

    if (product) {
      setProduct({ label: product.name, value: product.id });
    } else {
      setProduct(null);
    }

    if (receiver) {
      setReceiver({ label: receiver.name, value: receiver.id });
    } else {
      setReceiver(null);
    }

    if (outboundItem) {
      setQuantity(outboundItem.quantity);
    }
  }, [outboundItem, allProducts, allReceivers]);

  const handleProductOptionsChange = (
    product: SingleValue<ProductSelectProps>
  ) => {
    setProduct(product);
  };

  const handleReceiverOptionsChange = (
    receiver: SingleValue<ProductSelectProps>
  ) => {
    setReceiver(receiver);
  };

  const handleClose = () => {
    setOutboundItem(null);
  };

  const getContent = () => {
    let content;

    if (!outboundItem || visible === false) {
      content = (
        <>
          <img
            src={noSelectionSvg}
            alt="No selected outbound"
            className="w-[15rem] mx-auto"
          />
          <p className="mt-4 text-sm">
            Click on the edit button to update an outbound order
          </p>
        </>
      );
    } else {
      content = (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium">Update Outbound Order</h1>
            <button type="button" title="Close" onClick={handleClose}>
              <span>
                <AiFillCloseCircle size={23} />
              </span>
            </button>
          </div>

          <div className="flex justify-between items-center mt-10">
            <div>
              <p className="text-[color:var(--text-secondary)] text-sm uppercase">
                Order ID
              </p>
              <p className="font-medium mt-1">{outboundItem?.orderId}</p>
            </div>
            <div>
              <p className="text-[color:var(--text-secondary)] text-sm uppercase">
                Order Status
              </p>
              <div className="flex items-center gap-x-2 mt-2 group">
                <span
                  className={`font-medium text-xs  px-2 py-1 rounded-full dark:text-[#0f172a] ${
                    outboundItem?.orderStatus === 'pending'
                      ? 'bg-yellow-200'
                      : outboundItem?.orderStatus === 'processing'
                      ? 'bg-yellow-500'
                      : outboundItem?.orderStatus === 'canceled'
                      ? 'bg-red-500 text-white'
                      : outboundItem?.orderStatus === 'shipping'
                      ? 'bg-blue-400'
                      : 'bg-green-400 text-white'
                  }`}
                >
                  {outboundItem?.orderStatus}
                </span>
                <button
                  type="button"
                  className="hidden group-hover:flex hover:text-[color:var(--accent-primary)] transition-all duration-300 ease-in-out"
                  onClick={() => {
                    setOrderStatusVisible(true);
                  }}
                >
                  <span>
                    <FiEdit size={14} />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-[color:var(--border-color)]">
            <div className="flex justify-between items-center gap-x-5">
              <div className="product w-full">
                <Select
                  options={productOptions}
                  placeholder="Change Product"
                  value={product}
                  onChange={handleProductOptionsChange}
                  isSearchable
                  name="product"
                  classNames={{
                    control: () =>
                      '!bg-transparent !shadow-none !outline-none !border-[color:var(--border-color] !hover:border-[color:var(--text-primary] !h-full !py-[0.6rem] !px-[14px] dark:hover:bg-slate-400',
                    container: () => '!w-full',
                    option: () =>
                      '!text-[color:var(--text-primary)] dark:hover:bg-slate-400 dark:hover:text-slate-900',
                    input: () =>
                      '!text-[color:var(--text-primary)] !h-[1.4375em] !block !w-full !bg-transparent',
                    singleValue: () => '!text-[color:var(--text-primary)]',
                    placeholder: () => '!text-[color:var(--text-primary)]',
                    menu: () => '!bg-[color:var(--card-bg)] dark:!bg-slate-900',
                    dropdownIndicator: () =>
                      `!text-[color:var(--text-primary)]`,
                    indicatorSeparator: () => `!bg-[color:var(--text-primary)]`,
                  }}
                />
              </div>
              <div className="quantity w-[8rem]">
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  label="Quantity"
                />
              </div>
            </div>
            <div className="mt-5">
              <Select
                options={receiverOptions}
                placeholder="Change Receiver"
                value={receiver}
                onChange={handleReceiverOptionsChange}
                isSearchable
                name="receiver"
                classNames={{
                  control: () =>
                    '!bg-transparent !shadow-none !outline-none !border-[color:var(--border-color] !hover:border-[color:var(--text-primary] !h-full !py-[0.6rem] !px-[14px] dark:hover:bg-slate-400',
                  container: () => '!w-full',
                  option: () =>
                    '!text-[color:var(--text-primary)] dark:hover:bg-slate-400 dark:hover:text-slate-900',
                  input: () =>
                    '!text-[color:var(--text-primary)] !h-[1.4375em] !block !w-full !bg-transparent',
                  singleValue: () => '!text-[color:var(--text-primary)]',
                  placeholder: () => '!text-[color:var(--text-primary)]',
                  menu: () => '!bg-[color:var(--card-bg)] dark:!bg-slate-900',
                  dropdownIndicator: () => `!text-[color:var(--text-primary)]`,
                  indicatorSeparator: () => `!bg-[color:var(--text-primary)]`,
                }}
              />

              <div className="mt-5 pt-4 ">
                <button
                  type="submit"
                  className="w-full rounded px-4 py-2 border dark:border-gray-600 bg-[color:var(--border-color)] hover:border-[--text-primary] hover:dark:hover:border-[--text-primary] transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:hover:border-[color:var(--border-color)] disabled:text-[color:var(--text-secondary)]"
                  disabled={loading}
                  onClick={handleUpdate}
                >
                  {loading ? 'Updating order...' : 'Update Order'}
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }

    return content;
  };

  return (
    <div
      ref={wrapRef}
      className={`col-span-2 border border-[color:var(--border-color)] rounded-lg px-4 py-6 min-h-[390px] lg:sticky top-[6rem] self-start ${
        !outboundItem || visible === false
          ? 'lg:grid place-content-center'
          : 'lg:block'
      }`}
    >
      {getContent()}

      {orderStatusVisible && (
        <UpdateOrderStatus
          visible={orderStatusVisible}
          setVisible={setOrderStatusVisible}
          setPage={setPage}
          position="top"
          outboundItem={outboundItem}
          setOutboundItem={setOutboundItem}
        />
      )}
    </div>
  );
};

export default UpdateOutboundOrder;
