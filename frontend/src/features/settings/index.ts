export { default as TabMenu } from './components/TabMenu';

// roles
export { default as RoleDetails } from './roles/RoleDetails';
export { default as UserRolesTable } from './roles/UserRolesTable';
export { default as AddRolePermission } from './roles/dialogs/AddRolePermission';
export { default as DeleteRoleDialog } from './roles/dialogs/DeleteRoleDialog';
export { default as DeleteRolePermission } from './roles/dialogs/DeleteRolePermission';
export { default as EditRoleDialog } from './roles/dialogs/EditRoleDialog';
export { default as NewRoleDialog } from './roles/dialogs/NewRoleDialog';

// permissions
export { default as PermissionsList } from './permissions/PermissionsList';
export { default as ShowPermissionDesc } from './permissions/dialogs/ShowPermissionDesc';

// slice
export {
  default as roleSlice,
  selectRole,
  setAllPermissions,
  setAllRoles,
  setRolePermissions,
  setSearchResult,
} from './app/roleSlice';
