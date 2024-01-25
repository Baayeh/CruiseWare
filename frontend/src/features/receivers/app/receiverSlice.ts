import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface ReceiverState {
  allReceivers: ReceiverProps[] | null;
  paginatedReceivers: ReceiverProps[] | null;
  totalReceiverCount: number | 0;
  page: number;
  pageSize: number;
}

const initialState = {
  allReceivers: null,
  paginatedReceivers: null,
  totalReceiverCount: 0,
  page: 0,
  pageSize: 10,
} as ReceiverState;

const receiverSlice = createSlice({
  name: 'receiver',
  initialState,
  reducers: {
    setAllReceivers: (state, action) => {
      state.allReceivers = action.payload;
    },
    setPaginatedReceivers: (state, action) => {
      state.paginatedReceivers = action.payload.receivers;
      state.totalReceiverCount = action.payload.totalReceiverCount;
      state.page = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
    },
    setStateIfEmpty: (state) => {
      state.paginatedReceivers = null;
      state.totalReceiverCount = 0;
    },
    setSearchResult: (state, action) => {
      state.paginatedReceivers = action.payload;
    },
  },
});

export const selectReceiver = (state: RootState) => state.receiver;

export const {
  setAllReceivers,
  setPaginatedReceivers,
  setStateIfEmpty,
  setSearchResult,
} = receiverSlice.actions;

export default receiverSlice.reducer;
