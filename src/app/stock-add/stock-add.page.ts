import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-stock-add',
  templateUrl: './stock-add.page.html',
  styleUrls: ['./stock-add.page.scss'],
})
export class StockAddPage implements OnInit {
 
  stock: object;
  symbol: object;

  errors: string[];

  stocks: {
    name: string,
     currentPrice: number, 
     priceCompare: string, 
     priceYesterday: number
}[];

stockSymbol: string;
  _http: any;
  constructor(
    private _mainService: MainService,
    private http: HttpClient,
    public alertController: AlertController
  ) { }

  ngOnInit() {

  }

  //this function searches for the stock then returns if it is not found return error message
  findStock(stockSymbol){
//if this symbol exists - console Log exists then retrieve the information regarding the symbol
    if( this.stockSymbol ){
      console.log("stock symbol " + this.stockSymbol + " found");
      this.http.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+this.stockSymbol+'&interval=1min&apikey=V5JC59JK1GR6EUKJ').subscribe((response) => {
        console.log(response);
        this.presentAlert();
    }); //however else if this does not exist, show symbol not found.
    }else if( !this.stockSymbol ){
      console.log("Symbol not found!");
    }
  }
  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Found it!',
     // subHeader: '',
      message: 'Stock Symbol: '+ this.stockSymbol + ' found!',
      buttons: ['Thanks!']
    });

    await alert.present();
  }

  




}
