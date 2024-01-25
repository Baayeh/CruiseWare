import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface InboundState {
  allInbounds: InboundOrderProps[] | null;
  paginatedInbounds: InboundOrderProps[] | null;
  totalInboundCount: number | 0;
  page: number;
  pageSize: number;
}

const initialState = {
  allInbounds: null,
  paginatedInbounds: null,
  totalInboundCount: 0,
  page: 0,
  pageSize: 10,
} as InboundState;

const inboundSlice = createSlice({
  name: 'inbound',
  initialState,
  reducers: {
    setAllInbounds: (state, action) => {
      state.allInbounds = action.payload.inboundOrders;
    },
    setPaginatedInbounds: (state, action) => {
      state.paginatedInbounds = action.payload.inboundOrders;
      state.totalInboundCount = action.payload.totalInboundOrderCount;
      state.page = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
    },
    setInboundStateIfEmpty: (state) => {
      state.paginatedInbounds = null;
      state.totalInboundCount = 0;
    },
    setFoundInbound: (state, action) => {
      state.paginatedInbounds = action.payload;
    },
  },
});

export const {
  setAllInbounds,
  setPaginatedInbounds,
  setInboundStateIfEmpty,
  setFoundInbound,
} = inboundSlice.actions;

export const selectInbound = (state: RootState) => state.inbound;

export default inboundSlice.reducer;
