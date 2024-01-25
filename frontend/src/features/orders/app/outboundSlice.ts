import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface OutboundState {
  allOutbounds: OutboundOrderProps[] | null;
  paginatedOutbounds: OutboundOrderProps[] | null;
  totalOutboundCount: number | 0;
  page: number;
  pageSize: number;
}

const initialState = {
  allOutbounds: null,
  paginatedOutbounds: null,
  totalOutboundCount: 0,
  page: 0,
  pageSize: 10,
} as OutboundState;

const outboundSlice = createSlice({
  name: 'outbound',
  initialState,
  reducers: {
    setAllOutbounds: (state, action) => {
      state.allOutbounds = action.payload;
    },
    setPaginatedOutbounds: (state, action) => {
      state.paginatedOutbounds = action.payload.outbounds;
      state.totalOutboundCount = action.payload.totalOutboundCount;
      state.page = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
    },
    setStateIfEmpty: (state) => {
      state.paginatedOutbounds = null;
      state.totalOutboundCount = 0;
    },
    setSearchResult: (state, action) => {
      state.paginatedOutbounds = action.payload;
    },
  },
});

export const {
  setAllOutbounds,
  setPaginatedOutbounds,
  setStateIfEmpty,
  setSearchResult,
} = outboundSlice.actions;

export const selectOutbound = (state: RootState) => state.outbound;

export default outboundSlice.reducer;
