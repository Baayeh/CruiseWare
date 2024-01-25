import { Dialog } from 'primereact/dialog';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaOpencart } from 'react-icons/fa';
import { setPaginatedOutbounds } from '../..';
import { useAppSelector, useDelete, useFetch } from '../../../../hooks';
import { selectProduct, setAllProducts } from '../../../products';

interface DeleteOutboundOrderProps extends MainDialogProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  setPage: (page: number) => void;
  outboundItem: OutboundOrderProps | null;
}

const DeleteOutboundOrder: React.FC<DeleteOutboundOrderProps> = ({
  position,
  setPage,
  outboundItem,
  visible,
  setVisible,
}) => {
  const { data, loading, error, deleteData } = useDelete(
    '/outbounds/' + outboundItem?.id
  );

  // fetch all products
  const { allProducts } = useAppSelector(selectProduct);
  const { fetchData: fetchAllProducts } = useFetch('/product', setAllProducts);

  const getProductName = () => {
    const product = allProducts?.find((p) => p.id === outboundItem?.productId);
    return product ? product.name : null;
  };

  // fetch paginated list of outbound orders
  const { fetchData } = useFetch(
    `/outbounds?page=${0}&pageSize=${10}`,
    setPaginatedOutbounds
  );

  const deleteOutboundOrder = async () => {
    await deleteData();
  };

  useEffect(() => {
    if (data) {
      toast.success(data);
      setVisible(false);
      setPage(0);
      fetchData();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const footerContent = (
    <button
      type="button"
      className="px-4 py-2 border dark:border-gray-600 bg-[color:var(--border-color)] hover:border-[--text-primary] hover:dark:hover:border-[--text-primary] transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:hover:border-[color:var(--border-color)] disabled:text-[color:var(--text-secondary)]"
      onClick={deleteOutboundOrder}
      disabled={loading}
    >
      {loading ? 'Deleting order...' : 'Delete this order'}
    </button>
  );

  return (
    <Dialog
      header="Delete Outbound Order"
      visible={visible}
      onHide={() => setVisible(false)}
      position={position}
      footer={footerContent}
      draggable={false}
      resizable={false}
      maskClassName="delete-mask"
      id="delete-dialog"
    >
      <div className="pb-2 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-y-2">
          <FaOpencart size={30} />
          <h3 className="text-lg font-semibold">
            Outbound Order for {getProductName()}
          </h3>
        </div>
      </div>

      <div className="px-6 border-t border-[color:var(--border-color)]">
        <div className="p-3 text-sm mt-3 border-l-[0.3rem] border-[color:var(--accent-secondary)] rounded-r-md bg-yellow-600 bg-opacity-30">
          <p>This will permanently delete the order for {getProductName()}</p>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteOutboundOrder;
