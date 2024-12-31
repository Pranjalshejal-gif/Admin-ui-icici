import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

export interface SearchRefundPayout {
  txnType: string;
  refundOrgMerchantRef: string;
  refundOrgTxnId: string;
  payeeMobile: string;
  payeeVPA: string;
  amount: string;
  remarks: string;
}


@Injectable({
  providedIn: 'root'
})
export class RefundPayoutService {

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  CashBackuploadFileAndData(file: File) {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${environment.apiUrl}bulk-file-upload/request/reward-requestfile-upload`, formData, { headers: headers });
  }

  getFileStatus(token: any, id: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/status/${token}/${id}`)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
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