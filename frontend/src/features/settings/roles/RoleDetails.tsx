import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { BsPlusSquareFill } from 'react-icons/bs';
import {
  AddRolePermission,
  DeleteRolePermission,
  selectRole,
  setRolePermissions,
} from '..';
import noSelectionSvg from '../../../assets/images/no-selection.svg';
import { useAppSelector, useFetch } from '../../../hooks';

const RoleDetails = ({ activeItem }: { activeItem: UserRole | null }) => {
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [addRolePermissionVisible, setAddRolePermissionVisible] =
    useState<boolean>(false);
  const [rolePermission, setRolePermission] = useState<RolePermission | null>(
    null
  );

  // Initial number of visible permissions
  const [visibleItems, setVisibleItems] = useState(10);

  const handleViewMore = () => {
    // Increase the number of visible items by a certain amount
    setVisibleItems(visibleItems + 10);
  };

  const { rolePermissions } = useAppSelector(selectRole);

  const renderedItems = rolePermissions?.slice(0, visibleItems);

  const roleName = activeItem ? activeItem.name : '';

  const { fetchData } = useFetch(
    `/roles/${roleName}/permissions`,
    setRolePermissions
  );

  useEffect(() => {
    setAddRolePermissionVisible(false);
    setVisibleItems(10);
  }, [roleName]);

  useEffect(() => {
    if (activeItem) {
      fetchData();
    }
  }, [activeItem, roleName]);

  const removePermission = (item: RolePermission) => {
    setDeleteVisible(true);
    setRolePermission(item);
  };

  const content = () => {
    if (!activeItem) {
      return (
        <>
          <img
            src={noSelectionSvg}
            alt="No selected supplier"
            className="w-[15rem] mx-auto"
          />
          <p className="mt-4">Select a role to view its details</p>
        </>
      );
    } else {
      return (
        <>
          <div className="flex justify-between items-center gap-x-3">
            <div>
              <h3 className="uppercase text-xs text-[color:var(--text-secondary)]">
                Role
              </h3>
              <p className="font-medium text-sm">{activeItem.name}</p>
            </div>
            <div>
              <h3 className="uppercase text-xs text-[color:var(--text-secondary)]">
                Created At
              </h3>
              <p className="font-medium text-sm">
                {moment(activeItem?.createdAt).format('LL')}
              </p>
            </div>
            <div>
              <h3 className="uppercase text-xs text-[color:var(--text-secondary)]">
                Updated At
              </h3>
              <p className="font-medium text-sm">
                {moment(activeItem?.updatedAt).format('LL')}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t py-4 border-[color:var(--border-color)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-5">
                <h3 className="uppercase text-xs text-[color:var(--text-secondary)]">
                  Permissions
                </h3>
                {roleName !== 'superadmin' && (
                  <button
                    type="button"
                    title="Add Permission"
                    className="text-[color:var(--accent-primary)]"
                    onClick={() => setAddRolePermissionVisible(true)}
                  >
                    <BsPlusSquareFill />
                  </button>
                )}
              </div>
            </div>

            {rolePermissions?.length === 0 ? (
              <p className="mt-4">This role has no permissions. Add one!</p>
            ) : (
              <div className="mt-6 flex items-center flex-wrap gap-x-3 gap-y-5">
                {renderedItems?.map((permission) => (
                  <>
                    {roleName === 'superadmin' ? (
                      <div key={permission.permissionId}>
                        <Chip
                          label={permission.permissionName}
                          variant="outlined"
                        />
                      </div>
                    ) : (
                      <div key={permission.permissionId}>
                        <Chip
                          label={permission.permissionName}
                          onDelete={() => removePermission(permission)}
                          variant="outlined"
                          deleteIcon={<DeleteIcon />}
                        />
                      </div>
                    )}
                  </>
                ))}
                {rolePermissions && visibleItems < rolePermissions?.length && (
                  <button
                    type="button"
                    onClick={handleViewMore}
                    className="text-[color:var(--text-secondary)] text-sm hover:text-[color:var(--accent-primary)] transition-all duration-300 ease-in-out"
                  >
                    View More
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <div
      className={`hidden col-span-2 border border-[color:var(--border-color)] rounded-lg px-4 py-6 min-h-[390px] lg:sticky top-[6rem] self-start ${
        !activeItem ? 'lg:grid place-content-center' : 'lg:block'
      }`}
    >
      {content()}

      {addRolePermissionVisible && (
        <AddRolePermission
          roleName={roleName}
          visible={addRolePermissionVisible}
          setVisible={setAddRolePermissionVisible}
          rolePermissions={rolePermissions}
        />
      )}

      {deleteVisible && (
        <DeleteRolePermission
          position="bottom"
          visible={deleteVisible}
          setVisible={setDeleteVisible}
          rolePermission={rolePermission}
          roleName={roleName}
        />
      )}
    </div>
  );
};

export default RoleDetails;
