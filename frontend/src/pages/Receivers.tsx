import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { RequirePermission, TempSearchFilter } from '../components';
import PERMISSIONS from '../data/permissions';
import {
  DeleteReceiverDialog,
  EditReceiverDialog,
  NewReceiverDialog,
  ReceiverDetailSummary,
  ReceiversTable,
  selectReceiver,
  setAllReceivers,
  setPaginatedReceivers,
  setSearchResult,
} from '../features/receivers';
import { useAppSelector, useFetch } from '../hooks';

const Receivers = () => {
  const [page, setPage] = useState<number>(0);
  const [newVisible, setNewVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<ReceiverProps | null>(null);
  const [receiver, setReceiver] = useState<ReceiverProps | null>(null);

  const { allReceivers } = useAppSelector(selectReceiver);
  const { fetchData: fetchAllReceivers } = useFetch(
    '/receiver',
    setAllReceivers
  );

  const { fetchData } = useFetch(
    `/receiver?page=${page}&pageSize=${10}`,
    setPaginatedReceivers
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchAllReceivers();
  }, []);

  return (
    <section id="receivers" className="relative mb-10">
      <div className="my-6 p-4 rounded-lg border border-[color:var(--border-color)] flex justify-center sm:justify-between sticky top-0 bg-[color:var(--primary-bg)] z-10">
        <div className="flex gap-x-4">
          <RequirePermission allowedPermissions={[PERMISSIONS.CreateReceiver]}>
            <button
              type="button"
              className="text-[color:var(--text-dark)] bg-[color:var(--accent-primary)] px-3 py-2 rounded-lg text-sm flex justify-center items-center gap-x-1 hover:bg-orange-600 transition-colors duration-300 ease-in-out"
              onClick={() => setNewVisible(true)}
              title="Add receiver"
            >
              <MdAdd />
              <span className="hidden lg:flex">New Receiver</span>
            </button>
          </RequirePermission>
          <TempSearchFilter
            title="a receiver"
            feature="receiver"
            data={allReceivers}
            resetMethod={fetchData}
            dispatchAction={setSearchResult}
          />
        </div>
      </div>

      <div className="lg:grid grid-cols-6 gap-4">
        <ReceiversTable
          page={page}
          setPage={setPage}
          setReceiver={setReceiver}
          setEditVisible={setEditVisible}
          setDeleteVisible={setDeleteVisible}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
        <ReceiverDetailSummary activeItem={activeItem} />
      </div>

      {newVisible && (
        <NewReceiverDialog
          visible={newVisible}
          setVisible={setNewVisible}
          setPage={setPage}
          setActiveItem={setActiveItem}
        />
      )}

      {editVisible && (
        <EditReceiverDialog
          visible={editVisible}
          setVisible={setEditVisible}
          setPage={setPage}
          receiver={receiver}
          setActiveItem={setActiveItem}
        />
      )}

      <DeleteReceiverDialog
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        setPage={setPage}
        position="bottom"
        receiver={receiver}
        setActiveItem={setActiveItem}
      />
    </section>
  );
};

export default Receivers;
