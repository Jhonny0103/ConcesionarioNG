// Entidad principal que devuelve la API (GET)
export interface Brand {
  brandId: number;
  brandName: string;
  createdDate: string;
  isActive: boolean;
}

// Payload para crear un nuevo Fabricante (POST)
export interface CreateBrandDto {
  brandName: string;
}

// Payload para actualizar un Fabricante (PUT)
export interface UpdateBrandDto {
  brandId: number;
  brandName: string;
}