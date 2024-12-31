import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

export interface SearchHistory {

}

@Injectable({
  providedIn: 'root'
})
export class LoadCashbackService {

  historyColumns: any[] = [
    { name: 'id', label: 'Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'status', label: 'Status' },
    { name: 'created', label: 'Created Date' },
    { name: 'remarks', label: 'Remarks' },
    { name: 'payeeVPA', label: 'Payee VPA' },
    { name: 'switchResponseMassage', label: 'Switch Response Message' },


  ];

  constructor(private httpClient: HttpClient, private sharedSer: SharedService) { }

  loadMoney(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reward/load`, obj)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));

  }

  //------------ cashback load history-------------

  loadHistroy(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reward/load-history`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));

  }

  // --------------------------loadcashback appreg -----------

  loadapprove(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reward/load/approve-reject`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

  loadreject(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reward/load/approve-reject`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

  // --------------------------loadcashback PROFILE -----------
  viewProfile() {
    return this.httpClient.get<any>(`${environment.apiUrl}reward/viewProfile`)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));

  }


}