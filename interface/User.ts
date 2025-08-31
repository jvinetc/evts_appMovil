import { ImagesData } from "./Images";
import { IRole } from "./Role";
import { SellData } from "./Sell";

export interface UserData {
    id?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    age?: number;
    username?: string;
    state?: string;
    image?: string;
    roleId?: number;
    createAt?: string;
    updateAt?: string;
    verification_token?: string;
    birthDate?: string;
    Sells?: SellData[] | null | undefined;
    Rol?: IRole | null | undefined;
    Images?: ImagesData[]  | null | undefined;
}
