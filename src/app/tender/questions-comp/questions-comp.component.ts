import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-questions-comp',
  templateUrl: './questions-comp.component.html',
  styleUrls: ['./questions-comp.component.css']
})
export class QuestionsCompComponent implements OnInit {
  filterForm!: FormGroup
  dataSource: any;
  displayedColumns = ['srNo', 'questionTitle', 'Action'];
 
  currentPage: number = 0;
  totalCount: number = 0;

  categoryDropdown = new Array();
  expertiseCategory = new Array();
  questionCategory= new Array();
  questionType= new Array();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: CommonServiceService, private fb: FormBuilder,
    private _bottomSheet: MatBottomSheet) {
      // this._bottomSheet.open(AddQuestionComponent, {
      //   panelClass: 'custom-width'
      // });
     }

  ngOnInit(): void {
    this.formData();
    this.getData();
    this.getCategory();
    this.getQuestionCategory();
    this.getQuestionType()
  }

  formData() {
    this.filterForm = this.fb.group({
      category: [''],
      expertiseCategory: [''],
      questionCategory: [''],
      questionType: [''],
      questionName: ['']
    })
  }

  openBottomSheet(): void {
    this._bottomSheet.open(AddQuestionComponent);
  }

  getData() {
    let obj = this.filterForm.value;
    this.api.setHttp('get', 'api/QuestionBank/getdatawithfilter?pageno=' + (this.currentPage + 1) +
      '&rowsperpage=10&searchtext=' + obj.questionName + '&tenderCategoryId=' + obj.category +
      '&expertiseAreaId=' + obj.expertiseCategory + '&questionCategoryId=' + obj.questionCategory +
      '&questionTypeId=' + obj.questionType, false, false, false, 'baseURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.dataSource = new MatTableDataSource(res.responseData.data);
          this.dataSource.sort = this.sort;
          this.totalCount = res.responseData.totalCount
        }
        else{
          this.dataSource = []
        }
      }),
      error: (error: any) => {
        // this.handalErrorService.handelError(error.status);
        console.log(error);
      }
    })
  }

  getCategory() {
    this.api.setHttp('get', 'Category/Management/getddlTenderCategory_1_0', false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.categoryDropdown = res.responseData;
        } else {
          this.categoryDropdown = []
        }
      }),
      error: (error: any) => {
        // this.handalErrorService.handelError(error.status);
        console.log(error);
      }
    })
  }

  getExpertiseCategory() {
    let catId = this.filterForm.value.category
    this.api.setHttp('get', 'ExpertiseArea/Management/get-ddl-expertise-category_1_0?categoryId=' + catId, false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.expertiseCategory = res.responseData;
        } else {
          this.expertiseCategory = []
        }
      }),
      error: (error: any) => {
        // this.handalErrorService.handelError(error.status);
        console.log(error);
      }
    })
  }

  getQuestionCategory() {
    this.api.setHttp('get', 'api/QuestionBankdropdown/getQuestionCategory', false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.questionCategory = res.responseData;
        } else {
          this.questionCategory = []
        }
      }),
      error: (error: any) => {
        // this.handalErrorService.handelError(error.status);
        console.log(error);
      }
    })
  }

  getQuestionType() {
    this.api.setHttp('get', 'api/QuestionBankdropdown/getQuestionType', false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.questionType = res.responseData;
        } else {
          this.questionType = []
        }
      }),
      error: (error: any) => {
        // this.handalErrorService.handelError(error.status);
        console.log(error);
      }
    })
  }

  pageChanged(event: any) {
    // this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.cp = this.currentPage
    // this.getAllData(this.currentPage);
    this.getData();
  }

  clear() {
    this.filterForm.controls['expertiseCategory'].setValue('')
  }

}
