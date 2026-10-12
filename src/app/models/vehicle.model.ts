export interface Vehicle{
    vehicleId: number;
    modelId: number;
    brandId: number;
    licensePlate: string;
    color: string;
    year: number;
    mileage: number;
    price: number;
    createdDate: string;
    isSold: boolean;
    isActive: boolean;
    fullName: string; // This is a computed property that combines brand name, model name, and license plate
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