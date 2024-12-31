import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Services/user.service';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';

@Component({
  selector: 'app-rule-remark-dialog',
  templateUrl: './rule-remark-dialog.component.html',
  styleUrls: ['./rule-remark-dialog.component.scss']
})
export class RuleRemarkDialogComponent implements OnInit {

  addStatus: any = FormGroup;
  id: any;
  bulkFileStatus: any;
  AppRej: any = FormGroup;
  remarks: any = "";
  isUpdate: boolean = true;
  type = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    public dialogRef: MatDialogRef<RuleRemarkDialogComponent>,
    private toast: ToastrService, public dialog: MatDialog,
    private pcbdcService: PcbdcService, private userService: UserService) {
    this.bulkFileStatus = data.row.status;
    this.id = data.row.id;
    this.type = this.getAction(data.row.type);
  }

  ngOnInit(): void {
    this.AppRej = this.fb.group({
      remarks: [null, [Validators.pattern(RegularExpression.REMARKS_REGEX)]],
    })
  }

  ApproveSelectedFile() {
    if (this.AppRej.invalid) {
      return;
    }
    else {
      let request = {
        id: this.id,
        status: "A",
        action: this.type,
        remarks: this.remarks
      }

      this.pcbdcService.approveRule(request).subscribe(res => {
        if (res && res.success) {
          this.userService.reloadCurrentRoute();
          this.toast.success(res && res.data.displayMessage);
          this.dialogRef.close();
        }
        else {
          this.userService.reloadCurrentRoute();
          this.toast.error(res && res.message);
          this.dialogRef.close();
        }
      })
    }
  }

  RejectSelectedFile() {
    if (this.AppRej.invalid) {
      return;
    }
    else {
      let request = {
        id: this.id,
        status: "R",
        action: this.type,
        remarks: this.remarks
      }
      this.pcbdcService.approveRule(request).subscribe(res => {
        if (res && res.success) {
          this.dialogRef.close();
          this.userService.reloadCurrentRoute();
          this.toast.success(res && res.data.displayMessage);
        }
        else {
          this.dialogRef.close();
          this.userService.reloadCurrentRoute();
          this.toast.error(res && res.message);
        }
      })
    }
  }

  getAction(action: string): string {
    switch (action) {
      case 'UPDATE':
        return 'U';
      case 'CREATE':
        return 'C';
      case 'TOP-UP':
        return 'T';
      default:
        return action;
    }
  }
}
