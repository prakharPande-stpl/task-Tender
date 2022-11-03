import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonServiceService } from '../common-service.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-tender',
  templateUrl: './tender.component.html',
  styleUrls: ['./tender.component.css']
})
export class TenderComponent implements OnInit {
  filterForm!: FormGroup
  dataSource : any;
  displayedColumns = ['srNo', 'tenderId', 'tenderName', 'closingDate', 'location', 'action', 'publish'];
  totalCount: number = 0;
  currentPage: number = 0;
  tenderStatusValue: number = 0;
  checkedFlag: boolean = false;
  govtBodyArray = [
    { id: '0', name: 'All' },
    { id: '1', name: 'Center Goverment' },
    { id: '2', name: 'State Goverment' },
    { id: '3', name: 'PSU' }];

  tenderStatus = [
    { id: '0', name: 'All' },
    { id: '1', name: 'Publish' },
    { id: '2', name: 'Pending' },
    { id: '3', name: 'Expired' }];

    @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: CommonServiceService, private router: Router, private fb: FormBuilder,
    private snakBar: MatSnackBar, private ngxSpinner: NgxSpinnerService,
    public dialog: MatDialog) { }


  ngOnInit(): void {
    this.filterFormData();
    this.getTableData();    
  }

  openDialog(obj: any,type:string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data:type
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        if(type == 'delete'){
          this.deleteTender(obj);
        }else if(type == 'toggle'){
          this.slideSelect(obj)
        }
      }else{
        this.getTableData()
      }
    })

  }

  filterFormData() {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      govtBody: [''],
      tenderStatus: [''],
      searchText: ['']
    })
  }

  filterData() {
    this.tenderStatusValue = this.filterForm.value.tenderStatus ? this.filterForm.value.tenderStatus : 0;
    this.getTableData();
  }

  getTableData() {
    this.ngxSpinner.show();
    this.api.setHttp('get', 'Tender/Management/get-tender?pageid=' + (this.currentPage + 1) + '&rowsperpage=10&GovtBodyId=' +
      this.filterForm.value.govtBody + '&IsQuesploadRemain=false&TenderPublishStatus=' + this.tenderStatusValue +
      '&ToDate=' + this.filterForm.value.fromDate + '&FromDate=' + this.filterForm.value.toDate + '&seatchtext=' + this.filterForm.value.searchText,
      false, false, false, 'baseURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.dataSource = new MatTableDataSource(res.responseData.data);
          this.dataSource.sort = this.sort;
          this.totalCount = res.responseData.totalCount;
          this.ngxSpinner.hide()
        }
      }),
      error: (error: any) => {
        // this.handalErrorService.handelError(error.status);
        console.log(error);
      }
    })
  }

  clearForm() {
    this.filterForm.reset();
    this.tenderStatusValue = 0
    this.filterFormData();
    this.getTableData();
  }

  pageChanged(event: any) {
    // this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.cp = this.currentPage
    // this.getAllData(this.currentPage);
    this.getTableData();
  }

  slideSelect(obj: any) { 
    this.api.setHttp('put', 'Tender/Management/getbyTenderPublishStatus?tenderId='+obj.tenderId+
    '&modifiedBy=USER202203041214524702060&Ispublish='+!obj.tenderPublishStatus, false, false, false, 'baseURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.getTableData()
        }
      }),
      error: (error: any) => {
        // this.handalErrorService.handelError(error.status);
        console.log(error);
      }
    })
  }

  showMsg(obj: any) {
    if (obj.tenderPublishStatus) {
      this.snakBar.open("Publised Tender connot edit", 'ok')
      setTimeout(() => {
        this.snakBar.dismiss()
      }, 2000);
    } else {
      this.router.navigate(['/addTenders', obj.tenderId])
    }
    // [routerLink]="['/addTenders',element.tenderId]"
  }

  deleteTender(obj: any) {
    this.api.setHttp('delete', 'Tender/Management/delete?id=' + obj.tenderId + '&deletedby=USER202203041214524702060', false, false, false, 'baseURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.getTableData()
        }
      }),
      error: (error: any) => {
        // this.handalErrorService.handelError(error.status);
        console.log(error);
      }
    })
  }
}
