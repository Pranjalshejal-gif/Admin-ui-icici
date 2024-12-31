import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  roleColumns: any[] = [
    { name: 'id', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'permission', label: 'Permission' },
    { name: 'action', label: 'Action' },
];

  


  constructor(private httpClient: HttpClient, private sharedSer: SharedService, private helper: HelperService) { }

  getAllRoles() {
    return this.httpClient.get<any>(`${environment.apiUrl}role`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  updateRole(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}role/update`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  addRole(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}role`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  deleteRole(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}role/delete/${request}`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

}
