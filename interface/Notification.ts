export interface INotification{
    id?:number;
    title?: string;
    message?: string; // URL pública en Cloudinary
    userId?: number;
    sellId?:number;
    type?: string;
    orderBuy?:string;
    createAt?: Date;
    read?: boolean;
}