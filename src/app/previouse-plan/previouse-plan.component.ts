import { Component, OnInit } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-previouse-plan',
  templateUrl: './previouse-plan.component.html',
  styleUrls: ['./previouse-plan.component.css']
})
export class PreviousePlanComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  oPlanRes: any;
  docId: any;

  constructor(private data: ApiIntegrationService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private fb: FormBuilder)
  {
    this.docId = sessionStorage.getItem('docId');
  }

  ngOnInit(): void {
    this.getPlanByUserId();
  }


  planDisplayTimeout: any;
  planDispalyRequest: any;

  getPlanByUserId() {

    let model = {}
    this.blockUI.start();

    this.planDispalyRequest = this.data.getPlanByUserId(model).subscribe(res => {
      //console.log(res);
      clearTimeout(this.planDisplayTimeout);
      this.blockUI.stop();
      this.oPlanRes = res['data'].slice(1);
      console.log(this.oPlanRes);
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })

    this.planDisplayTimeout = setTimeout(() => {
      this.planDispalyRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);

  }

  gotToInvoice(userId){
    //console.log(userId)
    this.router.navigate(['invoice', userId]);
  }

}
