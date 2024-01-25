import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface UserState {
  users: UserProps[] | null;
}

const initialState = {
  users: null,
} as UserState;

const userSlice = createSlice({
  name: 'manageUser',
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      state.users = action.payload.users;
    },
    setSearchResult: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const selectUser = (state: RootState) => state.manageUser;

export const { setAllUsers, setSearchResult } = userSlice.actions;

export default userSlice.reducer;
