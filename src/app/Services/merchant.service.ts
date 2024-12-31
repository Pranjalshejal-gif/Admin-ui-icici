import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';

export interface SearchMerchant {
  mid: number;
  tid: number;
  externalMid: number;
  externalTid: number;
  name: string;
  legal: string;
  pan: string;
  address: string;
  number: number;
  registeredNumber: number;
  email: string;
  walletAddress: string;
  vpa: string;
  mcc: string;
  kyc: string;
  linkedbank: string,
  walletId: number,
  expanded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  merchantColumns: any[] = [
    { name: 'mid', label: 'mid' },
    { name: 'tid', label: 'tid' },
    { name: 'externalMid', label: 'external mid' },
    { name: 'externalTid', label: 'external tid' },
    { name: 'merchant-name', label: 'name' },
    { name: 'legal-name', label: 'legal' },
    { name: 'pan', label: 'pan' },
    { name: 'walletAddress', label: 'wallet' },
];
  searchMerchant: MatTableDataSource<any>;
  bulkData: MatTableDataSource<any>;
  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  merchantSearch(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}merchant/searchMerchant`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }


  update(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}merchant/updateMerchant`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  enable(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}merchant/enableMerchant`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  disable(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}merchant/disableMerchant`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }


  uploadFileAndData(file: File) {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${environment.apiUrl}bulk-file-upload/request/merchant-bulk-upload`, formData, { headers: headers });
  }
  getFileStatus(token: any, id: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/status/${token}/${id}`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  getReport(token: any, id: any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/octet-stream'
    });

    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/report/${token}/${id}`,
      { headers: header, responseType: 'blob' as 'json', observe: 'response' })
      .pipe(map(res => {

        return res;
      }));
  }

}
