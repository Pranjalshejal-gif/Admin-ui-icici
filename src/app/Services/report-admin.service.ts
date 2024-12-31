import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class ReportAdminService {

  constructor(private httpClient: HttpClient, public datepipe: DatePipe, private sharedSer: SharedService, private helper: HelperService) { }

  getAll() {
    return this.httpClient.get<any>(`${environment.apiUrl}report`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  deleteItem(id: number) {
    return this.httpClient.post<any>(`${environment.apiUrl}report/delete/${id}`, id)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  inputField(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}report/get-input-fields`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  fetchReport(request: any) {

    return this.httpClient.post<any>(`${environment.apiUrl}report/sample-execution`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  fetchReportDownload(reportName: string, reprtType: string, inputParams: any) {
    window.location.href = (`${environment.apiUrl}report/export/${reportName}/${reprtType}?q=${encodeURIComponent(JSON.stringify(inputParams))}`)
  }

  saveReport(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}report/update`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  saveReportAdd(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}report`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  getReportId(id: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}report/get-reportID/${id}`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  getReportIdDB(id: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}report/get-reportID/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }
}
