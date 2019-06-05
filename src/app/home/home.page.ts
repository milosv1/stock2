import { Component } from '@angular/core';
import {MainService} from '../main.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms'; 
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { StockAddPage } from '../stock-add/stock-add.page';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  stock: object;
  formGroup: FormGroup;
  errors: string[];
 

  stocks:{
    name: string,
    currentPrice: number, 
    priceCompare: string, 
    priceYesterday: number
  }[];
  constructor(
    private _mainService: MainService,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
    public modalController: ModalController
  
  ) {
    this.stock = { symbol: ''};
  }

  
    //get collections from firebase (this.stocks = ...)
  

  getCurrentPrice(){
    this.errors = [];
    this.stocks = [];
    this._mainService.getCurrentPrice(this.stock,(stockSymbol, valid) => {
      if(valid === true){
        this.getPrice(stockSymbol);
      }else{
        this.errors.push(stockSymbol);
        this.stock = { symbol: ''};
      }
    })
  }

  getPrice(stockSymbol){
    this._mainService.getPrice(stockSymbol, (Name, CurrentPrice, PriceYesterday) => {
      var retrievedStock = { name: Name,
                             currentPrice: CurrentPrice,
                             priceCompare:(CurrentPrice - PriceYesterday).toFixed(2),
                             priceYesterday:PriceYesterday};

      this.stocks.push(retrievedStock);
      this.stock = {symbol: ''};
    })
  }

  async StockAddPage(){
      const modal = await this.modalController.create({
        component: StockAddPage
      });
      return await modal.present();
  }

}
