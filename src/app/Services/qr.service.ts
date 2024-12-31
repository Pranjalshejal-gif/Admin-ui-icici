import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class QRService {

  headers: HttpHeaders = new HttpHeaders();

  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  getAllWallet(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}merchant/generateQr`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  shareQr(request: any) {
    //Encrytion part is pending
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', request.file, request.file.name);
    formData.append('qr', JSON.stringify(request.qr))
    return this.httpClient.post<any>(`${environment.apiUrl}merchant/request/merchant-QR-share/qr`, formData, { headers: headers });
  }


  generateDynamicQr(request: any) {

    return "TestURL";
  }
  updateWallet(payload: any) {
  }
}
