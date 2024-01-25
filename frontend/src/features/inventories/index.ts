export { default as InventoryTable } from './components/InventoryTable';

// dialogs
export { default as DeleteInventory } from './components/dialogs/DeleteInventory';
export { default as EditInventory } from './components/dialogs/EditInventory';
export { default as NewInventory } from './components/dialogs/NewInventory';

// slice
export {
  default as inventorySlice,
  selectInventory,
  setAllInventories,
  setNumOfDeletedInventories,
  setPaginatedInventories,
  setSearchResult,
  setStateIfEmpty,
} from './app/inventorySlice';
