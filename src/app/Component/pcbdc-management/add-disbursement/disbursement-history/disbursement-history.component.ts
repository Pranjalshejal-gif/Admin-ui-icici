import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { DisbursementApproveRejectDialogComponent } from './disbursement-approve-reject-dialog/disbursement-approve-reject-dialog.component';

@Component({
  selector: 'app-disbursement-history',
  templateUrl: './disbursement-history.component.html',
  styleUrls: ['./disbursement-history.component.scss']
})
export class DisbursementHistoryComponent implements OnInit {

  dataSourcePcbdc: MatTableDataSource<any>;
  Columns: string[];
  atLeastOneRequired: boolean = true;
  dataStatusList: any = [];
  constructor(private pcbdcService: PcbdcService, public dialog: MatDialog) { }
  data: any;

  ngOnInit(): void {
    this.Columns = this.pcbdcService.disbursementHistoryColumns;
    this.pcbdcService.bulkHistroy().subscribe(res => {
      if (res && res.success) {
        var arr = res.data;
        arr.forEach((obj: any) => {
          obj.status = obj.status === "P" ? 'PENDING' :
            obj.status === "C" ? 'COMPLETED' :
              obj.status === "R" ? 'INVALID' :
                obj.status === "I" ? 'IN_PROGRESS' :
                  obj.status === "Y" ? 'APPROVED' :
                    obj.status === "X" ? 'REJECTED' :
                      '';
        });
        this.dataSourcePcbdc = new MatTableDataSource(res.data);
        this.atLeastOneRequired = true;
      }
    });
  }

  openDialog(evt: any) {
    const dialogRef = this.dialog.open(DisbursementApproveRejectDialogComponent, {
      width: '50%',
      maxHeight: '52500px',
      data: { "row": evt },
      autoFocus: false
    });
  }
}