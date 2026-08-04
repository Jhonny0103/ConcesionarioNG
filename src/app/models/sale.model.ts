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