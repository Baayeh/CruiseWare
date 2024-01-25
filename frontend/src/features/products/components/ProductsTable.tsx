import { useEffect, useState } from 'react';
import { selectProduct, setPaginatedProducts, setStateIfEmpty } from '..';
import { PaginatorWrapper } from '../../../components';
import { useAppDispatch, useAppSelector, useFetch } from '../../../hooks';
import ProductCard from './ProductCard';
import DeleteProduct from './dialogs/DeleteProduct';
import EditProduct from './dialogs/EditProduct';

/**
 * Renders a table of products based on the provided data and query.
 *
 * @param {ProductsTableProps} data - The data for the products table.
 * @return {React.ReactNode} The rendered table of products.
 */
const ProductsTable: React.FC<TableProps> = ({ page, setPage }) => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] =
    useState<boolean>(false);
  const [productItem, setProductItem] = useState<ProductProps | null>(null);

  const dispatch = useAppDispatch();

  const { paginatedProducts, totalProductCount } =
    useAppSelector(selectProduct);

  const { data, loading, error, fetchData, resetState } = useFetch(
    `/product?page=${page + 1}&pageSize=${rowsPerPage}`,
    setPaginatedProducts
  );

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (!data && error) {
      dispatch(setStateIfEmpty());
      resetState();
    }
  }, [data, error, resetState]);

  const showEditDialog = (item: ProductProps) => {
    setEditVisible(true);
    setProductItem(item);
  };

  const showDeleteDialog = (item: ProductProps) => {
    setIsDeleteDialogVisible(true);
    setProductItem(item);
  };

  const handleScroll = () => {
    const { scrollX, scrollY } = window;
    setScrollPosition({ x: scrollX, y: scrollY });
  };

  const getContent = () => {
    if (loading) {
      return <p className="text-center text-xl">Loading...</p>;
    }

    if (!paginatedProducts || paginatedProducts?.length === 0) {
      return (
        <p className="text-center text-xl">No product available. Create one!</p>
      );
    }

    if (paginatedProducts?.length === 0) {
      return <p className="text-center text-xl">Sorry, no products found</p>;
    } else {
      return (
        <section
          id="products-table"
          className="mb-6 my-7 grid sm:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          {paginatedProducts?.map((product) => (
            <ProductCard
              key={product.id}
              item={product}
              scrollPosition={scrollPosition}
              showEditDialog={showEditDialog}
              showDeleteDialog={showDeleteDialog}
            />
          ))}
        </section>
      );
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-center sm:justify-between items-center mb-5">
          <h1 className="hidden sm:block font-bold text-xl">Product List</h1>
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

      {editVisible && (
        <EditProduct
          visible={editVisible}
          setVisible={setEditVisible}
          item={productItem}
          setPage={setPage}
        />
      )}

      <DeleteProduct
        visible={isDeleteDialogVisible}
        setVisible={setIsDeleteDialogVisible}
        item={productItem}
        setPage={setPage}
        position="bottom"
      />
    </>
  );
};
export default ProductsTable;
