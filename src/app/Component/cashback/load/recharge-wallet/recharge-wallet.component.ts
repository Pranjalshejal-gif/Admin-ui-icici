import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerData } from 'src/app/models/customer_data';
import { Router } from '@angular/router';
import { LoadCashbackService } from 'src/app/Services/load-cashback.service';
import { BulkHistoryService, SearchHistory } from 'src/app/Services/bulk-history.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-recharge-wallet',
  templateUrl: './recharge-wallet.component.html',
  styleUrls: ['./recharge-wallet.component.scss']
})
export class RechargeWalletComponent implements OnInit {

  cashbackData: any;
  walletData: any
  loadCashbackForm: FormGroup
  hasData: boolean = false;
  customer: any = {};
  showData: boolean = false;
  loadshowData: boolean = true; // Initialize to false  
  wallet: string;
  loadData: CustomerData;
  mode = 'Add';
  data: any;
  showMe = false;
  checked = false;
  dataSourceCashback: MatTableDataSource<any>;
  Columns: string[];
  atLeastOneRequired: boolean = true;
  myData: SearchHistory[];
  file: File;



  //this is the denomination code

  fixedValue1: number = 1
  fixedValue2: number = 2
  fixedValue5: number = 5
  fixedValue10: number = 10
  fixedValue20: number = 20
  fixedValue50: number = 50

  count: number = 0
  request: number = 0

  constructor(private router: Router, private loadcashback: LoadCashbackService, private cashbackbulkhistory: BulkHistoryService,
    private fb: FormBuilder, private toast: ToastrService, private userService: UserService) { }

  ngOnInit(): void {

    this.loadcashback.viewProfile().subscribe(res => {

      if (res && res.customer) {
        this.customer = res.customer;
      }
    });

    this.reset();

    this.loadCashbackForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
    this.loadcashhistroy();

  }

  loadcashhistroy() {
    let request = {
      status: "ALL"
    }
    this.Columns = this.loadcashback.historyColumns;

    this.loadcashback.loadHistroy(request).subscribe(res => {
      if (res && res.success) {
        var arr: SearchHistory[] = res.data;
        arr.forEach((obj: any) => {

          obj.status = obj.status === "P" ? 'PENDING' : obj.status === "C" ? 'COMPLETED' : obj.status === "A" ? 'APPROVED' : obj.status === "R" ? 'REJECTION' : obj.status === "I" ? 'IN_PROGRESS' : '';
        });

        this.dataSourceCashback = new MatTableDataSource(res.data);
        this.atLeastOneRequired = true;
        this.loadshowData = true;
      }
    });
  }
  calculateTotal() {
    // Function to validate input and convert to number, handling NaN cases
    const validateInput = (input: number | string): number => {
      // Convert input to a float and check if it's NaN
      const parsedValue = parseFloat(input.toString());
      // If it's NaN, return 0; otherwise, return the parsed value
      return isNaN(parsedValue) ? 0 : parsedValue;
    };
    // Validate and get numeric values for denominations
    const fixedValue1 = validateInput(this.loadCashbackForm.value.fixedValue1);
    const fixedValue2 = validateInput(this.loadCashbackForm.value.fixedValue2);
    const fixedValue5 = validateInput(this.loadCashbackForm.value.fixedValue5);
    const fixedValue10 = validateInput(this.loadCashbackForm.value.fixedValue10);
    const fixedValue20 = validateInput(this.loadCashbackForm.value.fixedValue20);
    const fixedValue50 = validateInput(this.loadCashbackForm.value.fixedValue50);

    // Validate and get numeric values for counts

    const countfor1 = validateInput(this.loadCashbackForm.value.countfor1);
    const countfor2 = validateInput(this.loadCashbackForm.value.countfor2);
    const countfor5 = validateInput(this.loadCashbackForm.value.countfor5);
    const countfor10 = validateInput(this.loadCashbackForm.value.countfor10);
    const countfor20 = validateInput(this.loadCashbackForm.value.countfor20);
    const countfor50 = validateInput(this.loadCashbackForm.value.countfor50);
    // Calculate total by multiplying denominations with counts
    const total =
      fixedValue1 * countfor1 +
      fixedValue2 * countfor2 +
      fixedValue5 * countfor5 +
      fixedValue10 * countfor10 +
      fixedValue20 * countfor20 +
      fixedValue50 * countfor50;

    this.loadCashbackForm.patchValue({ amount: total }, { emitEvent: false });
  }

  toggletag() {
    this.showMe = true;
  }
  load() {
    let obj: any = new Map();
    // Map denomination count only if count is greater than 0
    if (this.loadCashbackForm.value.countfor1 > 0) {
      obj[this.loadCashbackForm.value.fixedValue1] = this.loadCashbackForm.value.countfor1;
    }
    if (this.loadCashbackForm.value.countfor2 > 0) {
      obj[this.loadCashbackForm.value.fixedValue2] = this.loadCashbackForm.value.countfor2;
    }
    if (this.loadCashbackForm.value.countfor5 > 0) {
      obj[this.loadCashbackForm.value.fixedValue5] = this.loadCashbackForm.value.countfor5;
    }
    if (this.loadCashbackForm.value.countfor10 > 0) {
      obj[this.loadCashbackForm.value.fixedValue10] = this.loadCashbackForm.value.countfor10;
    }
    if (this.loadCashbackForm.value.countfor20 > 0) {
      obj[this.loadCashbackForm.value.fixedValue20] = this.loadCashbackForm.value.countfor20;
    }

    if (this.loadCashbackForm.value.countfor50 > 0) {
      obj[this.loadCashbackForm.value.fixedValue50] = this.loadCashbackForm.value.countfor50;
    }

    // Stop here if form is invalid
    if (this.loadCashbackForm.invalid) {
      return;
    } else if (Object.keys(obj).length === 0) {
      // If no denomination count is greater than 0, show an error or handle it accordingly
      this.toast.error("Please add at least one denomination count.");
      return;
    } else if (Number(this.loadCashbackForm.value.amount) === 0) {
      this.toast.error("Zero amount can not be added for Cashback");
      return;
    }

    // Below code is for adding the data in UI if mode is add
    if (this.mode == 'Add') {
      let request = {
        amount: this.loadCashbackForm.value.amount + '',
        loadDenomination: obj,
        remarks: this.loadCashbackForm.value.remarks,
      };


      this.loadcashback.loadMoney(request).subscribe(
        data => {
          if (data && data.success) {
            this.router.navigate(['/cashback/load/recharge-wallet']);
            this.userService.reloadCurrentRoute();
            this.reset();
          } else {
            this.toast.error(data && data.message);
          }
        },
      );
    }
  }

  reset() {
    this.loadCashbackForm = this.fb.group({
      remarks: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      // amount: ['', Validators.pattern],
      fixedValue1: 1,
      fixedValue2: 2,
      fixedValue5: 5,
      fixedValue10: 10,
      fixedValue20: 20,
      fixedValue50: 50,
      countfor1: ['', [Validators.minLength(1), Validators.maxLength(7)]],
      countfor2: ['', [Validators.minLength(1), Validators.maxLength(7)]],
      countfor5: ['', [Validators.minLength(1), Validators.maxLength(7)]],
      countfor10: ['', [Validators.minLength(1), Validators.maxLength(7)]],
      countfor20: ['', [Validators.minLength(1), Validators.maxLength(7)]],
      countfor50: ['', [Validators.minLength(1), Validators.maxLength(7)]],
      amount: 0,
    });
  }


  cancel() {
    this.router.navigate(['/dashboard']);

  }
}
