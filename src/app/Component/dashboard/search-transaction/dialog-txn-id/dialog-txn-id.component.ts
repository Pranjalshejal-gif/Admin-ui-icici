import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MonitorService } from 'src/app/Services/monitor.service';

@Component({
  selector: 'app-dialog-txn-id',
  templateUrl: './dialog-txn-id.component.html',
  styleUrls: ['./dialog-txn-id.component.scss']
})
export class DialogTxnIdComponent implements OnInit {

  tranctionDetails: any;
  isReqUptToken: boolean = false;
  txnData: any;
  showData: boolean = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public monServ: MonitorService, private toast: ToastrService) {
    this.tranctionDetails = data?.tranctionDetails;
    this.isReqUptToken = this.tranctionDetails.statementTxn && this.tranctionDetails.irc == "0000" && (this.tranctionDetails.flow == "LOAD" || this.tranctionDetails.flow == "REDEEM" || this.tranctionDetails.flow == 'INWARD' || (this.tranctionDetails.flow = 'TRANSFER' && this.tranctionDetails.direction == "OUTWARD"))
  }

  ngOnInit(): void {
  }
  reqUpdateToken() {
    const txnIdObj = {
      txnId: this.tranctionDetails.txnId
    };
    this.monServ.reqUpdateToken(txnIdObj).subscribe(data => {
      if (data && !data.success) {
        this.toast.error(data && data.message);
      }
    }
    );
  }

}
