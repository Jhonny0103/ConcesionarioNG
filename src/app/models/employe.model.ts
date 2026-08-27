export interface Employe {
    employeId: number;
    employeName: string;
    employeEmail: string;
    employePhone: string;
    CreatedDate: string;
    isActive: boolean;
}

export interface CreateEmployeDto {
    employeName: string;
    employeEmail: string;
    employePhone?: string;
}

export interface UpdateEmployeDto {
    employeId: number;
    employeName: string;
    employeEmail: string;
    employePhone?: string;
    isActive: boolean;
}