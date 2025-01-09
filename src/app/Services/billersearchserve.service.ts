import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class BillersearchserveService {


    CustomerColumns: any[] = [
    { name: 'blrId', label: 'Biller Id' },
    { name: 'blrName', label: 'Biller Name' },
    {name : 'blrCategoryName',label: 'Category Name'}
    // { name: 'agentMobileNo', label: 'mobile ' },
    // { name: 'status', label: 'status' },
    // { name: 'created',label: 'created date' },
    // { name: 'archivedDate',label: 'De-activation date' },
    // { name: 'vpa', label: 'vpa' },
    // { name: 'pan', label: 'pan' },
    // { name: 'kycStatus', label: 'kycStatus' },
    // { name: 'walletAddress', label: 'walletAddress' },
    // { name: 'address', label: 'address' },
    // { name: 'account', label: 'account' },
    // { name: 'balance', label: 'Balance' }
  ];
  searchCustomer: MatTableDataSource<any>;
  bulkData: MatTableDataSource<any>;
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  customerSearch(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}bbps-biller/search`, request)
      .pipe(map(res => {
        console.log("res" + JSON.stringify(res))
        if (res && res["payloadResponse"])
          
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));

        
        else
          res = null;
        return res;
        
      }));
  }
}
