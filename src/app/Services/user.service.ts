import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map } from 'rxjs';
import { DialogComponent } from '../Shared/dialog/dialog.component';
import { UserManagementService } from './user-management.service';
import { Admin } from '../models/admin';
import { environment } from 'src/environments/environment';
import { request } from 'http';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  spinnerVisibility: BehaviorSubject<any>;

  private userloginCheck = new BehaviorSubject<boolean>(false);
  loginCheck = this.userloginCheck.asObservable();
  headers: HttpHeaders = new HttpHeaders();
  captureUsersessionData: any;
  userSessionData: any;
  userPermissions: any;
  isVerified = false;
  pwdRegex: string = '^[A-Za-z]{1,1}[A-Za-z0-9]{7,20}$';
  pwdRegexMsg: string = 'Please enter valid Password';
  emailUIRegex: string;
  constructor(private matDialog: MatDialog, private sharedSer: SharedService, private helper: HelperService,
    private httpClient: HttpClient, private router: Router, private userManageSer: UserManagementService) {
    this.spinnerVisibility = new BehaviorSubject(false);
  }

  showSpinner() {
    setTimeout(() => {
      this.spinnerVisibility.next(true);
    }, 0);
  }

  hideSpinner() {
    setTimeout(() => {
      this.spinnerVisibility.next(false);
    }, 0);
  }

  public clearSessionData() {
    this.userSessionData = undefined;
    this.sharedSer.wk = undefined;
    this.sharedSer.wkAck = undefined;
    sessionStorage.removeItem('wk-ack');
    this.removeItemFromCache();
    window.location.reload();
  }

  updateUser(val: any) {
    this.userloginCheck.next(val);
  }

  public logoutServerSession() {
    this.httpClient.get(`${environment.apiUrl}user/logout`).subscribe((resp) => {
      this.router.navigate(['/login']);
      this.clearSessionData();
      this.matDialog.closeAll();
      window.location.reload();
    }, (err) => {
      this.router.navigate(['/login']);
      this.clearSessionData();
      this.matDialog.closeAll();
      window.location.reload();
    });
  }

  systemVersion() {
    return this.httpClient.get<any>(`${environment.apiUrl}app-info`)
      .pipe(map(res => {
        this.emailUIRegex = res['ui-props'].emailRegularExpression ? res['ui-props'].emailRegularExpression : this.emailUIRegex;
        return res;
      }));
  }

  logout(isConfirmationRequired = false) {
    if (!isConfirmationRequired) {
      this.logoutServerSession();
    } else {
      const dialogRef = this.matDialog.open(DialogComponent, {
        width: "300px",
        data: { "msg": "Do you want to logout?", "type": "confirm" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.logoutServerSession();
        }
      });
    }
  }

  who(wk: string) {
    this.headers = this.headers.set('wk', wk);
    return this.httpClient.get<any>(`${environment.apiUrl}user/who`, {
      observe: 'response',
      headers: this.headers
    })
      .pipe(map(res => {
        return res;
      }));
  }

  login(nick: any, password: string) {
    return this.httpClient.post<any>(`${environment.apiUrl}user/login`, { nick, password }, {
      headers: this.headers
    })
      .pipe(map(res => {
        res = this.helper.handleResponse(res);
        let admin: Admin = res.data;
        this.userSessionData = res;
        this.userPermissions = this.userSessionData?.data?.user?.userPerms;
        this.pwdRegex = res.data.PasswordPolicyRegEx ? res.data.PasswordPolicyRegEx : this.pwdRegex
        this.pwdRegexMsg = res.data.PasswordPolicyMessage ? res.data.PasswordPolicyMessage : this.pwdRegexMsg
        return res;
      }));
  }

  changePassword(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}user/change-password/`, request, {
      headers: this.headers
    })
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  async removeItemFromCache() {
    caches.keys().then((resp) => {
    }, (error) => {
      console.error("removeItemFromCache Error " + error);
    })
    for (const entry of await caches.keys()) {
      window.caches.open(entry).then(async (cache) => {
        return await cache.delete(entry);
      }, (error) => {
        console.error("removeItemFromCache Error while deleting" + entry);
      });
    }
  }



  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
};
