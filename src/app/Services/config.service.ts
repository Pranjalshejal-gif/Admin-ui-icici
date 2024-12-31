import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  add(request: any) {
    return this.http.post<any>(`${environment.apiUrl}institute-app-config/`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res.data;
      }));
  }

  get() {
    return this.http.get<any>(`${environment.apiUrl}institute-app-config/`)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res.data;
      }));

  }

  updateConfig(request: any) {
    return this.http.post<any>(`${environment.apiUrl}institute-app-config/update`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res.data;
      }));
  }

  deleteItem(id: number) {
    return this.http.post<any>(`${environment.apiUrl}institute-app-config/delete/${id}`,id)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }
}
