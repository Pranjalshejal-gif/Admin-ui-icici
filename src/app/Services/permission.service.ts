import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HelperService } from './helper.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  getAll() {
    return this.httpClient.get<any>(`${environment.apiUrl}permission`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  update(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}permission/update`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

}
