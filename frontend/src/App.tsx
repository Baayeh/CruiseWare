import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

//layouts
import { DashboardLayout, RootLayout } from './components';
import { AuthLayout } from './features/authentication';

// Pages
import {
  CreateInboundOrder,
  CreateOutboundOrder,
  Home,
  InboundOrders,
  Inventories,
  Login,
  ManageUsers,
  OutboundOrders,
  Overview,
  Products,
  Profile,
  Receivers,
  Register,
  Suppliers,
  UserPermissions,
  UserRoles,
} from './pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* Public Routes */}
      <Route index element={<Home />} />
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Private Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="overview" element={<Overview />} />
        <Route path="inventories" element={<Inventories />} />
        <Route path="products" element={<Products />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="receivers" element={<Receivers />} />
        <Route path="profile">
          <Route index element={<Profile />} />
        </Route>

        {/* Orders */}
        <Route path="/orders">
          <Route path="outbound">
            <Route index element={<OutboundOrders />} />
            <Route path="new" element={<CreateOutboundOrder />} />
          </Route>
          <Route path="inbound">
            <Route index element={<InboundOrders />} />
            <Route path="new" element={<CreateInboundOrder />} />
          </Route>
        </Route>

        {/* Settings */}
        <Route path="settings">
          <Route path="roles" element={<UserRoles />} />
          <Route path="permissions" element={<UserPermissions />} />

          {/* Manage Users */}
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
