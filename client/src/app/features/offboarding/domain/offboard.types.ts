export interface Address {
  streetLine1: string;
  country: string;
  city: string;
  postalCode: string;
  receiver: string;
}

export interface Offboarding {
  address: Address;
  notes: string;
  phone: string;
  email: string;
}

export interface OffboardingApiResponse {
  message: string;
  id: string;
}
