export interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdDate: string;
  isActive: boolean;
  fullName: string; // This is a computed property that combines firstName and lastName
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface UpdateCustomerDto {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
}