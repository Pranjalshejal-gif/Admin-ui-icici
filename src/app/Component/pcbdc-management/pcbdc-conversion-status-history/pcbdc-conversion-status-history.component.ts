import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { PcbdcConversionStatusDialogComponent } from './pcbdc-conversion-status-dialog/pcbdc-conversion-status-dialog.component';

@Component({
  selector: 'app-pcbdc-conversion-status-history',
  templateUrl: './pcbdc-conversion-status-history.component.html',
  styleUrls: ['./pcbdc-conversion-status-history.component.scss']
})
export class PcbdcConversionStatusHistoryComponent implements OnInit {

  dataSourcePcbdc: MatTableDataSource<any>;
  Columns: string[];
  atLeastOneRequired: boolean = true;
  dataStatusList: any = [];
  constructor(private pcbdcService: PcbdcService, public dialog: MatDialog) { }
  data: any;

  ngOnInit(): void {
    this.Columns = this.pcbdcService.reqStatusHistoryColumns;
    this.pcbdcService.requisitionHistory().subscribe(res => {
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
        })
        this.dataSourcePcbdc = new MatTableDataSource(res.data);
        this.atLeastOneRequired = true;
      }
    });

  }
  openDialog(evt: any) {
    const dialogRef = this.dialog.open(PcbdcConversionStatusDialogComponent, {
      width: '50%',
      maxHeight: '52500px',
      data: { "row": evt },
      autoFocus: false
    });
  }
}
