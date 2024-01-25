import { useEffect } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { RiEditFill } from 'react-icons/ri';
import { selectRole, setAllRoles } from '..';
// import { PaginatorWrapper } from '../../../components';
import { useAppSelector, useFetch } from '../../../hooks';

interface UserRoleTableProps {
  setEditVisible: (visible: boolean) => void;
  setDeleteVisible: (visible: boolean) => void;
  activeItem: UserRole | null;
  setActiveItem: (item: UserRole | null) => void;
}

const UserRolesTable: React.FC<UserRoleTableProps> = ({
  activeItem,
  setActiveItem,
  setEditVisible,
  setDeleteVisible,
}) => {
  const { allRoles } = useAppSelector(selectRole);

  const { loading, fetchData } = useFetch('/roles', setAllRoles);

  const showRoleDetails = (role: UserRole) => {
    if (activeItem === role) {
      setActiveItem(null);
    } else {
      setActiveItem(role);
    }
  };

  const showEditDialog = (role: UserRole) => {
    setEditVisible(true);
    setActiveItem(role);
  };

  const showDeleteDialog = (role: UserRole) => {
    setDeleteVisible(true);
    setActiveItem(role);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchData();
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

    if (!allRoles) {
      return (
        <tr role="row">
          <td colSpan={6} className="text-center" role="cell">
            No roles available. Create one!
          </td>
        </tr>
      );
    }

    if (allRoles?.length === 0) {
      return (
        <tr role="row">
          <td colSpan={6} className="text-center" role="cell">
            Sorry, no roles found
          </td>
        </tr>
      );
    } else {
      return allRoles?.map((role) => (
        <tr key={role.id} role="row">
          <td data-cell="name" role="cell" className="text-ellipsis truncate">
            {role.name}
          </td>
          <td
            data-cell="created by"
            role="cell"
            className="truncate hidden xl:table-cell"
          >
            {role.description}
          </td>
          <td data-cell="action" role="cell">
            <div className="flex justify-center items-center gap-x-3">
              <button
                type="button"
                title={activeItem !== role ? 'Show details' : 'Hide details'}
                onClick={() => showRoleDetails(role)}
                className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] text-white hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out text-xs sm:text-md"
              >
                {activeItem !== role ? (
                  <BsEyeFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-primary)]" />
                ) : (
                  <BsEyeSlashFill className="text-[color:var(--accent-primary)] group-hover:text-[color:var(--text-primary)]" />
                )}
              </button>
              <button
                type="button"
                className="col-span-1 p-2 group rounded-md border border-[color:var(--text-secondary)] text-white hover:bg-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] transition-colors duration-300 ease-in-out text-xs sm:text-md sm:text-md disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:dark:bg-gray-700 disabled:dark:border-gray-700"
                disabled={role.name === 'superadmin'}
                onClick={() => showEditDialog(role)}
              >
                <RiEditFill />
              </button>
              <button
                type="button"
                disabled={role.name === 'superadmin'}
                className="col-span-1 p-2 rounded-md bg-red-600 text-white hover:bg-red-800 transition-colors duration-300 ease-in-out text-xs sm:text-md disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:dark:bg-gray-700"
                onClick={() => showDeleteDialog(role)}
              >
                <MdDelete />
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
          <h1 className="hidden sm:block font-bold text-xl">User Role List</h1>
        </div>
        <table className="w-full" role="table">
          <thead role="rowgroup">
            <tr className="text-left bg-slate-300 dark:bg-slate-700" role="row">
              <th role="columnheader">Role Name</th>
              <th role="columnheader" className="hidden xl:table-cell">
                Role Description
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

export default UserRolesTable;
