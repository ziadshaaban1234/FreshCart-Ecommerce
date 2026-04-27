import { IBrand } from "../IBrand/ibrand.interface";
import { ICategory } from "../ICategory/icategory.interface";

export interface IOrder {
    shippingAddress: ShippingAddress;
    taxPrice: number;
    shippingPrice: number;
    totalOrderPrice: number;
    paymentMethodType: string;
    isPaid: boolean;
    isDelivered: boolean;
    _id: string;
    user: User;
    cartItems: CartItem[];
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
}

interface CartItem {
    count: number;
    _id: string;
    product: Product;
    price: number;
}

interface Product {
    subcategory: Subcategory[];
    ratingsQuantity: number;
    _id: string;
    title: string;
    imageCover: string;
    category: ICategory;
    brand: IBrand;
    ratingsAverage: number;
    id: string;
}


interface Subcategory {
    _id: string;
    name: string;
    slug: string;
    category: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

interface ShippingAddress {
    details: string;
    phone: string;
    city: string;
}