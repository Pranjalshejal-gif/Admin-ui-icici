import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { UserIdleService } from 'angular-user-idle';
import { DialogComponent } from 'src/app/Shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from './dashboard.service';
import { UserManagementService } from './user-management.service';
import { KycService } from './kyc-management.service';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutGuard implements CanActivate {
  showPopup: boolean = true;

  constructor(private userService: UserService, private kycService: KycService, private router: Router, public dialog: MatDialog, private userIdle: UserIdleService, private dashboardSer: DashboardService, private userManageSer: UserManagementService) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): any {
    const routePermissions = route?.data['permissions']?.split(',');
    let hasPermissions = false;
    const permissions = this.userService?.userPermissions?.map((f: any) => f.id).flat();
    if (!routePermissions) {
      hasPermissions = true;
    }
    for (let i: number = 0; i < routePermissions?.length; i++) {
      hasPermissions = permissions?.some((item: any) => permissions?.includes(routePermissions[i]))
      if (hasPermissions) {
        break;
      }
    }
    if (this.userService.userSessionData && hasPermissions) {
      //Start watching for user inactivity.
      this.userIdle.startWatching();

      // // Start watching when user idle is starting.
      this.userIdle.onTimerStart().subscribe(count => {
        console.log("onTimerStart");
        if (this.showPopup) {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: "380px",
            data: {
              "msgSessionMsgTitle": `Your session is going to be expired in <b>60 seconds.</b>`,
              "msgSessionMsgBody": `If you wish to continue please click on Yes button,</br>` +
                `else the session will be auto-logged out.`,
              "type": "confirm"
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.restart();
              this.showPopup = true;
              this.kycService.getKycDetails().subscribe({})
            } else {
              this.stop();
              this.userService.logoutServerSession();
            }
          });
          this.showPopup = false;
        }
      });

      // Start watch when time is up.
      this.userIdle.onTimeout().subscribe(() => {
        this.userService.logoutServerSession();
      });
      return true;
    } else {
      this.userService.logout();
    }
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }
}
