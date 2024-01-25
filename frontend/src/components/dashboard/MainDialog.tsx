import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { classNames } from 'primereact/utils';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPowerOff, FaUsersCog } from 'react-icons/fa';
import { IoWarning } from 'react-icons/io5';
import { RxCaretRight, RxDashboard } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import { notificationsList } from '../../data/data';
import { selectAuth } from '../../features/authentication';
import { useAuth } from '../../hooks';
import { useAppSelector } from '../../hooks/useStore';
import AccountBtn from './AccountBtn';

/**
 * Renders the MainDialog component which displays a notifications dialog with lists of notifications.
 *
 * @param {MainDialogProps} visible - A boolean value indicating if the dialog is visible or not.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setVisible - A function that sets the visibility of the dialog.
 * @return {React.ReactNode} The MainDialog component.
 */
const MainDialog: React.FC<MainDialogProps> = ({ visible, setVisible }) => {
  const account_menu = useRef<Menu>(null);
  const navigate = useNavigate();
  const { user } = useAppSelector(selectAuth);
  const [requesting, setRequesting] = useState(false);
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const { data, loading, logoutUser, error, auth, resetState } = useAuth();

  const formatRoleName = () => {
    const role = user?.role;
    return role === 'superadmin' ? 'Super Admin' : role;
  };

  const account_items: MenuItem[] = [
    {
      className: 'account-menu',
      label: 'Account settings',
      icon: 'pi pi-user',
      command: () => {
        setVisible(false);
        navigate('/profile');
      },
    },
    {
      className: 'account-menu',
      label: 'Lock',
      icon: 'pi pi-lock',
      command: () => {
        console.log('Lock clicked');
      },
    },
    { separator: true },
    {
      command: () => {
        console.log('Manage Users clicked');
      },
      template: (_, options) => {
        return (
          <button
            type="button"
            onClick={(e) => options.onClick(e)}
            className={classNames(
              options.className,
              'w-full p-link flex gap-x-2 items-center'
            )}
          >
            <span>
              <FaUsersCog size={20} />
            </span>
            <span className="text-sm">Manage users</span>
          </button>
        );
      },
    },
    {
      command: () => {
        console.log('Roles & Permissions clicked');
      },
      template: (_, options) => {
        return (
          <button
            type="button"
            onClick={(e) => options.onClick(e)}
            className={classNames(
              options.className,
              'w-full p-link flex gap-x-2 items-center'
            )}
          >
            <span>
              <RxDashboard size={20} />
            </span>
            <span className="text-sm">Roles & Permissions</span>
          </button>
        );
      },
    },
  ];

  const acceptLogout = async () => {
    await logoutUser(refreshToken);
    setRequesting(true);
  };

  useEffect(() => {
    if (data && requesting) {
      // toast.success(data);
      console.log(data);
      resetState();
    }
  }, [data, requesting, resetState]);

  useEffect(() => {
    if (error && !auth && requesting) {
      toast.error(error);
      resetState();
    }
  }, [error, auth, resetState]);

  const confirmLogout = () => {
    confirmDialog({
      message: 'Are you sure you want to logout?',
      header: 'Confirm Logout',
      icon: <IoWarning />,
      acceptLabel: loading ? 'Logging out...' : 'Logout',
      rejectLabel: 'Cancel',
      acceptClassName: 'p-button-danger',
      accept: acceptLogout,
    });
  };

  const headerContent = (
    <div className="flex justify-between items-center">
      <h3>Notifications</h3>
    </div>
  );

  const footerContent = (
    <section className="flex justify-between items-center">
      <Menu
        model={account_items}
        popup
        ref={account_menu}
        id="popup_menu_left"
      />
      <AccountBtn
        menu={account_menu}
        position="popup_menu_right"
        name={`${user?.firstName} ${user?.lastName}`}
        role={formatRoleName()}
      />

      <ConfirmDialog />
      <div className="logout-action">
        <button
          type="button"
          className="text-[color:var(--text-primary)]"
          onClick={confirmLogout}
        >
          <FaPowerOff size={20} />
        </button>
      </div>
    </section>
  );

  return (
    <>
      <Dialog
        header={headerContent}
        visible={visible}
        position="bottom"
        onHide={() => setVisible(false)}
        footer={footerContent}
        draggable={false}
        resizable={false}
        maskClassName="taskbar-mask"
        id="taskbar-dialog"
      >
        <div className="notifications-body mt-4">
          {notificationsList.length > 0 ? (
            <>
              <ul role="list">
                {notificationsList.map((item) => (
                  <li key={item.title} className="mb-2">
                    <a
                      href="#"
                      className="flex items-center p-2 group hover:bg-gray-100 dark:hover:bg-slate-700 border-l-2 border-[color:var(--accent-primary)] transition duration-300 ease-in-out hover:border-r-2"
                    >
                      <div>
                        <h2 className="text-xs font-semibold group-hover:text-[color:var(--accent-primary)]">
                          {item.title}
                        </h2>
                        <p className="flex gap-x-1 text-xs text-[var(--text-secondary)]">
                          <span>{item.date}</span>
                          at
                          <span>{item.time}</span>
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="notification-action border-t pt-2">
                <Link
                  to="/notifications"
                  className="text-xs text-[color:var(--accent-primary)] flex justify-between items-center group"
                >
                  <span>View all notifications</span>
                  <RxCaretRight
                    size={20}
                    className="invisible group-hover:visible group-hover:translate-x-1 transition duration-300 ease-in-out"
                  />
                </Link>
              </div>
            </>
          ) : (
            <div className="no-notifications">
              <p className="text-xs text-[var(--text-secondary)]">
                No new notifications
              </p>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};
export default MainDialog;
