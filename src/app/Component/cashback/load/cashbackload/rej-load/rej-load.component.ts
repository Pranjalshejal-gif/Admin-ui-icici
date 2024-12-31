import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApproveRefundPayoutService } from 'src/app/Services/approve-refund-payout.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoadCashbackService, SearchHistory } from 'src/app/Services/load-cashback.service';

@Component({
  selector: 'app-rej-load',
  templateUrl: './rej-load.component.html',
  styleUrls: ['./rej-load.component.scss']
})
export class RejLoadComponent implements OnInit {

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
    { name: 'amount', label: 'Amount' },
    { name: 'created', label: 'Created Date' },
    { name: 'updated', label: 'Updated Date' },
    { name: 'status', label: 'Status' },
    { name: 'payeeVPA', label: 'Payee VPA' },
    { name: 'cashbackStatus', label: 'Switch Status' },

  ];

  constructor(public dialog: MatDialog, private apprrefpay: ApproveRefundPayoutService, private loadcashback: LoadCashbackService, private router: Router, private toast: ToastrService) { }

  ngOnInit(): void {
    this.search();
  }

  search() {
    let request = {
      status: "P"
    }
    this.loadcashback.loadHistroy(request).subscribe(res => {
      if (res && res.success) {
        var arr: SearchHistory[] = res.data;
        arr.forEach((obj: any) => {

          obj.status = obj.status === "P" ? 'PENDING' : obj.status === "C" ? 'COMPLETED' : obj.status === "A" ? 'APPROVED' : obj.status === "R" ? 'REJECTION' : obj.status === "I" ? 'IN_PROGRESS' : '';
        });

        this.dataSource = new MatTableDataSource(res.data);

      }
    });
  }
}
