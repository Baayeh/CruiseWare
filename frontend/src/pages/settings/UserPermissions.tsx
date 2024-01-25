import { PermissionsList, TabMenu } from '../../features/settings';

const UserPermissions = () => {
  return (
    <section id="user-permissions">
      <TabMenu />

      <PermissionsList />
    </section>
  );
};

export default UserPermissions;
