import { TType } from "../contracts/TType";

// DTO for updating functions, all fields are optional ! like this : email?: string etc
export interface UserUpdateDTO {
    id?: string;
    type?: TType;
    title?: string;
    slug?: string;
    description?: string;
    metadata?: {
        [key: string]: any;
    };
    createdAt?: Date;
    updatedAt?: Date;
}