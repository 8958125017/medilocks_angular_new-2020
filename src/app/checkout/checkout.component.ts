import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ApiIntegrationService } from '../api-integration.service';
import { CartService } from '../shared/services/cart.service';
import { CustomValidators } from '../validators';
import { Location } from '@angular/common';
import { ConstantModule } from '../constants';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  addBuySubscription: FormGroup;

  @BlockUI() blockUI: NgBlockUI;

  docId;

  pendingRequest;
  clearSetTimeout;
  response;

  doctorDeatils;

  intialMonth: number;
  intialPrice: number;
  changePrice: number;
  getPlanDetail: any;
  subPlanName: any;
  subId: any;
  subscriptionSubmitted: boolean = false;
  validity: any;
  getCartItemLocal: any;
  getChangeMonth: any;
  validityType: any;
  getGST: number;

  docDetailSetVal;

  constructor(private data: ApiIntegrationService, private _cartService: CartService, private fb: FormBuilder, private toastr: ToastrService,
              private router:Router, private location: Location, private constants: ConstantModule) {
    

    this.docId = sessionStorage.getItem('docId');

    this._cartService.cartMonth.subscribe(res => {
      this.intialMonth = res;
      // console.log(this.intialMonth);
    })

    this._cartService.cartPrice.subscribe(res => {
      this.changePrice = res;
      // console.log(this.changePrice);
    })

    //this.getPlanDetail = this.location.getState();
    // console.log(this.getPlanDetail);

    this.getCartItemLocal = JSON.parse(localStorage.getItem('planDetail'));
    this.getChangeMonth = JSON.parse(localStorage.getItem('changeMonth'));
    this.getGST = JSON.parse(localStorage.getItem('gst'));
    // console.log(this.getCartItemLocal);
    // console.log(this.getChangeMonth);

    this.intialPrice = this.getCartItemLocal.amount;
    if (this.getChangeMonth) {
      this.changePrice = (this.getCartItemLocal.amount * this.getChangeMonth);
      this.intialMonth = this.getChangeMonth;
      this.validity = (this.getCartItemLocal.validity * this.getChangeMonth);
    }
    else {
      this.changePrice = (this.getCartItemLocal.amount * this.intialMonth);
      this.validity = (this.getCartItemLocal.validity * this.intialMonth);
    }

    this.subPlanName = this.getCartItemLocal.subName;
    this.subId = this.getCartItemLocal.subId;
    this.validityType = 'Free';
    if (this.getCartItemLocal.validityType == 'M')
      this.validityType = 'Month';
    else if (this.getCartItemLocal.validityType == 'Y')
      this.validityType = 'Year';

    this.getDoctorDetails();
  }

  ngOnInit(): void {
    this.setAddBuySubscription();
    this.setFormControl();
  }

  setAddBuySubscription() {
    this.addBuySubscription = this.fb.group({
      id: [0],
      name: this.fb.group({
        firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.pattern('^[a-zA-Z. ]+$'), CustomValidators.removeSpaces])],
        lastName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(35), Validators.pattern('^[a-zA-Z. ]+$'), CustomValidators.removeSpaces])]
      }),
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.]{3,}@[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,6}$'), CustomValidators.removeSpaces])],
      country: ['', Validators.compose([Validators.required, CustomValidators.removeSpaces])],
      pincode: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{6}$')])],
      mobNumber: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]{10}$')])],
      city: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100), CustomValidators.removeSpaces])],
      state: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100), CustomValidators.removeSpaces])],
      address: ['', Validators.compose([Validators.required, CustomValidators.removeSpaces])]
    })
  }

  // For Doctor Detail
  getDoctorDetails() {
    let postData = { "docId": this.docId }
    this.blockUI.start();
    this.pendingRequest = this.data.getDocById(postData).subscribe((data) => {
      //console.log(data);
      clearTimeout(this.clearSetTimeout);
      this.blockUI.stop();
      this.response = data;
      if (this.response.statusCode == 200) {
        this.doctorDeatils = this.response.data;
        //console.log(this.doctorDeatils);
      } else {
        this.toastr.error(this.response.message);
      }
    }, error => {
      this.toastr.error('Not able to connect host, please try again');
    })
    this.clearSetTimeout = setTimeout(() => {
      this.pendingRequest.unsubscribe();
    }, 60000);
  }

  setFormControl() {    
    let postData = { "docId": this.docId }
    this.data.getDocById(postData).subscribe(res => {
      this.docDetailSetVal = res['data'];
      //console.log(res['data'].name.firstName);
      this.addBuySubscription.get('name').get('firstName').patchValue(this.docDetailSetVal.name.firstName);
      this.addBuySubscription.get('name').get('lastName').patchValue(this.docDetailSetVal.name.lastName);
      this.addBuySubscription.get('email').patchValue(this.docDetailSetVal.email);
      this.addBuySubscription.get('mobNumber').patchValue(this.docDetailSetVal.mobNumber);
      this.addBuySubscription.get('city').patchValue(this.docDetailSetVal.city);
      this.addBuySubscription.get('state').patchValue(this.docDetailSetVal.state);
      this.addBuySubscription.get('address').patchValue(this.docDetailSetVal.address);
      this.addBuySubscription.get('country').patchValue('India');
      this.addBuySubscription.get('pincode').patchValue(this.docDetailSetVal.pincode);
    });
  }

  // onBuySubscription() {
  //   console.log(this.addBuySubscription);
  // }

  get drCart() {
    return this.addBuySubscription.controls;
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
  }

  increaseSub() {
    debugger
    if (this.intialMonth > 11) {
      this.toastr.info('Please Select Yearly Plan');
      return false;
    }
    this.intialMonth = this.intialMonth + 1;
    this.changePrice = this.intialPrice * this.intialMonth;
    this._cartService.cartMonth.next(this.intialMonth);
    this._cartService.cartPrice.next(this.changePrice);
  }

  onBuySubscription() {
    this.subscriptionSubmitted = true;

    if (this.addBuySubscription.invalid) {
      this.toastr.error('Fill All Detail');
      return false;
    }

    //console.log(this.addBuySubscription.value());
    this.subscriptionSubmitted = true;
    let firstName = this.addBuySubscription.get('name').get('firstName').value;
    let lastName = this.addBuySubscription.get('name').get('lastName').value;
    let email = this.addBuySubscription.get('email').value;
    let mobNumber = this.addBuySubscription.get('mobNumber').value;

    let postData = {
      "amount": this.changePrice + (this.changePrice * this.getGST) / 100,
      "productinfo": this.subPlanName,
      "firstname": firstName,
      "lastname": lastName,
      "email": email,
      "phone": mobNumber,
      "subId": this.subId,
      "planMonth": this.intialMonth,
      "gst": this.getGST,
      "planAmtWithoutGst": this.changePrice,
    };
    this.blockUI.start();
    this.pendingRequest = this.data.checkOutPayUMoney(postData).subscribe((data) => {
      if (data['statusCode'] == 200) {
        let routeURL = data['paymentUrl'];
        this.router.navigate(['/']).then(result => { window.location.href = routeURL; });
        this.blockUI.stop();
        this.subscriptionSubmitted = false;
      } else {
        //this.toastr.error(data['message']);
        console.log("error");
      }
    }, error => {
      // this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })

    setTimeout(() => {
      this.pendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 10000);
    //}
  }




}
