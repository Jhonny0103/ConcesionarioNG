export interface Vehicle{
    vehicleId: number;
    modelId: number;
    licensePlate: string;
    color: string;
    year: number;
    mileage: number;
    price: number;
    createdDate: string;
    isSold: boolean;
    isActive: boolean;
}

export interface CreateVehicleDto{
    modelId: number;
    brandId: number;
    licensePlate: string;
    color: string;
    year: number;
    mileage: number;
    price: number;
}

export interface UpdateVehicleDto{
    vehicleId: number;
    modelId: number;
    brandId: number;
    licensePlate: string;
    color: string;
    year: number;
    mileage: number;
    price: number;
}