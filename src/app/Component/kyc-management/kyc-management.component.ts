import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HelperService } from 'src/app/Services/helper.service';
import { KycService } from 'src/app/Services/kyc-management.service';

@Component({
  selector: 'app-kyc-management',
  templateUrl: './kyc-management.component.html',
  styleUrls: ['./kyc-management.component.scss']
})

export class KycManagementComponent implements OnInit {
  colDef: any[] = [
    { key: 'type', type: 'readable', readonly: true, heading: '', colspan: 1, subHeading: '' },
    { key: 'capacityLimit', type: 'number', heading: '', colspan: 1, subHeading: '' },
    { key: 'perDayLoadLimit', type: 'number', heading: 'Per day Load', colspan: 1, subHeading: '(Amount)' },
    { key: 'perDayTrfInwardLimit', type: 'number', heading: 'Per day Transfer', colspan: 1, subHeading: '(inward Amount)' },
    { key: 'txnLoadCount', type: 'number', heading: 'No. of Load', colspan: 1, subHeading: '(Count)' },
    { key: 'txnLTfrInwardCount', type: 'number', heading: 'No of transfer', colspan: 1, subHeading: '(inward count)' },
    { key: 'perDayUnLoadLimit', type: 'number', heading: 'Per Day Unload', colspan: 1, subHeading: '(Amount)' },
    { key: 'perDayTfrOutwardLimit', type: 'number', heading: 'Per day transfer', colspan: 1, subHeading: '(Outward Amount)' },
    { key: 'txnUnloadCount', type: 'number', heading: 'No. of unload', colspan: 1, subHeading: '(Count)' },
    { key: 'txnTrfOutwardCount', type: 'number', heading: 'No. of transfer', colspan: 1, subHeading: '(Outward Count)' },
    { key: 'perTransaction', type: 'number', heading: 'Per Transaction', colspan: 1, subHeading: '' },
    { key: 'monthlyTrfOutwardCount', type: 'number', heading: 'Number of P2P transfer', colspan: 1, subHeading: '(Within 30 days)' }
  ];

  displayedColumns: string[] = this.colDef.map(t => t.key);

  dataSource: MatTableDataSource<any>;
  isEditable: boolean = false;
  isEditChecked: boolean = false;
  checkMe: boolean = false;


  constructor(public dialog: MatDialog, private kycService: KycService,
    private cd: ChangeDetectorRef, private helper: HelperService) { }

  ngOnInit(): void {
    this.kycDetails();
  }

  onEdit() {
    this.isEditable = true;
    this.isEditChecked = true;
  }

  showOptions(event: MatCheckboxChange): void {
    this.displayedColumns = this.colDef.map(t => t.key)
  }

  onCancel() {
    this.kycDetails();
    this.isEditable = false;
    this.isEditChecked = false;
    this.dataSource?.filteredData?.map((x: any) => x.isChecked = false);
  }

  onInputChange(value: number, element: any, def: any) {
    if (value < 0) {
      element[def.key] = -value;
    }
  }

  onSubmit(event: any) {
    const updatedData = this.dataSource?.filteredData?.filter((x: any) => x.isChecked)
    const payload = updatedData.map(({ entityName, isChecked, ...rest }) => {
      return rest;
    });

    if (payload.length != 0) {
      this.kycService.updateKyc(payload).subscribe(
        data => {
          if (data && data.success) {
            this.isEditable = false;
            this.isEditChecked = false;
            this.kycDetails();
          }
          else if (data && data.message) {
            this.helper.errorResponse(data.message);
          }
          else
            this.helper.errorResponse("Server error");
        },
      );
    } else {
      this.helper.errorResponse("Select the checkbox to update");
    }
  }
  kycDetails() {
    this.kycService.getKycDetails().subscribe(res => {
      if (res && res.success) {
        this.dataSource = new MatTableDataSource(res?.data);

      }
    });
  }
}
