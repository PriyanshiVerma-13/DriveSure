export enum UserRole {
  Customer = 'Customer',
  CarCompany = 'Car Company',
  InsuranceCompany = 'Insurance Company',
}

export interface User {
  id: string;
  email: string;
  password?: string; // Should be handled securely on a backend
  name: string;
  role: UserRole;
}

export enum CarCondition {
  New = 'New',
  Used = 'Used',
  CertifiedPreOwned = 'Certified Pre-Owned',
}

export enum InsuranceStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
    NotRequested = 'Not Requested',
}

export enum CarStatus {
  Available = 'Available',
  Sold = 'Sold',
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  vin: string;
  serviceHistory: string; // For demo, using text. In prod, this would be a link to documents.
  imageUrl: string; // Base64 encoded image data URL
  condition: CarCondition;
  description: string;
  ownerId: string; // Could be a customer or a car company
  listedBy: string; // Name of the seller
  insuranceStatus: InsuranceStatus;
  insurancePremium?: number;
  status: CarStatus;
}