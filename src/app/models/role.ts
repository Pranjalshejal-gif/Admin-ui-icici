import { Permission } from "./permission";


export class Role {
    id: number;
    name: string;
    permissions: Array<any>;
    deleted?: boolean;
    createdDate?: number;
    updatedDate?: number;
    permissionsName?: string;
}