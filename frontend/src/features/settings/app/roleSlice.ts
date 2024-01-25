import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface UserRoleState {
  allRoles: UserRole[] | null;
  rolePermissions: RolePermission[] | null;
  allPermissions: Permission[] | null;
}

const initialState = {
  allRoles: null,
  rolePermissions: null,
  allPermissions: null,
} as UserRoleState;

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setAllRoles: (state, action) => {
      state.allRoles = action.payload;
    },
    setRolePermissions: (state, action) => {
      state.rolePermissions = action.payload;
    },
    setAllPermissions: (state, action) => {
      state.allPermissions = action.payload;
    },
    setSearchResult: (state, action) => {
      state.allRoles = action.payload;
    },
  },
});

export const selectRole = (state: RootState) => state.role;

export const {
  setAllRoles,
  setRolePermissions,
  setAllPermissions,
  setSearchResult,
} = roleSlice.actions;

export default roleSlice.reducer;
