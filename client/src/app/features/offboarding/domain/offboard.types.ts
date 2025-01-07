export interface Address {
  streetLine1: string;
  country: string;
  postalCode: string;
  receiver: string;
}

export interface Offboarding {
  address: Address;
  notes: string;
  phone: string;
  email: string;
}

export interface OffboardResponse {
  message: string;
  id: string;
}
