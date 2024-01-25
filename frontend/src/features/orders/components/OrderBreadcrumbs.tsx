import { TbArrowBadgeRightFilled } from 'react-icons/tb';
import { NavLink, useLocation } from 'react-router-dom';

const OrderBreadcrumbs = () => {
  const { pathname } = useLocation();
  const pathnames = pathname
    .split('/')
    .filter((x) => x !== 'orders' && x !== '');

  return (
    <>
      <div className="breadcrumbs flex items-center gap-x-1">
        <p className="text-gray-500">Orders</p>
        {pathnames.map((path, index) => {
          const routeTo = `/orders/${pathnames.slice(0, index + 1).join('/')}`;

          return (
            <p key={path} className="flex items-center gap-x-1">
              <span className="text-gray-500">
                <TbArrowBadgeRightFilled />
              </span>
              <NavLink to={routeTo} end className="link capitalize">
                {path}
              </NavLink>
            </p>
          );
        })}
      </div>
    </>
  );
};

export default OrderBreadcrumbs;
