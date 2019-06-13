import { Component } from '@angular/core';
import {MainService} from '../main.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms'; 
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
//import { StockAddPage } from '../stock-add/stock-add.page';
import { ModalController } from '@ionic/angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Stocks } from '../models/stocks.interface';
import { Observable } from 'rxjs';

//AngularFireCollection -- AngularFireStore

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  stock: object;
  formGroup: FormGroup;
  errors: string[];
 //below to add into list items in homepage.html
  private stockCollection: AngularFirestoreCollection<Stocks>;
  stocksToView: Observable<Stocks[]>;

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
    public modalController: ModalController,
    private afs: AngularFirestore
  
  ) {

    this.stock = { symbol: ''};
    
    //just added these two lines below.
   this.authService.auth.subscribe((user) => {
      if( user ){
        console.log('im logged in');
        let uid = user.uid;
        this.stockCollection = afs.collection<Stocks>(`users/${uid}/stocks`);
        this.stocksToView = this.stockCollection.valueChanges();
      }
   });
    

  }

    //get collections from firebase (this.stocks = ...)
  

 addStock(stock: Stocks){

  this.stockCollection.add(stock);
 }

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

  public async StockAddPage(){
       const modal = await this.modalController.create({
         component: this.StockAddPage
        // re-add StockAddPage
       });
       return await modal.present();
  }

  async dissmissPage(){
    this.modalController.dismiss();
    const modal = await this.modalController.getTop();
    this.modalController.dismiss();
  }

}
