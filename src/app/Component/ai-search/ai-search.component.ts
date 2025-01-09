import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AisearchService } from 'src/app/Services/aisearch.service';

@Component({
  selector: 'app-ai-search',
  templateUrl: './ai-search.component.html',
  styleUrls: ['./ai-search.component.scss']
})
export class AISearchComponent implements OnInit {

  
  [x: string]: any;

  searchForm: FormGroup;
  showData: boolean = false;
  dataSourceCustomer: MatTableDataSource<any>;
  Columns: string[];
  atLeastOneRequired: boolean = true;
  myData: AisearchService[];
  panelOpen: boolean = true;

  constructor(private toast: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private search: AisearchService,
    private router: Router) { }

  ngOnInit(): void {
    this.Columns = this.search.CustomerColumns;

    this.searchForm = this.fb.group({
      agentInstId: [''],

      agentInstType: [''],

      agentInstName: [''],
     });
  }

  // dateChange(e: { value: { toString: () => string; }; }) {
  //   this['minDateToFinish'].next(e.value.toString());
  // }

  searchCustomer() {
    let valid = this.searchForm;
    if (this.searchForm.invalid) {
      this.toast.error("Please Enter Valid Inputs");
      return;
    }

    if (isNullorUndefined(valid.get('agentInstId')?.value) &&
      isNullorUndefined(valid.get('agentInstType')?.value) &&
      isNullorUndefined(valid.get('agentInstName')?.value)

    ) {
      this.atLeastOneRequired = false;
      this.toast.error("At least one search criteria is required");
    } else {
      let request = {
        agentInstId: this.searchForm.value.agentInstId,
        agentInstType: this.searchForm.value.agentInstType,
        agentInstName: this.searchForm.value.agentInstName,
        status: this.searchForm.value.status,
      }
      this.search.customerSearch(request).subscribe(res => {
        if (res && res.success) {

          this.dataSourceCustomer = new MatTableDataSource(res.data);
          this.atLeastOneRequired = true;
          this.showData = true;
          this.panelOpen = false;
          console.log("res" + JSON.stringify(res))

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




