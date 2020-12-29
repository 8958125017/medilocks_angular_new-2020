import { Component, OnInit, ElementRef } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { Location, LocationStrategy, PathLocationStrategy, formatDate } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService } from '../messageservice.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  searchkey: any;
  subscription: Subscription;
  constructor(private element: ElementRef,
    private location: Location,
    private data: ApiIntegrationService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private messageService: MessageService,

  ) {
    this.subscription = this.messageService.getSearchPatient().subscribe(message => {
      if (message.text != "undefined") {
        this.searchkey = message.text;
        this.patientSearch(this.searchkey)
      }
    });
  }


  ngOnInit(): void {
    this.searchkey = this.actRoute.snapshot.paramMap.get('patientName');
    this.patientSearch(this.searchkey)
  }

  pendReq: any;
  clearTime: any;
  resp: any;
  searchResult: any = [];
  visitHisVar;

  patientSearch(searchkey) {
    let postData = {
      "search": searchkey
    }
    this.blockUI.start();
    this.pendReq = this.data.searchPatient(postData).subscribe((res) => {
      console.log(res);
      clearTimeout(this.clearTime);
      this.blockUI.stop();
      this.resp = res;
      if (this.resp.statusCode == 200) {
        this.searchResult = this.resp.data;
        //console.log(this.searchResult);
        this.visitHisVar = this.resp.data[0].visitHistory[0];
        //console.log(this.visitHisVar);
      } else {
        this.toastr.error(this.resp.message);
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })
    this.clearTime = setTimeout(() => {
      this.blockUI.stop();
      this.pendReq.unsubscribe();
    }, 60000);
  }
}
