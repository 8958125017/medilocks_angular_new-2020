import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiIntegrationService } from '../api-integration.service';
import { CartService } from '../shared/services/cart.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-by-subscription',
  templateUrl: './by-subscription.component.html',
  styleUrls: ['./by-subscription.component.css']
})
export class BySubscriptionComponent implements OnInit {

  intialMonth: number;
  intialPrice: number;
  changePrice: number;
  subsId: any;
  validityName: any;
  validityNamePro: any;
  gst: number;

  planDetail;

  createPrescription: FormGroup;

  constructor(private data: ApiIntegrationService, private _cartService:CartService, private fb: FormBuilder, private toastr: ToastrService,
              private _activatedReoute:ActivatedRoute, private  router:Router) {

    this._cartService.cartMonth.subscribe(res => {
      this.intialMonth = res;
      console.log(this.intialMonth);
    })

    this._cartService.cartPrice.subscribe(res => {
      this.changePrice = res;
      console.log(this.changePrice);
    })

    this._activatedReoute.params.subscribe(params=>{
      this.subsId = params.id;
    })

  }

  ngOnInit(): void {
    //this.createSubscriptionPlan();
    this.getPlan();

  }

  getPlan(){
    
    let reqSubPlanId = {"subId": this.subsId};
    this.data.getSubscriptionPlanById(reqSubPlanId).subscribe(res=> {

      this.planDetail = res['data'][0];
      console.log(this.planDetail);
      debugger
      localStorage.setItem('planDetail', JSON.stringify(this.planDetail));
      localStorage.setItem('changeMonth', JSON.stringify(this.intialMonth));

      this.changePrice = (this.planDetail.amount * this.intialMonth);
      this.intialPrice = this.planDetail.amount;
      this.gst = res['gst'];
      localStorage.setItem('gst', JSON.stringify(this.gst));
      this._cartService.cartMonth.next(this.intialMonth);
      this._cartService.cartPrice.next(this.changePrice);

      if(this.planDetail.validityType=='M'){
        this.validityName = "Month";
        this.validityNamePro = "days";
      } else if(this.planDetail.validityType=='Y'){
        this.validityName = "Year";
        this.validityNamePro = "days";
      } else {
        this.validityName = "Free";
        this.validityNamePro = "days";
      }
      //this.validityType = this.planDetail.cst;
    })
  }

  setCreatePrescriptionForm() {
    this.createPrescription = this.fb.group({
      id: [0],
      subName: [''],
      validityType: [''],
    })
  }

  createSubscriptionPlan() {
    let post = { validityType: "M" }
    this.data.createSubscriptionPlan(this.data).subscribe(res => {
      console.log(res);
    })
  }

  // For Cart
  decreaseSub() {
    if (this.intialMonth <= 1) {
      this.toastr.info('Minimum Subscription Plan One Months');
      return false;
    }
    this.intialMonth = this.intialMonth - 1;
    this.changePrice = this.changePrice - this.intialPrice;
    this._cartService.cartMonth.next(this.intialMonth);
    this._cartService.cartPrice.next(this.changePrice);
    localStorage.setItem('changeMonth', JSON.stringify(this.intialMonth));
  }

  increaseSub() {
    if (this.intialMonth > 11) {
      this.toastr.info('Please Select Yearly Plan');
      return false;
    }
    this.intialMonth = this.intialMonth + 1;
    this.changePrice = this.intialPrice * this.intialMonth;
    this._cartService.cartMonth.next(this.intialMonth);
    this._cartService.cartPrice.next(this.changePrice);
    localStorage.setItem('changeMonth', JSON.stringify(this.intialMonth));
  }

  goToCheckout(){
    //this.router.navigate(['/checkout'], { state: this.planDetail });
    this.router.navigate(['/checkout'], {state: this.planDetail });
  }

}
