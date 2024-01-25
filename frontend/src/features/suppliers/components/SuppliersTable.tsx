import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { RiEditFill } from 'react-icons/ri';
import { selectSupplier, setPaginatedSuppliers, setStateIfEmpty } from '..';
import { PaginatorWrapper, RequirePermission } from '../../../components';
import PERMISSIONS from '../../../data/permissions';
import { useAppDispatch, useAppSelector, useFetch } from '../../../hooks';

interface SupplierTableProps extends TableProps {
  setSupplier: (supplier: SupplierProps | null) => void;
  setEditVisible: (visible: boolean) => void;
  setDeleteVisible: (visible: boolean) => void;
  activeItem: SupplierProps | null;
  setActiveItem: (item: SupplierProps | null) => void;
}

const SuppliersTable: React.FC<SupplierTableProps> = ({
  page,
  setPage,
  setSupplier,
  setEditVisible,
  setDeleteVisible,
  activeItem,
  setActiveItem,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { paginatedSuppliers, totalSupplierCount } =
    useAppSelector(selectSupplier);

  const dispatch = useAppDispatch();

  const { data, loading, error, fetchData, resetState } = useFetch(
    `/supplier?page=${page + 1}&pageSize=${rowsPerPage}`,
    setPaginatedSuppliers
  );

  useEffect(() => {
    if (!data && error) {
      dispatch(setStateIfEmpty());
      resetState();
    }
  }, [data, error, resetState]);

  const setActiveRow = (item: SupplierProps | null) => {
    if (activeItem === item) {
      setActiveItem(null);
    } else {
      setActiveItem(item);
    }
  };

  const showEditDialog = (item: SupplierProps) => {
    setEditVisible(true);
    setSupplier(item);
  };

  const showDeleteDialog = (item: SupplierProps) => {
    setDeleteVisible(true);
    setSupplier(item);
    setActiveItem(null);
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  // Create table content
  const getContent = () => {
    if (loading) {
      return (
        <ul role="row">
          <li className="text-center col-span-4" role="cell">
            Loading...
          </li>
        </ul>
      );
    }

    if (!paginatedSuppliers) {
      return (
        <ul role="row">
          <li className="text-center col-span-4" role="cell">
            No supplier available. Create one!
          </li>
        </ul>
      );
    }

    if (paginatedSuppliers?.length === 0) {
      return (
        <ul role="row">
          <li className="text-center col-span-4" role="cell">
            No supplier found
          </li>
        </ul>
      );
    } else {
      return paginatedSuppliers?.map((supplier) => (
        <div key={supplier.id}>
          <RequirePermission
            allowedPermissions={[PERMISSIONS.ReadSupplier]}
            element={
              <ul role="row" className="suppliers-table__row">
                <li data-cell="name" role="cell">
                  {supplier.name}
                </li>
                <li
                  data-cell="phone"
                  role="cell"
                  className="hidden sm:table-cell"
                >
                  {supplier.phone}
                </li>
                <li
                  data-cell="email"
                  role="cell"
                  className="hidden xl:table-cell"
                >
                  {supplier.email}
                </li>
                <li data-cell="action" role="cell">
                  <div className="flex justify-center lg:justify-start items-center gap-x-3">
                    <RequirePermission
                      allowedPermissions={[PERMISSIONS.UpdateSupplier]}
                      element={
                        <button
                          type="button"
                          className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] text-white hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out text-xs sm:text-md sm:text-md disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:dark:bg-gray-700 disabled:dark:border-gray-700"
                          disabled
                        >
                          <RiEditFill />
                        </button>
                      }
                    >
                      <button
                        type="button"
                        className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out"
                        onClick={() => showEditDialog(supplier)}
                      >
                        <RiEditFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-dark)]" />
                      </button>
                    </RequirePermission>
                    <RequirePermission
                      allowedPermissions={[PERMISSIONS.DeleteSupplier]}
                      element={
                        <button
                          type="button"
                          className="col-span-1 p-2 rounded-md bg-red-600 text-white hover:bg-red-800 transition-colors duration-300 ease-in-out text-xs sm:text-md disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:dark:bg-gray-700"
                          disabled
                        >
                          <MdDelete />
                        </button>
                      }
                    >
                      <button
                        type="button"
                        className="col-span-1 p-2 rounded-md bg-red-600 text-white hover:bg-red-800 transition-colors duration-300 ease-in-out"
                        onClick={() => showDeleteDialog(supplier)}
                      >
                        <MdDelete />
                      </button>
                    </RequirePermission>
                  </div>
                </li>
              </ul>
            }
          >
            <ul
              key={supplier.id}
              role="row"
              className={`suppliers-table__row cursor-pointer ${
                activeItem === supplier ? 'active' : ''
              }`}
              onClick={() => setActiveRow(supplier)}
            >
              <li data-cell="name" role="cell">
                {supplier.name}
              </li>
              <li
                data-cell="phone"
                role="cell"
                className="hidden sm:table-cell"
              >
                {supplier.phone}
              </li>
              <li
                data-cell="email"
                role="cell"
                className="hidden xl:table-cell"
              >
                {supplier.email}
              </li>
              <li data-cell="action" role="cell">
                <div className="flex justify-center lg:justify-start items-center gap-x-3">
                  <RequirePermission
                    allowedPermissions={[PERMISSIONS.UpdateSupplier]}
                    element={
                      <button
                        type="button"
                        className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] text-white hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out text-xs sm:text-md sm:text-md disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:dark:bg-gray-700 disabled:dark:border-gray-700"
                        disabled
                      >
                        <RiEditFill />
                      </button>
                    }
                  >
                    <button
                      type="button"
                      className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out"
                      onClick={() => showEditDialog(supplier)}
                    >
                      <RiEditFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-dark)]" />
                    </button>
                  </RequirePermission>
                  <RequirePermission
                    allowedPermissions={[PERMISSIONS.DeleteSupplier]}
                    element={
                      <button
                        type="button"
                        className="col-span-1 p-2 rounded-md bg-red-600 text-white hover:bg-red-800 transition-colors duration-300 ease-in-out text-xs sm:text-md disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:dark:bg-gray-700"
                        disabled
                      >
                        <MdDelete />
                      </button>
                    }
                  >
                    <button
                      type="button"
                      className="col-span-1 p-2 rounded-md bg-red-600 text-white hover:bg-red-800 transition-colors duration-300 ease-in-out"
                      onClick={() => showDeleteDialog(supplier)}
                    >
                      <MdDelete />
                    </button>
                  </RequirePermission>
                </div>
              </li>
            </ul>
          </RequirePermission>
        </div>
      ));
    }
  };

  return (
    <div className="col-span-4 dark:shadow-none overflow-auto rounded-lg bg-slate-200/50 dark:bg-slate-900 px-2 sm:px-10 pb-5 pt-5 min-h-[390px] self-start">
      <div className="flex justify-center sm:justify-between items-center mb-5">
        <h1 className="hidden sm:block font-bold text-xl">Suppliers List</h1>
        <PaginatorWrapper
          page={page}
          rows={rowsPerPage}
          setPage={setPage}
          setRows={setRowsPerPage}
          totalRecords={totalSupplierCount}
        />
      </div>
      <ul className="w-full" role="table">
        <li role="rowgroup">
          <ul className="text-left bg-slate-300 dark:bg-slate-700" role="row">
            <li role="columnheader" data-head="name">
              Name
            </li>
            <li
              role="columnheader"
              data-head="phone"
              className="hidden sm:table-cell"
            >
              Phone
            </li>
            <li
              role="columnheader"
              data-head="email"
              className="hidden xl:table-cell"
            >
              Email
            </li>
            <li
              role="columnheader"
              data-head="actions"
              className="text-center lg:text-start"
            >
              Actions
            </li>
          </ul>
        </li>
        <li role="rowgroup">{getContent()}</li>
      </ul>
      <div className="flex justify-center sm:justify-end items-center mt-5">
        <PaginatorWrapper
          page={page}
          rows={rowsPerPage}
          setPage={setPage}
          setRows={setRowsPerPage}
          totalRecords={totalSupplierCount}
        />
      </div>
    </div>
  );
};

export default SuppliersTable;
