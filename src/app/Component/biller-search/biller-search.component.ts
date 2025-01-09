import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerData } from 'src/app/models/customer_data';
import { BillersearchserveService } from 'src/app/Services/billersearchserve.service';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { MerchantService, SearchMerchant } from 'src/app/Services/merchant.service';

@Component({
  selector: 'app-biller-search',
  templateUrl: './biller-search.component.html',
  styleUrls: ['./biller-search.component.scss']
})
export class BillerSearchComponent implements OnInit {
    searchForm: FormGroup;
    showData: boolean = false;
    dataSourceCustomer: MatTableDataSource<any>;
    Columns: string[];
    atLeastOneRequired: boolean = true;
    myData: BillersearchserveService[];
    panelOpen: boolean = true;
  
    constructor(private toast: ToastrService,
      private fb: FormBuilder,
      public dialog: MatDialog,
      private search: BillersearchserveService,
      private router: Router) { }
  
    ngOnInit(): void {
      this.Columns = this.search.CustomerColumns;
  
      this.searchForm = this.fb.group({
        blrId: [''],
  
        blrName: [''],
  
        // agentMobileNo: [''],
  
  
      });
    }
  
    searchCustomer() {
      let valid = this.searchForm;
      if (this.searchForm.invalid) {
        this.toast.error("Please Enter Valid Inputs");                                                      
        return;
      }
  
      if (isNullorUndefined(valid.get('blrId')?.value) &&
        isNullorUndefined(valid.get('blrName')?.value) 
        // isNullorUndefined(valid.get('agentMobileNo')?.value)
  
      ) {
        this.atLeastOneRequired = false;
        this.toast.error("At least one search criteria is required");
      } else {
        let request = {
          blrId: this.searchForm.value.blrId,
          blrName: this.searchForm.value.blrName,
          // agentMobileNo: this.searchForm.value.agentMobileNo,
          // status: this.searchForm.value.status,
        }
        this.search.customerSearch(request).subscribe(res => {
          if (res && res.success) {
  
            this.dataSourceCustomer = new MatTableDataSource(res.data);
            this.atLeastOneRequired = true;
            this.showData = true;
            this.panelOpen = false;
            console.log("res" + JSON.stringify(res))
  
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
  