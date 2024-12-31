import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HelperService } from './helper.service';
import { SharedService } from './shared.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient, private sharedService: SharedService, private helper: HelperService) { }

  private dataSubject = new BehaviorSubject<string>('Initial Value');
  serviceData: any;

  data$ = this.dataSubject.asObservable();

  updateData(updatedData: any): void {
    this.dataSubject.next(updatedData);
    this.serviceData = updatedData;
    return updatedData;
  }

  getServiceData() {
    return this.serviceData ? this.serviceData : '';
  }

  getTransactions(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}bbps-token/search`, obj)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  getCustomers(mobile: string) {
    return this.httpClient.get<any>(`${environment.apiUrl}customer1/search/mobile/${mobile}`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
}
