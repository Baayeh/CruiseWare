import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { RiEditFill } from 'react-icons/ri';
import { selectOutbound, setPaginatedOutbounds } from '..';
import { PaginatorWrapper, RequirePermission } from '../../../components';
import PERMISSIONS from '../../../data/permissions';
import { useAppSelector, useFetch } from '../../../hooks';
import { selectProduct, setAllProducts } from '../../products';

interface OutboundTableProps extends TableProps {
  setDeleteVisible: (visible: boolean) => void;
  setOutboundItem: (item: OutboundOrderProps | null) => void;
  setEditVisible: (visible: boolean) => void;
}

const OutboundTable: React.FC<OutboundTableProps> = ({
  page,
  setPage,
  setDeleteVisible,
  setOutboundItem,
  setEditVisible,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { paginatedOutbounds, totalOutboundCount } =
    useAppSelector(selectOutbound);
  const { allProducts } = useAppSelector(selectProduct);

  // fetch all products
  const { fetchData: fetchAllProducts } = useFetch('/product', setAllProducts);

  // get product name
  const getProductName = (productId: number) => {
    const product = allProducts?.find((p) => p.id === productId);
    return product ? product.name : null;
  };

  // fetch paginated list of outbound orders
  const { loading, fetchData: fetchPaginatedOutbounds } = useFetch(
    `/outbounds?page=${page + 1}&pageSize=${rowsPerPage}`,
    setPaginatedOutbounds
  );

  const handleUpdate = (item: OutboundOrderProps) => {
    setOutboundItem(item);
    setEditVisible(true);
  };

  const showDeleteDialog = (item: OutboundOrderProps) => {
    setDeleteVisible(true);
    setOutboundItem(item);
    setEditVisible(false);
  };

  useEffect(() => {
    fetchPaginatedOutbounds();
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const getContent = () => {
    const content = (
      <table className="w-full">
        <thead role="rowgroup">
          <tr className="text-left bg-slate-300 dark:bg-slate-700" role="row">
            <th role="columnheader">Order ID</th>

            <th role="columnheader" className="hidden xl:table-cell">
              Product
            </th>
            <th role="columnheader" className="hidden sm:table-cell">
              Quantity
            </th>
            <th
              role="columnheader"
              className="hidden sm:table-cell text-center"
            >
              Order Status
            </th>
            <th role="columnheader" className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {loading ? (
            <tr role="row">
              <td colSpan={6} className="text-center" role="cell">
                Loading...
              </td>
            </tr>
          ) : null}
          {!paginatedOutbounds ? (
            <tr role="row">
              <td colSpan={6} className="text-center" role="cell">
                No outbound order available. Create one!
              </td>
            </tr>
          ) : paginatedOutbounds?.length === 0 ? (
            <tr role="row">
              <td colSpan={6} className="text-center" role="cell">
                No outbound order found
              </td>
            </tr>
          ) : (
            paginatedOutbounds?.map((outbound) => (
              <tr key={outbound.id} role="row">
                <td
                  data-cell="name"
                  role="cell"
                  className="text-ellipsis truncate"
                >
                  {outbound.orderId}
                </td>
                <td
                  data-cell="created by"
                  role="cell"
                  className="truncate hidden xl:table-cell"
                >
                  {getProductName(outbound.productId)}
                </td>
                <td
                  data-cell="created by"
                  role="cell"
                  className="truncate hidden xl:table-cell"
                >
                  {outbound.quantity}
                </td>
                <td
                  data-cell="total products"
                  role="cell"
                  className="hidden sm:table-cell text-center"
                >
                  <span
                    className={`font-medium text-xs  px-2 py-1 rounded-full dark:text-[#0f172a] ${
                      outbound.orderStatus === 'pending'
                        ? 'bg-yellow-200'
                        : outbound.orderStatus === 'processing'
                        ? 'bg-yellow-500'
                        : outbound.orderStatus === 'canceled'
                        ? 'bg-red-500 text-white'
                        : outbound.orderStatus === 'shipping'
                        ? 'bg-blue-400'
                        : 'bg-green-400 text-white'
                    }`}
                  >
                    {outbound.orderStatus}
                  </span>
                </td>
                <td data-cell="action" role="cell">
                  <div className="flex justify-center items-center gap-x-3">
                    <RequirePermission
                      allowedPermissions={[PERMISSIONS.UpdateOutbound]}
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
                        onClick={() => handleUpdate(outbound)}
                      >
                        <RiEditFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-primary)]" />
                      </button>
                    </RequirePermission>
                    <RequirePermission
                      allowedPermissions={[PERMISSIONS.DeleteOutbound]}
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
                        onClick={() => showDeleteDialog(outbound)}
                      >
                        <MdDelete />
                      </button>
                    </RequirePermission>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );

    return content;
  };

  return (
    <>
      <div className="col-span-4 dark:shadow-none overflow-auto rounded-lg bg-slate-200/50 dark:bg-slate-900 px-2 sm:px-10 pb-5 pt-5 min-h-[390px] self-start">
        <div id="inventory-table">
          <div className="flex justify-center sm:justify-between items-center mb-5">
            <h1 className="hidden sm:block font-bold text-xl">
              Outbound Order List
            </h1>
            <PaginatorWrapper
              page={page}
              rows={rowsPerPage}
              setPage={setPage}
              setRows={setRowsPerPage}
              totalRecords={totalOutboundCount}
            />
          </div>
          {getContent()}
          <div className="flex justify-center sm:justify-end items-center mt-5">
            <PaginatorWrapper
              page={page}
              rows={rowsPerPage}
              setPage={setPage}
              setRows={setRowsPerPage}
              totalRecords={totalOutboundCount}
            />
          </div>
        </div>

        <div className="lg:col-span-2 sm:order-first lg:order-last hidden lg:sticky top-[6rem] self-start sm:flex lg:flex-col gap-8">
          {/* <OverviewCard
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
          /> */}
        </div>
      </div>
    </>
  );
};

export default OutboundTable;
