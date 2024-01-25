import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface InventoryState {
  allInventories: InventoryProps[] | null;
  paginatedInventories: InventoryProps[] | null;
  totalInventoryCount: number;
  totalProductCount: number;
  numOfDeletedInventories: number;
  page: number;
  pageSize: number;
}

const initialState = {
  allInventories: null,
  paginatedInventories: null,
  totalInventoryCount: 0,
  totalProductCount: 0,
  numOfDeletedInventories: 0,
  page: 0,
  pageSize: 10,
} as InventoryState;

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setAllInventories: (state, action) => {
      state.allInventories = action.payload.inventory;
    },
    setPaginatedInventories: (state, action) => {
      state.paginatedInventories = action.payload.inventory;
      state.totalInventoryCount = action.payload.totalInventoryCount;
      state.totalProductCount = action.payload.totalProductsCount;
      state.page = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
    },
    setNumOfDeletedInventories: (state, action) => {
      state.numOfDeletedInventories = action.payload.totalDeletedInventoryCount;
    },
    setStateIfEmpty: (state) => {
      state.paginatedInventories = null;
      state.totalInventoryCount = 0;
    },
    setSearchResult: (state, action) => {
      state.paginatedInventories = action.payload.inventory;
    },
  },
});

export const selectInventory = (state: RootState) => state.inventory;

export const {
  setAllInventories,
  setNumOfDeletedInventories,
  setPaginatedInventories,
  setStateIfEmpty,
  setSearchResult,
} = inventorySlice.actions;

export default inventorySlice.reducer;
