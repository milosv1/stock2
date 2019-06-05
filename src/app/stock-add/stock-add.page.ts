import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';

@Component({
  selector: 'app-stock-add',
  templateUrl: './stock-add.page.html',
  styleUrls: ['./stock-add.page.scss'],
})
export class StockAddPage implements OnInit {
 
  stock: object;
  

  errors: string[];

  stocks: {
    name: string,
     currentPrice: number, 
     priceCompare: string, 
     priceYesterday: number
}[];
stockSymbol: string;
  constructor(
    private _mainService: MainService,

  ) { }

  ngOnInit() {
  }

  findStock(){
    this.errors = [];
    this.stocks = [];
    this._mainService.getCurrentPrice(this.stockSymbol,( valid ) => {
      if(valid === true){
        this.getPrice(this.stockSymbol);
        console.log("got" + this.stockSymbol);

      }else{
        this.errors.push(this.stockSymbol);
        this.stock = { symbol: ''};
      }
    })
  }

  getPrice(stockSymbol)
{
  this._mainService.getPrice(stockSymbol, (Name, CurrentPrice, PriceYesterday) => {
    var retrievedStock = { name: Name,
                           currentPrice: CurrentPrice,
                           priceCompare:(CurrentPrice - PriceYesterday).toFixed(2),
                           priceYesterday:PriceYesterday};

    this.stocks.push(retrievedStock);
    this.stock = {symbol: ''};
})

}




}
