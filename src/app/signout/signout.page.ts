import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
//added these two items below,
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.page.html',
  styleUrls: ['./signout.page.scss'],
})
export class SignoutPage implements OnInit {
  //we need these auth and router to navigate pages.
  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit() {
  }

  signOut(){
    this.authService.signOut()
    .then(() => {this.router.navigate(['/signup'])})
    .catch();
  }

}
