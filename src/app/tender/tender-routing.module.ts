import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTenderComponent } from './add-tender/add-tender.component';
import { TenderComponent } from './tender/tender.component';

const routes: Routes = [{ path: '', component: TenderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenderRoutingModule { }
