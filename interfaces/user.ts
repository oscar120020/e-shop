export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: ValidRoles;
    createdAt: string;
    updatedAt: string;
    
}

export type ValidRoles = 'client' | 'admin'