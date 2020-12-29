import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../messageservice.service';
import { Subscription } from 'rxjs/Subscription';
declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  style?: string;
}
export const ROUTES: RouteInfo[] = [

  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  ttype: any;
  subscription:any;
  tooltip:boolean = false;
  constructor( private message : MessageService){
                     
   }

  ngOnInit() {    
     this.menuItems = ROUTES.filter(menuItem => menuItem);
     

  }


   ngOnDestroy() {
       
    }
}
