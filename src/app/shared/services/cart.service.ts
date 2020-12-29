import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartMonth = new BehaviorSubject(1);
  cartPrice = new BehaviorSubject(null);
  cartDetialVar = new BehaviorSubject(null);

}
