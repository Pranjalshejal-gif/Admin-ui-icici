import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportCategory } from 'src/app/models/report-category';
import { ReportCategoryService } from 'src/app/Services/report-category.service';
import { ViewReportService } from 'src/app/Services/view-report.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit {

  reportCategories: Array<ReportCategory>;
  reportList: any[] = [];
  constructor(
    private reportCategoryService: ReportCategoryService,
    private viewReportService: ViewReportService, private router: Router
  ) { }

  ngOnInit(): void {
    this.reportCategoryService.getAll().subscribe(
      res => {
        this.reportCategories = res.data;
        this.reportCategories.sort((a, b) => {
          const titleA = a.title ? a.title : '';
          const titleB = b.title ? b.title : '';
          return titleA.localeCompare(titleB);
        }
        );
      },
    );
  }
   panelOpen(obj: ReportCategory) {
     if (this.reportList.find(r => r.id == obj.id)) {
      return;
    }
    this.viewReportService.getReportsForCategory(obj.id).subscribe(res => {

      if (res && res.success)
        this.reportList.push({ id: obj.id, report: res.data });
    })
  }
  showReport(report: string, category: any) {
    this.router.navigate([`reports/view-report/${report}`], category);
  }
}
