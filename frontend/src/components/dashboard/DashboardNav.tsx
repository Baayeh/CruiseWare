import { NavLink } from 'react-router-dom';
import { RequirePermission } from '..';
import PERMISSIONS from '../../data/permissions';

const navLinks = [
  {
    name: 'Overview',
    path: '/overview',
  },
  {
    name: 'Inventories',
    path: '/inventories',
  },
  {
    name: 'Products',
    path: '/products',
  },
  {
    name: 'Suppliers',
    path: '/suppliers',
  },
  {
    name: 'Receivers',
    path: '/receivers',
  },
  {
    name: 'Reports',
    path: '/reports',
  },
];

function getPermissionsForNavItem(name: string) {
  switch (name) {
    case 'Inventories':
      return [
        PERMISSIONS.CreateInventory,
        PERMISSIONS.DeleteInventory,
        PERMISSIONS.UpdateInventory,
      ];
    case 'Products':
      return [
        PERMISSIONS.CreateProduct,
        PERMISSIONS.DeleteProduct,
        PERMISSIONS.UpdateProduct,
      ];
    case 'Suppliers':
      return [
        PERMISSIONS.ReadSupplier,
        PERMISSIONS.UpdateSupplier,
        PERMISSIONS.CreateSupplier,
        PERMISSIONS.DeleteSupplier,
      ];
    case 'Receivers':
      return [
        PERMISSIONS.ReadReceiver,
        PERMISSIONS.CreateReceiver,
        PERMISSIONS.DeleteReceiver,
        PERMISSIONS.UpdateReceiver,
      ];
    default:
      return [];
  }
}

const DashboardNav = () => {
  return (
    <nav className="dashboard-nav">
      <ul className="nav-list flex gap-x-7 sm:gap-x-10 w-full py-3 overflow-x-auto">
        {navLinks.map(({ name, path }) => {
          const allowedPermissions = getPermissionsForNavItem(name);

          if (allowedPermissions.length > 0) {
            return (
              <RequirePermission
                allowedPermissions={allowedPermissions}
                key={name}
              >
                <li className="nav-item">
                  <NavLink
                    to={path}
                    end
                    className={({ isActive }) => (isActive ? 'nav-active' : '')}
                  >
                    {name}
                  </NavLink>
                </li>
              </RequirePermission>
            );
          } else {
            return (
              <li className="nav-item" key={name}>
                <NavLink
                  to={path}
                  end
                  className={({ isActive }) => (isActive ? 'nav-active' : '')}
                >
                  {name}
                </NavLink>
              </li>
            );
          }
        })}
      </ul>
    </nav>
  );
};
export default DashboardNav;
