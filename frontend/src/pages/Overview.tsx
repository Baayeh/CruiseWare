import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { lazy, useEffect, useState } from 'react';
import { BsArrowDownLeftSquare, BsArrowUpRightSquare } from 'react-icons/bs';
import { FaOpencart, FaUsers } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import { TbCategory2 } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Overview.scss';
import { OverviewCard, RequirePermission } from '../components';
import PERMISSIONS from '../data/permissions';
import {
  selectInventory,
  setPaginatedInventories,
} from '../features/inventories';
import {
  selectInbound,
  selectOutbound,
  setPaginatedInbounds,
  setPaginatedOutbounds,
} from '../features/orders';
import { selectSupplier, setAllSuppliers } from '../features/suppliers';
import { useAppSelector, useFetch } from '../hooks';

const InventoryChart = lazy(() =>
  import('../features/overview').then((module) => {
    return { default: module.InventoryChart };
  })
);

const StockLevelChart = lazy(() =>
  import('../features/overview').then((module) => {
    return { default: module.StockLevelChart };
  })
);

/**
 * Renders the Overview component.
 *
 * @return {JSX.Element} The rendered Overview component.
 */
const Overview = () => {
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const { totalInventoryCount, totalProductCount } =
    useAppSelector(selectInventory);
  const { totalInboundCount } = useAppSelector(selectInbound);
  const { totalOutboundCount } = useAppSelector(selectOutbound);
  const { allSuppliers } = useAppSelector(selectSupplier);

  const { fetchData: fetchPaginatedInbounds } = useFetch(
    `inbounds/updatedAt/desc?page=${1}&pageSize=${10}`,
    setPaginatedInbounds
  );

  const { fetchData: fetchPaginatedOutbounds } = useFetch(
    '/outbounds?page=1&pageSize=10',
    setPaginatedOutbounds
  );

  const { fetchData: fetchPaginatedInventories } = useFetch(
    `/inventory?page=${1}&pageSize=${10}`,
    setPaginatedInventories
  );

  const { fetchData: fetchAllSuppliers } = useFetch(
    '/supplier',
    setAllSuppliers
  );

  useEffect(() => {
    fetchPaginatedInventories();
    fetchPaginatedInbounds();
    fetchPaginatedOutbounds();
    fetchAllSuppliers();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 300);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderSuppliers = allSuppliers && allSuppliers.slice(0, 3);

  return (
    <section id="overview">
      <section className="summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <OverviewCard
          title="Total Inventories"
          icon={MdOutlineInventory2}
          numCreated={totalInventoryCount}
          createdKeyword="created"
        />
        <OverviewCard
          title="Total Products"
          icon={FaOpencart}
          numCreated={totalProductCount}
          createdKeyword="in stock"
        />
        <OverviewCard
          title="Total Categories"
          icon={TbCategory2}
          numCreated={9}
          createdKeyword="created"
        />
        <OverviewCard
          title="Total Users"
          icon={FaUsers}
          numCreated={33}
          createdKeyword="created"
        />
      </section>

      <section className="suppliers-orders my-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="orders-card w-full p-5 rounded-xl border border-[color:var(--border-color)] dark:bg-[color:var(--secondary-bg)]">
          <h2 className="text-sm">Orders</h2>
          <div className="card-content mt-4 mb-5 lg:mb-0 flex items-center gap-x-5 h-full">
            <RequirePermission
              allowedPermissions={[
                PERMISSIONS.CreateInbound,
                PERMISSIONS.UpdateInbound,
                PERMISSIONS.DeleteInbound,
                PERMISSIONS.ReadInbound,
              ]}
              element={
                <div className="inbound-card w-full md:h-[12rem] p-5 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--primary-bg)] sm:flex flex-col justify-center">
                  <BsArrowDownLeftSquare className="text-[color:var(--accent-primary)] text-4xl lg:text-5xl" />
                  <div>
                    <p className="text-sm mt-4 text-[color:var(--text-secondary)] sm:w-16 lg:w-auto mb-3">
                      Inbound Orders
                    </p>
                    <h3 className="font-bold text-4xl">
                      {totalInboundCount === 0
                        ? 0
                        : totalInboundCount < 10
                        ? `0${totalInboundCount}`
                        : totalInboundCount}
                    </h3>
                  </div>
                </div>
              }
            >
              <div
                className="inbound-card w-full md:h-[12rem] p-5 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--primary-bg)] sm:flex flex-col justify-center hover:cursor-pointer hover:border-[color:var(--accent-primary)]"
                onClick={() => navigate('/orders/inbound')}
              >
                <BsArrowDownLeftSquare className="text-[color:var(--accent-primary)] text-4xl lg:text-5xl" />
                <div>
                  <p className="text-sm mt-4 text-[color:var(--text-secondary)] sm:w-16 lg:w-auto mb-3">
                    Inbound Orders
                  </p>
                  <h3 className="font-bold text-4xl">
                    {totalInboundCount === 0
                      ? 0
                      : totalInboundCount < 10
                      ? `0${totalInboundCount}`
                      : totalInboundCount}
                  </h3>
                </div>
              </div>
            </RequirePermission>

            <RequirePermission
              allowedPermissions={[
                PERMISSIONS.CreateOutbound,
                PERMISSIONS.ReadOutbounds,
                PERMISSIONS.UpdateOutbound,
                PERMISSIONS.DeleteOutbound,
              ]}
              element={
                <div className="outbound-card w-full md:h-[12rem] p-5 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--primary-bg)] sm:flex flex-col justify-center">
                  <BsArrowUpRightSquare className="text-[color:var(--accent-primary)] text-4xl lg:text-5xl" />
                  <div>
                    <p className="text-sm mt-4 text-[color:var(--text-secondary)] mb-3">
                      Outbound Orders
                    </p>
                    <h3 className="font-bold text-4xl">
                      {totalOutboundCount === 0
                        ? 0
                        : totalOutboundCount < 10
                        ? `0${totalOutboundCount}`
                        : totalOutboundCount}
                    </h3>
                  </div>
                </div>
              }
            >
              <div
                className="outbound-card w-full md:h-[12rem] p-5 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--primary-bg)] sm:flex flex-col justify-center hover:cursor-pointer hover:border-[color:var(--accent-primary)]"
                onClick={() => navigate('/orders/outbound')}
              >
                <BsArrowUpRightSquare className="text-[color:var(--accent-primary)] text-4xl lg:text-5xl" />
                <div>
                  <p className="text-sm mt-4 text-[color:var(--text-secondary)] mb-3">
                    Outbound Orders
                  </p>
                  <h3 className="font-bold text-4xl">
                    {totalOutboundCount === 0
                      ? 0
                      : totalOutboundCount < 10
                      ? `0${totalOutboundCount}`
                      : totalOutboundCount}
                  </h3>
                </div>
              </div>
            </RequirePermission>
          </div>
        </div>

        <div className="suppliers-card w-full p-5 rounded-xl border border-[color:var(--border-color)]">
          <div className="suppliers-card-header flex justify-between items-center text-sm">
            <h2 className="font-semibold">Suppliers</h2>
            <RequirePermission
              allowedPermissions={[
                PERMISSIONS.CreateInbound,
                PERMISSIONS.UpdateInbound,
                PERMISSIONS.DeleteInbound,
                PERMISSIONS.ReadInbound,
              ]}
            >
              <Link
                to="/suppliers"
                className="flex items-center gap-x-3 hover:text-[color:var(--accent-primary)] transition-all duration-300"
              >
                <span>View all</span>
              </Link>
            </RequirePermission>
          </div>

          <div className="suppliers-card-content">
            <DataTable id="suppliers-table-overview" value={renderSuppliers!}>
              <Column field="name" header="Name" />
              <Column field="email" header="Email" />
              <Column field="phone" header="Phone" />
            </DataTable>
          </div>
        </div>
      </section>

      {isMounted && (
        <div id="charts">
          <InventoryChart />
          <StockLevelChart />
        </div>
      )}
    </section>
  );
};

export default Overview;
