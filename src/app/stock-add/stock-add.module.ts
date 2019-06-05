import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StockAddPage } from './stock-add.page';
//we need this mainservice to be able to retreieve the info from the site.>>(stockprice)
import { MainService } from '../main.service';



const routes: Routes = [
  {
    path: '',
    component: StockAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StockAddPage]
})
export class StockAddPageModule {}
