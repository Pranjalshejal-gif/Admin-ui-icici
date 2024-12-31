import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DisputeManagement } from 'src/app/Services/dispute.service';
import { DialogDisputeComponent } from './dialog-dispute/dialog-dispute.component';


@Component({
  selector: 'app-dispute-management',
  templateUrl: './dispute-management.component.html',
  styleUrls: ['./dispute-management.component.scss']
})
export class DisputeManagementComponent implements OnInit {

  dataSource: any = [];
  Columns: any[] = [
    {name:'customer', label:"customer/ merchant name"},
    {name:'complaintId', label:'complaint Id'}, 
    {name:'created', label:'created Date'}, 
    {name:'disputeType', label:'dispute Type'},
    {name:'status', label:'status'}, 
    {name:'title', label:'title'},
    {name:'txnId', label:'txn Id'},
    {name:'updated', label:'updated Date'}];

  constructor(public dialog: MatDialog, private disputeManagement :DisputeManagement) { }

  ngOnInit(): void {

    this.disputeManagement.getDispute().subscribe(res => {
      const data = res?.data?.map((x:any) =>{ 
        x.customerName = x?.customer?.name;      
        return x;
      });
      this.dataSource = new MatTableDataSource(res?.data);
    }
  );
  }

  openDialog(evt:any){
    const dialogRef = this.dialog.open(DialogDisputeComponent, {
      width: '80%',
      data: {"customerDetails": evt}
    });

  }

}
