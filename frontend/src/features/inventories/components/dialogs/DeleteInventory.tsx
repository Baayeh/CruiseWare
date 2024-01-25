import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineInventory2 } from 'react-icons/md';
import {
  setNumOfDeletedInventories,
  setPaginatedInventories,
  setStateIfEmpty,
} from '../..';
import { useDelete, useFetch } from '../../../../hooks';
import { useAppDispatch } from '../../../../hooks/useStore';

/**
 * Props for the delete inventory component.
 *
 * @interface DeleteInventoryProps
 * @extends {MainDialogProps}
 * @property {'top' | 'bottom' | 'left' | 'right'} position - The position of the delete inventory component.
 * @property {InventoryProps | null} item - The inventory item to be deleted, or null if no item is selected.
 */
interface DeleteInventoryProps extends MainDialogProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  item: InventoryProps | null;
  setPage: (page: number) => void;
}

/**
 * Renders a dialog to delete an inventory.
 *
 * @param {DeleteInventoryProps} visible - Determines if the dialog is visible.
 * @param {function} setVisible - Sets the visibility of the dialog.
 * @param {string} position - The position of the dialog.
 * @param {Inventory} item - The inventory item to be deleted.
 * @return {ReactElement} The rendered dialog component.
 */
const DeleteInventory: React.FC<DeleteInventoryProps> = ({
  visible,
  setVisible,
  position,
  item,
  setPage,
}) => {
  const [step, setStep] = useState(0);
  const [isStepperVisible, setIsStepperVisible] = useState(false);
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();

  const [requestSent, setRequestSent] = useState(false);

  const { data, loading, error, deleteData, resetState } = useDelete(
    `/inventory/${item?.id}`
  );

  const { fetchData: fetchPaginatedInventories } = useFetch(
    `/inventory?page=${0}&pageSize=${10}`,
    setPaginatedInventories
  );
  const { fetchData: fetchNumOfDeletedInventories } = useFetch(
    '/inventory/deleted',
    setNumOfDeletedInventories
  );

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const showStepper = () => {
    setIsStepperVisible(true);
    nextStep();
  };

  const stepper = () => {
    switch (step) {
      case 1:
        return (
          <div
            className="p-3 text-sm mt-3 border-l-[0.3rem] border-[color:var(--accent-secondary)] rounded-r-md bg-yellow-600 bg-opacity-30"
            data-aos="fade-up"
          >
            <p>
              This will permanently delete the{' '}
              <span className="font-semibold">{item?.name}</span> inventory and
              remove all of its products.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="pt-3 text-sm mt-1">
            <div className="w-full">
              <label
                htmlFor="inventory-name"
                className="disable-text-selection font-semibold text-xs"
              >
                To confirm, type "{item?.name}" in the box below
              </label>
              <input
                type="text"
                id="inventory-name"
                name="inventory-name"
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                className={`${
                  input === item?.name
                    ? 'border-green-600 focus:border-green-600'
                    : 'border-[#d32f2f] focus:border-[#d32f2f]'
                } w-full p-2 bg-transparent rounded-md border-2 focus:outline-none`}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              />
            </div>
          </div>
        );
      default:
        return;
    }
  };

  const closeDialog = () => {
    setIsStepperVisible(false);
    setVisible(false);
    setStep(0);
    setInput('');
  };

  const deleteInventory = async () => {
    await deleteData();
    setRequestSent(true);
  };

  const footerContent = (
    <>
      {step === 0 ? (
        <button
          type="button"
          className="px-4 py-2 border dark:border-gray-600 bg-[color:var(--border-color)] hover:border-[--text-primary] hover:dark:hover:border-[--text-primary] transition-colors duration-300 ease-in-out"
          onClick={showStepper}
        >
          I want to delete this inventory
        </button>
      ) : step === 1 ? (
        <button
          type="button"
          className="sm:px-4 py-2 border dark:border-gray-600 bg-[color:var(--border-color)] hover:border-[--text-primary] hover:dark:hover:border-[--text-primary] transition-colors duration-300 ease-in-out"
          onClick={nextStep}
        >
          I have read and understand these effects
        </button>
      ) : (
        <button
          type="button"
          className="px-4 py-2 border dark:border-gray-600 bg-[color:var(--border-color)] hover:border-[--text-primary] hover:dark:hover:border-[--text-primary] transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:hover:border-[color:var(--border-color)] disabled:text-[color:var(--text-secondary)]"
          onClick={deleteInventory}
          disabled={input !== item?.name ? true : false}
        >
          {loading ? 'Deleting this inventory...' : 'Delete this inventory'}
        </button>
      )}
    </>
  );

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
      closeDialog();
      setPage(0);
      resetState();
      setRequestSent(false);
      fetchPaginatedInventories();
      fetchNumOfDeletedInventories();
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
  }, [error, requestSent]);

  return (
    <Dialog
      header={`Delete Inventory`}
      visible={visible}
      position={position}
      footer={footerContent}
      onHide={closeDialog}
      draggable={false}
      resizable={false}
      maskClassName="delete-mask"
      id="delete-dialog"
    >
      <div className="pb-2 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-y-2">
          <MdOutlineInventory2 size={30} />
          <h3 className="text-xl font-semibold">{item?.name}</h3>
        </div>
      </div>
      {isStepperVisible && (
        <section className="px-6 border-t border-[color:var(--border-color)]">
          {stepper()}
        </section>
      )}
    </Dialog>
  );
};
export default DeleteInventory;
