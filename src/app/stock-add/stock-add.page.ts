import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';
import { AlertController, ModalController } from '@ionic/angular';
import { Http } from '@angular/http';
//we need this to add stuff into the collections.
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../auth.service';

import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Symbol } from '../models/symbol.interface';
@Component({
  selector: 'app-stock-add',
  templateUrl: './stock-add.page.html',
  styleUrls: ['./stock-add.page.scss'],
})
export class StockAddPage implements OnInit {
//just added these to help bring suggestions into my search.

loading:boolean = true;
symbols:Array<any>;
suggestSymbols:Array<any> = [];
symbolForm: FormGroup;
items: string[];
currentStockPrice:Number;



  //currentStockPrice:Number;

   //stock: string;

  //symbol: object;

  errors: string[];

  stocks: {
    name: string,
     currentPrice: number, 
     priceCompare: string, 
     priceYesterday: number
}[];

 //we need to push this into the DB and 
 //ALSO dont forget the openData which is the current price.
stockSymbol: string;

//this is what is being pushed into the collection.
stockCollection: AngularFirestoreCollection<any> = this.afs.collection('stocks');



  //_http: any;
  constructor(
    private _mainService: MainService,
    private http: Http,
    public alertController: AlertController,
    public httpClientModule: HttpClientModule,
    public afs: AngularFirestore,
    public authService:AuthService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private modalController: ModalController
   
  ) { }

  ngOnInit() {
    this.symbolForm = this.formBuilder.group({
      symbolSearch: ['', [Validators.required] ]
    });
    this.symbolForm.valueChanges.subscribe((search) => {
      if(search.symbolSearch.length >0 ){
        this.findSymbols(search.symbolSearch);
      }
      else{
        this.suggestSymbols = [];
      }
    });
    this.getSymbols();

  }

  getSymbols(){
    this.dataService.symbols$.subscribe((values)=>{
      this.loading = false;
      this.symbols = values;
      console.log( this.symbols );
    });
  }

  findSymbols( searchTerm:string){
    console.log( searchTerm );
    this.suggestSymbols = this.symbols.filter((item) =>{
      if( item.Symbol.toLowerCase().indexOf( searchTerm.toLowerCase() ) !==-1 ){
        return item;
      }
    });
    console.log( this.suggestSymbols);
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
       //getting the most updated updated price here.
         console.log("last Refreshed", lastRefresh);
         
         let timeSeries = jsonParseResp["Time Series (1min)"]
         let lastRefreshData = timeSeries[lastRefresh]
         //now that we got here we can view the open price being the most current price
         let openData = lastRefreshData["1. open"]

         console.log("price: ", openData)
          this.currentStockPrice = openData;
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

  
  saveStocks(){
//in the users collection we hold the following variables.
    //  this.afs.collection('users').add({
     //in the users collection we hold the following variables.
     console.log("uid: ", this.authService.getUser());
     const stockID = this.afs.createId();
     const uid:string = this.authService.getUser().uid;

      const stock = {
        //items in which we are saving into Firebase.
        timestamp : new Date(),
        stock: this.stockSymbol,
        price: this.currentStockPrice,
        stockID: stockID,
        uid: uid
      }
      //save into the following firestore structure.
      this.afs.doc(`users/${uid}/stocks/${stockID}`).set(stock);
      const stocks = this.afs.doc(`users/${uid}/stocks/${stockID}`).get()
      //added $StockID into the query...
      console.log("Got it!", stocks);
    
}

//close stock-add page via pressing close.
closeSearchSection(){
  this.modalController.dismiss();
}

}
