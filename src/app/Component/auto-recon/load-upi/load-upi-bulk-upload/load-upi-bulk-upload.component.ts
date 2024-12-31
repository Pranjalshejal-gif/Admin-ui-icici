import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { AutoReconService } from 'src/app/Services/auto-recon.service';
import { LoadUpiFileUploadDialogComponent } from '../load-upi-file-upload-dialog/load-upi-file-upload-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-load-upi-bulk-upload',
  templateUrl: './load-upi-bulk-upload.component.html',
  styleUrls: ['./load-upi-bulk-upload.component.scss']
})
export class LoadUpiBulkUploadComponent implements OnInit {

  dataSourceDisbursment: MatTableDataSource<any>;
  Columns: string[];
  file: File;
  showData: boolean = true; // Initialize to false
  searchAllTxntypeForm: FormGroup;
  fileSubType: any;

  constructor(private toast: ToastrService,
    private autoRecon: AutoReconService,
    public dialog: MatDialog,
    private router: Router,
    private sharedService: SharedService, private user: UserService, private _formBuilder: FormBuilder) {


  }
  ngOnInit(): void {
    this.searchAllTxntypeForm = this._formBuilder.group({
      txnType: ['', Validators.required],
      subTxnType: ['', Validators.required]
    });
    this.searchAllTxntypeForm.get('txnType')?.valueChanges.subscribe(value => {
      // Reset the value of 'subTxnType' when 'txnType' changes
      this.searchAllTxntypeForm.get('subTxnType')?.setValue('', { emitEvent: false });
      // Reset the validity of 'subTxnType' to trigger validation
      this.searchAllTxntypeForm.get('subTxnType')?.updateValueAndValidity({ emitEvent: false });
      this.fileSubType = "";
    });

  }


  upload() {

    this.searchAllTxntypeForm.get('txnType')?.markAsTouched();
    this.searchAllTxntypeForm.get('subTxnType')?.markAsTouched();
    if (this.searchAllTxntypeForm.invalid) {
      return;
    }

    let txnType = this.searchAllTxntypeForm.get('txnType')?.value;
    let subTxnType = this.searchAllTxntypeForm.get('subTxnType')?.value;

    if (txnType === "LOAD-UPI") {

      if (subTxnType === "UPI-PAY") {
        this.fileSubType = "LOAD-UPI-PAY"
      } else if (subTxnType === "UPI-REV") {
        this.fileSubType = "LOAD-UPI-REV"
      }
    } else if (txnType === "LOAD-CBS") {

      if (subTxnType === "CBS-PAY") {
        this.fileSubType = "LOAD-CBS-PAY"

      } else if (subTxnType === "CBS-REV") {
        this.fileSubType = "LOAD-CBS-REV"
      }
    }

    this.sharedService.setTxntype(this.fileSubType);
    this.autoRecon.uploadFileAndData(this.file, this.fileSubType).subscribe(
      res => {
        if (res && res.success) {
          this.dialog.open(LoadUpiFileUploadDialogComponent, {
            width: '60%',
            data: { "fileDetails": res },
            autoFocus: false,
            maxHeight: '400px'
          });
        }
        else
          this.toast.error(res.msg);
      }, err => {
      });

  }

  readFile(event: any) {
    this.file = event.target.files[0];
  }

}
