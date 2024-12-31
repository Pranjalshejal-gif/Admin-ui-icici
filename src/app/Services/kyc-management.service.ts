import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { KycTransaction } from '../models/kyc_transaction';
import { HelperService } from './helper.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class KycService {

  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  getKycDetails() {
    return this.httpClient.get<any>(`${environment.apiUrl}kyclimit`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  updateKyc(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}kyclimit/kycAdd`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

}
