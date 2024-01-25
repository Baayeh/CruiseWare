import { useEffect } from 'react';
import { selectAuth } from '../../features/authentication';
import { selectRole, setRolePermissions } from '../../features/settings';
import { useAppSelector, useFetch } from '../../hooks';

interface PermissionsWrapperProp {
  allowedPermissions: string[];
  children: any;
  element?: any;
}

const RequirePermission: React.FC<PermissionsWrapperProp> = ({
  allowedPermissions,
  children,
  element,
}) => {
  const { user } = useAppSelector(selectAuth);

  const { rolePermissions } = useAppSelector(selectRole);
  const { fetchData } = useFetch(
    `/roles/${user?.role}/permissions`,
    setRolePermissions
  );

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const hasRequiredPermissions = rolePermissions?.some((permission) =>
    allowedPermissions.includes(permission.permissionName)
  );

  return hasRequiredPermissions ? children : element ? element : null;
};

export default RequirePermission;
