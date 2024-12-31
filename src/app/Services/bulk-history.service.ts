import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

export interface SearchHistory {

}

@Injectable({
  providedIn: 'root'
})
export class BulkHistoryService {

  historyColumns: any[] = [
    { name: 'fileName', label: 'File Name' },
    { name: 'status', label: 'Status' },
    { name: 'created', label: 'Created Date' },
    { name: 'totalRecords', label: 'Total Records' },
    { name: 'successfulCount', label: 'Success Record' },
    { name: 'errorRecord', label: 'Error Record' },
    { name: 'description', label: 'Description' },
    { name: 'downloadbulk', label: 'Action' },

  ];

  SearchHistory: MatTableDataSource<any>;
  bulkData: MatTableDataSource<any>;

  cashBack_File_Type: number = 5;


  constructor(private httpClient: HttpClient, private sharedService: SharedService) {

  }
  bulkHistroy() {
    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/reportHistory/` + this.cashBack_File_Type)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));

  }

}
