import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Services/user.service';
import { CustomValidators } from '../custom-validators';
import * as CryptoJS from 'crypto-js';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/Services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.scss']
})
export class DialogChangePasswordComponent implements OnInit {

  addForm: FormGroup;
  oldPassword_hide = true;
  newPassword_hide = true;
  confirmPassword_hide = true;
  LogedWithTempPassword: boolean;
  pwdPattern: string;
  pwdRegexMsgValidation: string;

  type: string = 'password';

  constructor(
    private router: Router,
    private location: Location,
    public userService: UserService,
    private fb: FormBuilder,
    private sharedSer: SharedService,
    private toast: ToastrService,
    public dialogRef: MatDialogRef<DialogChangePasswordComponent>
  ) {
    this.LogedWithTempPassword = this.userService.userSessionData?.data?.LogedWithTempPassword;
  }
  get f() { return this.addForm.controls; }

  ngOnInit(): void {
    this.pwdPattern = this.userService.pwdRegex;
    this.pwdRegexMsgValidation = this.userService.pwdRegexMsg;
    this.addForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.required]],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validator: CustomValidators.MatchValidator('newPassword', 'confirmPassword') });
  }

  

  onSubmit() {
    if (this.addForm.invalid) {
      return;
    }
    let request = {
      id: this.userService.userSessionData?.data?.user.id,
      oldPassword: this.sharedSer.getEncryptedString(this.addForm.value.oldPassword),
      newPassword: this.sharedSer.getEncryptedString(this.addForm.value.newPassword)
    };
    if (this.addForm.valid) {
      this.userService.changePassword(request).subscribe(
        data => {
          if (data.success) {
            this.dialogRef.close();
            this.userService.logout();
          }
        },
      );
    }
  }

  passwordMatchError() {
    return (
      this.addForm.getError('mismatch') &&
      this.addForm.get('confirmPassword')?.touched
    );
  }

  hidePassword() {
    this.type = (this.type === 'password') ? 'text' : 'password';
    this.oldPassword_hide = this.type === 'password';
    this.newPassword_hide = this.type === 'password';
    this.confirmPassword_hide = this.type === 'password';
  }
}
