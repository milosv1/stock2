import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';
import { HttpClientModule } from '@angular/common/http';
import { AlertController, ModalController } from '@ionic/angular';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//we need this to add stuff into the collections.
//import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { Symbol } from '../models/symbol.interface';


@Component({
  selector: 'app-stock-add',
  templateUrl: './stock-add.page.html',
  styleUrls: ['./stock-add.page.scss'],
})
export class StockAddPage implements OnInit {
  loading:boolean = false;
  symbols:Array<any>;
  suggestSymbols:Array<any> = [];
  symbolForm: FormGroup;
  currentStock:any = null;
  error:string;
  

  constructor(
    private modalController: ModalController,
    public httpClientModule: HttpClientModule,
    private formBuilder: FormBuilder,
    private dataService:DataService
   
  ) { }

  ngOnInit() {
    this.symbolForm = this.formBuilder.group({
      symbolSearch: [ '', [Validators.required] ]
    });
    this.symbolForm.valueChanges.subscribe((search) => {
      if( search.symbolSearch ){
        this.findSymbols( search.symbolSearch );
      }
      else{
        //reset everything
        this.suggestSymbols = [];
        this.error = '';
        this.currentStock = '';
      }
    });
    this.getSymbols();
  }

  getSymbols(){
    this.dataService.symbols$.subscribe((values) => {
      this.loading = false;
      this.symbols = values;
    });
  }
  findSymbols( searchTerm:string ){
    this.suggestSymbols = this.symbols.filter((item) => {
      if( item.Symbol.toLowerCase().indexOf( searchTerm.toLowerCase() ) !== -1 ){
        return item;
      }
    });
  }
  getStockPrice( symbol:string ){
    this.loading = true;
    this.dataService.getStockBySymbol( symbol )
    .then(
      ( response ) => {
        this.loading = false;
        this.currentStock = response;
        this.suggestSymbols = [];
        console.log( response );
      }
    )
    .catch( (error) => {
      this.loading = false;
      this.suggestSymbols = [];
      //display error
      this.error = "stock not found";
    });
  }

  close(){
    this.modalController.dismiss();
  }
  save(){
    this.modalController.dismiss( this.currentStock );
  }
}
