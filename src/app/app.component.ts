import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
//import firebase modules etc
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { MainService } from './main.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public user:User;
  stock: object;
  errors: string[];

  stocks:{
    name:string,
    currentPrice:number,
    priceCompare: string,
    priceYesterday: number
  }[];
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'History',
      url:  '/history',
      icon: 'clipboard'
    },
    {
      title: 'signin',
      url: '/signin',
      icon: 'log-in'
    },
    {
      title: 'signup',
      url: '/signup',
      icon: 'person-add'
    },
    {
      title: 'signout',
      url: '/signout',
      icon: 'exit'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth:AngularFireAuth,
    private router:Router
  ) {
    this.initializeApp();
    this.checkAuthStatus();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkAuthStatus(){
        //subscribe  == observable... 
        this.afAuth.authState.subscribe((user)=>{
          if(user){
            this.user = user;
            //update navigation for logged inuser
            this.appPages = [
              {
              title: 'Home',
              url: '/home',
              icon: 'home'
              },
             // {
               // title:'stock-add',
                //url: '/stock-add',
                //icon:'list'
              //},
             //{
           // title: 'List',
           // url: '/list',
           // icon: 'list'
            //},
           // {
              //title: 'History',
              //url: '/history',
              //icon:'clipboard'
           // },
        {
          title:'Signout',
          url:'/signout',
          icon:'exit'
        }
         ];
    
          }else{
            this.user = null;
            this.router.navigate(['/signup']);
            //else null? or logged out user, update nav for logged out user
            this.appPages = [
              {
                //added signup last lession
                title:'Signup',
                url:'/signup',
                icon:'person-add'
              },
              {
                //added signup last lession
                title:'Signin',
                url:'/signin',
                icon:'log-in'
              }
    
            ];
          }
        });


  }

 
}
