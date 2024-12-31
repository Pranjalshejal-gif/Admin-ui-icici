import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { UserData, UserPermissions } from '../models/user_data';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';
interface UserDataOld {
  id: string;
  name: string;
  nick: string;
  email: string;
  roles: string;
  last_activity: string;
  status: string;
}
export interface UserRolesOld {
  id: string;
  name: string;
  permissions: string;
  deleted: boolean;
  updatedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  displayedColumns: string[] = ['userID', 'name', 'email'];
  userDataOld: MatTableDataSource<UserDataOld>;
  userData: MatTableDataSource<UserData>;
  userRoles: MatTableDataSource<UserRolesOld>;
  userPermissions: MatTableDataSource<UserPermissions>;


  permissionColumns: string[] = ['id', 'value', 'action'];

  constructor(private httpClient: HttpClient, private sharedSer: SharedService, private helper: HelperService) { }

  search(filter: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}user/`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  searchLDAPUser(filter: string) {
    return this.httpClient.post<any>(`${environment.apiUrl}user/search-ldap-user/${filter}`, {})
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  add(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}user`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  update(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}user/update`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  unlockUser(id: number) {
    return this.httpClient.post<any>(`${environment.apiUrl}user/unlock`, { id: id })
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  deleteUser(id: number) {
    return this.httpClient.post<any>(`${environment.apiUrl}user/delete/${id}`, id)
      .pipe(map(res => {
        return res;
      }));
  }

}