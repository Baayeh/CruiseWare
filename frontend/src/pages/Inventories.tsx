import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import '../assets/css/Inventory.scss';
import { RequirePermission, SearchFilter } from '../components';
import PERMISSIONS from '../data/permissions';
import {
  InventoryTable,
  NewInventory,
  setPaginatedInventories,
  setSearchResult,
} from '../features/inventories';
import { useFetch } from '../hooks';

const Inventories = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const { fetchData: fetchPaginatedInventories } = useFetch(
    `/inventory?page=${page}&pageSize=${10}`,
    setPaginatedInventories
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="inventories" className="mb-10 relative">
      <div className="my-6 p-4 rounded-lg border border-[color:var(--border-color)] flex justify-center sm:justify-between sticky top-0 bg-[color:var(--primary-bg)] z-10">
        <div className="flex gap-x-4">
          <RequirePermission allowedPermissions={[PERMISSIONS.CreateInventory]}>
            <button
              type="button"
              className="text-[color:var(--text-dark)] bg-[color:var(--accent-primary)] px-3 py-2 rounded-lg text-sm flex justify-center items-center gap-x-1 hover:bg-orange-600 transition-colors duration-300 ease-in-out"
              onClick={() => setVisible(true)}
              title="Add inventory"
            >
              <MdAdd />
              <span className="hidden lg:flex">New inventory</span>
            </button>
          </RequirePermission>
          <SearchFilter
            title="an inventory"
            resetMethod={fetchPaginatedInventories}
            url="/inventory"
            dispatchAction={setSearchResult}
          />
        </div>
      </div>

      <InventoryTable page={page} setPage={setPage} />

      {visible && (
        <NewInventory
          visible={visible}
          setVisible={setVisible}
          setPage={setPage}
        />
      )}
    </section>
  );
};
export default Inventories;
