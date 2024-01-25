export {};

declare global {
  // Props for the form fields when creating a new account
  interface RegisterFormValues {
    f_name: string;
    l_name: string;
    email: string;
    password: string;
    company_name: string;
    company_street: string;
    company_city: string;
    company_state: string;
    company_country: string;
    company_timezone: string;
    company_phone: string;
    company_email: string;
    company_industry: string;
    company_description: string;
    company_regStatus: boolean;
    company_size: string;
    terms_agreed: boolean;
  }

  // Props for the form fields when logging in
  interface LoginFormValues {
    email: string;
    password: string;
  }

  // Props for the request body when creating a new account
  interface AccountCreationData {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };
    businessContact: {
      name: string;
      email: string;
      phone: string;
      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        timezone: string;
      };
    };
    businessData: {
      industry: string;
      description: string;
      regStatus: boolean;
      size: string;
    };
  }

  interface UserState {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }

  interface CompanyState {
    businessID: number;
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    businessAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      timezone: string;
    };
  }

  interface BusinessHours {
    id: number;
    businessID: number;
    locationID: number;
    day: string;
    start: Date;
    end: Date;
  }

  interface BusinessLocation {
    id: 1;
    businessID: 1;
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    timezone: string;
    description: string;
    businessHours: BusinessHours[];
  }

  interface BusinessSocials {
    id: number;
    businessID: number;
    Twitter: string;
    Facebook: string;
    LinkedIn: string;
    Instagram: string;
    Tiktok: string;
  }

  interface BusinessData {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    industry: string;
    regStatus: boolean;
    regNumber: string;
    colour: string;
    description: string;
    size: string;
    businessSocials: BusinessSocials;
    businessLocations: BusinessLocation[];
  }

  // Props for the Main dialog
  interface MainDialogProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  }

  // Props for the form fields when creating a new inventory
  interface InventoryFormValues {
    name?: string;
    description?: string;
  }

  // Props for an inventory
  interface InventoryProps {
    id: number;
    businessID: number;
    name: string;
    description: string;
    productCount: number;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
  }

  // Props for the form fields when creating a new product
  interface ProductFormValues {
    name: string;
    quantity: number;
    price: string;
    photo: File | null | unknown;
    inventoryId: string;
    description: string;
    fullDescription: string;
  }

  // Props of a product
  interface ProductProps {
    id: number;
    businessID: number;
    name: string;
    description: string;
    fullDescription: string;
    price: string;
    quantity: number;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
    inventoryId: number;
    createdBy: string;
    updatedBy: string;
  }

  // Props of a User
  interface UserProps {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    businessID: number;
    deactivated: boolean;
    roleID: number;
  }

  // interface UserProps {
  //   role: {
  //     id: number;
  //     businessID: number;
  //     name: string;
  //     description: string;
  //     createdAt: Date;
  //     updatedAt: Date;
  //   };
  // }

  // Props for the form fields when creating a new product
  interface UserFormValues {
    firstName: string;
    lastName: string;
    email: string;
    roleId: number | null;
  }

  // Props for the form fields when creating a new supplier
  interface SupplierFormValues {
    name: string;
    phone: string;
    email?: string;
    address: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    addContact?: boolean;
  }

  // Props of a supplier
  interface SupplierProps {
    id: number;
    businessID: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  }

  // Props for the form fields when creating a new receiver
  interface ReceiverFormValues {
    name: string;
    phone: string;
    email?: string;
    address: string;
  }

  // Props of a receiver
  interface ReceiverProps {
    id: number;
    businessID: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  }

  // Props for Outbound Product
  interface OutboundProductProps {
    productID?: number;
    inventoryID?: number;
    quantity: number;
  }

  interface NewOutboundProduct {
    product: ProductProps;
    quantity: number;
  }

  // Props for the form fields when creating a new outbound order
  interface OutboundOrderFormValues {
    products: OutboundProductProps[];
    receiverId: number;
  }

  // Props of an outbound order
  interface OutboundOrderProps {
    id: number;
    businessID: number;
    orderId: string;
    productId: number;
    receiverId: number;
    quantity: number;
    orderStatus: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  }

  // Props for Inbound Product
  interface InboundProductProps {
    productID?: number;
    quantity: number;
  }

  interface NewInboundProduct {
    product: ProductProps;
    quantity: number;
  }

  // Props for the form fields when creating a new inbound order
  interface InboundOrderFormValues {
    products: InboundProductProps[];
    supplierId: number;
  }

  // Props of an inbound order
  interface InboundOrderProps {
    id: number;
    businessID: number;
    productId: number;
    supplierId: number;
    quantity: number;
    orderStatus: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    reference: string;
  }

  // Props of a table
  interface TableProps {
    page: number;
    setPage: (page: number) => void;
  }

  // props of a user role
  interface UserRole {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }

  // props for a permission associated with a role
  interface RolePermission {
    permissionId: number;
    permissionName: string;
    permissionDescription: string;
  }

  // props for a permission
  interface Permission {
    id: number;
    businessID: number;
    name: string;
    description: string;
  }

  // props for fields when creating a new role
  interface RoleFormValues {
    name: string;
    description: string;
  }
}
