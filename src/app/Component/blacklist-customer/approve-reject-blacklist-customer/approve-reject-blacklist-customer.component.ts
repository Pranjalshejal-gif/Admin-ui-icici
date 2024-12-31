import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlacklistCustomerService } from 'src/app/Services/blacklist-customer.service';

@Component({
  selector: 'app-approve-reject-blacklist-customer',
  templateUrl: './approve-reject-blacklist-customer.component.html',
  styleUrls: ['./approve-reject-blacklist-customer.component.scss']
})
export class ApproveRejectBlacklistCustomerComponent implements OnInit {


  selection = new SelectionModel<any>(true, []);
  indexArray: string[] = [];
  merPayoutPayload: any = {};
  dataSource: any = [];
  showData: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  Columns: any[] = [
    { name: 'selectAction', label: 'Approve/Reject' },
    { name: 'blockType', label: 'Block Type' },
    { name: 'blockValue', label: 'Block Value' },
    { name: 'created', label: 'Created Date' },
    { name: 'status', label: 'Status' },
    { name: 'makerId', label: 'Maker ID' },
    { name: 'makerCheckerStatus', label: 'Maker-Checker Status' },
    { name: 'updatedReason', label: 'Comment' }
  ];

  constructor(public dialog: MatDialog, private router: Router, private toast: ToastrService, private blacklistCustSer: BlacklistCustomerService) { }

  ngOnInit(): void {
    this.search();
  }

  search() {
    let request = {
      makerCheckerStatus: "PENDING"
    }
    this.blacklistCustSer.getByStatus(request).subscribe(res => {
      if (res && res.success) {
        Object.keys(res.data).forEach(key => {
          if (res.data[key]['status'] == 'B') {
            res.data[key]['status'] = 'BLOCK'
          }
          if (res.data[key]['status'] == 'U') {
            res.data[key]['status'] = 'UNBLOCK'
          }
          if (res.data[key]['makerCheckerStatus'] == 'P') {
            res.data[key]['makerCheckerStatus'] = 'PENDING'
          }
          if (res.data[key]['makerCheckerStatus'] == 'A') {
            res.data[key]['makerCheckerStatus'] = 'APPROVED'
          }
          if (res.data[key]['makerCheckerStatus'] == 'R') {
            res.data[key]['makerCheckerStatus'] = 'REJECTED'
          }
          if (res.data[key]['makerCheckerStatus'] == 'E') {
            res.data[key]['makerCheckerStatus'] = 'ERROR'
          }
        });
        this.dataSource = new MatTableDataSource(res?.data);
      }
    });
  }
}
