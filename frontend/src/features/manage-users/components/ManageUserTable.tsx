import { useEffect, useState } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { useAppSelector, useFetch } from '../../../hooks';
import { selectRole, setAllRoles } from '../../settings';

interface UsersTableProps {
  activeItem: UserProps | null;
  setActiveItem: (item: UserProps | null) => void;
  users: UserProps[];
}

const ManageUsersTable: React.FC<UsersTableProps> = ({
  activeItem,
  setActiveItem,
  users,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { allRoles } = useAppSelector(selectRole);
  const { fetchData } = useFetch('/roles', setAllRoles);

  // get role name
  const getRoleName = (roleID: number) => {
    const role = allRoles?.find((r) => r.id === roleID);
    return role ? role.name : null;
  };

  const showUserDetails = (user: UserProps) => {
    if (activeItem === user) {
      setActiveItem(null);
    } else {
      setActiveItem(user);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getContent = () => {
    if (loading) {
      return (
        <tr role="row">
          <td colSpan={6} className="text-center" role="cell">
            Loading...
          </td>
        </tr>
      );
    }

    if (!users) {
      return (
        <tr role="row">
          <td colSpan={6} className="text-center" role="cell">
            No users available. Add one!
          </td>
        </tr>
      );
    }

    if (users?.length === 0) {
      return (
        <tr role="row">
          <td colSpan={6} className="text-center" role="cell">
            Sorry, no users found
          </td>
        </tr>
      );
    } else {
      return users.map((user) => (
        <tr key={user.id} role="row">
          <td data-cell="name" role="cell" className="text-ellipsis truncate">
            {user.firstName} {user.lastName}
          </td>
          <td
            data-cell="user role"
            role="cell"
            className="truncate hidden xl:table-cell"
          >
            {getRoleName(user.roleID)}
          </td>
          <td
            data-cell="user status"
            role="cell"
            className="truncate hidden xl:table-cell text-center"
          >
            <span
              className={`${
                user.deactivated ? 'bg-red-600' : 'bg-green-600'
              } rounded-full px-3 py-1 text-xs text-white`}
            >
              {user.deactivated ? 'inactive' : 'active'}
            </span>
          </td>
          <td data-cell="action" role="cell">
            <div className="flex justify-center items-center gap-x-3">
              <button
                type="button"
                title={activeItem !== user ? 'Show details' : 'Hide details'}
                onClick={() => showUserDetails(user)}
                className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] text-white hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out text-xs sm:text-md"
              >
                {activeItem !== user ? (
                  <BsEyeFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-primary)]" />
                ) : (
                  <BsEyeSlashFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-primary)]" />
                )}
              </button>
            </div>
          </td>
        </tr>
      ));
    }
  };

  return (
    <div className="col-span-4 dark:shadow-none overflow-auto rounded-lg bg-slate-200/50 dark:bg-slate-900 px-2 sm:px-10 pb-5 pt-5 min-h-[390px] self-start">
      <div id="inventory-table">
        <div className="flex justify-center sm:justify-between items-center mb-5">
          <h1 className="hidden sm:block font-bold text-xl">User List</h1>
        </div>
        <table className="w-full" role="table">
          <thead role="rowgroup">
            <tr className="text-left bg-slate-300 dark:bg-slate-700" role="row">
              <th role="columnheader">Name</th>
              <th role="columnheader" className="hidden xl:table-cell">
                Role
              </th>
              <th
                role="columnheader"
                className="hidden xl:table-cell text-center"
              >
                User Status
              </th>
              <th role="columnheader" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">{getContent()}</tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageUsersTable;
