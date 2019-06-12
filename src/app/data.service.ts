import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  

  constructor(private afsc: AngularFirestoreCollection,
              private afirestore: AngularFirestore) { 
  
  }
 
  getUsersStock(userID: AngularFirestoreCollection){
    return this.afirestore.collection('stocks',ref => ref.where('uid', '==', userID));
  }

 
}
