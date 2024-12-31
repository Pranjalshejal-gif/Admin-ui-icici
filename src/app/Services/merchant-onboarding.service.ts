import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';

interface SearchOnboard {
  mid: number;
  tid: number;
  externalMid: number;
  externalTid: number;
  name: string;
  legal: string;
  pan: string;
  address: string;
  number: number;
  registeredNumber: number;
  email: string;
  aggregatorEmail: string;
  wallet: string;
  vpa: string;
  mcc: string;
  kyc: string;
  linkedbank: string,
  walletId: number,
  expanded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MerchantOnboardService {

  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  addMerchant(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}merchant/addMerchant`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
}
