export const permissions = [
    {
        name: "CreateUser",
        description: "Create a new User",
        businessID: 0
    },
    {
        name: "ReadUser",
        description: "Read a user's details",
        businessID: 0

    },
    {
        name: "ReadAllUsers",
        description: "Read all users' details",
        businessID: 0
    },
    {
        name: "UpdateUser",
        description: "Update a user's information",
        businessID: 0
    },
    {
        name: "DeleteUser",
        description: "Delete a user",
        businessID: 0
    },
    {
        name: "CreateRole",
        description: "Create a new role",
        businessID: 0
    },
    {
        name: "ReadRole",
        description: "Read a role's details",
        businessID: 0
    },
    {
        name: "ReadAllRoles",
        description: "Read all roles' details",
        businessID: 0
    },
    {
        name: "UpdateRole",
        description: "Update a role's information",
        businessID: 0
    },
    {
        name: "DeleteRole",
        description: "Delete a role",
        businessID: 0
    },
    {
        name: "ReadAllPermissions",
        description: "Get all permissions",
        businessID: 0
    },
    {
        name: "ReadBusinessData",
        description: "Get all data about a business",
        businessID: 0
    },
    {
        name: "UpdateBusinessData",
        description: "Update a business's data",
        businessID: 0
    },
    {
        name: "CreateInventory",
        description: "Create a new Inventory",
        businessID: 0
    },
    {
        name: "ReadInventory",
        description: "Read Inventories' details",
        businessID: 0

    },
    {
        name: "UpdateInventory",
        description: "Update an Inventory's information",
        businessID: 0
    },
    {
        name: "DeleteInventory",
        description: "Delete an Inventory",
        businessID: 0
    },
    {
        name: "ReadAllReceivers",
        description: "Reads all receivers",
        businessID: 0
    },
    {
        name: "ReadReceiver",
        description: "Reads a receiver by name",
        businessID: 0
    },
    {
        name: "CreateReceiver",
        description: "Create a new receiver",
        businessID: 0
    },
    {
        name: "UpdateReceiver",
        description: "Update a receiver",
        businessID: 0
    },
    {
        name: "DeleteReceiver",
        description: "Reads all receivers",
        businessID: 0
    },
    {
        name: "ReadAllSuppliers",
        description: "Reads all suppliers",
        businessID: 0
    },
    {
        name: "ReadSupplier",
        description: "Read a supplier by name",
        businessID: 0
    },
    {
        name: "CreateSupplier",
        description: "Create a new supplier",
        businessID: 0
    },
    {
        name: "UpdateSupplier",
        description: "Update a supplier",
        businessID: 0
    },
    {
        name: "DeleteSupplier",
        description: "Delete a supplier",
        businessID: 0
    },
    {
        name: "CreateProduct",
        description: "Create a new Product",
        businessID: 0
    },
    {
        name: "UpdateProduct",
        description: "Update a product's information",
        businessID: 0
    },
    {
        name: "DeleteProduct",
        description: "Delete a product",
        businessID: 0
    },
    {
        name: "ReadOutbounds",
        description: "Read outbound orders",
        businessID: 0
    },
    {
        name: "CreateOutbound",
        description: "Create outbound orders",
        businessID: 0
    },
    {
        name: "UpdateOutbound",
        description: "Update an outbound order",
        businessID: 0
    },
    {
        name: "DeleteOutbound",
        description: "Delete an outbound order",
        businessID: 0
    },
    {
        name: "CreateInbound",
        description: "Create inbound orders",
        businessID: 0
    },
    {
        name: "ReadInbound",
        description: "Read inbound orders",
        businessID: 0
    },
    {
        name: "UpdateInbound",
        description: "Update an inbound order",
        businessID: 0
    },
    {
        name: "DeleteInbound",
        description: "Delete an inbound order",
        businessID: 0
    }
]

export const roles = [
    {
        name: "superadmin",
        description: "the super admin role",
        createdAt: new Date(),
        updatedAt: new Date(),
        businessID: 0
    },
    {
        name: "admin",
        description: "the general administrator role",
        createdAt: new Date(),
        updatedAt: new Date(),
        businessID: 0
    },
    {
        name: "inbounds manager",
        description: "the manages all inbounds functions",
        createdAt: new Date(),
        updatedAt: new Date(),
        businessID: 0
    },
    {
        name: "outbounds manager",
        description: "the manages all outbounds functions",
        createdAt: new Date(),
        updatedAt: new Date(),
        businessID: 0
    }
]

const adminPermissionNames: string[] = [
    "CreateUser",
    "ReadUser",
    "ReadAllUsers",
    "UpdateUser",
    "DeleteUser",
    "CreateRole",
    "ReadRole",
    "ReadAllRoles",
    "UpdateRole",
    "DeleteRole",
    "ReadAllPermissions",
    "ReadBusinessData",
    "UpdateBusinessData",
    "CreateInventory",
    "ReadInventory",
    "UpdateInventory",
    "DeleteInventory",
    "ReadAllReceivers",
    "ReadReceiver",
    "CreateReceiver",
    "UpdateReceiver",
    "DeleteReceiver",
    "ReadAllSuppliers",
    "ReadSupplier",
    "CreateSupplier",
    "UpdateSupplier",
    "DeleteSupplier",
    "CreateProduct",
    "UpdateProduct",
    "DeleteProduct",
    "ReadOutbounds",
    "CreateOutbound",
    "UpdateOutbound",
    "DeleteOutbound",
    "CreateInbound",
    "ReadInbound",
    "UpdateInbound",
    "DeleteInbound"
]

export const rolePermissions = [
    {
        roleName: "superadmin",
        permissionNames: adminPermissionNames,
    },
    {
        roleName: "admin",
        permissionNames: adminPermissionNames,
    },
]
