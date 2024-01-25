import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { TempSearchFilter } from '../components';
import {
  ManageUserTable,
  NewUser,
  TabMenu,
  UserDetails,
  selectUser,
  setAllUsers,
  setSearchResult,
} from '../features/manage-users';
import { useAppSelector, useFetch } from '../hooks';

const ManageUsers = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const labels = ['all', 'active', 'inactive'];
  const [activeItem, setActiveItem] = useState<UserProps | null>(null);

  const { users } = useAppSelector(selectUser);
  const { fetchData: fetchAllUsers } = useFetch('/users', setAllUsers);

  const getUsers = (): UserProps[] => {
    const filteredUsers = users ?? [];

    switch (activeTab) {
      case 1:
        return filteredUsers.filter((user: UserProps) => !user.deactivated);
      case 2:
        return filteredUsers.filter((user: UserProps) => user.deactivated);
      default:
        return filteredUsers;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <section className="mb-10 relative">
      <div className="my-6 p-4 rounded-lg border border-[color:var(--border-color)] flex items-center justify-center sm:justify-between sticky top-0 bg-[color:var(--primary-bg)] z-20">
        <TabMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          labels={labels}
          setActiveItem={setActiveItem}
        />
        <div className="flex gap-x-4">
          <button
            type="button"
            className="text-[color:var(--text-dark)] bg-[color:var(--accent-primary)] px-3 py-2 rounded-lg text-sm flex items-center gap-x-2 hover:bg-orange-600 transition-colors duration-300 ease-in-out"
            onClick={() => setVisible(true)}
            title="Add a user"
          >
            <MdAdd />
            <span className="hidden lg:flex">New User</span>
          </button>
          <TempSearchFilter
            title="a user"
            feature="user"
            users={getUsers()}
            dispatchAction={setSearchResult}
            resetMethod={fetchAllUsers}
          />
        </div>
      </div>

      <div className="lg:grid grid-cols-6 gap-4">
        <ManageUserTable
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          users={getUsers()!}
        />
        <UserDetails activeItem={activeItem} setActiveItem={setActiveItem} />
      </div>
      {visible && (
        <NewUser
          visible={visible}
          setVisible={setVisible}
          setActiveItem={setActiveItem}
        />
      )}
    </section>
  );
};
export default ManageUsers;
