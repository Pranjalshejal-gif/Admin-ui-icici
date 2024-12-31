import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { VoucherService } from 'src/app/Services/voucher.service';
import { SettlementDialogComponent } from './settlement-dialog/settlement-dialog.component';
import { HelperService } from 'src/app/Services/helper.service';

@Component({
  selector: 'app-voucher-settlement',
  templateUrl: './voucher-settlement.component.html',
  styleUrls: ['./voucher-settlement.component.scss']
})

export class VoucherSettlementComponent implements OnInit {
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
    private datePipe: DatePipe,
    private helper: HelperService
  ) {
    this.Columns = voucherService.voucherSettlement
    this.searchForm = this.fb.group({
      status: ['P', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadVouchers();
  }

  loadVouchers() {
    let request = {
      status: "P"
    }
    this.voucherService.getUnsettledTxnByStatus(request).subscribe(data => {
      if (data && data.success) {
        this.dataSource = new MatTableDataSource(data.data);
        this.showData = true;
      } else {
        this.showData = false;
        this.helper.errorResponse(data.message);
      }
    });
  }

  search() {
    let valid = this.searchForm
    let checkValidData = this.helper.isNullorUndefined(valid.get('status')?.value)

    if (this.searchForm.invalid) {
      this.showData = false;
      return;
    } else if (checkValidData) {
      this.atLeastOneRequired = false;
      this.showData = false;
    }
    else {
      var obj = this.buildSearchFilter(this.searchForm);
      this.voucherService.getUnsettledTxnByStatus(obj).subscribe(data => {
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
  }

  reset() {
    for (let value in this.searchForm.controls) {
      this.searchForm.controls[value].setValue('P');
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
    this.dialog.open(SettlementDialogComponent,
      {
        width: '30%',
        data: { "voucherData": evt },
        autoFocus: false
      });
  }
}