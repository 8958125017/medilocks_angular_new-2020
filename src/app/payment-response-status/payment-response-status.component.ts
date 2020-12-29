import { Component, OnInit } from '@angular/core';
import {ApiIntegrationService} from '../api-integration.service';
import {CartService} from '../shared/services/cart.service';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ConstantModule} from '../constants';

@Component({
  selector: 'app-payment-response-status',
  templateUrl: './payment-response-status.component.html',
  styleUrls: ['./payment-response-status.component.css']
})
export class PaymentResponseStatusComponent implements OnInit {

    resPaymtStatus: any;
    tid: any;
    constructor(private data: ApiIntegrationService, private _cartService: CartService, private fb: FormBuilder, private toastr: ToastrService,
                private _activatedReoute: ActivatedRoute, private  router: Router, private constants: ConstantModule) {

        this.tid = this._activatedReoute.snapshot.queryParams.tid;
        console.log(this.tid);
        this.getPaymentDetailStatus(this.tid);

        // this._activatedReoute.queryParams.subscribe(params => {
        //     this.tid = params.tid;
        //     console.log(this.tid);
        //     this.getPaymentDetailStatus(this.tid);
        // });
    }

  ngOnInit(): void {

  }

    // tslint:disable-next-line:typedef
    getPaymentDetailStatus(oRes){
        const oSendReq = {tid: oRes};
        this.data.getPaymentDetailStatus(oSendReq).subscribe(res => {
            this.resPaymtStatus = res['data'];
            console.log(this.resPaymtStatus);
        });
    }
}
