import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
@Injectable({
  providedIn: 'root'
})
export class SocketioService {
socket:any;
  constructor() { 
    //this.socket = io('http://localhost:3000');
  }
}
