import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigData } from 'src/app/models/config_data';
import { OtpService } from 'src/app/Services/otp.service';
import { UserService } from 'src/app/Services/user.service';
import * as CryptoJS from 'crypto-js';
import config from './../../../../assets/config.json';
import { CustomValidators } from '../../navigation/custom-validators';
import { SharedService } from 'src/app/Services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  configData: ConfigData = config;
  isUpdate: boolean = true;
  timerCount: any;
  isTimerEnds: boolean = false;
  resetForm: FormGroup;
  passwordResetForm: FormGroup;
  hide = true;
  type: string = 'password';
  secsTimeInterval: any;
  otpVal: any;
  otpInvalid: boolean = false;
  username: string;
  otpDeliveryMethod: string = 'Mobile';
  pwdPattern: string;
  pwdRegexMsgValidation: string;
  constructor(private router: Router,
    public userService: UserService, public otpService: OtpService,
    private fb: FormBuilder, private toast: ToastrService, private sharedSer: SharedService) {
    this.timer(0.5);
  }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      userName: [null, Validators.required],
    });
    this.passwordResetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern]],
      confirmPassword: [null, Validators.required],
    }, { validator: CustomValidators.MatchValidator('newPassword', 'confirmPassword') });
  }

  timer(minute: any) {
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 30;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 29;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.timerCount = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.isTimerEnds = true;
        clearInterval(timer);
      }
    }, 1000);
  }

  resend() {
    clearInterval(this.secsTimeInterval);
    this.isTimerEnds = false;

    let request = {
      "nick": this.username,
    };

    this.otpService.generateOtp(request).subscribe((data: any) => {
    });
    this.timer(0.5);
  }

  onSave() {
    this.username = this.resetForm.value.userName
    if (this.resetForm.invalid) {
      return;
    }
    const request = {
      "nick": this.username,
      "purpose": "PWD_RESET"
    };
    if (this.resetForm.valid) {
      this.otpService.generateOtp(request).subscribe((data: any) => {
        this.pwdPattern = this.otpService.pwdRegex;
        this.pwdRegexMsgValidation = this.otpService.pwdRegexMsg;
        if (data.success) {
          this.isUpdate = false;
          this.resetForm.get('userName')?.disable();
          this.resetForm.get('userName')?.updateValueAndValidity();
          this.otpDeliveryMethod = data && data.data && data.data['otp-delivery-method'] == 'MAIL' ? 'Mail' : 'Mobile';
        }
        else if (data.message) {
          this.toast.error(data.message)
        }
        else {
          this.toast.error("internal server error, please try again")
        }
      });
    }
  }

  onSubmit() {
    if (isNaN(this.otpVal)) {
      this.otpInvalid = true;
      return;
    }
    this.otpInvalid = this.otpVal.length == 6 ? false : true;
    if (this.passwordResetForm.invalid || this.otpInvalid) {
      return;
    }
    let request = {
      "nick": this.username,
      otpValue: this.sharedSer.getEncryptedString(this.otpVal),
      "otpType": "PWD_RESET",
      newPassword: this.sharedSer.getEncryptedString(this.passwordResetForm.value.newPassword)
    };

    this.otpService.validateOtp(request).subscribe(
      data => {
        if (data.success) {
          this.router.navigate(['/login']);
          this.userService.clearSessionData();
          this.toast.success(data.message)
        }
        else if (data.message) {
          this.toast.error(data.message)
        }
        else {
          this.toast.error("internal server error, please try again")
        }
      },
    );
  }

  passwordMatchError() {
    return (
      this.passwordResetForm.getError('mismatch') &&
      this.passwordResetForm.get('confirmPassword')?.touched
    );
  }

  hidePassword() {
    this.type = (this.type === 'password') ? 'text' : 'password';
    this.hide = this.type === 'password'
  }

  onCancel() {
    this.router.navigate(['/login']);
  }

  onOtpChange(evt: any) {
    this.otpInvalid = true;
    this.otpVal = evt;
    if (isNaN(this.otpVal))
      this.otpInvalid = true;
    else {

      this.otpInvalid = this.otpVal.length == 6 ? false : true;
    }
  }

}

