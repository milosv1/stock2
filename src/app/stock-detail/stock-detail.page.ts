import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { PriceData } from '../models/pricedata.interface';
import { Stocks } from '../models/stocks.interface';
import { Alert } from 'selenium-webdriver';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.page.html',
  styleUrls: ['./stock-detail.page.scss'],
})
export class StockDetailPage implements OnInit {
stock:Stocks;
priceData$:Observable<PriceData[]>;

@ViewChild('chart') chartCanvas;
chart:any;

  constructor(
    private modalController:ModalController,
    private dataService:DataService,
    private authService:AuthService,
    private alertController:AlertController
  ) { }

  ngOnInit() {
    this.dataService.getPriceData(this.stock)
    .then( (response:Observable<PriceData[]>) => {
      this.priceData$ = response;
      this.priceData$.subscribe( (values) => {
        let chartLabels:Array<any> = [];
        //i got four arrays, which should be holding the price values
        let chartData:Array<number> = [];
        let chartDataTwo:Array<number> = [];
        let chartDataThree:Array<number> = [];
        let chartDataFour:Array<number> = [];

        values.forEach( (value, index ) => {
          let date = value.time;
          chartLabels.push( index );
          //add extra lines to our line graph
          //these lines depict high-close-open-low prices\
          chartData.push(value.open);
          chartDataTwo.push(value.close);
          chartDataThree.push(value.high);
          chartDataFour.push(value.low);
        });
        this.chart = new Chart(this.chartCanvas.nativeElement,{

          type: 'line',
          data: {
            labels: chartLabels,
            datasets: [
                {
                  label: `${this.stock.symbol} open`,
                  data: chartData,
                  fill: "false",
                  borderColor: 'hsla(350, 100%, 50%, 1)',
                  borderWidth: 1
                },
                {
                  label: `${this.stock.symbol} close`,
                  data: chartDataTwo,
                  fill: "false",
                  borderColor: 'hsla(120, 100%, 50%, 1)',
                  borderWidth: 1
                },
                {
                  label: `${this.stock.symbol} high`,
                  data: chartDataThree,
                  fill: "false",
                  borderColor: 'hsla(290, 100%, 50%, 1)',
                  borderWidth: 1
                },
                {
                  label: `${this.stock.symbol} low`,
                  data: chartDataFour,
                  fill: "false",
                  borderColor: 'hsla(190, 100%, 50%, 1)',
                  borderWidth: 1
                }
            ]
          },
          
        });
      });
    });
    

    
  }
  //close this particular screen
  close(){
    this.modalController.dismiss();
  }
  //update 
  updateStock(){
    this.dataService.updateStockPriceData( this.stock ); 
  }
//pressing this button will delete this stock from the list
  async deleteStock(){
    const  alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'This action will delete this stock',
      message: `You will not be able to track ${this.stock.symbol} after this`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancelled');
          }
        },
        {
          text: 'OK',
          role: 'ok',
          handler: () => {
            this.dataService.deleteStock( this.stock).then( () => { this.modalController.dismiss() }); 
          }
        }
      ]
    });
    await alert.present();
  }

}
