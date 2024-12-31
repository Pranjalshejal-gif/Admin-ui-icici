import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HelperService } from './helper.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  constructor(private http: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  getAll() {
    return this.http.get<any>(`${environment.apiUrl}dashboard/config/all`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  getDashboardTab(dashName: string) {
    return this.http.get<any>(`${environment.apiUrl}dashboard/load/${dashName}`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  reqUpdateToken(obj: any) {
    return this.http.post<any>(`${environment.apiUrl}token/ReqUpdateToken`, obj)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

}

