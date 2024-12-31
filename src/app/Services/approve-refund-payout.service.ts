import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ApproveRefundPayoutService {

  Columns: any[] = [
    { name: 'id', label: 'Id' },
    { name: 'cashbackSchemeRef', label: 'Cashback Scheme Ref' },
    { name: 'mobile', label: 'Mobile' },
    { name: 'customerVpa', label: 'Customer Vpa' },
    { name: 'created', label: 'Created Date' },
    { name: 'updated', label: 'Updated Date' },
    { name: 'status', label: 'Status' },
    { name: 'payeeVPA', label: 'Payee VPA' },
    { name: 'amount', label: 'Amount' },
    { name: 'cashbackStatus', label: 'Cashback Status' },
    { name: 'sendervpa', label: 'Sender Vpa' },

  ];

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  getStatusDetails(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reward/search`, obj)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

  getByStatus(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reward/find-by-status`, obj)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

  approve(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reward/approve`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

  reject(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reward/reject`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }


}