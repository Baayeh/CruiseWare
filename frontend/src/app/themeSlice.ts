import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? true
  : false;

const initialState = {
  darkMode: !!JSON.parse(
    localStorage.getItem('darkMode') || String(systemTheme)
  ),
};

export const asyncToggleTheme = createAsyncThunk(
  'theme/toggleTheme',
  (_payload, thunkAPI) => {
    const isDarkMode = !!JSON.parse(
      localStorage.getItem('darkMode') || String(systemTheme)
    );
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));

    thunkAPI.dispatch(toggleTheme());
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;

export const selectTheme = (state: RootState) => state.theme;
