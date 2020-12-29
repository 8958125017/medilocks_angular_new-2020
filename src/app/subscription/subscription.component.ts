import { Component, OnInit } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators } from '../validators';
import { ChartDataSets, ChartOptions, Chart } from 'chart.js';
declare var $;
import * as _ from 'underscore';
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  monthlyPlan: boolean = false;
  annualyPlan: boolean = false;
  highlightedPricingPlan: boolean = false;
  free: boolean = false;
  standardPlan: boolean = false;
  premiumPlan: boolean = false;
  proPlan: boolean = false;
  docId: any;
  oPlanRes: any;

  monthPlan: any;
  yearPlan: any;

  constructor(
    private data: ApiIntegrationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.docId = sessionStorage.getItem('docId');
    this.getSubscriptionWithFeature();
  }

  ngOnInit(): void {
    this.selectMonthlyPlan();
    this.getPlanByUserId();
  }


  planDisplayTimeout: any;
  planDispalyRequest: any;

  getPlanByUserId() {

    const model = {userId: this.docId}
    this.blockUI.start();

    this.planDispalyRequest = this.data.getPlanByUserId(model).subscribe(res => {
      console.log(res);
      clearTimeout(this.planDisplayTimeout);
      this.blockUI.stop();
      this.oPlanRes = res['data'][0];
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })

    this.planDisplayTimeout = setTimeout(() => {
      this.planDispalyRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);

  }

  monthlyPlanRequest: any;
  monthlyPlanTimeout: any;

  selectMonthlyPlan() {
    debugger
    this.monthlyPlan = true;
    this.annualyPlan = false;
    this.free = false;
    this.standardPlan = false;
    this.premiumPlan = false;
    this.proPlan = false;

    let model = { validityType: "M" }
    this.blockUI.start();

    this.monthlyPlanRequest = this.data.getSubscriptionPlan(model).subscribe(res => {
      console.log(res);
      clearTimeout(this.monthlyPlanTimeout);
      this.blockUI.stop();
      this.monthPlan = res['data'];
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })

    this.monthlyPlanTimeout = setTimeout(() => {
      this.monthlyPlanRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);

  }

  yearlyPlanRequest: any;
  yearlyPlanTimeout: any;

  selectAnnualyPlan() {
    this.monthlyPlan = false;
    this.annualyPlan = true;
    this.free = false;
    this.standardPlan = false;
    this.premiumPlan = false;
    this.proPlan = false;

    let model = { validityType: "Y" }
    this.blockUI.start();

    this.yearlyPlanRequest = this.data.getSubscriptionPlan(model).subscribe(res => {
      console.log(res);
      clearTimeout(this.yearlyPlanTimeout);
      this.blockUI.stop();
      this.yearPlan = res['data'];
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })

    this.yearlyPlanTimeout = setTimeout(() => {
      this.yearlyPlanRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);

  }

  highLight(value) {

    if (value == 'free') {
      this.free = true;
      this.standardPlan = false;
      this.premiumPlan = false;
      this.proPlan = false;
    }

    else if (value == 'standardPlan') {
      this.standardPlan = true;
      this.free = false;
      this.premiumPlan = false;
      this.proPlan = false;
    }

    else if (value == 'premiumPlan') {
      this.standardPlan = false;
      this.free = false;
      this.premiumPlan = true;
      this.proPlan = false;
    }

    else if (value == 'proPlan') {
      this.standardPlan = false;
      this.free = false;
      this.premiumPlan = false;
      this.proPlan = true;
    }

  }

  getsubResp: any;
  subscriptionPendingRequest: any;
  getSubSetTimeout: any;
  subscriptionDeatils: any;
  getSubscriptionWithFeature() {
    let postData = {
      "subName": "Standard"
    }
    //debugger
    this.blockUI.start();
    this.subscriptionPendingRequest = this.data.getSubscriptionWithFeature(postData).subscribe((data) => {
      clearTimeout(this.getSubSetTimeout);
      this.blockUI.stop();
      //debugger
      this.getsubResp = data;
      if (this.getsubResp.statusCode === "200") {
        //debugger
        this.subscriptionDeatils = this.getsubResp.data;
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.getSubSetTimeout = setTimeout(() => {
      this.subscriptionPendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);

  }

  gotToInvoice(userId){
    this.router.navigate(['invoice', userId]);
  }

}
