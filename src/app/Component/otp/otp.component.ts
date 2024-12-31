import { Component, OnInit, ViewChild } from '@angular/core';
import config from './../../../assets/config.json';
import { ConfigData } from 'src/app/models/config_data';
import { UserService } from 'src/app/Services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogChangePasswordComponent } from '../navigation/dialog-change-password/dialog-change-password.component';
import { OtpService } from 'src/app/Services/otp.service';
import * as CryptoJS from 'crypto-js';
import { NgOtpInputComponent } from 'ng-otp-input';
import { SharedService } from 'src/app/Services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  configData: ConfigData = config;
  isUpdate: boolean = true;
  minsTimeCounter: any;
  secsTimeCounter: any;
  isTimerEnds: boolean = false;
  secsTimeInterval: any;
  minTimeInterval: any;
  otpVerifiedForm: FormGroup;
  userData: any;
  @ViewChild('ngOtpInput') ngOtpInputRef: any;
  otpVal: any;
  otpInvalid: boolean = false;
  otpDeliveryMethod: string = 'Mobile';

  constructor(
    public userSer: UserService,
    public otpService: OtpService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<OtpComponent>,
    private toast: ToastrService,
    private sharedSer: SharedService
  ) {
    this.userData = this.userSer.userSessionData.data
    this.secsTimer(0.5);
  }

  ngOnInit(): void {
    this.otpVerifiedForm = this.fb.group({
      otpValue: ['', Validators.required],
    });
    this.otpDeliveryMethod = this.userData['login.otp.delivery.method'] == 'MAIL' ? 'Mail' : 'Mobile';
  }

  get f() { return this.otpVerifiedForm.controls }

  onOtpChange(evt: any) {
    this.otpVal = evt;
    if (isNaN(this.otpVal))
      this.otpInvalid = true;
    else if (this.otpVal.length == 6) {
      this.otpInvalid = false;
      let request = {
        "nick": this.userData.user.nick,
        otpValue: this.sharedSer.getEncryptedString(this.otpVal),
        "otpType": "LOGIN",
      };
      this.otpService.validateOtp(request).subscribe((data: any) => {
        this.userSer.isVerified = true;
        if (data.success) {
          if (this.userData.LogedWithTempPassword) {
            this.dialogRef.close();
            this.dialog.open(DialogChangePasswordComponent, {
              width: '27%',
              disableClose: true,
            });
          } else if (request.otpValue == data.data) {
            this.router.navigate(['/dashboard']);
            this.dialogRef.close();
          } else {
            this.toast.error("Something unexpected occurred, please check with administrator")
          }
        }
        else if (data.message) {
          this.toast.error(data.message)
        }
        else {
          this.toast.error("Internal server error, please try again")
        }
      });
    }
  }
  secsTimer(minute: any) {
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 30;
    const prefix = minute < 10 ? "0" : "";
    this.secsTimeInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 29;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.secsTimeCounter = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.isTimerEnds = true;
        clearInterval(this.secsTimeInterval);
      }
    }, 1000);
  }



  back() {
    this.ngOnInit()
  }

  resend() {
    clearInterval(this.secsTimeInterval);
    clearInterval(this.minTimeInterval);
    this.ngOtpInputRef.setValue(null);
    this.isTimerEnds = false;
    let request = {
      "nick": this.userData.user.nick,
    };
    this.otpService.generateOtp(request).subscribe((data: any) => {
    });
    this.secsTimer(0.5);
  }

}
