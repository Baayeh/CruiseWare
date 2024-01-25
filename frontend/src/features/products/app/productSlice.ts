import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface ProductState {
  allProducts: ProductProps[] | null;
  paginatedProducts: ProductProps[] | null;
  totalProductCount: number;
  page: number;
  pageSize: number;
}

const initialState = {
  allProducts: null,
  paginatedProducts: null,
  totalProductCount: 0,
  page: 0,
  pageSize: 10,
} as ProductState;

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setAllProducts: (state, action) => {
      state.allProducts = action.payload.product;
    },
    setPaginatedProducts: (state, action) => {
      state.paginatedProducts = action.payload.product;
      state.totalProductCount = action.payload.totalProductCount;
      state.page = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
    },
    setStateIfEmpty: (state) => {
      state.paginatedProducts = null;
      state.totalProductCount = 0;
    },
    setSearchResult: (state, action) => {
      state.paginatedProducts = action.payload.product;
    },
  },
});

export const selectProduct = (state: RootState) => state.product;

export const {
  setAllProducts,
  setPaginatedProducts,
  setStateIfEmpty,
  setSearchResult,
} = productSlice.actions;

export default productSlice.reducer;
