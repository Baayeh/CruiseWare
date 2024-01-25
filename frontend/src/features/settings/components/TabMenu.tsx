import React from 'react';
import { TbArrowBadgeRightFilled } from 'react-icons/tb';
import { NavLink, useLocation } from 'react-router-dom';

const TabMenu = () => {
  const { pathname } = useLocation();
  return (
    <ul className="flex items-center gap-x-2">
      <li className="text-gray-500">Settings</li>
      <li>
        <span className="text-gray-500">
          <TbArrowBadgeRightFilled />
        </span>
      </li>
      <li>
        <NavLink
          to="/settings/roles"
          className={`border px-2 py-1 rounded-[5px] transition-all duration-300 ease-in-out ${
            pathname === '/settings/roles'
              ? 'border-[#ff5722] text-[color:var(--accent-primary)]'
              : 'border-[color:var(--border-color)] text-gray-500 hover:border-gray-400 dark:hover:border-gray-700'
          }`}
          end
        >
          Roles
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/settings/permissions"
          className={`border px-2 py-1 rounded-[5px] transition-all duration-300 ease-in-out ${
            pathname === '/settings/permissions'
              ? 'border-[#ff5722] text-[color:var(--accent-primary)]'
              : 'border-[color:var(--border-color)] text-gray-500 hover:border-gray-400 dark:hover:border-gray-700'
          }`}
          end
        >
          Permissions
        </NavLink>
      </li>
    </ul>
  );
};

export default TabMenu;
