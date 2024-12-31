import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DisputeManagement } from 'src/app/Services/dispute.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-dialog-dispute',
  templateUrl: './dialog-dispute.component.html',
  styleUrls: ['./dialog-dispute.component.scss']
})
export class DialogDisputeComponent implements OnInit {

  customerDetails: any;
  tranlogDetails: any
  details: any;
  isUpdate: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toast: ToastrService, private disputeManagement: DisputeManagement,
    private userService: UserService, public dialogRef: MatDialogRef<DialogDisputeComponent>) {
    this.customerDetails = data?.customerDetails?.customer;
    this.tranlogDetails = data?.customerDetails?.tranlog;
    this.details = data?.customerDetails
  }

  ngOnInit(): void {
  }

  update() {
    this.isUpdate = true
  }
  submit() {
    this.isUpdate = false;
    const payload = {
      id: this.details.id,
      remark: this.details.remark,
      resolution: this.details.resolution,
    }
    this.disputeManagement.updateDetails(payload).subscribe(res => {
      this.dialogRef.close();
      this.userService.reloadCurrentRoute();
    })
  }

}
