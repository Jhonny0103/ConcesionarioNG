export interface Sale {
  saleId: number;
  vehicleId: number;
  customerId: number;
  saleDate: string;
  salePrice: number;
}

export interface CreateSaleDto {
  vehicleId: number;
  customerId: number;
  salePrice: number;
}

export interface UpdateSaleDto {
  saleId: number;
  vehicleId: number;
  customerId: number;
  salePrice: number;
}

export interface SaleDetails {
  saleId: number;
  vehicleId: number;
  modelId: number;
  modelName: string;
  brandId: number;
  brandName: string;
  licensePlate: string;
  customerId: number;
  firstName: string;
  lastName: string;
  saleDate: string;
  salePrice: number;
}