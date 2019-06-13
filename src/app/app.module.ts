import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//we need these following imported items below :-)
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule, AngularFirestoreCollection } from 'angularfire2/firestore';
//after importing these items we need to ensure they're added to the appropriate places below
import { MainService } from './main.service';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { StockAddPageModule } from '../app/stock-add/stock-add.module';
//this was added recently.
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent], 
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    IonicModule.forRoot(),
    StockAddPageModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    //imported recently also..
    HttpClientModule,
    //added this because we are using firestore.
    AngularFirestoreModule
    
  ],
  providers: [
    StatusBar,
    MainService,
    SplashScreen,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
