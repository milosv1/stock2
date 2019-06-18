import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
//we need this for injection..
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private afAuth:AngularFireAuth) { 
    this.afAuth.authState.subscribe((user) => {
      if( user ){
        this.auth.next(user);
      }else{
        this.auth.next(null);
      }
    });
  }
  
        
  signUp(email:string, password:string){
      return new Promise((resolve, reject)=>{
        this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((response) => { resolve(response) })
        .catch((error)=> {reject(error) })
      });
  }
  signOut(){
    return new Promise((resolve,reject)=>{
      this.afAuth.auth.signOut()
      .then(() => {resolve(true)})
      .catch((error) => {reject(error)});
      resolve(true);
    })
  }
  signIn(email:string, password:string){
    return new Promise((resolve,reject)=>{
      this.afAuth.auth.signInWithEmailAndPassword(email,password).then((response) => {resolve(response)}).catch((error) =>{reject(error)});
    })
  }
//get user
  getUser(){
    return this.afAuth.auth.currentUser;
  }

}
