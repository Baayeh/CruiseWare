import { configureStore } from '@reduxjs/toolkit';
import { businessSlice } from '../features/account-settings';
import { authSlice } from '../features/authentication';
import { inventorySlice } from '../features/inventories';
import { userSlice } from '../features/manage-users';
import { inboundSlice, outboundSlice } from '../features/orders';
import { productSlice } from '../features/products';
import { receiverSlice } from '../features/receivers';
import { roleSlice } from '../features/settings';
import { supplierSlice } from '../features/suppliers';
import themeSlice from './themeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    inventory: inventorySlice,
    product: productSlice,
    manageUser: userSlice,
    supplier: supplierSlice,
    receiver: receiverSlice,
    outbound: outboundSlice,
    inbound: inboundSlice,
    role: roleSlice,
    business: businessSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
