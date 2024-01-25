import { useTheme } from '@mui/material';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BsBoxSeamFill, BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
import { IoNotifications, IoSettings } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { asyncToggleTheme, selectTheme } from '../../app/themeSlice';
import { selectAuth, setIsLocked } from '../../features/authentication';
import { useAuth } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import AccountBtn from './AccountBtn';

/**
Props for a task bar component.
* 
* @interface TaskBarProps
* @property {() => void} toggleMainDialog - Function to toggle the main dialog.
* @property {() => void} toggleNotificationDialog - Function to toggle the notification dialog.
*/
interface TaskBarProps {
  toggleMainDialog: () => void;
  toggleNotificationDialog: () => void;
}

/**
 * Renders the TaskBar component that displays a theme switcher, account settings button,
 * settings link, notification area button, and a main dialog button.
 *
 * @param {TaskBarProps} toggleMainDialog - A function to toggle the main dialog
 * @param {TaskBarProps} toggleNotificationDialog - A function to toggle the notification dialog
 * @return {ReactElement} A React component that displays the TaskBar
 */
const TaskBar: React.FC<TaskBarProps> = ({
  toggleMainDialog,
  toggleNotificationDialog,
}) => {
  const { darkMode } = useAppSelector(selectTheme);
  const element = document.documentElement;
  const root = document.querySelector(':root');
  const account_menu = useRef<Menu>(null);
  const settings_menu = useRef<Menu>(null);
  const dispatch = useAppDispatch();
  const muiTheme = useTheme();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const { message, loading, logoutUser, error, auth, resetState } = useAuth();

  const { user } = useAppSelector(selectAuth);

  const formatRoleName = () => {
    const role = user?.role;
    return role === 'superadmin' ? 'Super Admin' : role;
  };

  const handleLogout = async () => {
    await logoutUser(refreshToken);
    setRequesting(true);
  };

  useEffect(() => {
    if (message && requesting) {
      toast.success(message);
      localStorage.clear();
      resetState();
      navigate('/login');
    }
  }, [message, requesting, resetState]);

  useEffect(() => {
    if (error && !auth && requesting) {
      toast.error(error);
      resetState();
    }
  }, [error, auth, resetState]);

  const account_items: MenuItem[] = [
    {
      className: 'account-menu',
      label: 'Account settings',
      icon: 'pi pi-user',
      command: () => {
        navigate('/profile');
      },
    },
    {
      className: 'account-menu',
      label: 'Lock',
      icon: 'pi pi-lock',
      command: () => {
        dispatch(setIsLocked(true));
        document.body.classList.add('overflow-hidden');
      },
    },
    {
      className: 'account-menu',
      label: loading ? 'Logging out...' : 'Logout',
      icon: 'pi pi-power-off',
      command: () => {
        handleLogout();
      },
    },
  ];

  const settings_items: MenuItem[] = [
    {
      className: 'settings-menu',
      label: 'Manage Users',
      icon: 'pi pi-users',
      command: () => {
        navigate('/settings/users');
      },
    },
    {
      className: 'settings-menu',
      label: 'Roles & Permissions',
      icon: 'pi pi-th-large',
      command: () => {
        navigate('/settings/roles');
      },
    },
  ];

  const handleThemeChange = () => {
    dispatch(asyncToggleTheme());
    if (!darkMode) {
      root?.setAttribute('color-scheme', 'dark');
    } else {
      root?.setAttribute('color-scheme', 'light');
    }
  };

  useEffect(() => {
    switch (muiTheme.palette.mode) {
      case 'dark':
        element.classList.add('dark');
        break;
      case 'light':
        element.classList.remove('dark');
        break;
      default:
        break;
    }
  }, [muiTheme.palette.mode]);

  return (
    <section id="task-bar">
      <div className="flex items-center justify-between sm:w-full lg:w-auto lg:gap-x-[15rem]">
        <div className="theme-switcher">
          <button
            type="button"
            title={
              muiTheme.palette.mode === 'light' ? 'Dark Mode' : 'Light Mode'
            }
            onClick={handleThemeChange}
            className="p-2 border-2 border-[color:var(--border-color)] rounded-full bg-[color:var(--border-color)] hover:border-[color:var(--accent-primary)] hover:bg-transparent hover:text-[color:var(--accent-primary)] transition duration-300 ease-in-out"
          >
            {muiTheme.palette.mode === 'light' ? (
              <span>
                <BsFillMoonFill />
              </span>
            ) : (
              <span>
                <BsFillSunFill />
              </span>
            )}
          </button>
        </div>

        <div className="flex-row-reverse items-center hidden sm:flex lg:flex-row gap-x-7">
          <Menu
            model={account_items}
            popup
            ref={account_menu}
            id="popup_menu_right"
          />
          <AccountBtn
            menu={account_menu}
            position="popup_menu_right"
            name={`${user?.firstName} ${user?.lastName}`}
            role={formatRoleName()}
          />

          <ul className="flex items-center super-admin-access gap-x-5">
            {user?.role === 'superadmin' || user?.role === 'admin' ? (
              <li>
                <Menu
                  model={settings_items}
                  popup
                  ref={settings_menu}
                  id="popup_menu_left"
                />
                <button
                  type="button"
                  className="flex items-center gap-x-2 px-2 py-2 rounded-md hover:bg-[var(--border-color)] transition-all duration-300 ease-in-out w-[2.6rem] lg:overflow-hidden lg:hover:w-[6.8rem]"
                  onClick={(e) => settings_menu.current?.toggle(e)}
                  aria-controls="popup_menu_left"
                  aria-haspopup
                >
                  <div>
                    <IoSettings
                      size={25}
                      className="text-[color:var(--text-secondary)]"
                    />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)] hidden lg:flex">
                    Settings
                  </span>
                </button>
              </li>
            ) : null}
            <li>
              <button
                type="button"
                className="flex items-center gap-x-2 px-2 py-2 rounded-md hover:bg-[var(--border-color)] transition-all duration-300 ease-in-out w-[2.6rem] lg:overflow-hidden lg:hover:w-[8.7rem]"
                onClick={toggleNotificationDialog}
              >
                <div>
                  <IoNotifications
                    size={25}
                    className="text-[color:var(--text-secondary)]"
                  />
                </div>
                <span className="text-sm text-[var(--text-secondary)] hidden lg:flex">
                  Notifications
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <button
        type="button"
        className="sm:hidden p-2 text-[color:var(--accent-primary)] text-2xl rounded-md hover:bg-[color:var(--border-color)] transition-colors duration-300 ease-in-out"
        onClick={toggleMainDialog}
      >
        <BsBoxSeamFill />
      </button>

      <div className="hidden lg:flex items-center text-end text-[color:var(--text-secondary)] text-sm gap-x-2">
        <p>
          <span className="font-semibold">&copy; Cruise Ware - v1.0</span> |
          Powered by Cruise
        </p>
      </div>
    </section>
  );
};
export default TaskBar;
