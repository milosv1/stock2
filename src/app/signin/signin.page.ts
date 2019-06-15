import { Component, OnInit } from '@angular/core';
//adding Validators and other items needed below this point!
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
signInForm: FormGroup;

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private router: Router ) { 

    }
  

  ngOnInit() {
    this.signInForm = this.formBuilder.group({email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required]]});
  }

  signIn(formData){
    this.authService.signIn(formData.email, formData.password)
    .then((response) => {
      //signin is good!
      this.router.navigate(['/home']);
    })
    .catch((error) => {console.log(error) })


  }
}
