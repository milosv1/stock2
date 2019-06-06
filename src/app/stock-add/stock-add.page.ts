import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Http } from '@angular/http';

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

keys: string [];
// name:string;
 //price: number;[];

stockSymbol: string;
  //_http: any;
  constructor(
    private _mainService: MainService,
    private http: Http,
    public alertController: AlertController,
    public httpClientModule: HttpClientModule,
   
   
  ) { }

  ngOnInit() {
   

  }

  //this function searches for the stock then returns if it is not found return error message
  findStock(stockSymbol, cb){
//if this symbol exists - console Log exists then retrieve the information regarding the symbol
    if( this.stockSymbol ){
      console.log("stock symbol ",this.stockSymbol, " found");
      this.http.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+this.stockSymbol+'&interval=1min&apikey=V5JC59JK1GR6EUKJ').subscribe((response) => {
       
        let _body = response["_body"]
        console.log(typeof _body);
        console.log(response);
         const jsonParseResp = JSON.parse(_body);
         console.log('json', jsonParseResp["Time Series (1min)"]);
         
         let metaData = jsonParseResp["Meta Data"];
         let lastRefresh = metaData["3. Last Refreshed"]
         console.log("last", lastRefresh);
         
         let timeSeries = jsonParseResp["Time Series (1min)"]
         let lastRefreshData = timeSeries[lastRefresh]
         let openData = lastRefreshData["1. open"]

         console.log("price: ", openData)
        
        this.presentAlert();
       
        
    }); //however else if this does not exist, show symbol not found.
    }
  }
  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Found it!',
     // subHeader: '',
      message: 'Stock Symbol: '+ this.stockSymbol + ' found!',
      //buttons: ['Thanks!']
    });

    await alert.present();
  }

  
async save(){



}



}
