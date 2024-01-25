import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useRef } from 'react';
import { BiSolidHome } from 'react-icons/bi';
import { CgOrganisation } from 'react-icons/cg';
import { FaUserEdit, FaUsers } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import { selectAuth } from '../../authentication';

/**
 * Interface that defines the properties for the AccountNav component.
 * @interface AccountNavProps
 *
 * @property {number} activeTab - The currently active tab.
 * @property {Function} setActiveTab - Function to set the active tab.
 */
interface AccountNavProps {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
}

/**
 * Renders the account navigation component.
 * @component
 * @implements {AccountNavProps}
 *
 * @param {AccountNavProps} activeTab - The currently active tab.
 * @param {Function} setActiveTab - Function to set the active tab.
 * @return {ReactElement} The account navigation component.
 */
const AccountNav: React.FC<AccountNavProps> = ({ activeTab, setActiveTab }) => {
  const menu = useRef<Menu>(null);
  const { user } = useAppSelector(selectAuth);

  const items: MenuItem[] = [
    {
      label: 'Company Profile',
      icon: (
        <span className="mr-2">
          <ImProfile />
        </span>
      ),
      command: () => {
        setActiveTab(1);
      },
    },
    {
      label: 'Users',
      icon: (
        <span className="mr-2">
          <FaUsers />
        </span>
      ),
      url: '/admin/users',
    },
    {
      label: 'Roles & Permissions',
      icon: 'pi pi-th-large',
      url: '/admin/roles',
      style: {
        fontSize: '0.9rem',
      },
    },
  ];

  return (
    <nav
      className={`${
        user?.role === 'superadmin' || user?.role === 'admin'
          ? 'sm:h-[18rem] lg:h-[25rem]'
          : 'h-[8rem]'
      } account-nav fixed w-[20rem] sm:border rounded-md  sm:p-4 sm:shadow`}
    >
      <ul className="flex justify-around sm:flex-col sm:items-start sm:gap-y-4 items-center">
        <li className="w-full">
          <button
            type="button"
            className={`${
              activeTab === 0 ? 'active_tab' : ''
            } py-1 px-2 rounded-md flex items-center gap-x-2 hover:bg-[color:var(--border-color)] transition-colors duration-300 ease-in-out w-full sm:py-2 lg:p-3 lg:text-lg`}
            onClick={() => setActiveTab(0)}
          >
            <span className="">
              <BiSolidHome />
            </span>
            <span>Home</span>
          </button>
        </li>
        <li className="sm:w-full">
          <div className="hidden sm:block">
            <h3 className="uppercase font-semibold">Personal</h3>

            <ul className="ml-2 mt-2">
              <li className="w-full">
                <button
                  type="button"
                  className={`${
                    activeTab === 1 ? 'active_tab' : ''
                  } py-1 px-2 rounded-md flex items-center gap-x-2 hover:bg-[color:var(--border-color)] transition-colors duration-300 ease-in-out w-full sm:py-2 lg:p-3 lg:text-lg`}
                  onClick={() => setActiveTab(1)}
                >
                  <span className="">
                    <FaUserEdit />
                  </span>
                  <span>Personal Info</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="sm:hidden">
            <button
              type="button"
              className={`${
                activeTab === 1 ? 'active_tab' : ''
              } rounded-md flex items-center gap-x-2 hover:bg-[color:var(--border-color)] transition-colors duration-300 ease-in-out w-full py-2 px-2 text-sm`}
              onClick={() => setActiveTab(1)}
            >
              <span className="">
                <FaUserEdit />
              </span>
              <span>Personal Info</span>
            </button>
          </div>
        </li>
        {user?.role === 'superadmin' || user?.role === 'admin' ? (
          <li className="sm:w-full">
            <div className="hidden sm:block">
              <h3 className="uppercase font-semibold">Organization</h3>

              <ul className="ml-2 grid gap-2 mt-2">
                <li>
                  <button
                    type="button"
                    className={`${
                      activeTab === 2 ? 'active_tab' : ''
                    } py-1 px-2 rounded-md hidden sm:flex items-center gap-x-2 hover:bg-[color:var(--border-color)] transition-colors duration-300 ease-in-out w-full sm:py-2 lg:p-3`}
                    onClick={() => setActiveTab(2)}
                  >
                    <span>
                      <ImProfile />
                    </span>
                    <span>Company Profile</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/settings/users"
                    className="py-1 px-2 rounded-md hidden sm:flex items-center gap-x-2 hover:bg-[color:var(--border-color)] transition-colors duration-300 ease-in-out w-full sm:py-2 lg:p-3"
                  >
                    <span>
                      <FaUsers />
                    </span>
                    <span>Users</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/roles"
                    className="py-1 px-2 rounded-md hidden sm:flex items-center gap-x-2 hover:bg-[color:var(--border-color)] transition-colors duration-300 ease-in-out w-full sm:py-2 lg:p-3"
                  >
                    <i className="pi pi-th-large" />
                    <span>Roles & Permissions</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="sm:hidden">
              <button
                type="button"
                className={`${
                  activeTab === 1 ? 'active_tab' : ''
                } py-2 px-3 rounded-md flex items-center gap-x-2 hover:bg-[color:var(--border-color)] transition-colors duration-300 ease-in-out text-sm`}
                onClick={(event) => menu.current?.toggle(event)}
                aria-controls="popup_menu"
                aria-haspopup
              >
                <span>
                  <CgOrganisation />
                </span>
                <span>Organization</span>
              </button>
            </div>
          </li>
        ) : null}
      </ul>
      <Menu
        model={items}
        popup
        ref={menu}
        id="popup_menu"
        popupAlignment="right"
      />
    </nav>
  );
};

export default AccountNav;
