import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/Services/user.service';
import config from './../../../assets/config.json';
import * as CryptoJS from 'crypto-js';
import { ConfigData } from 'src/app/models/config_data';
import { MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { SharedService } from 'src/app/Services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogChangePasswordComponent } from '../navigation/dialog-change-password/dialog-change-password.component';
import { OtpComponent } from '../otp/otp.component';
import { NgxCaptchaService } from '@binssoft/ngx-captcha'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  hide = true;
  type: string = 'password';
  configData: ConfigData = config;
  welcomeMsg: string = config.welcomeMsg;
  loginRequiredForm: FormGroup;

  @ViewChild('captcha') myChild: any;
  captchaStatus: any = null;
  captchaConfig: any = {
    length: 6,
    cssClass: 'custom',
    back: {
      stroke: "#2F9688",
      solid: "#f2efd2"
    },
    font: {
      color: "#000000",
      size: "35px"
    }
  };
  otp: any;
  showCaptcha: boolean = false;
  decrypted: string;
  encrypted: any = "";
  version: any;
  uiVersion: string = config.uiVersion;

  constructor(private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private captchaService: NgxCaptchaService,
    private toast: ToastrService,
    public dialog: MatDialog,
    private sharedService: SharedService) {

  }

  ngOnInit(): void {
    this.sharedService.who().subscribe();
    this.loginRequiredForm = this.fb.group({
      userName: ['admin', Validators.required],
      password: ['test', Validators.required]
    });
    this.userService.systemVersion().subscribe(res => {
      this.version = res.version;
    });
  }

  get f() { return this.loginRequiredForm.controls; }

  ngAfterViewInit(): void {
    this.showCaptcha = true;
  }

  login() {
    if (this.loginRequiredForm.invalid) {
      return;
    }
    if (this.myChild.captch_input !== this.myChild.resultCode) {
      this.toast.error("Please enter valid Captcha");
      return;
    }
    this.userService.showSpinner();

    let password;
    password = this.sharedService.getEncryptedString(this.f['password'].value);

    this.userService.login(this.f['userName'].value, password)
      .pipe(first())
      .subscribe(res => {
        this.userService.hideSpinner();
        if (res.success && res.data) {
          if (this.userService.userSessionData.data['login-otp-validation'] == true) {
            const dialogRef = this.dialog.open(OtpComponent, {
              width: '50%',
              disableClose: true,
              autoFocus: false
            }).afterClosed().subscribe(() => {
              let element: HTMLElement = document.getElementsByClassName('cpt-btn reload')[0] as HTMLElement;
              element.click();
              this.myChild.captch_input = null;
            });
          } else {
            this.userService.isVerified = true;
            this.router.navigate(['/dashboard']);
          }
        }
        else if (res.message) {
          this.toast.error(res.message)
        }
        else {
          this.toast.error("internal server error, please try again")
        }
      },
        error => {
          this.userService.hideSpinner();
        });
  }

  hidePassword() {
    this.type = (this.type === 'password') ? 'text' : 'password';
    this.hide = this.type === 'password'
  }

}
