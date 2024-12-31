import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SharedService } from "./shared.service";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { map } from "rxjs";
import { HelperService } from "./helper.service";

@Injectable({
  providedIn: 'root'
})
export class scheduledReportService {

  reportsDataColumns: any[] = [
    { name: "reportCategory", label: "Report Category" },
    { name: "reportName", label: "Report Name" },
    { name: "inputParams", label: "Input Parameters" },
    { name: "status", label: "Status" },
    { name: "createdDate", label: "Created Date" },
    { name: "updatedDate", label: "Updated Date" },
    { name: "scheduleDownload", label: "Action" }
  ];

  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  scheduleReport(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}scheduled-reports/addReport`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  reportSearch(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}scheduled-reports/getAll`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  getScheduledReport(id: any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/octet-stream'
    });

    return this.httpClient.get<any>(`${environment.apiUrl}scheduled-reports/download/${id}`,
      { headers: header, responseType: 'blob' as 'json', observe: 'response' })
      .pipe(map(res => {

        return res;
      }));
  }

}
