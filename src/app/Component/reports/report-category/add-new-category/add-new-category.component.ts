import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ReportCategoryService } from 'src/app/Services/report-category.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent implements OnInit {

  addForm: FormGroup;
  reportCategoryData: any;
  mode = 'Add';
  isView = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private reportCategoryService: ReportCategoryService
  ) {
    this.reportCategoryData = this.router.getCurrentNavigation()?.extras;
    if (router.url.includes('view')) {
      this.isView = true;
    }
  }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      title: ['', Validators.required],
    });

    if (this.reportCategoryData.id) {
      this.mode = 'Edit';
    }
    this.addForm = this.fb.group({
      title: [{ value: this.reportCategoryData?.title, disabled: this.isView },Validators.pattern(RegularExpression.REPORT_CATEGORY_TITLE)],
      systemCategory: this.reportCategoryData.systemCategory
    });
  }
  onSubmit() {
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }

    if (this.mode == 'Add') {
      let request = {
        title: this.addForm.value.title,
      };

      this.reportCategoryService.add(request).subscribe(
        data => {
          this.router.navigate([`reports/report-category`]);
        },
      );
    }
    else {
      let request = {
        id: this.reportCategoryData.id,
        title: this.addForm.value.title,
      };

      this.reportCategoryService.update(request).subscribe(
        data => {
          this.router.navigate([`reports/report-category`]);
        },
      );
    }
  }
  onClose() {
    this.location.back();
  }
}
