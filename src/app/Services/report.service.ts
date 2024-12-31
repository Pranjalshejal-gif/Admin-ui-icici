import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

interface UserAdmin {
  id: string;
  name: string;
  title: string;
  query: string;
  selectedReport: string;
  subTitle: string;
  fileName: string;
  targetDb: string;
}
interface UserReportsCategory {
  id: number;
  title: string;
  showAsSubmenu: boolean;
  systemCategory: boolean;
}

interface UserTask {
  id: number;
  type: string;
  taskDescription: string;
}

interface UserScheduler {
  id: number;
  scheduleDesc: string;
  taskInterval: string;
  intervalUnit: number;
  nextExecDateTime: number;
  executionCount: number;
  active: string;
  tasks: any;
  deliveryType: string;
  emailFrom: string;
  emailTo: string;
  emailCc: string;
  emailContent: string;
  lastDate: any;
  ftpHost: any;
  ftpPort: any;
  ftpUser: any;
  ftpPassword: any;
  ftpRemoteDir: any;
  emailPassword: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  userReportsCategory: MatTableDataSource<UserReportsCategory>;
  userTask: MatTableDataSource<UserTask>;
  userScheduler: MatTableDataSource<UserScheduler>;
  UserAdmin: MatTableDataSource<UserAdmin>
  reportListColumns: any[] = [
    {name:'id', label:'id'},
    {name:'name', label:'name'},
    {name:'title', label:'title'},
    {name:'query', label:'query'},
    {name:'action', label:'action'}];
  reportInputColumns:any[] = [
    {name:'name', label:'name'},
    {name:'type', label:'type'},
    {name:'sql param', label:'sql parameter'},
    {name:'remove', label:'remove'}];
  reportsCategoryColumn: any[] = [
    {name:'id', label:'id'},
    {name:'title', label:'title'},
    {name:'showAsSubmenu', label:'show as submenu'},
    {name:'action', label:'action'}];
  taskColumn: any[] = [
    {name:'id', label:'id'},
    {name:'type', label:'type'},
    {name:'taskDescription', label:'description'},
    {name:'action', label:'action'}];
  schedulerColumn: any[] = [
    {name:'id',  label:'id'},
    {name:'scheduleDesc',  label:'description'},
    {name:'taskInterval',  label:'interval'},
    {name:'intervalUnit',  label:'unit'},
    {name:'lastDate',  label:'last date'},
    {name:'deliveryType',  label:'delivery type'},
    {name:'nextExecDateTime',  label:'new execution time'},
    {name:'active',  label:'active'},
    {name:'action', label:'action'}];
  constructor(private httpClient: HttpClient) { }

  reportList() {

  }

}
