import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApproveRefundPayoutService } from 'src/app/Services/approve-refund-payout.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-approve-refund-payout',
  templateUrl: './approve-refund-payout.component.html',
  styleUrls: ['./approve-refund-payout.component.scss']
})
export class ApproveRefundPayoutComponent implements OnInit {

  selection = new SelectionModel<any>(true, []);
  indexArray: string[] = [];
  merPayoutPayload: any = {};
  dataSource: any = [];
  showData: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  Columns: any[] = [
    { name: 'selectAction', label: 'Approve' },
    { name: 'id', label: 'Id' },
    { name: 'cashbackSchemeRef', label: 'Cashback Scheme Ref' },
    { name: 'mobile', label: 'Mobile' },
    { name: 'customerVpa', label: 'Customer Vpa' },
    { name: 'created', label: 'Created Date' },
    { name: 'updated', label: 'Updated Date' },
    { name: 'status', label: 'Status' },
    { name: 'payeeVPA', label: 'Payee VPA' },
    { name: 'amount', label: 'Amount' },
    { name: 'cashbackStatus', label: 'Cashback Status' },
    { name: 'sendervpa', label: 'Sender Vpa' },

  ];

  constructor(public dialog: MatDialog, private apprrefpay: ApproveRefundPayoutService, private router: Router, private toast: ToastrService) { }

  ngOnInit(): void {
    this.search();
  }

  search() {
    let request = {
      status: "PENDING"
    }
    this.apprrefpay.getByStatus(request).subscribe(res => {
      const data = res?.data?.map((x: any) => {
        x.refundOrgTxnIdTrans = x?.refundOrgTxnId?.name;
        return x;
      });
      this.dataSource = new MatTableDataSource(res?.data);
    });
  }
}



