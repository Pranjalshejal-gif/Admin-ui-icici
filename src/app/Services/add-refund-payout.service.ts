import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

interface SearchOnboard {
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
export class AddRefundPayoutService {

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  addRefundPayout(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reward/add`, request)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }

}
