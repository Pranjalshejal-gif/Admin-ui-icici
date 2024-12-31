import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { first, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import config from '../../assets/config.json';
import { ConfigData } from 'src/app/models/config_data';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  wk: any;
  wkAck: any;
  headers: HttpHeaders = new HttpHeaders();
  merchantMid: string;
  configData: ConfigData = config;
  subType: string;
  sponsorId: string;
  ruleId: string;
  dataMccList: any[];
  dataLocationList: any[];
  uniqueStates: Location[];

  constructor(private httpClient: HttpClient, private toast: ToastrService,) {
    this.generateWK();
  }

  generateWK() {
    this.wk = this.randomString(16);
  }
  who() {
    if (!this.wk)
      this.generateWK();
    this.headers = this.headers.set('wk', this.wk);
    return this.httpClient.get<any>(`${environment.apiUrl}user/who`, {
      observe: 'response',
      headers: this.headers
    })
      .pipe(map(res => {
        sessionStorage.setItem('wk-ack', res.headers.get('wk-ack') || '');
        this.wkAck = this.getWkAck();
      }));
  }

  randomString(len: number) {
    let charSet = 'ABCDEF0123456789';
    var randomString = '';

    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  };

  getWkAck(): string {
    let storedwkack = sessionStorage.getItem('wk-ack') || '';
    var key = CryptoJS.enc.Utf8.parse(this.wk); //Shared AES KEY
    var iv = CryptoJS.enc.Utf8.parse("0000000000000000");
    var decrypted = CryptoJS.AES.decrypt(storedwkack, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  getEncryptedString(request: string) {
    if (!this.wkAck)
      this.who().subscribe();
    var key = CryptoJS.enc.Utf8.parse(this.wkAck.substring(0, 16)); //Shared AES KEY
    var ix = this.wkAck.substring(16, 32); //Initialization vector
    var iv = CryptoJS.enc.Utf8.parse(ix);

    var encrypted = CryptoJS.AES.encrypt(request, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }


  getDecryptedData(newReq: any) {

    var key = CryptoJS.enc.Utf8.parse(this.wkAck); //Shared AES KEY
    var iv = CryptoJS.enc.Utf8.parse("0000000000000000");

    return CryptoJS.AES.decrypt(
      newReq, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  raiseDayDiffMessage() {
    const allowedDateRange = this.configData.dayDiffForSearchCriteria
    this.toast.error("Invalid Date Range. From date and to date must only have a difference less than or equal to  " + allowedDateRange + " days")
  }

  // Set the FileSubtype  property with the selected Transaction type
  setTxntype(selectedTxntype: string) {
    this.subType = selectedTxntype;
  }

  setIds(selectedSponsorId: string, selectedRuleId: string) {
    this.sponsorId = selectedSponsorId;
    this.ruleId = selectedRuleId;
  }

  setPcbdcMccMetaData(metaResponse: any) {
    this.dataMccList = metaResponse.mccList
  }

  setPcbdcMetaData(metaResponse: any, uniqueStates: any) {
    this.dataMccList = metaResponse.mccList
    this.dataLocationList = metaResponse.locationList
    this.uniqueStates = uniqueStates;
  }

    // Set the merchantMid property with the selected merchant ID
    setMid(selectedMid: string) {
      this.merchantMid = selectedMid;
    }
}
