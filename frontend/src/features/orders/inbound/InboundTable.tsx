import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { RiEditFill } from 'react-icons/ri';
import { selectInbound, setPaginatedInbounds } from '..';
import { PaginatorWrapper, RequirePermission } from '../../../components';
import PERMISSIONS from '../../../data/permissions';
import { useAppSelector, useFetch } from '../../../hooks';
import { selectProduct, setAllProducts } from '../../products';

interface InboundTableProps extends TableProps {
  setDeleteVisible: (visible: boolean) => void;
  setInboundItem: (item: InboundOrderProps | null) => void;
  setEditVisible: (visible: boolean) => void;
}

const InboundTable: React.FC<InboundTableProps> = ({
  page,
  setPage,
  setDeleteVisible,
  setInboundItem,
  setEditVisible,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { paginatedInbounds, totalInboundCount } =
    useAppSelector(selectInbound);

  const { allProducts } = useAppSelector(selectProduct);

  // fetch all products
  const { fetchData: fetchAllProducts } = useFetch('/product', setAllProducts);

  // get product name
  const getProductName = (productId: number) => {
    const product = allProducts?.find((p) => p.id === productId);
    return product ? product.name : null;
  };

  // fetch paginated list of outbound orders
  const { loading, fetchData: fetchPaginatedInbounds } = useFetch(
    `/inbounds?page=${page + 1}&pageSize=${rowsPerPage}`,
    setPaginatedInbounds
  );

  const handleUpdate = (item: InboundOrderProps) => {
    setInboundItem(item);
    setEditVisible(true);
  };

  const showDeleteDialog = (item: InboundOrderProps) => {
    setDeleteVisible(true);
    setInboundItem(item);
    setEditVisible(false);
  };

  useEffect(() => {
    fetchPaginatedInbounds();
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const getContent = () => {
    const content = (
      <table className="w-full">
        <thead role="rowgroup">
          <tr className="text-left bg-slate-300 dark:bg-slate-700" role="row">
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
          {!paginatedInbounds ? (
            <tr role="row">
              <td colSpan={6} className="text-center" role="cell">
                No inbound order available. Create one!
              </td>
            </tr>
          ) : paginatedInbounds?.length === 0 ? (
            <tr role="row">
              <td colSpan={6} className="text-center" role="cell">
                No inbound order found
              </td>
            </tr>
          ) : (
            paginatedInbounds?.map((inbound) => (
              <tr key={inbound.id} role="row">
                <td
                  data-cell="created by"
                  role="cell"
                  className="truncate hidden xl:table-cell"
                >
                  {getProductName(inbound.productId)}
                </td>
                <td
                  data-cell="created by"
                  role="cell"
                  className="truncate hidden xl:table-cell"
                >
                  {inbound.quantity}
                </td>
                <td
                  data-cell="total products"
                  role="cell"
                  className="hidden sm:table-cell text-center"
                >
                  <span
                    className={`font-medium text-xs  px-2 py-1 rounded-full dark:text-[#0f172a] ${
                      inbound.orderStatus === 'pending'
                        ? 'bg-yellow-200'
                        : inbound.orderStatus === 'processing'
                        ? 'bg-yellow-500'
                        : inbound.orderStatus === 'canceled'
                        ? 'bg-red-500 text-white'
                        : inbound.orderStatus === 'shipping'
                        ? 'bg-blue-400'
                        : 'bg-green-400 text-white'
                    }`}
                  >
                    {inbound.orderStatus}
                  </span>
                </td>
                <td data-cell="action" role="cell">
                  <div className="flex justify-center items-center gap-x-3">
                    <RequirePermission
                      allowedPermissions={[PERMISSIONS.UpdateInbound]}
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
                        onClick={() => handleUpdate(inbound)}
                      >
                        <RiEditFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-primary)]" />
                      </button>
                    </RequirePermission>
                    <RequirePermission
                      allowedPermissions={[PERMISSIONS.DeleteInbound]}
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
                        onClick={() => showDeleteDialog(inbound)}
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
    <div className="col-span-4 dark:shadow-none overflow-auto rounded-lg bg-slate-200/50 dark:bg-slate-900 px-2 sm:px-10 pb-5 pt-5 min-h-[390px] self-start">
      <div id="inventory-table">
        <div className="flex justify-center sm:justify-between items-center mb-5">
          <h1 className="hidden sm:block font-bold text-xl">
            Inbound Order List
          </h1>
          <PaginatorWrapper
            page={page}
            rows={rowsPerPage}
            setPage={setPage}
            setRows={setRowsPerPage}
            totalRecords={totalInboundCount}
          />
        </div>
        {getContent()}
        <div className="flex justify-center sm:justify-end items-center mt-5">
          <PaginatorWrapper
            page={page}
            rows={rowsPerPage}
            setPage={setPage}
            setRows={setRowsPerPage}
            totalRecords={totalInboundCount}
          />
        </div>
      </div>
    </div>
  );
};

export default InboundTable;
