import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
@Component({
  selector: 'app-view-rcbdc-balance',
  templateUrl: './view-rcbdc-balance.component.html',
  styleUrls: ['./view-rcbdc-balance.component.scss']
})
export class ViewRcbdcBalanceComponent implements OnInit {

  searchForm: FormGroup;
  programList: any = [];
  programTokenList: any = [];
  data: any;
  showBalance = false;
  pcbdcData = true;
  customer: any = {};

  //this is the denomination variable
  fixedValue0: number = 0.5
  fixedValue1: number = 1
  fixedValue2: number = 2
  fixedValue5: number = 5
  fixedValue10: number = 10
  fixedValue20: number = 20
  fixedValue50: number = 50
  fixedValue100: number = 100
  fixedValue200: number = 200
  fixedValue500: number = 500
  fixedValue2000: number = 2000

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public datepipe: DatePipe,
    private toast: ToastrService,
    public dialog: MatDialog,
    private pcbdcService: PcbdcService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      countfor0: [],
      countfor1: [],
      countfor2: [],
      countfor5: [],
      countfor10: [],
      countfor20: [],
      countfor50: [],
      countfor100: [],
      countfor200: [],
      countfor500: [],
      countfor2000: [],
      totalAmount: []
    });

    this.pcbdcService.getRcbdcBalance().subscribe(res => {
      if (res && res.data) {
        this.programTokenList = res.data.tokenAvailability;
        this.calculateTotal();
      }
      else {
        this.toast.error(res.message)
      }
    })
  }

  calculateTotal() {
    // Validate and get numeric values for denominations
    const fixedValue0 = 0.5;
    const fixedValue1 = 1;
    const fixedValue2 = 2;
    const fixedValue5 = 5;
    const fixedValue10 = 10;
    const fixedValue20 = 20;
    const fixedValue50 = 50;
    const fixedValue100 = 100;
    const fixedValue200 = 200;
    const fixedValue500 = 500;
    const fixedValue2000 = 2000;

    // Validate and get numeric values for counts
    const countfor0 = this.programTokenList["50"];
    const countfor1 = this.programTokenList["100"];
    const countfor2 = this.programTokenList["200"];
    const countfor5 = this.programTokenList["500"];
    const countfor10 = this.programTokenList["1000"];
    const countfor20 = this.programTokenList["2000"];
    const countfor50 = this.programTokenList["5000"];
    const countfor100 = this.programTokenList["10000"];
    const countfor200 = this.programTokenList["20000"];
    const countfor500 = this.programTokenList["50000"];
    const countfor2000 = this.programTokenList["200000"];

    // Calculate total by multiplying denominations with counts
    const total =
      fixedValue0 * countfor0 +
      fixedValue1 * countfor1 +
      fixedValue2 * countfor2 +
      fixedValue5 * countfor5 +
      fixedValue10 * countfor10 +
      fixedValue20 * countfor20 +
      fixedValue50 * countfor50 +
      fixedValue100 * countfor100 +
      fixedValue200 * countfor200 +
      fixedValue500 * countfor500 +
      fixedValue2000 * countfor2000
    this.searchForm.patchValue({ totalAmount: total }, { emitEvent: false });
  }
}