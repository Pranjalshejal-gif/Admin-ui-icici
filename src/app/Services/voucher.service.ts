import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { DatePipe } from '@angular/common';
import { HelperService } from './helper.service';

@Injectable()

export class VoucherService {

  searchVoucher: any[] = [
    { name: 'code', label: 'Voucher Code' },
    { name: 'amount', label: 'Amount' },
    { name: 'email', label: 'Email' },
    { name: 'created', label: 'Created Date' },
    { name: 'expirationDate', label: 'Expiration Date' },
    { name: 'redeemDate', label: 'Redeem Date' },
    { name: 'status', label: 'Status' },
    { name: 'voucherEnhance', label: 'Edit' },
    { name: 'voucherCodeGenerate', label: 'Action' }
  ];

  searchVoucherTransaction: any[] = [
    { name: 'txnId', label: 'Transaction ID' },
    { name: 'type', label: 'Type' },
    { name: 'displayMessage', label: 'Display Message' },
    { name: 'currencyCode', label: 'Currency Code' },
    { name: 'amount', label: 'Amount' },
    { name: 'rc', label: 'RC' },
    { name: 'custRefNo', label: 'Customer Reference Id' },
    { name: 'date', label: 'Date' },
    { name: 'cbsRefId', label: 'CBS Reference Id' },
    { name: 'paymentMode', label: 'Payment Mode' },
    { name: 'payerName', label: 'Payer Name' },
    { name: 'payerVPA', label: 'Payer VPA' },
    { name: 'payerWallet', label: 'Payer Wallet' },
    { name: 'payeeName', label: 'Payee name' },
    { name: 'payeeVPA', label: 'Payee VPA' },
    { name: 'payeeWallet', label: 'Payee Wallet' },
    { name: 'status', label: 'Status' },
  ];

  voucherSettlement: any[] = [
    { name: 'voucherCode', label: 'Voucher Code' },
    { name: 'userWalletAdd', label: 'User Wallet Address' },
    { name: 'bankWalletAdd', label: 'Bank Wallet Address' },
    { name: 'unsettledAmount', label: 'Unsettled Amount' },
    { name: 'created', label: 'Created Date' },
    { name: 'refId', label: 'Locked Amount Referrence ID' },
    { name: 'status', label: 'Status' },
    { name: 'voucherSettlement', label: 'Action' }
  ];

  constructor(private httpClient: HttpClient,
    public datePipe: DatePipe,
    private helperService: HelperService) { }

  createVoucher(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}gff-voucher/add`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  updateVoucher(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}gff-voucher/update-voucher`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  topUpVoucher(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}gff-voucher/top-up-voucher`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  searchTransaction(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}gff-voucher/search-transaction`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  getVoucherByStatus(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}gff-voucher/find-by-status`, obj)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  getVoucherQR(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}gff-voucher/generate-qr`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  getUnsettledTxnByStatus(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}gff-voucher/find-unsettled-txn-by-status`, obj)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }

  updateUnsettledTxn(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}gff-voucher/update-txn`, request)
      .pipe(map(res => this.helperService.handleResponse(res)));
  }
}