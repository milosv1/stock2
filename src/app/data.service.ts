import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Stocks } from '../app/models/stocks.interface';
import { PriceData } from '../app/models/pricedata.interface';
import { Http } from '@angular/http';
import jsonData from '../assets/nasdaq-listen_json.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentPath:string;
  symbolsData:Array<any> = jsonData;
  symbols$:BehaviorSubject<Symbol[]> = new BehaviorSubject(null);
  stocksCollection: AngularFirestoreCollection<Stocks>;
  userStocks:Observable<Stocks[]>;

  priceDataCollection: AngularFirestoreCollection<PriceData>;
  priceData:Observable<PriceData[]>;
  constructor(
    private afs: AngularFirestore,
    private http: Http
  ) 
  {
    this.getSymbols();
  }
  getSymbols(){
    this.symbols$.next( this.symbolsData );
  }

  getStocks(uid):Observable<Stocks[]>{
    this.currentPath = `users/${uid}/stocks`;
    this.stocksCollection = this.afs.collection<Stocks>(this.currentPath);
    this.userStocks = this.stocksCollection.valueChanges();
    return this.userStocks;
  }
  addStock(stock: Stocks) {
    //this is the first time the stock is added
    this.stocksCollection.add({symbol: stock.symbol});
  }
  getPriceData( stock:Stocks ){
    return new Promise((resolve,reject) => {
      //get the id of current stock
      let stocks:AngularFirestoreCollection<Stocks> = this.afs.collection( 
        this.currentPath , 
        ref => ref.where('symbol','==', stock.symbol 
      ));
      let stockData:Observable<any> = stocks.valueChanges({idField: 'id'});
      stockData.subscribe((values) => {
        let docId = values[0].id;
        let path = `${this.currentPath}/${docId}/prices`;
        this.priceDataCollection = this.afs.collection<PriceData>(path);
        this.priceData = this.priceDataCollection.valueChanges();
        resolve(this.priceData);
      });
    });
    
    
    
  }
  addPriceData( data:PriceData ){
    this.priceDataCollection.add(data);
  }
  //this function resolves the Promise with stock data or reject with an Error message
  getStockBySymbol(stockSymbol){
    return new Promise((resolve,reject) => {
      //api url
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=1min&apikey=V5JC59JK1GR6EUKJ`;
      //api call and subscribe to get value
      this.http.get(url).subscribe( (response:any) => {
        const data = JSON.parse( response._body );
        if( data["Error Message"] ){
          //reject the promise with the error message
          reject( data["Error Message"] );
        }
        else{
          //process response
          const keys:Array<string> = Object.keys(data["Time Series (1min)"]);
          //get the last in the series
          const result = data["Time Series (1min)"][ keys[ keys.length -1 ] ];
          //format the result using sensible keys
          const resultKeys:Array<string> = Object.keys( result );
          const resultValues:Array<string> = Object.values( result );
          //remove the numbers in the keys so '1. open' becomes 'open'
          const newKeys = resultKeys.map( (key) => {
            return key.substring(3);
          });
          let output:any = { symbol: stockSymbol };
          let pricedata:any = { time: new Date() };
          resultKeys.forEach( (resultKey, index ) => {
            pricedata[ newKeys[index] ] = resultValues[ index ];
          });
          output.pricedata = pricedata;
          resolve( output );
        }
      });
    });
  }
}
