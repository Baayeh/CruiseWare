import React, { useEffect, useState } from 'react';
import { BsEyeFill } from 'react-icons/bs';
import { FaOpencart } from 'react-icons/fa';
import { MdDelete, MdOutlineInventory2 } from 'react-icons/md';
import { RiEditFill } from 'react-icons/ri';
import {
  DeleteInventory,
  EditInventory,
  selectInventory,
  setNumOfDeletedInventories,
  setPaginatedInventories,
  setStateIfEmpty,
} from '..';
import {
  OverviewCard,
  PaginatorWrapper,
  RequirePermission,
} from '../../../components';
import PERMISSIONS from '../../../data/permissions';
import { useFetch } from '../../../hooks';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';

const InventoryTable: React.FC<TableProps> = ({ page, setPage }) => {
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] =
    useState<boolean>(false);
  const [inventoryItem, setInventoryItem] = useState<InventoryProps | null>(
    null
  );
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();

  const {
    paginatedInventories,
    numOfDeletedInventories,
    totalInventoryCount,
    totalProductCount,
  } = useAppSelector(selectInventory);

  const {
    data,
    loading,
    fetchData: fetchPaginatedInventories,
    error,
    resetState,
  } = useFetch(
    `/inventory?page=${page + 1}&pageSize=${rowsPerPage}`,
    setPaginatedInventories
  );

  const { fetchData: fetchNumOfDeletedInventories } = useFetch(
    '/inventory/deleted',
    setNumOfDeletedInventories
  );

  useEffect(() => {
    fetchPaginatedInventories();
    fetchNumOfDeletedInventories();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (!data && error) {
      dispatch(setStateIfEmpty());
      resetState();
    }
  }, [data, error, resetState]);

  const showDeleteDialog = (item: InventoryProps) => {
    setIsDeleteDialogVisible(true);
    setInventoryItem(item);
  };

  const showEditDialog = (item: InventoryProps) => {
    setEditVisible(true);
    setInventoryItem(item);
  };

  const getContent = () => {
    if (loading) {
      return (
        <tr role="row">
          <td colSpan={6} className="text-center" role="cell">
            Loading...
          </td>
        </tr>
      );
    }

    if (!paginatedInventories || paginatedInventories?.length === 0) {
      return (
        <tr role="row">
          <td colSpan={6} className="text-center" role="cell">
            No inventory available. Create one!
          </td>
        </tr>
      );
    }

    if (paginatedInventories?.length === 0) {
      return (
        <tr role="row">
          <td colSpan={6} className="text-center" role="cell">
            Sorry, no inventories found
          </td>
        </tr>
      );
    } else {
      return paginatedInventories?.map((inventory) => (
        <tr key={inventory.id} role="row">
          <td data-cell="name" role="cell" className="text-ellipsis truncate">
            {inventory.name}
          </td>
          <td
            data-cell="created by"
            role="cell"
            className="truncate hidden xl:table-cell"
          >
            {inventory.createdBy}
          </td>
          <td
            data-cell="total products"
            role="cell"
            className="hidden sm:table-cell !pl-[4rem]"
          >
            {inventory.productCount}
          </td>
          <td data-cell="action" role="cell">
            <div className="flex justify-center items-center gap-x-3">
              <RequirePermission
                allowedPermissions={[PERMISSIONS.ReadInventory]}
                element={
                  <button
                    type="button"
                    disabled
                    className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] text-white hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out text-xs sm:text-md sm:text-md disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:dark:bg-gray-700 disabled:dark:border-gray-700"
                  >
                    <BsEyeFill />
                  </button>
                }
              >
                <button
                  type="button"
                  onClick={() => showEditDialog(inventory)}
                  className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] text-white hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out text-xs sm:text-md"
                >
                  <BsEyeFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-primary)]" />
                </button>
              </RequirePermission>
              <RequirePermission
                allowedPermissions={[PERMISSIONS.UpdateInventory]}
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
                  className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] text-white hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out text-xs sm:text-md"
                  onClick={() => showEditDialog(inventory)}
                >
                  <RiEditFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-primary)]" />
                </button>
              </RequirePermission>
              <RequirePermission
                allowedPermissions={[PERMISSIONS.DeleteInventory]}
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
                  className="col-span-1 p-2 rounded-md bg-red-600 text-white hover:bg-red-800 transition-colors duration-300 ease-in-out text-xs sm:text-md"
                  onClick={() => showDeleteDialog(inventory)}
                >
                  <MdDelete />
                </button>
              </RequirePermission>
            </div>
          </td>
        </tr>
      ));
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-6 sm:gap-10 lg:gap-16">
        <div id="inventory-table" className="lg:col-span-4">
          <div className="flex justify-center sm:justify-between items-center mb-5">
            <h1 className="hidden sm:block font-bold text-xl">
              Inventory List
            </h1>
            <PaginatorWrapper
              page={page}
              rows={rowsPerPage}
              setPage={setPage}
              setRows={setRowsPerPage}
              totalRecords={totalInventoryCount}
            />
          </div>
          <table className="w-full" role="table">
            <thead role="rowgroup">
              <tr
                className="text-left bg-slate-300 dark:bg-slate-700"
                role="row"
              >
                <th role="columnheader">Name</th>
                <th role="columnheader" className="hidden xl:table-cell">
                  Created By
                </th>
                <th role="columnheader" className="hidden sm:table-cell">
                  Total Products
                </th>
                <th role="columnheader" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">{getContent()}</tbody>
          </table>
          <div className="flex justify-center sm:justify-end items-center mt-5">
            <PaginatorWrapper
              page={page}
              rows={rowsPerPage}
              setPage={setPage}
              setRows={setRowsPerPage}
              totalRecords={totalInventoryCount}
            />
          </div>
        </div>

        <div className="lg:col-span-2 sm:order-first lg:order-last hidden lg:sticky top-[6rem] self-start sm:flex lg:flex-col gap-8">
          <OverviewCard
            title="Inventories"
            icon={MdOutlineInventory2}
            numCreated={totalInventoryCount}
            createdKeyword="created"
            numDeleted={numOfDeletedInventories}
            deletedKeyword="deleted"
            hasDeleted={true}
          />
          <OverviewCard
            title="Products"
            icon={FaOpencart}
            numCreated={totalProductCount || 0}
            createdKeyword="total"
          />
        </div>
      </div>

      <DeleteInventory
        visible={isDeleteDialogVisible}
        setVisible={setIsDeleteDialogVisible}
        position="bottom"
        item={inventoryItem}
        setPage={setPage}
      />
      {editVisible && (
        <EditInventory
          visible={editVisible}
          setVisible={setEditVisible}
          item={inventoryItem}
          setPage={setPage}
        />
      )}
    </>
  );
};

export default InventoryTable;
