import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';

@Injectable({
    providedIn: 'root'
  })
export class PayoutService {

  Columns: any[] = [
    { name: 'mid', label: 'MID' },
    { name: 'externalMid', label: 'External MID' },
    { name: 'externalTid', label: 'External TID' },
    { name: 'merchant-name', label: 'Merchant Name' },
    { name: 'legal-name', label: 'Legal Name' },
    { name: 'pan', label: 'PAN' },
    { name: 'wallet', label: 'Wallet' },
  ];

  columnsHistoryDisburement: any[] = [
    { name: 'id', label: 'Sr.No' },
    { name: 'payeeAccNo', label: 'Payee Acc No' },
    { name: 'mid', label: 'MID' },
    { name: 'created', label: 'Upload Date' },
    { name: 'uploadType', label: 'Upload Type' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'payeeMobile', label: 'Payee Mobile' },
    { name: 'payeeVPA', label: 'Payee VPA' },
    { name: 'amount', label: 'Total Amount' },
    { name: 'remarks', label: 'Remarks' },
    { name: 'status', label: 'Status' },
    { name: 'switchRc', label: 'Switch Rc' },
    { name: 'switchResponseMassage', label: 'Message' },
    { name: 'switchTxnId', label: 'Switch Txn Id' },
    { name: 'payoutStatus', label: 'NPCI Status' },
    { name: 'fileName', label: 'File Name' }
  ];

  //Search Merchant Column
  disbursmentColumns: any[] = [
    { name: 'mid', label: 'MID' },
    { name: 'externalMid', label: 'External MID' },
    { name: 'externalTid', label: 'External TID' },
    { name: 'merchant-name', label: 'Merchant Name' },
    { name: 'legal-name', label: 'Legal Name' },
    { name: 'pan', label: 'PAN' },
    { name: 'wallet', label: 'Wallet' },
  ];

  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helperService: HelperService) { }

  merchantSearch(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}disbursement/searchMerchant`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  //Add Disburement History API Call
  addDisbursment(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}disbursement/add`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  //Disburement History API Call
  disbursmentHistory(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}disbursement/history`, obj)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  //Approve/Reject API Call
  getByStatus(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}disbursement/find-by-status`, obj)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }
}