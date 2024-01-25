import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import '../assets/css/Suppliers.scss';
import { RequirePermission, TempSearchFilter } from '../components';
import PERMISSIONS from '../data/permissions';
import {
  DeleteSupplierDialog,
  EditSupplierDialog,
  NewSupplierDialog,
  SupplierDetailSummary,
  SuppliersTable,
  selectSupplier,
  setAllSuppliers,
  setPaginatedSuppliers,
  setSearchResult,
} from '../features/suppliers';
import { useAppSelector, useFetch } from '../hooks';

const Suppliers = () => {
  const [page, setPage] = useState<number>(0);
  const [newVisible, setNewVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<SupplierProps | null>(null);
  const [supplier, setSupplier] = useState<SupplierProps | null>(null);

  const { allSuppliers } = useAppSelector(selectSupplier);
  const { fetchData: fetchAllSuppliers } = useFetch(
    '/supplier',
    setAllSuppliers
  );

  const { fetchData } = useFetch(
    `/supplier?page=${page}&pageSize=${10}`,
    setPaginatedSuppliers
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchAllSuppliers();
  }, []);

  return (
    <section id="suppliers" className="relative mb-10">
      <div className="my-6 p-4 rounded-lg border border-[color:var(--border-color)] flex justify-center sm:justify-between sticky top-0 bg-[color:var(--primary-bg)] z-10">
        <div className="flex gap-x-4">
          <RequirePermission allowedPermissions={[PERMISSIONS.CreateSupplier]}>
            <button
              type="button"
              className="text-[color:var(--text-dark)] bg-[color:var(--accent-primary)] px-3 py-2 rounded-lg text-sm flex justify-center items-center gap-x-1 hover:bg-orange-600 transition-colors duration-300 ease-in-out"
              onClick={() => {
                setNewVisible(true);
                setActiveItem(null);
              }}
              title="Add supplier"
            >
              <MdAdd />
              <span className="hidden lg:flex">New Supplier</span>
            </button>
          </RequirePermission>
          <TempSearchFilter
            title="a supplier"
            feature="supplier"
            data={allSuppliers}
            resetMethod={fetchData}
            dispatchAction={setSearchResult}
          />
        </div>
      </div>

      <div className="lg:grid grid-cols-6 gap-4">
        <SuppliersTable
          page={page}
          setPage={setPage}
          setSupplier={setSupplier}
          setEditVisible={setEditVisible}
          setDeleteVisible={setDeleteVisible}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
        <SupplierDetailSummary activeItem={activeItem} />
      </div>

      {newVisible && (
        <NewSupplierDialog
          visible={newVisible}
          setVisible={setNewVisible}
          setPage={setPage}
          setActiveItem={setActiveItem}
        />
      )}

      {editVisible && (
        <EditSupplierDialog
          visible={editVisible}
          setVisible={setEditVisible}
          setPage={setPage}
          supplier={supplier}
          setActiveItem={setActiveItem}
        />
      )}

      <DeleteSupplierDialog
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        setPage={setPage}
        position="bottom"
        supplier={supplier}
        setActiveItem={setActiveItem}
      />
    </section>
  );
};

export default Suppliers;
