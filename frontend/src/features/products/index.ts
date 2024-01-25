export { default as ImageUpload } from './components/ImageUpload';
export { default as ProductsTable } from './components/ProductsTable';
export { default as NewProduct } from './components/dialogs/NewProduct';

// slice
export {
  default as productSlice,
  selectProduct,
  setAllProducts,
  setPaginatedProducts,
  setSearchResult,
  setStateIfEmpty,
} from './app/productSlice';
