import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  filterForm!: FormGroup;
  addQueForm!: FormGroup;
  categoryDropdown = new Array();
  expertiseCategory = new Array();
  questionCategory = new Array();
  questionType = new Array();
  selectCountArray = new Array();
  forLoopCountArray = new Array();
  questionType1:any
  constructor(private api: CommonServiceService, private fb: FormBuilder,
    private _bottomSheetRef: MatBottomSheetRef<AddQuestionComponent>) {

  }

  ngOnInit(): void {
    this.filterFormData();
    this.getCategory();
    this.getQuestionCategory();
    this.addQueFormData()

  }

  filterFormData() {
    this.filterForm = this.fb.group({
      category: [''],
      expertiseCategory: [''],
      questionCategory: [''],
      questionType: [''],
      questionCount: ['']
    })
  }

  addQueFormData(){
    this.addQueForm = this.fb.group({
      questionTitle : [''],
      questionOptions : this.fb.array([
      ])
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
    let textCatIdArray = this.filterForm.value.category
    let textCatId = textCatIdArray.join(",");
    this.api.setHttp('get', 'ExpertiseArea/Management/get-ddl-expertise-category_2_0?categoryId=' + textCatId, false, false, false, 'dropdownURL');
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

  getSelecteCount(){
    if(this.filterForm.value.questionType == 2 || this.filterForm.value.questionType == 3 ){
      this.selectCountArray =  [2,3,4,5,6,7,8,9,10];
    }else{
      this.selectCountArray = []
    }
  }

  clear() {
    this.filterForm.controls['expertiseCategory'].setValue('')
  }

  onAdd(){
    this.forLoopCountArray=[]
    let count = this.filterForm.value.questionCount
   this.questionType1 =  this.filterForm.value.questionType
    for(let i=0;i<count;i++){
      this.forLoopCountArray.push(String.fromCharCode(97+i));
    }    
  }
}
