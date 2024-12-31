import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class DisputeManagement {

  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  getDispute() {
    return this.httpClient.get<any>(`${environment.apiUrl}dispute`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  updateDetails(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}dispute/update/post`, obj)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

}
