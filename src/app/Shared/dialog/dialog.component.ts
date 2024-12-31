import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  hasHeading: boolean = false;
  messageText: string;
  headerText: string;
  type: string;
  approvemsg: string;
  rejectmsg: string;
  sessionMsgTitle: string;
  sessionMsgBody: string;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.messageText = this.data.msg;
      this.type = this.data.type;
      this.approvemsg = this.data.msgapprove;
      this.rejectmsg = this.data.msgreject;
      this.sessionMsgTitle = this.data.msgSessionMsgTitle;
      this.sessionMsgBody = this.data.msgSessionMsgBody;
    }
  }

  ngOnInit(): void {
  }
  confirm() {
    this.dialogRef.close(true);
  }
  cancel() {
    this.dialogRef.close(false);
  }

}
