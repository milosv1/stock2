import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { PriceData } from '../models/pricedata.interface';
import { Stocks } from '../models/stocks.interface';
@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.page.html',
  styleUrls: ['./stock-detail.page.scss'],
})
export class StockDetailPage implements OnInit {
stock:Stocks;
priceData$:Observable<PriceData[]>;
  constructor(
    private modalController:ModalController,
    private dataService:DataService,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.dataService.getPriceData( this.stock )
    .then((response:Observable<PriceData[]>)=>{
      this.priceData$ = response;
    });
  }
  close(){
    this.modalController.dismiss();
  }

}
