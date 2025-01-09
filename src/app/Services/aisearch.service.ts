import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root'
})
export class AisearchService {

   CustomerColumns: any[] = [
    { name: 'agentInstId', label: 'Institute Id' },
   { name: 'agentInstName', label: 'Institute Name ' },
    { name: 'agentInstType', label: 'Institute Type' },
   
   
  ];

  searchCustomer: MatTableDataSource<any>;
  bulkData: MatTableDataSource<any>;
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  customerSearch(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}bbps-ai/search`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }
}
