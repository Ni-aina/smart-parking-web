export interface TypeInterface {
    id: string;
    vehicleType: string;
    maxWidth: string;
    maxLength: string;
    maxHeight: string;
    description: string;
    createdAt: string;
}

export interface FormTypeInterface {
    id?: string;
    vehicleType: string;
    maxWidth: string;
    maxLength: string;
    maxHeight: string;
    description: string;
}