import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { TenderRoutingModule } from './tender-routing.module';
import { AddTenderComponent } from './add-tender/add-tender.component';
import { TenderComponent } from './tender/tender.component';
import { MaterialModule } from '../material.module';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSortModule } from '@angular/material/sort';
import { QuestionsCompComponent } from './questions-comp/questions-comp.component';
import { AddQuestionComponent } from './add-question/add-question.component';


@NgModule({
  declarations: [
    AddTenderComponent,
    TenderComponent,
    ViewDetailsComponent,
    DeleteDialogComponent,
    QuestionsCompComponent,
    AddQuestionComponent
  ],
  imports: [
    CommonModule,
    TenderRoutingModule,
    MaterialModule,
    NgxSpinnerModule,
    MatSortModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
      libraries: ["places"]
    })
  ]
})
export class TenderModule { }
