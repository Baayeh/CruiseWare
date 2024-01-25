import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { RequirePermission, TempSearchFilter } from '../../../components';
import PERMISSIONS from '../../../data/permissions';
import {
  DeleteInboundOrder,
  InboundTable,
  OrderBreadcrumbs,
  UpdateInboundOrder,
  selectInbound,
  setAllInbounds,
  setFoundInbound,
  setPaginatedInbounds,
} from '../../../features/orders';
import { useAppSelector, useFetch } from '../../../hooks';

const InboundOrders = () => {
  const [page, setPage] = useState<number>(0);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [inboundItem, setInboundItem] = useState<InboundOrderProps | null>(
    null
  );
  const navigate = useNavigate();

  const { allInbounds } = useAppSelector(selectInbound);
  const { fetchData: fetchAllInbounds } = useFetch('/inbounds', setAllInbounds);

  const { fetchData } = useFetch(
    `/inbounds/updatedAt/desc?page=${page}&pageSize=${10}`,
    setPaginatedInbounds
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchAllInbounds();
  }, []);

  return (
    <section className="outbound relative mb-10">
      <div className="mt-3 mb-6 p-4 rounded-lg border border-[color:var(--border-color)] flex items-center justify-center sm:justify-between sticky top-0 bg-[color:var(--primary-bg)] z-20">
        <OrderBreadcrumbs />
        <div className="flex gap-x-4">
          <RequirePermission allowedPermissions={[PERMISSIONS.CreateInbound]}>
            <button
              type="button"
              className="text-[color:var(--text-dark)] bg-[color:var(--accent-primary)] px-3 py-2 rounded-lg text-sm flex justify-center items-center gap-x-1 hover:bg-orange-600 transition-colors duration-300 ease-in-out"
              onClick={() => navigate('/orders/inbound/new')}
              title="Create Inbound Order"
            >
              <MdAdd />
              <span className="hidden lg:flex">New Inbound Order</span>
            </button>
          </RequirePermission>
          <TempSearchFilter
            title="an inbound order"
            feature="inboundOrder"
            inbounds={allInbounds}
            dispatchAction={setFoundInbound}
            resetMethod={fetchData}
          />
        </div>
      </div>

      <div className="lg:grid grid-cols-6 gap-4">
        <InboundTable
          page={page}
          setPage={setPage}
          setDeleteVisible={setDeleteVisible}
          setInboundItem={setInboundItem}
          setEditVisible={setEditVisible}
        />
        <UpdateInboundOrder
          inboundItem={inboundItem}
          setInboundItem={setInboundItem}
          setPage={setPage}
          setVisible={setEditVisible}
          visible={editVisible}
        />
      </div>

      {deleteVisible && (
        <DeleteInboundOrder
          inboundItem={inboundItem}
          visible={deleteVisible}
          setVisible={setDeleteVisible}
          setPage={setPage}
          position="bottom"
        />
      )}
    </section>
  );
};

export default InboundOrders;
