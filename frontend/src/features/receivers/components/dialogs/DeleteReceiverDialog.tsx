import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineUserMinus } from 'react-icons/hi2';
import { setPaginatedReceivers, setStateIfEmpty } from '../..';
import { useAppDispatch, useDelete, useFetch } from '../../../../hooks';

interface DeleteReceiverProps extends MainDialogProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  receiver: ReceiverProps | null;
  setPage: (page: number) => void;
  setActiveItem: (item: ReceiverProps | null) => void;
}

const DeleteReceiverDialog: React.FC<DeleteReceiverProps> = ({
  position,
  receiver,
  setPage,
  visible,
  setVisible,
  setActiveItem,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const { data, loading, error, deleteData, resetState } = useDelete(
    `/receiver/${receiver?.id}`
  );

  const dispatch = useAppDispatch();

  const { fetchData } = useFetch(
    `/receiver?page=${0}&pageSize=${10}`,
    setPaginatedReceivers
  );

  const deleteReceiver = async () => {
    await deleteData();
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
      setVisible(false);
      setPage(0);
      setActiveItem(null);
      resetState();
      setRequestSent(false);
      fetchData();
    }
  }, [data, requestSent, resetState]);

  useEffect(() => {
    if (!data) {
      dispatch(setStateIfEmpty());
    }
  }, [data]);

  useEffect(() => {
    if (error && requestSent) {
      toast.error(error);
      resetState();
      setRequestSent(false);
    }
  }, [error, resetState]);

  const footerContent = (
    <button
      type="button"
      className="px-4 py-2 border dark:border-gray-600 bg-[color:var(--border-color)] hover:border-[--text-primary] hover:dark:hover:border-[--text-primary] transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:hover:border-[color:var(--border-color)] disabled:text-[color:var(--text-secondary)]"
      onClick={deleteReceiver}
      disabled={loading}
    >
      {loading ? 'Deleting receiver...' : 'Delete this receiver'}
    </button>
  );

  return (
    <Dialog
      header="Delete Receiver"
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
          <HiOutlineUserMinus size={30} />
          <h3 className="text-xl font-semibold">{receiver?.name}</h3>
        </div>
      </div>

      <div className="px-6 border-t border-[color:var(--border-color)]">
        <div className="p-3 text-sm mt-3 border-l-[0.3rem] border-[color:var(--accent-secondary)] rounded-r-md bg-yellow-600 bg-opacity-30">
          <p>
            This will permanently delete{' '}
            <span className="font-semibold">{receiver?.name}'s</span> account
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteReceiverDialog;
