export interface TypeInterface {
    id: string;
    type: string;
    maxWidth: string;
    maxLength: string;
    maxHeight: string;
    description: string;
    createdAt: string;
}

export interface FormTypeInterface {
    id?: string;
    type: string;
    maxWidth: string;
    maxLength: string;
    maxHeight: string;
    description: string;
}