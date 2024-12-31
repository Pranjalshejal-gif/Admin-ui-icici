import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import config from './../../assets/config.json';
import { SharedService } from './shared.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class HelperService {
  static DATE_FORMATS: any;

  constructor(private datePipe: DatePipe,
    private sharedService: SharedService,
    private httpClient: HttpClient,
    private toast: ToastrService,) { }

  public static readonly MY_FORMATS = {
    parse: {
      dateInput: 'DD-MMM-YYYY', // this is how your date will be parsed from Input
    },
    display: {
      dateInput: config.dateFormatForTxn, // this is how your date will get displayed on the Input
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  };

  public isNullorUndefined(val: any): boolean {
    return val == undefined || val == '' || val == null;
  }

  public formatDate(value: any): string {
    const formattedDate = this.datePipe.transform(value, 'dd-MM-yyyy');
    return formattedDate || ''; // return an empty string if the result is null
  }

  handleResponse(res: any) {
    if (res && res["payloadResponse"]) {
      return JSON.parse(this.sharedService.getDecryptedData(res["payloadResponse"]));
    } else {
      console.log("Invalid Response Received");
      return null;
    }
  }

  errorResponse(message: any) {
    this.toast.error(message, '', { enableHtml: true });
  }

  //getFileTemplate
  getFileTemplateAndSave(flag: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/octet-stream'
    });

    let blobResponse = this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/download-template/${flag}`,
      { headers: header, responseType: 'blob' as 'json', observe: 'response' })
      .pipe(map(res => {
        return res;
      }));

    blobResponse.subscribe(res => {
      const contentDisposition = res.headers.get('content-disposition');

      const fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim()
        .replace("\"", "").replace("\"", "");
      if (fileName) {

        FileSaver.saveAs(res.body, fileName);
      }
      else
        this.toast.error("Error downloading file!");
    }, err => {
      this.toast.error("Error downloading file!");
    });

  }

}
