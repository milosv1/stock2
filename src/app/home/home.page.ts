import { Component } from '@angular/core';
import {MainService} from '../main.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms'; 
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { StockAddPage } from '../stock-add/stock-add.page';
import { ModalController } from '@ionic/angular';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Stocks } from '../models/stocks.interface';
//i just aded this stuff...below
import { AngularFirestore } from 'angularfire2/firestore'; 


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  stock: object;
  formGroup: FormGroup;
  errors: string[];
  savedStocks: any;

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
    public afs: AngularFirestore,  
  ) {
    this.stock = { symbol: ''};

    

  }


  ngOnInit() {
   //this.getStockList();
   //const stocks = this.afs.doc(`users/${uid}/stocks/`).valueChanges;

   const uid:string = this.authService.getUser().uid;

    this.afs.collection('users').doc(uid).collection('stocks').valueChanges().subscribe((data) => {
     this.savedStocks = data;
     console.log("Saved Stocks: ");
    });
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

  async StockAddPage(){
      const modal = await this.modalController.create({
        component: StockAddPage
      });
      return await modal.present();
  }

  getStockList():AngularFirestoreCollection<Stocks>{
    // console.log(this.afs.collection('stocks'))
    //const uid:string = this.authService.getUser().uid;
    
   const uid:string = this.authService.getUser().uid;

    console.log('auth Service:');
    console.log(this.authService);
    this.afs.collection('stocks' , ref => ref.where('uid', '==', uid));
    console.log('afs.collection');
    console.log(this.afs.collection);
    console.log('data', this.afs.collection('stocks' , ref => ref.where('uid', '==', uid)));
    return this.afs.collection('stocks' , ref => ref.where('uid', '==', uid));;
  }

}
