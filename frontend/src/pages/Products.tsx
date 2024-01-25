import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import '../assets/css/Products.scss';
import { RequirePermission, SearchFilter } from '../components';
import PERMISSIONS from '../data/permissions';
import {
  NewProduct,
  ProductsTable,
  setPaginatedProducts,
  setSearchResult,
} from '../features/products';
import { useFetch } from '../hooks';

const Products = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const { fetchData: fetchPaginatedProducts } = useFetch(
    `/product?page=${page}&pageSize=${10}`,
    setPaginatedProducts
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="products" className="relative">
      <div className="my-6 p-4 rounded-lg border border-[color:var(--border-color)] flex justify-center sm:justify-between sticky top-0 bg-[color:var(--primary-bg)] z-20">
        <div className="flex gap-x-4">
          <RequirePermission allowedPermissions={[PERMISSIONS.CreateProduct]}>
            <button
              type="button"
              className="text-[color:var(--text-dark)] bg-[color:var(--accent-primary)] px-3 py-2 rounded-lg text-sm flex items-center gap-x-2 hover:bg-orange-600 transition-colors duration-300 ease-in-out"
              onClick={() => setVisible(true)}
              title="Add a product"
            >
              <MdAdd />
              <span className="hidden lg:flex">New Product</span>
            </button>
          </RequirePermission>
          <SearchFilter
            title="a product"
            resetMethod={fetchPaginatedProducts}
            url="/product"
            dispatchAction={setSearchResult}
          />
        </div>
      </div>

      <ProductsTable page={page} setPage={setPage} />

      {visible && (
        <NewProduct
          visible={visible}
          setVisible={setVisible}
          setPage={setPage}
        />
      )}
    </section>
  );
};
export default Products;
