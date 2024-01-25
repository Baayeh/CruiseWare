import { FormHelperText, TextField } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineUserMinus } from 'react-icons/hi2';
import * as Yup from 'yup';
import { selectRole, setAllPermissions, setRolePermissions } from '../..';
import { useAppSelector, useCreate, useFetch } from '../../../../hooks';

interface AddRolePermissionProps extends MainDialogProps {
  roleName: string;
  rolePermissions: RolePermission[] | null;
}

const initialValues: { permissionName: string } = {
  permissionName: '',
};

const validationSchema = Yup.object().shape({
  permissionName: Yup.string().required('Permission name is required'),
});

const AddRolePermission: React.FC<AddRolePermissionProps> = ({
  roleName,
  visible,
  setVisible,
  rolePermissions,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const { allPermissions } = useAppSelector(selectRole);
  const [permissionName, setPermissionName] = useState('');

  const { fetchData: fetchAllPermissions } = useFetch(
    `/roles/permissions`,
    setAllPermissions
  );

  const { fetchData } = useFetch(
    `/roles/${roleName}/permissions`,
    setRolePermissions
  );

  // get permissions that are not assigned to the role
  const unassignedPermissions = allPermissions?.filter(
    (permission) =>
      !rolePermissions?.some(
        (rolePermission) => rolePermission.permissionName === permission.name
      )
  );

  const { data, loading, error, createData, resetState } = useCreate(
    `/roles/${roleName}/${permissionName}`
  );

  const onSubmit = async (values: { permissionName: string }) => {
    setPermissionName(values.permissionName);
  };

  useEffect(() => {
    if (permissionName) {
      createData();
      setRequestSent(true);
    }
  }, [permissionName]);

  useEffect(() => {
    fetchAllPermissions();
  }, [roleName]);

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
      setVisible(false);
      resetState();
      fetchData();
    }
  }, [data]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  return (
    <Dialog
      header="Add Permission"
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      maskClassName="create-new-mask"
      id="new-supplier-dialog"
    >
      <div className="form-wrapper mt-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="flex justify-between items-center gap-x-5 mb-5">
              <TextField
                value={roleName}
                disabled
                label="Role Name"
                className="w-full"
              />
              <Field name="permissionName">
                {({ field, meta }: FieldProps) => (
                  <div className="w-full">
                    <label
                      htmlFor="permissions"
                      className="mb-2 text-sm font-medium text-gray-900 dark:text-white hidden"
                    >
                      Select an option
                    </label>
                    <select
                      id="permissions"
                      className={`bg-[color:var(--secondary-bg)] border   text-sm rounded block w-full px-4 py-[1.1rem] hover:border-[#0f172a] focus:border-[#0f172a]  dark:placeholder-gray-400  dark:focus:border-[#f4f4f4] ${
                        meta.touched && meta.error
                          ? 'border-[#d32f2f] focus:outline-none focus-visible:outline-none text-[#d32f2f]'
                          : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-[#f4f4f4]'
                      }`}
                      {...field}
                    >
                      <option value="">Select Permission</option>
                      {unassignedPermissions &&
                      unassignedPermissions.length === 0 ? (
                        <option value="">All Permission have been added</option>
                      ) : null}

                      {unassignedPermissions &&
                        unassignedPermissions.map((permission) => (
                          <option key={permission.id} value={permission.name}>
                            {permission.name}
                          </option>
                        ))}
                    </select>
                    {meta.touched && meta.error && (
                      <FormHelperText error sx={{ marginLeft: '1rem' }}>
                        {meta.error}
                      </FormHelperText>
                    )}
                  </div>
                )}
              </Field>
            </div>
            <div>
              <button
                type="submit"
                className="custom-btn loading-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Adding...</span>
                  </>
                ) : (
                  'Add Permission to Role'
                )}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </Dialog>
  );
};

export default AddRolePermission;
