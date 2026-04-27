
export interface IUser {
    role: string;
    active: boolean;
    wishlist: any[];
    _id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    addresses: Address[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    passwordChangedAt: string;
}

interface Address {
    _id: string;
    name: string;
    details: string;
    phone: string;
    city: string;
}