export { default as ReceiverDetailSummary } from './components/ReceiverDetailSummary';
export { default as ReceiversTable } from './components/ReceiversTable';

// dialogs
export { default as DeleteReceiverDialog } from './components/dialogs/DeleteReceiverDialog';
export { default as EditReceiverDialog } from './components/dialogs/EditReceiverDialog';
export { default as NewReceiverDialog } from './components/dialogs/NewReceiverDialog';

// slice
export {
  default as receiverSlice,
  selectReceiver,
  setAllReceivers,
  setPaginatedReceivers,
  setSearchResult,
  setStateIfEmpty,
} from './app/receiverSlice';
