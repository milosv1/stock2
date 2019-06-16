import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable,BehaviorSubject } from 'rxjs';
import { Stocks } from '../app/models/stocks.interface';
import jsonData from '../assets/nasdaq-listen_json.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  SymbolsData:Array<any> = jsonData;
  symbols$:BehaviorSubject<symbol[]> = new BehaviorSubject(null);
  SymbolsCollection: AngularFirestoreCollection<any>;
  stocksCollection: AngularFirestoreCollection<Stocks>;
  userStocks:Observable<Stocks[]>;
  

  constructor(
    private afs: AngularFirestore
  ) 
  { 
  this.getSymbols();
  }
  getSymbols(){

    this.symbols$.next( this.SymbolsData );

  }
  getStocks(uid):Observable<Stocks[]>{
    let path = `users/${uid}/stocks`;
    this.stocksCollection = this.afs.collection<Stocks>(path);
    this.userStocks = this.stocksCollection.valueChanges();
    return this.userStocks;
  }
  addStock(stock: Stocks){
    this.stocksCollection.add(stock);
  }
 
}
