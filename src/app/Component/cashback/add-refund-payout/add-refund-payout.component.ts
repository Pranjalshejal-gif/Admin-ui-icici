import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddRefundPayoutService } from 'src/app/Services/add-refund-payout.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-add-refund-payout',
  templateUrl: './add-refund-payout.component.html',
  styleUrls: ['./add-refund-payout.component.scss']
})
export class AddRefundPayoutComponent implements OnInit {

  isValid: boolean = false;
  isInvalid: boolean = false;
  firstFormGroup: FormGroup;
  isFormValid = false;

  constructor(private toast: ToastrService,
    private fb: FormBuilder,
    private addRefPay: AddRefundPayoutService,
    private router: Router,
    private location: Location,
    private httpClient: HttpClient,
    private userService: UserService) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern, Validators.minLength(10), Validators.maxLength(10)]],
      txnType: ['', [Validators.required, Validators.pattern]],
      remarks: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      amount: ['', Validators.pattern],
    });
  }

  submit() {
    if (this.firstFormGroup.invalid) {
      return;
    }
    else {
      let request = {
        "txnType": String(this.firstFormGroup.value.txnType),
        "mobile": String(this.firstFormGroup.value.mobile),
        "amount": String(this.firstFormGroup.value.amount),
        "remarks": this.firstFormGroup.value.remarks,
      }
      this.addRefPay.addRefundPayout(request).subscribe(
        data => {
          if (data && data.success) {
            this.router.navigate(['cashback/add-refund-payout']);
            this.userService.reloadCurrentRoute();
          }
          else {
            this.toast.error(data && data.message);
          }
        },
      );
      this.isInvalid = false;
      this.isValid = false
    }
  }

  reset() {
    for (let value in this.firstFormGroup.controls) {
      this.firstFormGroup.controls[value].setValue('');
      this.firstFormGroup.controls[value].setErrors(null);
    }
  }

  bulkUpload() {
    this.router.navigate(['/add-cashback/bulk-upload']);
  }
}
