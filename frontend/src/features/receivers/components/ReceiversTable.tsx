import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { RiEditFill } from 'react-icons/ri';
import { selectReceiver, setPaginatedReceivers, setStateIfEmpty } from '..';
import { PaginatorWrapper, RequirePermission } from '../../../components';
import PERMISSIONS from '../../../data/permissions';
import { useAppDispatch, useAppSelector, useFetch } from '../../../hooks';

interface ReceiverTableProps extends TableProps {
  setReceiver: (receiver: ReceiverProps | null) => void;
  setEditVisible: (visible: boolean) => void;
  setDeleteVisible: (visible: boolean) => void;
  activeItem: ReceiverProps | null;
  setActiveItem: (item: ReceiverProps | null) => void;
}

const ReceiversTable: React.FC<ReceiverTableProps> = ({
  page,
  setPage,
  setReceiver,
  setEditVisible,
  setDeleteVisible,
  activeItem,
  setActiveItem,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { paginatedReceivers, totalReceiverCount } =
    useAppSelector(selectReceiver);

  const dispatch = useAppDispatch();

  const { data, loading, error, fetchData, resetState } = useFetch(
    `/receiver?page=${page + 1}&pageSize=${rowsPerPage}`,
    setPaginatedReceivers
  );

  useEffect(() => {
    if (!data && error) {
      dispatch(setStateIfEmpty());
      resetState();
    }
  }, [data, error, resetState]);

  const setActiveRow = (item: ReceiverProps | null) => {
    if (activeItem === item) {
      setActiveItem(null);
    } else {
      setActiveItem(item);
    }
  };

  const showEditDialog = (item: ReceiverProps) => {
    setEditVisible(true);
    setReceiver(item);
  };

  const showDeleteDialog = (item: ReceiverProps) => {
    setDeleteVisible(true);
    setReceiver(item);
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

    if (!paginatedReceivers || paginatedReceivers?.length === 0) {
      return (
        <ul role="row">
          <li className="text-center col-span-4" role="cell">
            No receiver available. Create one!
          </li>
        </ul>
      );
    }

    if (paginatedReceivers?.length === 0) {
      return (
        <ul role="row">
          <li className="text-center col-span-4" role="cell">
            No receiver found
          </li>
        </ul>
      );
    } else {
      return paginatedReceivers?.map((receiver) => (
        <div key={receiver.id}>
          <RequirePermission
            allowedPermissions={[PERMISSIONS.ReadReceiver]}
            element={
              <ul role="row" className="suppliers-table__row">
                <li data-cell="name" role="cell">
                  {receiver.name}
                </li>
                <li
                  data-cell="phone"
                  role="cell"
                  className="hidden sm:table-cell"
                >
                  {receiver.phone}
                </li>
                <li
                  data-cell="email"
                  role="cell"
                  className="hidden xl:table-cell"
                >
                  {receiver.email}
                </li>
                <li data-cell="action" role="cell">
                  <div className="flex justify-center lg:justify-start items-center gap-x-3">
                    <RequirePermission
                      allowedPermissions={[PERMISSIONS.UpdateReceiver]}
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
                        onClick={() => showEditDialog(receiver)}
                      >
                        <RiEditFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-dark)]" />
                      </button>
                    </RequirePermission>
                    <RequirePermission
                      allowedPermissions={[PERMISSIONS.DeleteReceiver]}
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
                        onClick={() => showDeleteDialog(receiver)}
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
              key={receiver.id}
              role="row"
              className={`suppliers-table__row cursor-pointer ${
                activeItem === receiver ? 'active' : ''
              }`}
              onClick={() => setActiveRow(receiver)}
            >
              <li data-cell="name" role="cell">
                {receiver.name}
              </li>
              <li
                data-cell="phone"
                role="cell"
                className="hidden sm:table-cell"
              >
                {receiver.phone}
              </li>
              <li
                data-cell="email"
                role="cell"
                className="hidden xl:table-cell"
              >
                {receiver.email}
              </li>
              <li data-cell="action" role="cell">
                <div className="flex justify-center lg:justify-start items-center gap-x-3">
                  <RequirePermission
                    allowedPermissions={[PERMISSIONS.UpdateReceiver]}
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
                      onClick={() => showEditDialog(receiver)}
                    >
                      <RiEditFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-dark)]" />
                    </button>
                  </RequirePermission>
                  <RequirePermission
                    allowedPermissions={[PERMISSIONS.DeleteReceiver]}
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
                      onClick={() => showDeleteDialog(receiver)}
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
        <h1 className="hidden sm:block font-bold text-xl">Receivers List</h1>
        <PaginatorWrapper
          page={page}
          rows={rowsPerPage}
          setPage={setPage}
          setRows={setRowsPerPage}
          totalRecords={totalReceiverCount}
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
          totalRecords={totalReceiverCount}
        />
      </div>
    </div>
  );
};

export default ReceiversTable;
