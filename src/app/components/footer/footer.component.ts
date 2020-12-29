import { Component, OnInit } from '@angular/core';
import { GlobalConstant } from '../../globalconstant';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test : Date = new Date();
   companyName:any="Blockcube";
  constructor( public  constants:GlobalConstant,) { 
  }

  ngOnInit() {
  }

}
