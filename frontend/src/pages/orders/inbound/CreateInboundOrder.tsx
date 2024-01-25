import { useEffect, useState } from 'react';
import '../../../assets/css/Orders.scss';
import { SearchFilter } from '../../../components';
import {
  AddProductDialog,
  InboundForm,
  InboundProductTable,
  OrderBreadcrumbs,
} from '../../../features/orders';
import {
  setPaginatedProducts,
  setSearchResult,
} from '../../../features/products';
import { useFetch } from '../../../hooks';

const CreateInboundOrder = () => {
  const [page, setPage] = useState<number>(0);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [productItems, setProductItems] = useState<NewOutboundProduct[]>([]);
  const [item, setItem] = useState<ProductProps | null>(null);

  const { fetchData: fetchPaginatedProducts } = useFetch(
    `/product/updatedAt/desc?page=${page}&pageSize=${10}`,
    setPaginatedProducts
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="outbound mb-10">
      <div className="mt-3 mb-6 p-4 rounded-lg border border-[color:var(--border-color)] flex items-center justify-center sm:justify-between sticky top-0 bg-[color:var(--primary-bg)] z-20">
        <OrderBreadcrumbs />
        <SearchFilter
          title="a product"
          resetMethod={fetchPaginatedProducts}
          url="/product/search"
          dispatchAction={setSearchResult}
        />
      </div>

      <div className="grid grid-cols-7 mt-5 gap-4">
        <InboundProductTable
          page={page}
          setPage={setPage}
          productItems={productItems}
          setProductItems={setProductItems}
          setItem={setItem}
          setShowAddDialog={setShowAddDialog}
        />
        <InboundForm products={productItems} />
      </div>

      {showAddDialog && (
        <AddProductDialog
          visible={showAddDialog}
          setVisible={setShowAddDialog}
          item={item}
          productItems={productItems}
          setProductItems={setProductItems}
        />
      )}
    </section>
  );
};

export default CreateInboundOrder;
