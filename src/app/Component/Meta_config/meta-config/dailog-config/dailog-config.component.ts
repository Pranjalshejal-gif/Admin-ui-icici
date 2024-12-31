import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/Services/config.service';
import { inject } from '@angular/core/testing';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MetaConfigComponent } from '../meta-config.component';
@Component({
  selector: 'app-dailog-config',
  templateUrl: './dailog-config.component.html',
  styleUrls: ['./dailog-config.component.scss']
})
export class DailogConfigComponent implements OnInit {

  productForm: FormGroup;
  sample: any;
  actionBtn: string = "Submit";
  mode = 'Add';
  isView = false;
  showResult: boolean;
  institute: any;
  dialogg: any;
  showMe = true;

  constructor(private formBuilder: FormBuilder,
    private config: ConfigService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public datag: any,
    private location: Location,
    private dialogref: MatDialogRef<MetaConfigComponent>) {
    {
      this.sample = this.router.getCurrentNavigation()?.extras;
      if (router.url.includes('view')) {
        this.isView = true;
      }
    }
  }

  ngOnInit(): void {
    // Below code for add the validation for fields
    this.productForm = this.formBuilder.group({
      key: ['', Validators.pattern],
      value: ['', Validators.pattern],

    });

    //Below code is for Edit operation,Assign the data for dailog fields
    if (this.datag.id) {
      this.mode = 'Edit';

    }
    this.productForm = this.formBuilder.group({
      id: { value: this.datag.id, disabled: this.productForm },
      key: { value: this.datag.key, disabled: this.productForm },
      value: this.datag.value,
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.productForm.invalid) {
      return;
    }
    //Below code is for add the data in UI if mode is add
    if (this.mode == 'Add') {
      let request = {
        key: "meta.data." + this.productForm.value.key.trim(),
        value: this.productForm.value.value.trim()
      };
      //Below code is for add the data in DB and redirect in home page
      this.config.add(request).subscribe(
        data => {
          this.router.navigate([`meta-config`]); this.dialogref.close();
          this.reloadCurrentRoute();
        },
      );
    }
    else {
      let request = {
        id: this.datag.id,
        key: this.productForm.value.key,
        value: this.productForm.value.value.trim(),
      };
      this.config.updateConfig(request).subscribe(
        data => {
          this.router.navigate([`meta-config`]);
          this.dialogref.close();
          this.reloadCurrentRoute();
        },
      );
    }
  }

  onClose() {
    this.router.navigate([`meta-config`]);
  }

  getDisabledValue() {
    // in this case textarea will be disbaled.
    return true;
  }
  toggletag() {
    this.showMe = false;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('.', { skipLocationChange: false }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
