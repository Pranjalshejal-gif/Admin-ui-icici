import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HelperService } from './helper.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class PcbdcService {

  reqStatusHistoryColumns: any[] = [
    { name: 'id', label: 'Sr.No' },
    { name: 'sponsorId', label: 'Sponsor ID' },
    { name: 'sponsorName', label: 'Sponsor Name' },
    { name: 'ruleId', label: 'Rule ID' },
    { name: 'amount', label: 'Amount' },
    { name: 'denomination', label: 'Denomination' },
    { name: 'created', label: 'Created Date' },
    { name: 'status', label: 'Status' },
    { name: 'checkStatus', label: 'Action' },
  ];

  ruleHistoryColumns: any[] = [
    { name: 'id', label: 'Sr.No' },
    { name: 'sponsorId', label: 'Sponsor ID' },
    { name: 'sponsorName', label: 'Sponsor Name' },
    { name: 'mccDetails', label: 'MCC' },
    { name: 'amount', label: 'Amount' },
    { name: 'remarks', label: 'Remarks' },
    { name: 'created', label: 'Created Date' },
    { name: 'expiryTimestamp', label: 'Expiry Date' },
    { name: 'ruleValidity', label: 'Rule Validity' },
    { name: 'type', label: 'Type' },
    { name: 'status', label: 'Status' },
    { name: 'ruleStatus', label: 'Check Status' }
  ];

  ruleSearchColumns: any[] = [
    { name: 'id', label: 'Sr.No' },
    { name: 'ruleId', label: 'Rule ID' },
    { name: 'sponsorId', label: 'Sponsor ID' },
    { name: 'sponsorName', label: 'Sponsor Name' },
    { name: 'mccDetails', label: 'MCC' },
    { name: 'created', label: 'Created Date' },
    { name: 'expiryTimestamp', label: 'Expiry Date' },
    { name: 'ruleValidity', label: 'Rule Validity' },
    { name: 'status', label: 'Status' },
    { name: 'ruleEnhance', label: 'Edit' },
    { name: 'ruleTopUp', label: 'Top-Up' }
  ];


  disbursementHistoryColumns: any[] = [
    { name: 'id', label: 'Sr.No' },
    { name: 'uploadName', label: 'File Uploaded Name' },
    { name: 'description', label: 'Description' },
    { name: 'totalRecords', label: 'Total Records' },
    { name: 'uploadedUser', label: 'Uploaded User' },
    { name: 'successfulCount', label: 'Success Count' },
    { name: 'status', label: 'Status' },
    { name: 'created', label: 'Created Date' },
    { name: 'downloadPcbdcBulkFile', label: 'Download' },
    { name: 'distursementStatus', label: 'Rule Status' },
  ];

  pcbdc_File_Type: number = 7;

  constructor(private httpClient: HttpClient, private helperService: HelperService) { }

  addSponsor(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/create-sponsor`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  getSponsor() {
    return this.httpClient.get<any>(`${environment.apiUrl}pcbdc/sponsor`)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  getMetaData(filter: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}pcbdc/metadata/all`)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  addRule(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/create-rule`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  ruleHistory() {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/pending-rule-history/`, this.pcbdc_File_Type)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  ruleSearch(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/search-rule`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  editRule(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/update-rule`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  enhanceRule(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/top-up-rule`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  getRuleId(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/find-by-sponsor-id`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  checkStatus(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/check-pcbdc-conversion-status`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  getAllProgramToken(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/get-program-token-availability`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  uploadPcbdcFileAndData(file: File) {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${environment.apiUrl}bulk-file-upload/request/pcbdc-bulk-upload`, formData, { headers: headers });
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

  bulkHistroy() {
    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/reportHistory/` + this.pcbdc_File_Type)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  getMetaStatus(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/pcbdc-meta-status`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  requisitionHistory() {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/sponsor-requisition-history`, {})
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  approveRule(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/approve-reject-rule`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  approveDisbursement(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/approve-disbursement`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  rejectDisbursement(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/reject-disbursement`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  getRcbdcBalance() {
    return this.httpClient.post<any>(`${environment.apiUrl}pcbdc/get-bank-token-availability`, {})
      .pipe(map(res => this.helperService.handleResponse(res)));
  }
}
