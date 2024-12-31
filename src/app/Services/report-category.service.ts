import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HelperService } from './helper.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ReportCategoryService {

  constructor(private httpClient: HttpClient, private sharedSer: SharedService, private helper: HelperService) { }

  getAll() {
    return this.httpClient.get<any>(`${environment.apiUrl}report/get-report-category`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  getAllReportDB() {
    return this.httpClient.get<any>(`${environment.apiUrl}report/get-report-db`)
      .pipe(map(res =>
        this.helper.handleResponse(res)
      ));
  }

  add(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reportcategory`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  update(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}reportcategory/update`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  deleteItem(id: number) {
    return this.httpClient.post<any>(`${environment.apiUrl}reportcategory/delete/${id}`, id)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
}
