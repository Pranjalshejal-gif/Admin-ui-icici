// import { Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';


@Injectable({
  providedIn: 'root'
})
export class AgentService {


  roleColumns: any[] = [
    { name: 'id', label: 'Id' },
    { name: 'agentId', label: 'ID' },
    { name: 'agentName', label: 'Name' },
    { name: 'agentPaymentModes', label: 'Payment Modes' },
    {name:'agentPaymentChannels',label:'Channels'},
    {name:'agentShopName',label:'Shop Name'},
    {name:'agentMobileNo',label:'Mobile number'},
    {name:'agentRegisteredAddr', label: 'Address'},
    {name:'agentRegisteredCity',label: 'City'},
    {name:'agentRegisteredState',label: 'State'}
  ];


  constructor(private httpClient: HttpClient, private sharedSer: SharedService, private helper: HelperService) { }

  getAllRoles() {
    return this.httpClient.get<any>(`${environment.apiUrl}bbps-agent/get-all`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  updateRole(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}role/update`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  addRole(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}role`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  deleteRole(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}role/delete/${request}`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

}
