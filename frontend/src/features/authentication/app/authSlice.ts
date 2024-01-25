import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface AuthState {
  user: UserState | null;
  company: CompanyState | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLocked: boolean;
}

const initialIsLocked = localStorage.getItem('isLocked') === 'true';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    company: null,
    accessToken: null,
    refreshToken: null,
    isLocked: initialIsLocked,
  } as AuthState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, company, access, refresh } = action.payload;

      state.user = user;
      state.company = company;
      state.accessToken = access;
      state.refreshToken = refresh;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('company', JSON.stringify(company));
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('isLocked', JSON.stringify(initialIsLocked));
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    updateUserInfo: (state, action) => {
      state.user = action.payload;
    },
    updateCompanyInfo: (state, action) => {
      state.company = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.company = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setIsLocked: (state, action) => {
      state.isLocked = action.payload;

      localStorage.setItem('isLocked', JSON.stringify(action.payload));
    },
  },
});

export const {
  setCredentials,
  logOut,
  setAccessToken,
  setIsLocked,
  updateUserInfo,
  updateCompanyInfo,
} = authSlice.actions;

export default authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;
