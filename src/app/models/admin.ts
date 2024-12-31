import { Role } from './role';

export class Admin {
    channel?: string;
    daysToPasswordExpiry: number;
    ck: string;
    sk: string;
    authdata?: string;
    userPermissions?: any;
    user: {
        id: number;
        nick: string;
        name: string;
        email: string;
        authType: number;
        loginAttempts: number;
        active: boolean;
        deleted: boolean;
        verified: boolean;
        roles: Role[];
        institute: {
            id: number;
            code: string;
            name: string;
            type: string;
            deleted: boolean;
            modules: { id: number; name: string; }[];
        };
        userProperties: {};
        lastActivity: number;
        hostInstitute: boolean;
    }
}