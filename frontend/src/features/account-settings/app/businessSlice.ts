import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface BusinessState {
  business: BusinessData | null;
}

const initialState = {
  business: null,
} as BusinessState;

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusiness: (state, action) => {
      state.business = action.payload;
    },
  },
});

export const selectBusiness = (state: RootState) => state.business;

export const { setBusiness } = businessSlice.actions;

export default businessSlice.reducer;
