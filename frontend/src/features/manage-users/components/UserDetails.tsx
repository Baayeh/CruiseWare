import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { setAllUsers } from '..';
import noSelectionSvg from '../../../assets/images/no-selection.svg';
import { useAppSelector, useDelete, useFetch } from '../../../hooks';
import { selectRole, setAllRoles } from '../../settings';

interface UserDetailsProps {
  activeItem: UserProps | null;
  setActiveItem: (item: UserProps | null) => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  activeItem: user,
  setActiveItem,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const { allRoles } = useAppSelector(selectRole);
  const { fetchData } = useFetch('/roles', setAllRoles);

  const getInitials = () => {
    return user && user?.firstName[0] + user?.lastName[0];
  };

  // get role name
  const getRoleName = () => {
    const role = allRoles?.find((r) => r.id === user?.roleID);
    return role ? role.name : null;
  };

  const { fetchData: fetchAllUsers } = useFetch('/users', setAllUsers);

  // deactivate user
  const { data, error, deleteData, resetState } = useDelete(
    `/users/${user?.id}`
  );
  const deactivateUser = () => {
    deleteData();
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
      resetState();
      setRequestSent(true);
      setActiveItem(null);
      fetchAllUsers();
    }
  }, [data, requestSent, resetState]);

  useEffect(() => {
    if (error && requestSent) {
      toast.error(error);
      resetState();
      setRequestSent(false);
    }
  }, [error, resetState]);

  useEffect(() => {
    fetchData();
  }, []);

  const getContent = () => {
    if (!user) {
      return (
        <>
          <img
            src={noSelectionSvg}
            alt="No selected supplier"
            className="w-[15rem] mx-auto"
          />
          <p className="mt-4">Select a user to view details</p>
        </>
      );
    } else {
      return (
        <>
          <div className="">
            <div
              className={`rounded-full p-1 border border-[color:var(--border-color)] flex items-center justify-between ${
                getInitials()!.length > 4 ? 'text-xs' : 'text-sm'
              }`}
            >
              <div className="flex items-center gap-x-3">
                <div className="bg-[color:var(--border-color)] h-[3.5rem] w-[3.5rem] rounded-full flex flex-wrap justify-center items-center font-bold uppercase">
                  <p>{getInitials()}</p>
                </div>
                <div>
                  <p className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-[color:var(--text-secondary)]">
                    {user?.email}
                  </p>
                </div>
              </div>
              <p className="text-xs me-2 bg-[color:var(--border-color)] p-2 rounded-e-full">
                {getRoleName()}
              </p>
            </div>
          </div>
          <div className="my-5 flex justify-center gap-x-10">
            <div>
              <h3 className="uppercase text-xs text-[color:var(--text-secondary)]">
                Created
              </h3>
              <p className="mt-2 flex gap-x-2 items-center text-sm text-[color:var(--text-secondary)]">
                at
                <span className="font-medium text-[color:var(--text-primary)]">
                  {moment(user?.createdAt).format('DD/MM/YYYY')}
                </span>
              </p>
            </div>
            <div>
              <h3 className="uppercase text-xs text-[color:var(--text-secondary)]">
                Updated
              </h3>
              <p className="mt-2 flex gap-x-2 items-center text-sm text-[color:var(--text-secondary)]">
                at
                <span className="font-medium text-[color:var(--text-primary)]">
                  {moment(user?.updatedAt).format('DD/MM/YYYY')}
                </span>
              </p>
            </div>
            <div>
              <h3 className="uppercase text-xs text-[color:var(--text-secondary)]">
                Action
              </h3>
              {!user?.deactivated ? (
                <button
                  type="button"
                  className="text-white mt-2 text-xs rounded-full px-2 py-1 bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in-out"
                  onClick={deactivateUser}
                >
                  Deactivate
                </button>
              ) : (
                <button
                  type="button"
                  className="text-white mt-2 text-xs rounded-full px-2 py-1 bg-green-600 hover:bg-green-700 transition-all duration-300 ease-in-out"
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        </>
      );
    }
  };
  return (
    <div
      className={`hidden col-span-2 border border-[color:var(--border-color)] rounded-lg px-4 py-6 lg:sticky top-[6rem] self-start ${
        !user ? 'lg:grid place-content-center min-h-[390px]' : 'lg:block'
      }`}
    >
      {getContent()}
    </div>
  );
};

export default UserDetails;
