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
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
   @BlockUI() blockUI: NgBlockUI;
   docId:any;
  constructor(private data : ApiIntegrationService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private message : MessageService,
              private fb: FormBuilder) { 
             this.docId = sessionStorage.getItem('docId');
                }

  ngOnInit() {
    this.getPromotionCountSms();
    this.getPromotionCountWhatsUp();
  	this.getpromotion();
  }

pendRequest:any;
clearsetinterval:any;
promoResp:any;
promoDetails:any=[];
page:any =1
proLength:any;
 getpromotion(){
              let postData={
				       "page": this.page,
			         "limit": 10
				  }
              this.blockUI.start();              
              this.pendRequest = this.data.getAllPromo(postData).subscribe((res) => {
              clearTimeout(this.clearsetinterval);        
              this.blockUI.stop();
              this.promoResp=res;
              debugger
              if (this.promoResp.statusCode == 200) {   
                    this.promoDetails=[];  
                    debugger                 
                     this.promoDetails=this.promoResp.data; 
                     if(this.promoDetails.length>10){
                        this.proLength=true;
                       }else{
                        this.proLength=false;
                       }                    
              } else{                       
                     this.toastr.error(this.promoResp.message);  
              }
              },error => {
                    this.blockUI.stop();
                    this.toastr.error('Not able to connect host, please try again');  
              })
              this.clearsetinterval = setTimeout(() => {
                   this.pendRequest.unsubscribe();
                   this.blockUI.stop();
              }, 60000);
   }

   pendinggetPromoRequest:any
   cleargetPromoSetinterval:any;
   promotionResp:any;
   promotionDetails:any={};
   issmsChecked:boolean=false;
   iswhatsupChecked:boolean=false;
   scheduleAt:any;  
   showPromo(item){    
                let postData={
                   "promoId": item.promoId               
               }
              debugger
              clearTimeout(this.cleargetPromoSetinterval);  
              this.blockUI.start();              
              this.pendRequest = this.data.getPromo(postData).subscribe((res) => {
              clearTimeout(this.cleargetPromoSetinterval);  
              debugger      
              this.blockUI.stop();
              this.promotionResp=res;              
              if (this.promotionResp.statusCode == 200) {                                                         
                    this.promotionDetails=this.promotionResp.data;
                   if(this.promotionDetails.promoMode=="SMS"){
                      this.issmsChecked=true;
                      this.iswhatsupChecked=false;
                    }else{
                       this.iswhatsupChecked=true;
                        this.issmsChecked=false;
                    }
                    $('#bloodDonationCamp').modal('toggle');                 
              } else{                       
                     this.toastr.error(this.promotionResp.message);  
              }
              },error => {
                    this.blockUI.stop();
                    this.toastr.error('Not able to connect host, please try again');  
              })
              this.cleargetPromoSetinterval = setTimeout(() => {
                   this.pendRequest.unsubscribe();
                   this.blockUI.stop();
              }, 60000);
}

showMore(){
  this.page=this.page+1;
  console.log("this.page = ="+this.page);
}
showLess(){
  if(this.page!=0){
      this.page=this.page-1;
      console.log("this.page = ="+this.page);
  }
 // this.getpromotion();
}




promoDetils:any;
pendingReq:any
clearSetTimes:any;
whatsUpPromoDetils:any={};
getPromotionCountWhatsUp(){
              let postData={
                        "promoMode": "whatsapp"
                    }
                    debugger
              this.blockUI.start();              
              this.pendingReq = this.data.getPromotionCount(postData).subscribe((data) => {
              clearTimeout(this.clearSetTimes);        
              this.blockUI.stop();
              debugger
              if (data['statusCode'] == 200) {  
                    debugger
                     this.whatsUpPromoDetils=data['data'];
                     
              } else{                       
                   //  this.toastr.error(data['message']);  
              }
              },error => {
                    this.blockUI.stop();
                    this.toastr.error('Not able to connect host, please try again');  
              })
              this.clearSetTimes = setTimeout(() => {
                   this.pendingReq.unsubscribe();
                   this.blockUI.stop();
              }, 60000);
  }

smsPromoDetil:any={};
pendingRequ:any
clearSetTime:any;
getPromotionCountSms(){
              let postData={
                        "promoMode": "sms"
                    }
                    debugger
              this.blockUI.start();              
              this.pendingReq = this.data.getPromotionCount(postData).subscribe((data) => {
              clearTimeout(this.clearSetTimes);        
              this.blockUI.stop();
              debugger
              if (data['statusCode'] == 200) {  
                    debugger
                     this.smsPromoDetil=data['data'];
                     
              } else{                       
                   //  this.toastr.error(data['message']);  
              }
              },error => {
                    this.blockUI.stop();
                    this.toastr.error('Not able to connect host, please try again');  
              })
              this.clearSetTimes = setTimeout(() => {
                   this.pendingReq.unsubscribe();
                   this.blockUI.stop();
              }, 60000);
  }

}
