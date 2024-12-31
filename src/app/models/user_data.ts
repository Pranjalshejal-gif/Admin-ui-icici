export interface UserData {
    id: string;
    name: string;
    nick: string;
    email: string;
    roles: UserRoles[];
    lastActivity: string;
    active: boolean;
    deleted: boolean;
    verified: boolean;
    authType: number;
    updatedDate: string;
    hostInstitute: string;
    loginAttempts: number;
}
export interface UserTableData {
  id: string;
  name: string;
  nick: string;
  email: string;
  mobileNo: string;
  roles: UserRoles[];
}

export interface UserRoles {
    id: string;
    name: string;
    permissions: UserPermissions[];
    deleted:boolean;
    updatedDate: string;
  }
export interface UserPermissions {
    id: string;
    value: string;
    module: string;
  }