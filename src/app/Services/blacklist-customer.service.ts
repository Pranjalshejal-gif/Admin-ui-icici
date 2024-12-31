import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HelperService } from './helper.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class BlacklistCustomerService {

  CustomerColumns: any[] = [
    { name: 'blockValue', label: 'Block Value' },
    { name: 'created', label: 'Created Date' },
    { name: 'status', label: 'Status' },
    { name: 'updated', label: 'Updated Date' },
    { name: 'updatedReason', label: 'Comment' },
    { name: 'srNumber', label: 'SR Number' },
    { name: 'custedit', label: 'Action' }, 
  ];

  HistoryColumns: any[] = [
    { name: 'blockType', label: 'Block Type' },
    { name: 'blockValue', label: 'Block Value' },
    { name: 'status', label: 'Status' },
    { name: 'created', label: 'Created Date' },
    { name: 'updated', label: 'Updated Date' },
    { name: 'makerId', label: 'Maker Id' },
    { name: 'checkerId', label: 'Checker Id' },
    { name: 'makerCheckerStatus', label: 'Maker Checker Status' },
    { name: 'srNumber', label: 'SR Number' },
    { name: 'responseMessage', label: 'Response Message' },
  ];
  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  private dataSubject = new BehaviorSubject<string>('Initial Value');
  serviceData: any;

  data$ = this.dataSubject.asObservable();

  getBlacklistedCustomers(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}mobile-blacklist/search`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  addBlacklistCustomer(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}mobile-blacklist/add-customer`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  updateBlacklistCustomer(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}mobile-blacklist/update-blacklist-customer`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  approveRejectBlacklisting(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}mobile-blacklist/approve-reject`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  uploadFileAndData(file: File, flag: any) {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${environment.apiUrl}bulk-file-upload/request/${flag}`, formData, { headers: headers });
  }

  getByStatus(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}mobile-blacklist/find-by-status`, obj)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  blacklistHistory(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}mobile-blacklist/blacklist-history`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
}