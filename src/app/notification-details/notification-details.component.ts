import { Component, OnInit,HostListener} from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router , RouterModule ,ActivatedRoute, Routes} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators } from '../validators';
declare var $;
import * as moment from 'moment';
import { MessageService } from '../messageservice.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.css']
})
export class NotificationDetailsComponent implements OnInit {
   @BlockUI() blockUI: NgBlockUI; 
   docId:any;
   constructor(private data : ApiIntegrationService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private message : MessageService,
              private fb: FormBuilder  ) { 
                   this.docId = sessionStorage.getItem('docId');                                 
                   }

  ngOnInit(): void {
  	this.getallnotifications();
  }

    notificatonResp:any;
    notificationList:any=[];;
    pendingNotifyRequest:any;
    clearNotifySetTimeout:any;
    getallnotifications(){
      let postData={
              
              }
              this.blockUI.start();              
              this.pendingNotifyRequest = this.data.getallnotifications(postData).subscribe((data) => {
              clearTimeout(this.clearNotifySetTimeout);        
              this.blockUI.stop();    
              debugger         
              this.notificatonResp=data;
              if (this.notificatonResp.statusCode === "200") { 
                         this.notificationList=[]; 
                         this.notificationList=this.notificatonResp.data;  
              } else{                       
                     this.toastr.error(data['message']);  
                    }
              },error => {
                    this.blockUI.stop();
                    this.toastr.error('Not able to connect host, please try again');  
                    // this.showErrorToaster('Not able to connect host, please try again');
              })
              this.clearNotifySetTimeout = setTimeout(() => {
                   this.pendingNotifyRequest.unsubscribe();
                   this.blockUI.stop();
              }, 60000);
    }

}
