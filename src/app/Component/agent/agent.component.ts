// import { Component, OnInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AgentService } from 'src/app/Services/agent.service';
import { DialogComponent } from 'src/app/Shared/dialog/dialog.component';


@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {

 
  
    displayedColumns: any[];
    dataSource: MatTableDataSource<any>;
    showResult:boolean;
  
    constructor( private userRole: AgentService,
      private router:Router, public dialog: MatDialog) { }
  
    ngOnInit(): void {
      this.displayedColumns = this.userRole.roleColumns;
      this.loadRoles();    
    }
  
    loadRoles() {
      this.userRole.getAllRoles().subscribe(res => {
        var data = res?.data?.map((x: any) => {
          x.permission = x?.permissions?.map((y: any) => y.value).join(', ');
          return x;
        });
        
        this.dataSource = new MatTableDataSource(data);
        
        this.showResult = true;
      });

       console.log("data" + JSON.stringify(this.dataSource))
     
    }
  
    add() {
      this.router.navigate([`user-management/role/add`]);
    }
  
    edit(id: any) {
      this.router.navigate([`user-management/role/edit/${id}`],this.dataSource.filteredData.find(r => r.id == id));
    }
  
    view(id: any) {
      this.router.navigate([`user-management/role/view/${id}`],this.dataSource.filteredData.find(r => r.id == id));
    }
  
    delete(id:any) {
         let dialogRef = this.dialog.open(DialogComponent, {
        width: "300px",
        data: {"msg": "Do you really want to delete the role?", "type": "confirm"}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userRole.deleteRole(id).subscribe(      
            data => {
              this.dialog.open(DialogComponent, {
                width: "300px",
                data: {"msg": "Role has been deleted successfully", "type": "info"}
              });
              this.loadRoles()
            },
          );        
        } 
      });
    }
  
  }
  