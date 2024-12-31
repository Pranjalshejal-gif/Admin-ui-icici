import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';


export interface SearchHistory {

}

@Injectable({
  providedIn: 'root'
})
export class BulkPayoutService {
  historyColumns: any[] = [
    { name: 'uploadName', label: 'File Name' },
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

  disbursement_File_Type: number = 6;


  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helperService: HelperService) {

  }
  bulkHistroy(mid: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/reportHistory/` + mid + `/` + this.disbursement_File_Type)
      .pipe(map(res => this.helperService.handleResponse(res)));

  }
  DisbursmentuploadFileAndData(file: File) {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${environment.apiUrl}bulk-file-upload/request/disbursement-bulk-upload`, formData, { headers: headers });
  }

  getFileStatus(token: any, id: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/status/${token}/${id}`)
      .pipe(map(res => this.helperService.handleResponse(res)));
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