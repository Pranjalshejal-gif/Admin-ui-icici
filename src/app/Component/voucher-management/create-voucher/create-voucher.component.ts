import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VoucherService } from 'src/app/Services/voucher.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';
import { UserService } from 'src/app/Services/user.service';
import { HelperService } from 'src/app/Services/helper.service';
import { Constants } from 'src/app/Shared/constants';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: ['./create-voucher.component.scss']
})

export class CreateVoucherComponent implements OnInit {
  createVoucherForm: any = FormGroup;

  constructor(private fb: FormBuilder,
    private helper: HelperService,
    private voucherService: VoucherService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.createVoucherForm = this.fb.group({
      count: ['', [Validators.required, Validators.pattern(RegularExpression.VOUCHER_COUNT)]]
    });
  }

  onSubmit() {
    if (this.createVoucherForm.invalid) {
      this.helper.errorResponse(Constants.REQUIRED_FIELDS_MSG);
      return;
    }
    else {
      let request = {
        "count": this.createVoucherForm.value.count
      }
      this.voucherService.createVoucher(request).subscribe(
        data => {
          if (data && data.success) {
            this.userService.reloadCurrentRoute();
          }
          else {
            this.helper.errorResponse(data && data.message);
          }
        },
      );
    }
  }

  reset() {
    for (let value in this.createVoucherForm.controls) {
      this.createVoucherForm.controls[value].setValue('');
      this.createVoucherForm.controls[value].setErrors(null);
    }
  }
}
