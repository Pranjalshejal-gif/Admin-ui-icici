import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

export interface CustomerService {
  name: string;
  email: string;
  mobile: string
  status: string
  vpa: string;
  pan: string;
  kycStatus: string;
  walletAddress: string;
  address: string;
  archivedDate: string;
  balance: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  CustomerColumns: any[] = [
    { name: 'name', label: 'name' },
    { name: 'email', label: 'email' },
    { name: 'mobile', label: 'mobile ' },
    { name: 'status', label: 'status' },
    { name: 'created',label: 'created date' },
    { name: 'archivedDate',label: 'De-activation date' },
    { name: 'vpa', label: 'vpa' },
    { name: 'pan', label: 'pan' },
    { name: 'kycStatus', label: 'kycStatus' },
    { name: 'walletAddress', label: 'walletAddress' },
    { name: 'address', label: 'address' },
    { name: 'account', label: 'account' },
    { name: 'balance', label: 'Balance' }];
  searchCustomer: MatTableDataSource<any>;
  bulkData: MatTableDataSource<any>;
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  customerSearch(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}customer1/searchCustomer/v1`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }
}
