import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor( public location: Location, private router: Router) {}

  ngOnInit() {
      // const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

      // if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
      //     // if we are on windows OS we activate the perfectScrollbar function

      //     document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
      // } else {
      //     document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
      // }
      
      // this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
          
      // });
      // if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
          
      // }
  }
  ngAfterViewInit() {
     // this.runOnRouteChange();
  }
  // isMaps(path){
  //     var titlee = this.location.prepareExternalUrl(this.location.path());
  //     titlee = titlee.slice( 1 );
  //     if(path == titlee){
  //         return false;
  //     }
  //     else {
  //         return true;
  //     }
  // }
  // runOnRouteChange(): void {
  //   if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
     
  //   }
  // }
  // isMac(): boolean {
  //     let bool = false;
  //     if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
  //         bool = true;
  //     }
  //     return bool;
  // }

}
