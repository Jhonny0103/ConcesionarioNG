export interface Model {
  modelId: number;
  brandId: number;
  modelName: string;
  createdDate: string;
  isActive: boolean;
}

export interface CreateModelDto {
  modelName: string;
}

export interface UpdateModelDto {
  modelId: number;
  modelName: string;
}