import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { PaginatorWrapper } from '../../../../components';
import { useAppDispatch, useAppSelector, useFetch } from '../../../../hooks';
import {
  selectProduct,
  setPaginatedProducts,
  setStateIfEmpty,
} from '../../../products';

interface OutboundProductTableProps {
  page: number;
  setPage: (page: number) => void;
  productItems: NewOutboundProduct[] | null;
  setItem: (item: ProductProps) => void;
  setShowAddDialog: (showAddDialog: boolean) => void;
  setProductItems: (productItems: NewOutboundProduct[]) => void;
}

const OutboundProductTable: React.FC<OutboundProductTableProps> = ({
  page,
  setPage,
  productItems,
  setItem,
  setProductItems,
  setShowAddDialog,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { paginatedProducts, totalProductCount } =
    useAppSelector(selectProduct);
  const dispatch = useAppDispatch();

  const { data, error, fetchData, resetState } = useFetch(
    `/product/updatedAt/desc?page=${page + 1}&pageSize=${rowsPerPage}`,
    setPaginatedProducts
  );

  const showDialog = (item: ProductProps) => {
    setShowAddDialog(true);
    setItem(item);
  };

  const isItemInArray = (
    productIdToCheck: number,
    inventoryIdToCheck: number
  ) => {
    return productItems!.some((item) => {
      return (
        item.product.id === productIdToCheck &&
        item.product.inventoryId === inventoryIdToCheck
      );
    });
  };

  // Function to remove an item with specific productID and inventoryID from the array
  const removeItemFromProductItems = (
    productIdToRemove: number,
    inventoryIdToRemove: number
  ) => {
    const updatedProductItems = productItems!.filter((item) => {
      return !(
        item.product.id === productIdToRemove &&
        item.product.inventoryId === inventoryIdToRemove
      );
    });

    setProductItems(updatedProductItems);
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (!data && error) {
      dispatch(setStateIfEmpty());
      resetState();
    }
  }, [data, error, resetState]);

  const getContent = () => {
    const content = (
      <>
        <table className="w-full">
          <thead role="rowgroup">
            <tr role="row" className="text-left bg-slate-300 dark:bg-slate-700">
              <th role="columnheader">Product Name</th>
              <th role="columnheader" className="hidden xl:table-cell">
                Description
              </th>
              <th role="columnheader" className="hidden sm:table-cell">
                Quantity
              </th>
              <th role="columnheader" className="text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {!paginatedProducts || paginatedProducts?.length === 0 ? (
              <tr role="row">
                <td colSpan={6} className="text-center" role="cell">
                  No product available.{' '}
                  <Link
                    to="/products"
                    className="underline hover:text-[var(--text-secondary)]"
                  >
                    Create one!
                  </Link>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
                return (
                  <tr key={product.id} role="row">
                    <td data-cell="name" role="cell">
                      {product.name}
                    </td>
                    <td data-cell="description" role="cell">
                      {product.description}
                    </td>
                    <td data-cell="quantity" role="cell">
                      {product.quantity}
                    </td>
                    <td data-cell="actions" role="cell">
                      <div className="flex justify-center items-center gap-x-3">
                        {isItemInArray(product.id, product.inventoryId) ? (
                          <button
                            type="button"
                            title="Remove from list"
                            className="col-span-1 p-2 rounded-md bg-red-600 text-white hover:bg-red-800 transition-colors duration-300 ease-in-out text-xs sm:text-md"
                            onClick={() =>
                              removeItemFromProductItems(
                                product.id,
                                product.inventoryId
                              )
                            }
                          >
                            <MdDelete />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Add to Outbound"
                            className="col-span-1 p-2 group rounded-md border border-[color:var(--accent-primary)] text-white hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out text-xs sm:text-md"
                            onClick={() => showDialog(product)}
                          >
                            <AiOutlinePlus className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-primary)]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </>
    );

    return content;
  };

  return (
    <div className="col-span-4 dark:shadow-none overflow-auto rounded-lg bg-slate-200/50 dark:bg-slate-900 px-2 sm:px-10 pb-5 pt-5 min-h-[390px] self-start">
      <div className="flex justify-center sm:justify-between items-center mb-5">
        <h1 className="hidden sm:block font-bold text-xl">Add a product</h1>
        <PaginatorWrapper
          page={page}
          rows={rowsPerPage}
          setPage={setPage}
          setRows={setRowsPerPage}
          totalRecords={totalProductCount}
        />
      </div>
      {getContent()}
    </div>
  );
};

export default OutboundProductTable;
