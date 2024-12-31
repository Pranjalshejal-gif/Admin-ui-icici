import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class LoadDisbursmentService {

  constructor(private httpClient: HttpClient, private sharedSer: SharedService, private helperService: HelperService) { }

  // --------------------------load Disbursment API-----------//
  loadMoney(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}disbursement/load`, obj)
      .pipe(map(res => this.helperService.handleResponse(res)));

  }


  // --------------------------load Disbursment Approve/Reject -----------//

  loadapprove(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}disbursement/approve-reject`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  loadreject(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}disbursement/approve-reject`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }



}
