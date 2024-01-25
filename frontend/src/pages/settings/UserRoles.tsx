import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { TempSearchFilter } from '../../components';
import {
  DeleteRoleDialog,
  EditRoleDialog,
  NewRoleDialog,
  RoleDetails,
  TabMenu,
  UserRolesTable,
  selectRole,
  setAllRoles,
  setSearchResult,
} from '../../features/settings';
import { useAppSelector, useFetch } from '../../hooks';

const UserRoles = () => {
  const [activeItem, setActiveItem] = useState<UserRole | null>(null);
  const [newVisible, setNewVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);

  const { allRoles } = useAppSelector(selectRole);

  const { fetchData } = useFetch('/roles', setAllRoles);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section id="user-roles" className="mb-10 relative">
      <div className="mt-5 mb-6 p-4 rounded-lg border border-[color:var(--border-color)] flex justify-center sm:justify-between sticky top-0 bg-[color:var(--primary-bg)] z-20">
        <TabMenu />
        <div className="flex gap-x-4">
          <button
            type="button"
            className="text-[color:var(--text-dark)] bg-[color:var(--accent-primary)] px-3 py-2 rounded-lg text-sm flex justify-center items-center gap-x-1 hover:bg-orange-600 transition-colors duration-300 ease-in-out"
            onClick={() => setNewVisible(true)}
            title="Create User Role"
          >
            <MdAdd />
            <span className="hidden lg:flex">New User Role</span>
          </button>
          <TempSearchFilter
            title="a role"
            feature="role"
            roles={allRoles}
            dispatchAction={setSearchResult}
            resetMethod={fetchData}
          />
        </div>
      </div>

      <div className="lg:grid grid-cols-6 gap-4">
        <UserRolesTable
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          setEditVisible={setEditVisible}
          setDeleteVisible={setDeleteVisible}
        />
        <RoleDetails activeItem={activeItem} />
      </div>
      {newVisible && (
        <NewRoleDialog visible={newVisible} setVisible={setNewVisible} />
      )}

      {editVisible && (
        <EditRoleDialog
          visible={editVisible}
          setVisible={setEditVisible}
          setActiveItem={setActiveItem}
          activeItem={activeItem}
        />
      )}

      <DeleteRoleDialog
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        position="bottom"
        setActiveItem={setActiveItem}
        activeItem={activeItem}
      />
    </section>
  );
};

export default UserRoles;
