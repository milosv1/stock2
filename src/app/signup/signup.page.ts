import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
signUpForm: FormGroup;

  constructor(private authService:AuthService, private formBuilder:FormBuilder, private router:Router) { }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]], 
      password: ['',[Validators.required,Validators.minLength(6)]]
  });
}
signUp(formData){
  this.authService.signUp(formData.email,formData.password)
  .then((response)=>{
    //successful
    //log the response sent to the server
    console.log(response);
    //if indeed it is successful, send user to home.
    this.router.navigate(['/home']);
  })
  .catch((error)=>{
    console.log(error);
  })
}

}