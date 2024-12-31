import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerData } from 'src/app/models/customer_data';
import { CustomerService } from 'src/app/Services/customer.service';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { MerchantService, SearchMerchant } from 'src/app/Services/merchant.service';

@Component({
  selector: 'app-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.scss']
})
export class SearchCustomerComponent implements OnInit {

  searchForm: FormGroup;
  showData: boolean = false;
  dataSourceCustomer: MatTableDataSource<any>;
  Columns: string[];
  atLeastOneRequired: boolean = true;
  myData: CustomerService[];
  panelOpen: boolean = true;

  constructor(private toast: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private search: CustomerService,
    private router: Router) { }

  ngOnInit(): void {
    this.Columns = this.search.CustomerColumns;

    this.searchForm = this.fb.group({
      mobile: [''],

      walletAddress: [''],

      vpa: [''],


    });
  }

  searchCustomer() {
    let valid = this.searchForm;
    if (this.searchForm.invalid) {
      this.toast.error("Please Enter Valid Inputs");
      return;
    }

    if (isNullorUndefined(valid.get('mobile')?.value) &&
      isNullorUndefined(valid.get('walletAddress')?.value) &&
      isNullorUndefined(valid.get('vpa')?.value)

    ) {
      this.atLeastOneRequired = false;
      this.toast.error("At least one search criteria is required");
    } else {
      let request = {
        mobile: this.searchForm.value.mobile,
        walletAddress: this.searchForm.value.walletAddress,
        vpa: this.searchForm.value.vpa,
        status: this.searchForm.value.status,
      }
      this.search.customerSearch(request).subscribe(res => {
        if (res && res.success) {

          this.dataSourceCustomer = new MatTableDataSource(res.data);
          this.atLeastOneRequired = true;
          this.showData = true;
          this.panelOpen = false;

        }
        else {

          this.toast.error("No Matching record found");
        }
      });

    }
  }
  reset() {
    for (let value in this.searchForm.controls) {
      this.searchForm.controls[value].setValue('');
      this.searchForm.controls[value].setErrors(null);
    }
    this.showData = false;
  }
}
function isNullorUndefined(val: any) {
  if (val == undefined)
    return true;
  if (val == '')
    return true;
  if (val == null)
    return true;
  return false;
}
