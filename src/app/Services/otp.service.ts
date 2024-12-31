import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  headers: HttpHeaders = new HttpHeaders();
  pwdRegex: string = '^[A-Za-z]{1,1}[A-Za-z0-9]{7,20}$';
  pwdRegexMsg: string = 'Please enter valid Password';

  constructor(private httpClient: HttpClient, private sharedSer: SharedService) { }

  generateOtp(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}user/gen-login-otp`, request)
      .pipe(map(res => {
        console.log(JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"])))
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"]));
        else {
          res = null;
          return res;
        }
        this.pwdRegex = res.data.PasswordPolicyRegEx ? res.data.PasswordPolicyRegEx : this.pwdRegex;
        this.pwdRegexMsg = res.data.PasswordPolicyMessage ? res.data.PasswordPolicyMessage : this.pwdRegexMsg
        return res;

      }));
  }

  validateOtp(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}user/verify-user-otp`, request, {
      headers: this.headers
    })
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }
}

