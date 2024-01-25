import { Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { ShowPermissionDesc, selectRole, setAllPermissions } from '..';
import { useAppSelector, useFetch } from '../../../hooks';

const PermissionsList = () => {
  const { allPermissions } = useAppSelector(selectRole);
  const [visible, setVisible] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<Permission | null>(null);

  const { loading, fetchData } = useFetch(
    '/roles/permissions',
    setAllPermissions
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const showDescription = (item: Permission) => {
    setVisible(true);
    setActiveItem(item);
    // console.log(item);
  };

  const getContent = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (!allPermissions || allPermissions?.length === 0) {
      return <p>No permissions available</p>;
    } else {
      return allPermissions?.map((permission) => (
        <Chip
          key={permission.name}
          label={permission.name}
          variant="outlined"
          onClick={() => showDescription(permission)}
          sx={{
            fontSize: '1rem',
          }}
        />
      ));
    }
  };

  return (
    <div className="mt-10 dark:shadow-none overflow-auto rounded-lg bg-slate-200/50 dark:bg-slate-900 px-2 sm:px-10 pb-5 pt-5 min-h-[390px] flex items-center gap-x-3 flex-wrap">
      {getContent()}

      {visible && (
        <ShowPermissionDesc
          visible={visible}
          setVisible={setVisible}
          position="top"
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
      )}
    </div>
  );
};

export default PermissionsList;
