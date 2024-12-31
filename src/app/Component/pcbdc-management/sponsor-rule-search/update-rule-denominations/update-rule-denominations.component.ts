import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { PcbdcService } from 'src/app/Services/pcbdc.service';

@Component({
  selector: 'app-update-rule-denominations',
  templateUrl: './update-rule-denominations.component.html',
  styleUrls: ['./update-rule-denominations.component.scss']
})
export class UpdateRuleDenominationsComponent implements OnInit {

  updateForm: FormGroup;
  denominationDetails: any;
  fixedValue0_5: number = 0.50
  fixedValue1: number = 1
  fixedValue2: number = 2
  fixedValue5: number = 5
  fixedValue10: number = 10
  fixedValue20: number = 20
  fixedValue50: number = 50
  fixedValue100: number = 100
  fixedValue200: number = 200
  fixedValue500: number = 500
  count: number = 0
  request: number = 0
  amount: any;
  denomRegExLength = [Validators.minLength(1), Validators.maxLength(7)];

  constructor(private fb: FormBuilder, private toast: ToastrService, private router: Router, private pcbdcService: PcbdcService) {
    this.denominationDetails = this.router.getCurrentNavigation()?.extras;
  }

  ngOnInit(): void {

    this.updateForm = this.fb.group({
      ruleId: this.denominationDetails.ruleId,
      fixedValue0_5: 0.50,
      fixedValue1: 1,
      fixedValue2: 2,
      fixedValue5: 5,
      fixedValue10: 10,
      fixedValue20: 20,
      fixedValue50: 50,
      fixedValue100: 100,
      fixedValue200: 200,
      fixedValue500: 500,
      countfor0_5: ['', this.denomRegExLength],
      countfor1: ['', this.denomRegExLength],
      countfor2: ['', this.denomRegExLength],
      countfor5: ['', this.denomRegExLength],
      countfor10: ['', this.denomRegExLength],
      countfor20: ['', this.denomRegExLength],
      countfor50: ['', this.denomRegExLength],
      countfor100: ['', this.denomRegExLength],
      countfor200: ['', this.denomRegExLength],
      countfor500: ['', this.denomRegExLength],
      totalAmount: 0,
      totalQuantityAmount0_5: 0,
      totalQuantityAmount1: 0,
      totalQuantityAmount2: 0,
      totalQuantityAmount5: 0,
      totalQuantityAmount10: 0,
      totalQuantityAmount20: 0,
      totalQuantityAmount50: 0,
      totalQuantityAmount100: 0,
      totalQuantityAmount200: 0,
      totalQuantityAmount500: 0,
      totalAmountNoDenom: ['', [Validators.pattern(/^\d+(?:\.((?:5|50)))?$/), Validators.min(0.5), Validators.minLength(1), Validators.maxLength(7)]],
      transactionType: ['amount']
    });
    this.updateForm.valueChanges.pipe(
      debounceTime(50) // Adjust the debounce time (in milliseconds) based on your needs
    ).subscribe(() => {
      this.calculateTotal();
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
    const fixedValue0_5 = validateInput(this.updateForm.value.fixedValue0_5);
    const fixedValue1 = validateInput(this.updateForm.value.fixedValue1);
    const fixedValue2 = validateInput(this.updateForm.value.fixedValue2);
    const fixedValue5 = validateInput(this.updateForm.value.fixedValue5);
    const fixedValue10 = validateInput(this.updateForm.value.fixedValue10);
    const fixedValue20 = validateInput(this.updateForm.value.fixedValue20);
    const fixedValue50 = validateInput(this.updateForm.value.fixedValue50);
    const fixedValue100 = validateInput(this.updateForm.value.fixedValue100);
    const fixedValue200 = validateInput(this.updateForm.value.fixedValue200);
    const fixedValue500 = validateInput(this.updateForm.value.fixedValue500);

    // Validate and get numeric values for counts
    const countfor0_5 = validateInput(this.updateForm.value.countfor0_5);
    const countfor1 = validateInput(this.updateForm.value.countfor1);
    const countfor2 = validateInput(this.updateForm.value.countfor2);
    const countfor5 = validateInput(this.updateForm.value.countfor5);
    const countfor10 = validateInput(this.updateForm.value.countfor10);
    const countfor20 = validateInput(this.updateForm.value.countfor20);
    const countfor50 = validateInput(this.updateForm.value.countfor50);
    const countfor100 = validateInput(this.updateForm.value.countfor100);
    const countfor200 = validateInput(this.updateForm.value.countfor200);
    const countfor500 = validateInput(this.updateForm.value.countfor500);

    // Calculate total by multiplying denominations with counts
    const total =
      fixedValue0_5 * countfor0_5 +
      fixedValue1 * countfor1 +
      fixedValue2 * countfor2 +
      fixedValue5 * countfor5 +
      fixedValue10 * countfor10 +
      fixedValue20 * countfor20 +
      fixedValue50 * countfor50 +
      fixedValue100 * countfor100 +
      fixedValue200 * countfor200 +
      fixedValue500 * countfor500;

    this.updateForm.patchValue({ totalAmount: total }, { emitEvent: false });

    const totalQuantity0_5 = fixedValue0_5 * countfor0_5;
    this.updateForm.patchValue({ totalQuantityAmount0_5: totalQuantity0_5 }, { emitEvent: false });

    const totalQuantity1 = fixedValue1 * countfor1;
    this.updateForm.patchValue({ totalQuantityAmount1: totalQuantity1 }, { emitEvent: false });

    const totalQuantity2 = fixedValue2 * countfor2;
    this.updateForm.patchValue({ totalQuantityAmount2: totalQuantity2 }, { emitEvent: false });

    const totalQuantity5 = fixedValue5 * countfor5;
    this.updateForm.patchValue({ totalQuantityAmount5: totalQuantity5 }, { emitEvent: false });

    const totalQuantity10 = fixedValue10 * countfor10;
    this.updateForm.patchValue({ totalQuantityAmount10: totalQuantity10 }, { emitEvent: false });

    const totalQuantity20 = fixedValue20 * countfor20;
    this.updateForm.patchValue({ totalQuantityAmount20: totalQuantity20 }, { emitEvent: false });

    const totalQuantity50 = fixedValue50 * countfor50;
    this.updateForm.patchValue({ totalQuantityAmount50: totalQuantity50 }, { emitEvent: false });

    const totalQuantity100 = fixedValue100 * countfor100;
    this.updateForm.patchValue({ totalQuantityAmount100: totalQuantity100 }, { emitEvent: false });

    const totalQuantity200 = fixedValue200 * countfor200;
    this.updateForm.patchValue({ totalQuantityAmount200: totalQuantity200 }, { emitEvent: false });

    const totalQuantity500 = fixedValue500 * countfor500;
    this.updateForm.patchValue({ totalQuantityAmount500: totalQuantity500 }, { emitEvent: false });
  }

  submit() {
    if (this.updateForm.value.totalAmount === 0) {
      this.toast.error("Please enter atleast one demomination.")
      return;
    }

    let obj: any = new Map();

    // Map denomination count only if count is greater than 0
    if (this.updateForm.value.countfor0_5 > 0) {
      obj[this.updateForm.value.fixedValue0_5] = this.updateForm.value.countfor0_5;
    }
    if (this.updateForm.value.countfor1 > 0) {
      obj[this.updateForm.value.fixedValue1] = this.updateForm.value.countfor1;
    }
    if (this.updateForm.value.countfor2 > 0) {
      obj[this.updateForm.value.fixedValue2] = this.updateForm.value.countfor2;
    }
    if (this.updateForm.value.countfor5 > 0) {
      obj[this.updateForm.value.fixedValue5] = this.updateForm.value.countfor5;
    }
    if (this.updateForm.value.countfor10 > 0) {
      obj[this.updateForm.value.fixedValue10] = this.updateForm.value.countfor10;
    }
    if (this.updateForm.value.countfor20 > 0) {
      obj[this.updateForm.value.fixedValue20] = this.updateForm.value.countfor20;
    }

    if (this.updateForm.value.countfor50 > 0) {
      obj[this.updateForm.value.fixedValue50] = this.updateForm.value.countfor50;
    }
    if (this.updateForm.value.countfor100 > 0) {
      obj[this.updateForm.value.fixedValue100] = this.updateForm.value.countfor100;
    }
    if (this.updateForm.value.countfor200 > 0) {
      obj[this.updateForm.value.fixedValue200] = this.updateForm.value.countfor200;
    }
    if (this.updateForm.value.countfor500 > 0) {
      obj[this.updateForm.value.fixedValue500] = this.updateForm.value.countfor500;
    }

    let request = {
      "id": this.denominationDetails.id,
      "ruleId": this.denominationDetails.ruleId,
      "denominations": obj,
      "amount": this.updateForm.value.totalAmount,
    }

    this.pcbdcService.enhanceRule(request).subscribe(
      data => {
        if (data && data.success) {
          this.router.navigate([`pcbdc-management/sponsor-rule-search`])
        }
        else {
          this.toast.error(data && data.message);
        }
      },
    );
  }

  back() {
    this.router.navigate([`pcbdc-management/sponsor-rule-search`])
  }
}
