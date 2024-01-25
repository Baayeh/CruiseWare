import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/Orders.scss';
import { RequirePermission, TempSearchFilter } from '../../../components';
import PERMISSIONS from '../../../data/permissions';
import {
  DeleteOutboundOrder,
  OrderBreadcrumbs,
  OutboundTable,
  UpdateOutboundOrder,
  selectOutbound,
  setAllOutbounds,
  setPaginatedOutbounds,
  setSearchResult,
} from '../../../features/orders';
import { useAppSelector, useFetch } from '../../../hooks';

const OutboundOrders = () => {
  const [page, setPage] = useState<number>(0);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [outboundItem, setOutboundItem] = useState<OutboundOrderProps | null>(
    null
  );
  const navigate = useNavigate();

  const { allOutbounds } = useAppSelector(selectOutbound);
  const { fetchData: fetchAllOutbounds } = useFetch(
    '/outbounds',
    setAllOutbounds
  );

  const { fetchData } = useFetch(
    `/outbounds?page=${page}&pageSize=${10}`,
    setPaginatedOutbounds
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchAllOutbounds();
  }, []);

  return (
    <section className="outbound relative mb-10">
      <div className="mt-3 mb-6 p-4 rounded-lg border border-[color:var(--border-color)] flex justify-center sm:justify-between sticky top-0 bg-[color:var(--primary-bg)] z-20 items-center">
        <OrderBreadcrumbs />
        <div className="flex gap-x-4">
          <RequirePermission allowedPermissions={[PERMISSIONS.CreateOutbound]}>
            <button
              type="button"
              className="text-[color:var(--text-dark)] bg-[color:var(--accent-primary)] px-3 py-2 rounded-lg text-sm flex justify-center items-center gap-x-1 hover:bg-orange-600 transition-colors duration-300 ease-in-out"
              onClick={() => navigate('/orders/outbound/new')}
              title="Create Outbound Order"
            >
              <MdAdd />
              <span className="hidden lg:flex">New Outbound Order</span>
            </button>
          </RequirePermission>
          <TempSearchFilter
            title="an outbound order"
            feature="outboundOrder"
            outbounds={allOutbounds}
            dispatchAction={setSearchResult}
            resetMethod={fetchData}
          />
        </div>
      </div>

      <div className="lg:grid grid-cols-6 gap-4">
        <OutboundTable
          page={page}
          setPage={setPage}
          setDeleteVisible={setDeleteVisible}
          setOutboundItem={setOutboundItem}
          setEditVisible={setEditVisible}
        />
        <UpdateOutboundOrder
          outboundItem={outboundItem}
          setOutboundItem={setOutboundItem}
          setPage={setPage}
          setVisible={setEditVisible}
          visible={editVisible}
        />
      </div>

      {deleteVisible && (
        <DeleteOutboundOrder
          outboundItem={outboundItem}
          visible={deleteVisible}
          setVisible={setDeleteVisible}
          setPage={setPage}
          position="bottom"
        />
      )}
    </section>
  );
};

export default OutboundOrders;
