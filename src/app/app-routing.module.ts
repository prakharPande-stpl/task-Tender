import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionComponent } from './tender/add-question/add-question.component';
import { AddTenderComponent } from './tender/add-tender/add-tender.component';
import { QuestionsCompComponent } from './tender/questions-comp/questions-comp.component';
import { ViewDetailsComponent } from './tender/view-details/view-details.component';

const routes: Routes = [{ path: 'registerVehicle', loadChildren: () => import('./register-vehicle/register-vehicle.module').then(m => m.RegisterVehicleModule) },
{ path: 'tenders', loadChildren: () => import('./tender/tender.module').then(m => m.TenderModule) },
{ path: 'addTenders', component: AddTenderComponent },
{ path: 'viewDetails/:id', component: ViewDetailsComponent },
{path: 'addTenders/:id', component: AddTenderComponent },
{ path: 'questionsComp', component: QuestionsCompComponent },
{ path: 'addQuestions', component: AddQuestionComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
