import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})

export class RcManagementService {

  rcColumns: any[] = [
    { name: 'rcLocalAdd', label: 'Action' },
    { name: 'idRc', label: 'ID' },
    { name: 'mnemonic', label: 'RC' },
    { name: 'description', label: 'Description' }
  ]

  localRcColumns: any[] = [
    { name: 'parentId', label: 'Parent ID' },
    { name: 'local', label: 'Destination' },
    { name: 'resultCode', label: 'RC' },
    { name: 'resultInfo', label: 'Message' },
    { name: 'rcedit', label: 'Action' }
  ]

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  rcSearch(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}rc/search`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

  rcAdd(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}rc`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

  localRcSearch(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}rc-details/search`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

  rcLocalAdd(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}rc-details/add`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

  rcLocalUpdate(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}rc-details/update-details`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }
}
