import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineUserMinus } from 'react-icons/hi2';
import { setAllRoles } from '../..';
import { useDelete, useFetch } from '../../../../hooks';

interface DeleteRoleProps extends MainDialogProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  activeItem: UserRole | null;
  setActiveItem: (item: UserRole | null) => void;
}

const DeleteRoleDialog: React.FC<DeleteRoleProps> = ({
  position,
  activeItem,
  setActiveItem,
  visible,
  setVisible,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const { data, loading, error, deleteData, resetState } = useDelete(
    `/roles/${activeItem?.name}`
  );

  const { fetchData } = useFetch(`/roles`, setAllRoles);

  const deleteRole = async () => {
    await deleteData();
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
      setVisible(false);
      setActiveItem(null);
      resetState();
      setRequestSent(false);
      fetchData();
    }
  }, [data, requestSent, resetState]);

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
      onClick={deleteRole}
      disabled={loading}
    >
      {loading ? 'Deleting role...' : 'Delete this role'}
    </button>
  );

  return (
    <Dialog
      header="Delete Role"
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
          <h3 className="text-xl font-semibold">{activeItem?.name}</h3>
        </div>
      </div>

      <div className="px-6 border-t border-[color:var(--border-color)]">
        <div className="p-3 text-sm mt-3 border-l-[0.3rem] border-[color:var(--accent-secondary)] rounded-r-md bg-yellow-600 bg-opacity-30">
          <p>
            This will permanently delete{' '}
            <span className="font-semibold">{activeItem?.name}'s</span> role
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteRoleDialog;
