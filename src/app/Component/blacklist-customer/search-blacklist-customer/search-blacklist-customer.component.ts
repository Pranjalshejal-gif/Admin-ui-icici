import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { AddBlacklistCustomerDialogComponent } from './add-blacklist-customer-dialog/add-blacklist-customer-dialog.component';
import { BlacklistCustomerService } from 'src/app/Services/blacklist-customer.service';

@Component({
  selector: 'app-search-blacklist-customer',
  templateUrl: './search-blacklist-customer.component.html',
  styleUrls: ['./search-blacklist-customer.component.scss']
})
export class SearchBlacklistCustomerComponent implements OnInit {

  panelOpen: boolean = true;
  customer: any = {};
  showData: boolean = false;
  searchForm: FormGroup;
  dataSourceCustomer: MatTableDataSource<any>;
  Columns: string[];

  constructor(private blacklistcustser: BlacklistCustomerService, private toastr: ToastrService, private fb: FormBuilder, private router: Router, public dialog: MatDialog) {
    this.Columns = this.blacklistcustser.CustomerColumns;
    this.searchForm = this.fb.group({
      blockValue: ['', Validators.pattern],
    })
  }

  ngOnInit(): void {
  }

  search() {
    if (this.searchForm.invalid) {
      this.toastr.error("Please Enter Valid Inputs");
      return;
    }

    let request = {
      blockValue: this.searchForm.value.blockValue,
    }

    this.showData = false;
    this.blacklistcustser.getBlacklistedCustomers(request).subscribe(r => {
      if (r && r.success && typeof (r.data) == "object") {
        Object.keys(r.data).forEach(key => {
          if (r.data[key]['status'] == 'U') {
            r.data[key]['status'] = 'UNBLOCK'
          }
          if (r.data[key]['status'] == 'B') {
            r.data[key]['status'] = 'BLOCK'
          }
        });
        this.dataSourceCustomer = new MatTableDataSource(r.data);
        this.showData = true;
        this.panelOpen = false;
      }
      else {
        this.showData = false;
        this.toastr.error(r.message);
      }
    })
  }

  openDialogAddCustomer(evt: any) {
    const dialogRef = this.dialog.open(AddBlacklistCustomerDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { "rc": evt, }
    });
  }

  bulkUpload() {
    this.router.navigate(['/blacklist-customer/search-blacklist-customer/blacklist-bulk-upload']);
  }
}