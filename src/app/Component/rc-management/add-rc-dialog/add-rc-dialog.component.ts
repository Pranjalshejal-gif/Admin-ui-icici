import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RcManagementService } from 'src/app/Services/rc-management.service';
import { UserService } from 'src/app/Services/user.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';

@Component({
  selector: 'app-add-rc-dialog',
  templateUrl: './add-rc-dialog.component.html',
  styleUrls: ['./add-rc-dialog.component.scss']
})
export class AddRcDialogComponent implements OnInit {

  addForm: FormGroup;
  isValid: boolean = false;
  isInvalid: boolean = false;
  panelOpen: boolean = true;

  constructor(
    private fb: FormBuilder,
    private searchRC: RcManagementService,
    private toast: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<AddRcDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      mnemonic: ['', [Validators.required, Validators.pattern(RegularExpression.RC)]],
      description: ['', [Validators.required, Validators.pattern]],
    })
  }

  submit() {
    if (this.addForm.invalid) {
      return;
    }
    else {
      let request = {
        "mnemonic": this.addForm.value.mnemonic,
        "description": this.addForm.value.description,
      }
      this.searchRC.rcAdd(request).subscribe(
        data => {
          if (data && data.success) {
            this.dialogRef.close();
            this.userService.reloadCurrentRoute();
            this.panelOpen = false;
          }
          else {
            this.toast.error(data && data.message);
          }
        },
      )
    }
    this.isInvalid = false;
    this.isValid = false
  }

  reset() {
    for (let value in this.addForm.controls) {
      this.addForm.controls[value].setValue('');
      this.addForm.controls[value].setErrors(null);
    }
  }
}
