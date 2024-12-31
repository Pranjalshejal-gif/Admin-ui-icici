import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { DialogComponent } from 'src/app/Shared/dialog/dialog.component';
import { DisbursementRemarkDialogComponent } from '../disbursement-remark-dialog/disbursement-remark-dialog.component';

@Component({
  selector: 'app-disbursement-approve-reject-dialog',
  templateUrl: './disbursement-approve-reject-dialog.component.html',
  styleUrls: ['./disbursement-approve-reject-dialog.component.scss']
})
export class DisbursementApproveRejectDialogComponent implements OnInit {

  id: any;
  addStatus: any = FormGroup;
  indexArray: string[] = [];
  element: string[] = [];
  Columns: string[];
  approve: boolean;
  reject: boolean;
  dataStatusList: any = [];
  selection = new SelectionModel<any>(true, []);
  bulkFileId: any;
  bulkFileStatus: any;
  statusDetail: any;
  jsonObj: any;
  list: any;
  dataValid: any = [];
  dataSuccess: any = [];
  bulkFileName: any;
  successfullCount: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DisbursementApproveRejectDialogComponent>,
    private toast: ToastrService,
    public dialog: MatDialog,
    private pcbdcService: PcbdcService) {
    this.bulkFileStatus = data.row.status;
    this.bulkFileId = data.row.id;
    this.bulkFileName = data.row.uploadName;
    this.successfullCount = data.row.successfulCount;
  }

  ngOnInit(): void {

    let request = {
      id: this.bulkFileId
    }

    this.pcbdcService.getMetaStatus(request).subscribe(data => {
      this.dataStatusList = data.data;
      this.dataValid = data.isApproveAllowed;
      this.dataSuccess = data.success;
    });
  }

  confirmationPopUp(action: string) {
    return this.dialog.open(DialogComponent, {
      width: "400px",
      data: {
        "msg": `Are you sure, that you want to ` + action + ` the selected file ?</b>`,
        "note": `NOTE : Invalid record will not be ` + action + `.`,
        "type": "confirm"
      }
    });
  }

  ApproveSelectedFile() {
    let payload = {
      indexIds: this.bulkFileId,
      action: 'A'
    }
    this.dialog.open(DisbursementRemarkDialogComponent, {
      width: '30%',
      data: { "payload": payload }
    });
    this.dialogRef.close();
  }

  RejectSelectedFile() {
    this.indexArray = [];
    let payload = {
      indexIds: this.bulkFileId,
      action: 'R'
    }
    this.dialog.open(DisbursementRemarkDialogComponent, {
      width: '30%',
      data: { "payload": payload }
    });
    this.dialogRef.close();
  }
}
