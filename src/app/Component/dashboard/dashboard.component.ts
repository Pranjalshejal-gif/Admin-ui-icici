import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/Services/user.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/Services/shared.service';
import { MonitorService } from 'src/app/Services/monitor.service';
import { CdkTextColumn } from '@angular/cdk/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { stringify } from 'querystring';
import { interval, Subscription } from 'rxjs';
import config from './../../../assets/config.json';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  tabConfigData: any;
  output: any;
  tabData: any;
  w4data: any;
  showResult: boolean;
  showTabResult: boolean;
  tabName: string;
  autoRefreshInterval: number = 0;
  autoRefreshTimer: any;
  autoRefreshTime: number = config.autoRefreshTime; //set deafault value in config.json

  private updateSubscription: Subscription;

  constructor(public userSer: UserService, private monitor: MonitorService, private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.getData();
    if (this.autoRefreshInterval) {
      this.autoRefresh();
    }
  }
  reloadPage() {
    this.ngOnInit();
  }

  onKeyPress(event: any) {
    const enteredValue = event.target.value;
    if (enteredValue.length > 3) {
      this.autoRefreshInterval = parseInt(enteredValue.slice(0, 3), 10);
      this.toast.error('Maximum Allowed value is 999 secs');
      return;
    }
    // Check if the auto refresh interval is less than or equal to the auto refresh time
    this.autoRefreshInterval = parseInt(event.target.value, 10); // Parse the entered value into an integer
    if (this.autoRefreshInterval <= this.autoRefreshTime) {
      this.toast.error('Refresh time should be greater than ' + this.autoRefreshTime + ' secs');
      return;
    }
    else {
      this.toast.clear();// Clear any previous error messages
      // Initiate auto refresh if the entered value is valid
      if (this.autoRefreshInterval) {
        this.autoRefresh();
      } else {
        clearInterval(this.autoRefreshTimer);
      }
    }
  }

  showRefresh() {
    return (this.autoRefreshInterval <= this.autoRefreshTime) || isNaN(this.autoRefreshInterval);
  }

  autoRefresh() {
    // If an autoRefreshTimer is already set, clear the previous interval
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
    }
    // If the autoRefreshInterval is set, initiate a new interval to execute the getData function at the specified time interval
    if (this.autoRefreshInterval) {
      this.autoRefreshTimer = setInterval(() => {
        this.getData(); //Call the getData function to fetch updated data
      }, this.autoRefreshInterval * 1000); // The time interval is determined by the autoRefreshInterval property, converted to seconds
    }
  }

  getData() {
    this.monitor.getAll().subscribe(
      (res) => {
        this.showResult = false;
        if (res) {
          this.tabConfigData = res.schema.tabConfig;
          this.showResult = true;
        } else {
          this.tabConfigData = null;
        }
      }
    )
  }
  // to clear the timer when the component is destroyed
  ngOnDestroy() {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
    }
  }

  selectedTabValue(event: any) {
    if (typeof event === "string") {
      this.tabName = event;
    } else {
      this.tabName = event.tab.textLabel;
    }
    this.monitor.getDashboardTab(this.tabName).subscribe(
      (res) => {
        this.showTabResult = false;
        if (res) {
          this.showTabResult = false;
          this.tabData = res;
          this.output = res.consolidateOutput;
        }
        else {
          this.tabData = null;
        }
      })
  }
}
