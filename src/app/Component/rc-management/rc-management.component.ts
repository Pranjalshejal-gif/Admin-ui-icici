import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RcManagementService } from 'src/app/Services/rc-management.service';
import { AddRcDialogComponent } from './add-rc-dialog/add-rc-dialog.component';
import { AddRcLocalDialogComponent } from './add-rc-local-dialog/add-rc-local-dialog.component';

@Component({
  selector: 'app-rc-management',
  templateUrl: './rc-management.component.html',
  styleUrls: ['./rc-management.component.scss']
})

export class RcManagementComponent implements OnInit {

  searchForm: FormGroup;
  dataSourceRc: MatTableDataSource<any>;
  dataSourceLocalRc: MatTableDataSource<any>;
  ColumnsRc: string[];
  ColumnsRcLocal: string[];
  showData: boolean = false;
  showLocalRc: boolean = false;
  atLeastOneRequired: boolean = true;
  rc: any = [];
  panelOpen: boolean = true;

  constructor(
    private searchRc: RcManagementService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private toast: ToastrService,
  ) {
    this.rc = this.router.getCurrentNavigation()?.extras;
  }

  ngOnInit(): void {
    this.ColumnsRc = this.searchRc.rcColumns;
    this.ColumnsRcLocal = this.searchRc.localRcColumns;
    this.searchForm = this.fb.group({
      mnemonic: ['']
    });
  }

  search() {
    let valid = this.searchForm;
    if (this.searchForm.invalid) {
      this.toast.error("Please Enter Valid Inputs");
      return;
    }
    if (isNullorUndefined(valid.get('mnemonic')?.value)) {
      this.atLeastOneRequired = false;
      this.toast.error("At least one search criteria is required");
    } else {
      this.searchRc.rcSearch(this.searchForm.value).subscribe(res => {
        if (res && res.success) {
          this.dataSourceRc = new MatTableDataSource(res.data.data);
          this.atLeastOneRequired = true;
          this.showData = true;
          this.panelOpen = false;
        }
      })
    }
  }

  openDialogAddRc(evt: any) {
    const dialogRef = this.dialog.open(AddRcDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { "rc": evt, }
    });
  }

  openDialogDiaplayLocalRC(evt: any) {
    this.showLocalRc = false;
    let request = {
      id: evt.id
    }
    this.searchRc.localRcSearch(request).subscribe(res => {
      if (res && res.success) {
        Object.keys(res.data).forEach(key => {
          res.data[key]['parentId'] = evt.id
        });
        this.dataSourceLocalRc = new MatTableDataSource(res.data);
        this.showLocalRc = true;
      }

    })
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