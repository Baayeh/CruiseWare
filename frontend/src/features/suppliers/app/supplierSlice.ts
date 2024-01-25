import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface SupplierState {
  allSuppliers: SupplierProps[] | null;
  paginatedSuppliers: SupplierProps[] | null;
  totalSupplierCount: number;
  page: number;
  pageSize: number;
}

const initialState = {
  allSuppliers: null,
  paginatedSuppliers: null,
  totalSupplierCount: 0,
  page: 0,
  pageSize: 10,
} as SupplierState;

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setAllSuppliers: (state, action) => {
      state.allSuppliers = action.payload;
    },
    setPaginatedSuppliers: (state, action) => {
      state.paginatedSuppliers = action.payload.suppliers;
      state.totalSupplierCount = action.payload.totalSupplierCount;
      state.page = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
    },
    setStateIfEmpty: (state) => {
      state.paginatedSuppliers = null;
      state.totalSupplierCount = 0;
    },
    setSearchResult: (state, action) => {
      state.paginatedSuppliers = action.payload;
    },
  },
});

export const selectSupplier = (state: RootState) => state.supplier;

export const {
  setAllSuppliers,
  setPaginatedSuppliers,
  setStateIfEmpty,
  setSearchResult,
} = supplierSlice.actions;

export default supplierSlice.reducer;
