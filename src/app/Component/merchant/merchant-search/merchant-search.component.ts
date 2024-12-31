import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MerchantService, SearchMerchant } from 'src/app/Services/merchant.service'
import { QRCodeDialog } from './qr-dialog/qr-dialog.component';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'app-merchant-search',
  templateUrl: './merchant-search.component.html',
  styleUrls: ['./merchant-search.component.scss']
})
export class MerchantSearchComponent implements OnInit {

  searchForm: FormGroup;
  showData: boolean = false;
  dataSourceMerchant: MatTableDataSource<any>;
  Columns: string[];
  atLeastOneRequired: boolean = true;
  myData: SearchMerchant[];
  merchantData: any;

  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private searchMerchant: MerchantService,
    private router: Router,
    private dashboardSer: DashboardService
  ) { }

  ngOnInit(): void {

    this.Columns = this.searchMerchant.merchantColumns;

    this.searchForm = this.fb.group({
      merchantName: ['', Validators.pattern],
      legalName: ['', Validators.pattern],
      mid: ['', Validators.pattern],
      mobile: ['', Validators.pattern]
    });
  }



  search() {
    let valid = this.searchForm;
    if (this.searchForm.invalid){
      this.toast.error("Please Enter Valid Inputs");
      return;
    }

    if (isNullorUndefined(valid.get('merchantName')?.value) && isNullorUndefined(valid.get('legalName')?.value) &&
      isNullorUndefined(valid.get('mid')?.value) && isNullorUndefined(valid.get('mobile')?.value)
    ) {
      this.atLeastOneRequired = false;
      this.toast.error("At least one search criteria is required");
    } else {
      this.searchMerchant.merchantSearch(this.searchForm.value).subscribe(res => {
        if (res && res.success) {
          this.dataSourceMerchant = new MatTableDataSource(res.data);
          this.dashboardSer.updateData('isMerchant');
          this.atLeastOneRequired = true;
          this.showData = true;
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
  edit(row: any) {
    this.router.navigate([`merchant-search/edit`], this.dataSourceMerchant.filteredData.find(r => r.mid == row.mid));
  }
  enableDisableLink(data: any) {
    let request = {
      customerId: data?.customer
    }
    let disrequest = {
      mobile: data?.customerDetails?.mobile,
      vpa: data?.customerDetails?.vpa
    }
    if (data.customerDetails.status == 'BLOCK') {

      this.searchMerchant.enable(request).subscribe((data: any) => {
        this.search();
      })
    } else {
      this.searchMerchant.disable(disrequest).subscribe((data: any) => {
        this.search();
      })
    }
  }
  enable(id: any) {
    let request = {
      customerId: id.customer
    }

  }

  disable(id: any) {
    let request = {
      mobile: id.customerDetails.mobile,
      vpa: id.customerDetails.vpa
    }
    this.searchMerchant.disable(request).subscribe((data: any) => {
      this.merchantData = data;
    })
  }

  delete(id: any) {
    this.toast.error("This functionality is not available at the moment");
  }

  openDialog(evt: any) {
    const dialogRef = this.dialog.open(QRCodeDialog, {
      width: '90%',
      disableClose: true,
      data: { "wallet": evt, }
    });
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
