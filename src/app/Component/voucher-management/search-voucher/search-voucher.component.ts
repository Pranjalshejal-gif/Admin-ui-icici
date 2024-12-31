import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { VoucherService } from 'src/app/Services/voucher.service';
import { GenerateQrComponent } from './generate-qr/generate-qr.component';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/Services/helper.service';

@Component({
  selector: 'app-search-voucher',
  templateUrl: './search-voucher.component.html'
})

export class SearchVoucherComponent implements OnInit {
  Columns: string[];
  dataSource: MatTableDataSource<any>;
  searchForm: FormGroup;
  showData: boolean = false;
  atLeastOneRequired: boolean = true;
  error = "";
  id: any;

  constructor(
    public dialog: MatDialog,
    private voucherService: VoucherService,
    private fb: FormBuilder,
    private helper: HelperService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.Columns = voucherService.searchVoucher
    this.searchForm = this.fb.group({
      status: ['ALL', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadVouchers();
  }

  loadVouchers() {
    let request = {
      status: "ALL"
    }
    this.voucherService.getVoucherByStatus(request).subscribe(response => {
      if (response && response.success) {
        this.dataSource = new MatTableDataSource(response.data);
        this.showData = true;
      } else {
        this.showData = false;
        this.helper.errorResponse(response.message);
      }
    });
  }

  search() {
    var obj = this.buildSearchFilter(this.searchForm);
    this.voucherService.getVoucherByStatus(obj).subscribe(data => {
      if (data && data.success) {
        this.dataSource = new MatTableDataSource(data.data);
        this.showData = true;
      }
      else {
        this.showData = false;
        this.helper.errorResponse(data.message);
      }
    })
  }

  reset() {
    for (let value in this.searchForm.controls) {
      this.searchForm.controls[value].setValue('ALL');
    }
    this.loadVouchers();
  }

  buildSearchFilter(form: FormGroup) {
    let obj: any = new Object();
    Object.keys(form.controls).forEach(key => {
      if (!this.helper.isNullorUndefined(form.get(key)?.value)) {
        if (key == 'fromDate' || key == 'toDate')
          obj[key] = this.datePipe.transform(form.get(key)?.value, 'dd-MM-yyyy');
        else
          obj[key] = form.get(key)?.value;
      }
    });
    return obj;
  }

  openDialog(evt: any) {
    this.dialog.open(GenerateQrComponent, {
      width: '90%',
      data: { "voucherData": evt },
      autoFocus: false
    });
  }

  edit(id: any) {
    this.router.navigate([`voucher-management/search-voucher/update-voucher`], this.dataSource.filteredData.find(r => r.id == id));
  }

  topUp(id: any) {
    this.router.navigate([`voucher-management/search-voucher/topup-voucher`], this.dataSource.filteredData.find(r => r.id == id));
  }
}
