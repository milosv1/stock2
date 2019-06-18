import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms'; 
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { StockAddPage } from '../stock-add/stock-add.page';
import { StockDetailPage } from '../stock-detail/stock-detail.page';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Stocks } from '../models/stocks.interface';
import { PriceData } from '../models/pricedata.interface';
//done
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  stock:any;
  formGroup: FormGroup;
  errors: Array<string>;
  
  followedStocks$:Observable<Stocks[]>;
  userStocks:Array<Stocks>=[];


  constructor(
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
    public modalController: ModalController
  
  ) {
  }

  ngOnInit(){
    // get collections from firebase (this.stocks = ...)
    this.authService.auth.subscribe( (user) => {
      if( user ){
        let uid = user.uid;
        this.followedStocks$ = this.dataService.getStocks( uid );
        this.followedStocks$.subscribe((values) => {
          values.forEach( item => this.userStocks.push(item) );
        })
      }
    });
  }

  async StockAddPage(){
      const modal = await this.modalController.create({
        component: StockAddPage
      });
      //get data from modal when closed
      modal.onDidDismiss().then((response) => {
        if( response.data !== undefined ){
          //get data from the stock-add modal
          let data = response.data;
          let stock = {symbol: response.data.symbol }
          let pricedata = response.data.pricedata;
          this.dataService.addStock( data );
          this.dataService.getPriceData(stock).then((response:Observable<PriceData>) => {
            this.dataService.addPriceData(pricedata);
          })
        }
      });
      return await modal.present();
  }
  updatePrices(){
    // update prices for all followed stocks
    this.userStocks.forEach( (stock) => {
      //get the latest price
      this.dataService.getStockBySymbol( stock.symbol )
      .then( (response:any) => {
        //get the price data
        let pricedata = response.pricedata;
        //create price data collection for the stock
        this.dataService.getPriceData( stock )
        .then( (response) => {
          //add the new price data to stock
          this.dataService.addPriceData( pricedata );
        });
      });
    });
  }

  async stockDetailPage( stock:Stocks ){
    //open modal showing stock prices and graph?
    const modal = await this.modalController.create({
      component: StockDetailPage,
      componentProps:{
        'stock': stock
      }
    });
    return await modal.present();
  }
}
