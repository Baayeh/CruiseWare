export { default as Home } from './Home';
export { default as Inventories } from './Inventories';
export { default as Login } from './Login';
export { default as ManageUsers } from './ManageUsers';
export { default as Overview } from './Overview';
export { default as Products } from './Products';
export { default as Profile } from './Profile';
export { default as Receivers } from './Receivers';
export { default as Register } from './Register';
export { default as Suppliers } from './Suppliers';

// orders - Outbound
export { default as CreateOutboundOrder } from './orders/outbound/CreateOutboundOrder';
export { default as OutboundOrders } from './orders/outbound/OutboundOrders';

// orders - Inbound

export { default as CreateInboundOrder } from './orders/inbound/CreateInboundOrder';
export { default as InboundOrders } from './orders/inbound/InboundOrders';

// roles and permissions
export { default as UserPermissions } from './settings/UserPermissions';
export { default as UserRoles } from './settings/UserRoles';
