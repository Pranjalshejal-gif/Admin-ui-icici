import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RcManagementService } from 'src/app/Services/rc-management.service';
import { UserService } from 'src/app/Services/user.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';

@Component({
  selector: 'app-add-rc-local-dialog',
  templateUrl: './add-rc-local-dialog.component.html',
  styleUrls: ['./add-rc-local-dialog.component.scss']
})
export class AddRcLocalDialogComponent implements OnInit {
  addForm: FormGroup;
  isValid: boolean = false;
  isInvalid: boolean = false;
  rcData: any = {};
  panelOpen: boolean = true;

  constructor(
    private fb: FormBuilder,
    private searchRC: RcManagementService,
    private toast: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<AddRcLocalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rcData = data?.data;
  }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      id: [{ value: this.rcData.id, disabled: true }],
      local: ['', [Validators.required, Validators.pattern]],
      resultCode: ['', [Validators.required, Validators.pattern(RegularExpression.RC)]],
      resultInfo: ['', [Validators.required, Validators.pattern]],
    })
  }

  submit() {
    if (this.addForm.invalid) {
      return;
    }
    else {
      let request = {
        "id": this.rcData.id,
        "local": this.addForm.value.local,
        "resultCode": this.addForm.value.resultCode,
        "resultInfo": this.addForm.value.resultInfo,
      }
      this.searchRC.rcLocalAdd(request).subscribe(
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

  onCancel() {
    this.dialogRef.close();
  }
}
