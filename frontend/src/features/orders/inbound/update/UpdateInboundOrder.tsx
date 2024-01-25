import { TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import Select, { SingleValue } from 'react-select';
import { UpdateOrderStatus, setPaginatedInbounds } from '../..';
import noSelectionSvg from '../../../../assets/images/no-selection.svg';
import { useAppSelector, useFetch, useUpdate } from '../../../../hooks';
import { selectProduct, setAllProducts } from '../../../products';
import { selectSupplier, setAllSuppliers } from '../../../suppliers';

interface UpdateInboundOrderProps extends MainDialogProps {
  inboundItem: InboundOrderProps | null;
  setInboundItem: (item: InboundOrderProps | null) => void;
  setPage: (page: number) => void;
}

interface ProductSelectProps {
  label: string;
  value: number;
}

const UpdateInboundOrder: React.FC<UpdateInboundOrderProps> = ({
  inboundItem,
  setInboundItem,
  setPage,
  visible,
  setVisible,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [orderStatusVisible, setOrderStatusVisible] = useState(false);
  const [product, setProduct] = useState<ProductSelectProps | null>(null);
  const [supplier, setSupplier] = useState<ProductSelectProps | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [requestSent, setRequestSent] = useState(false);

  const { data, loading, error, updateData, resetState } = useUpdate(
    `/inbounds/${inboundItem?.reference}`,
    'PATCH'
  );

  // fetch paginated list of inbound orders
  const { fetchData } = useFetch(
    `/inbounds/updatedAt/desc?page=${0}&pageSize=${10}`,
    setPaginatedInbounds
  );

  const handleUpdate = async () => {
    const body = {
      supplierId: supplier?.value,
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
      setInboundItem(null);
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
  const { allSuppliers } = useAppSelector(selectSupplier);
  const { fetchData: fetchAllSuppliers } = useFetch(
    '/supplier',
    setAllSuppliers
  );

  useEffect(() => {
    fetchAllSuppliers();
  }, []);

  const supplierOptions = allSuppliers?.map((s) => {
    return {
      label: s.name,
      value: s.id,
    };
  });

  useEffect(() => {
    const product = allProducts?.find((p) => p.id === inboundItem?.productId);
    const supplier = allSuppliers?.find(
      (r) => r.id === inboundItem?.supplierId
    );

    if (product) {
      setProduct({ label: product.name, value: product.id });
    } else {
      setProduct(null);
    }

    if (supplier) {
      setSupplier({ label: supplier.name, value: supplier.id });
    } else {
      setSupplier(null);
    }

    if (inboundItem) {
      setQuantity(inboundItem.quantity);
    }
  }, [inboundItem, allProducts, allSuppliers]);

  const handleProductOptionsChange = (
    product: SingleValue<ProductSelectProps>
  ) => {
    setProduct(product);
  };

  const handleSupplierOptionsChange = (
    supplier: SingleValue<ProductSelectProps>
  ) => {
    setSupplier(supplier);
  };

  const handleClose = () => {
    setInboundItem(null);
  };

  const getContent = () => {
    let content;

    if (!inboundItem || visible === false) {
      content = (
        <>
          <img
            src={noSelectionSvg}
            alt="No selected inbound"
            className="w-[15rem] mx-auto"
          />
          <p className="mt-4 text-sm">
            Click on the edit button to update an inbound order
          </p>
        </>
      );
    } else {
      content = (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium">Update Inbound Order</h1>
            <button type="button" title="Close" onClick={handleClose}>
              <span>
                <AiFillCloseCircle size={23} />
              </span>
            </button>
          </div>

          <div className="flex justify-between items-center mt-10">
            <div>
              <p className="text-[color:var(--text-secondary)] text-sm uppercase">
                Inbound Reference ID
              </p>
              <p className="font-medium mt-1">{inboundItem?.reference}</p>
            </div>
            <div>
              <p className="text-[color:var(--text-secondary)] text-sm uppercase">
                Order Status
              </p>
              <div className="flex items-center gap-x-2 mt-2 group">
                <span
                  className={`font-medium text-xs  px-2 py-1 rounded-full dark:text-[#0f172a] ${
                    inboundItem?.orderStatus === 'pending'
                      ? 'bg-yellow-200'
                      : inboundItem?.orderStatus === 'processing'
                      ? 'bg-yellow-500'
                      : inboundItem?.orderStatus === 'canceled'
                      ? 'bg-red-500 text-white'
                      : inboundItem?.orderStatus === 'shipping'
                      ? 'bg-blue-400'
                      : 'bg-green-400 text-white'
                  }`}
                >
                  {inboundItem?.orderStatus}
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
                options={supplierOptions}
                placeholder="Change Supplier"
                value={supplier}
                onChange={handleSupplierOptionsChange}
                isSearchable
                name="supplier"
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
        !inboundItem || visible === false
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
          inboundItem={inboundItem}
          setInboundItem={setInboundItem}
        />
      )}
    </div>
  );
};

export default UpdateInboundOrder;
