import { Component, OnInit } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators } from '../validators';
import { MessageService } from '../messageservice.service';
@Component({
   selector: 'app-user-profile',
   templateUrl: './user-profile.component.html',
   styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
   // @BlockUI() blockUI: NgBlockUI; 
   docId: any;
   clearSetTimeout: any;
   pendingRequest: any;
   dataLength: boolean = true;
   doctorDeatils: any = {};
   public doctSpecialization: any = [];
   public doctDegree: any = [];
   public doctWorkExperience: any = [];
   public docAchivment: any = [];
   response: any;
   docName: any = "NA";
   constructor(
      private data: ApiIntegrationService,
      private toastr: ToastrService,
      private router: Router,
      public constants: GlobalConstant,
      private message: MessageService
   ) {
      this.docId = sessionStorage.getItem('docId');
   }

   ngOnInit() {
      this.getDoctorDetails();
      this.getSchedule();
   }
   latLang: any;
   getDoctorDetails() {
      let postData = {
         "docId": this.docId
      }
      // this.blockUI.start();              
      this.pendingRequest = this.data.getDocById(postData).subscribe((data) => {
         clearTimeout(this.clearSetTimeout);
         // this.blockUI.stop();              
         this.response = data;
         if (this.response.statusCode == 200) {
            this.doctorDeatils = this.response.data;
            console.log(this.doctorDeatils);
            if (this.doctorDeatils.openTime.toString().length < 4) {
               this.doctorDeatils.openTime = '0' + "" + this.doctorDeatils.openTime.toString();
            } else {
               this.doctorDeatils.openTime = this.doctorDeatils.openTime.toString();
            }
            if (this.doctorDeatils.closeTime.toString().length < 4) {
               this.doctorDeatils.closeTime = '0' + "" + this.doctorDeatils.closeTime.toString();
            } else {
               this.doctorDeatils.closeTime = this.doctorDeatils.closeTime.toString();
            }
            this.openTime = this.doctorDeatils.openTime.match(/.{1,2}/g).join(':'),
               this.closeTime = this.doctorDeatils.closeTime.match(/.{1,2}/g).join(':'),
               this.docName = this.doctorDeatils.name.firstName + " " + this.doctorDeatils.name.lastName;
            this.doctSpecialization = this.doctorDeatils.specialization;
            this.latLang = this.doctorDeatils.location.longitude + "," + this.doctorDeatils.location.latitude;
            this.doctDegree = this.doctorDeatils.degree;
            this.docAchivment = this.doctorDeatils.achievement;
            this.doctWorkExperience = this.doctorDeatils.experience;
            this.message.sendMessage(this.docName);
         } else {
            this.toastr.error(this.response.statusCode.message);
         }
      }, error => {
         // this.blockUI.stop();
         this.toastr.error('Not able to connect host, please try again');
      })
      this.clearSetTimeout = setTimeout(() => {
         this.pendingRequest.unsubscribe();
         // this.blockUI.stop();
      }, 60000);
   }

   editProfile() {
      this.router.navigate(['/myProfile'])
   }





   //****************************Get Schedual Api Intrgration Start Here******************************//

   pendingReq: any;
   clearSetTime: any;
   scheduleDetails: any
   respSchedule: any;
   sun: any = [];
   mon: any = [];
   tue: any = [];
   wed: any = [];
   thu: any = [];
   fri: any = [];
   sat: any = [];
   setSunTime1: any;
   setSunTime2: any;
   setMonTime1: any;
   setMonTime2: any;
   setTueTime1: any;
   setTueTime2: any
   setWedTime1: any;
   setWedTime2: any
   setThuTime1: any;
   setThuTime2: any
   setFriTime1: any;
   setFriTime2: any;
   setSatTime1: any;
   setSatTime2: any;
   breakTime1: any;
   breakTime2: any;

   getsplitvalue(value) {
      var result = value.toString().match(/(\d{2})(?=(\d{2})+(?!\d)|$)/g);
      return result
   }
   getsplitvalueByFourDigit(value) {
      var result = value.toString().match(/(\d{4})(?=(\d{4})+(?!\d)|$)/g);
      return result
   }
   getSchedule() {
      let postData = {

      }
      // this.blockUI.start();              
      this.pendingReq = this.data.getSchedule(postData).subscribe((data) => {
         clearTimeout(this.clearSetTime);
         // this.blockUI.stop();              
         this.respSchedule = data;
         if (this.respSchedule.statusCode == 200) {
            this.scheduleDetails = this.respSchedule.data;
            this.sun = this.getsplitvalueByFourDigit(this.scheduleDetails.sun);
            this.mon = this.getsplitvalueByFourDigit(this.scheduleDetails.mon);
            this.tue = this.getsplitvalueByFourDigit(this.scheduleDetails.tue);
            this.wed = this.getsplitvalueByFourDigit(this.scheduleDetails.wed);
            this.thu = this.getsplitvalueByFourDigit(this.scheduleDetails.thu);
            this.fri = this.getsplitvalueByFourDigit(this.scheduleDetails.fri);
            this.sat = this.getsplitvalueByFourDigit(this.scheduleDetails.sat);

            var output1 = this.getsplitvalue(this.sun[0]);
            var output2 = this.getsplitvalue(this.sun[1]);
            this.setSunTime1 = output1[0] + ":" + output1[1];
            this.setSunTime2 = output2[0] + ":" + output2[1];

            var output3 = this.getsplitvalue(this.mon[0]);
            var output4 = this.getsplitvalue(this.mon[1]);
            this.setMonTime1 = output3[0] + ":" + output3[1];
            this.setMonTime2 = output4[0] + ":" + output4[1];

            var output5 = this.getsplitvalue(this.tue[0]);
            var output6 = this.getsplitvalue(this.tue[1]);
            this.setTueTime1 = output5[0] + ":" + output5[1];
            this.setTueTime2 = output6[0] + ":" + output6[1];

            var output7 = this.getsplitvalue(this.wed[0]);
            var output8 = this.getsplitvalue(this.wed[1]);
            this.setWedTime1 = output7[0] + ":" + output7[1];
            this.setWedTime2 = output8[0] + ":" + output8[1];

            var output9 = this.getsplitvalue(this.thu[0]);
            var output10 = this.getsplitvalue(this.thu[1]);
            this.setThuTime1 = output9[0] + ":" + output9[1];
            this.setThuTime2 = output10[0] + ":" + output10[1];

            var output11 = this.getsplitvalue(this.fri[0]);
            var output12 = this.getsplitvalue(this.fri[1]);
            this.setFriTime1 = output11[0] + ":" + output11[1];
            this.setFriTime2 = output12[0] + ":" + output12[1];

            var output13 = this.getsplitvalue(this.sat[0]);
            var output14 = this.getsplitvalue(this.sat[1]);
            this.setSatTime1 = output13[0] + ":" + output13[1];
            this.setSatTime2 = output14[0] + ":" + output14[1];

            this.breakTime1 = output7[2] + ":" + output7[3];
            this.breakTime2 = output8[0] + ":" + output8[1];
            this.getDayByTime('sun');


         } else {
            //  alert("this.response.message"+this.response.message);           
            //  this.toastr.error(this.response.message);  
         }
      }, error => {
         // this.blockUI.stop();
         this.toastr.error('Not able to connect host, please try again');
      })
      this.clearSetTime = setTimeout(() => {
         this.pendingReq.unsubscribe();
         // this.blockUI.stop();
      }, 60000);
   }



   //**********************************Get Shedual api end here********************************************//
   openTime: any;
   closeTime: any;
   getDayByTime(item) {
      if (item === 'sun') {
         this.openTime = this.setSunTime1;
         this.closeTime = this.setSunTime2;
      } else if (item === 'mon') {
         this.openTime = this.setMonTime1;
         this.closeTime = this.setMonTime2;
      } else if (item === 'tue') {
         this.openTime = this.setTueTime1;
         this.closeTime = this.setTueTime2;
      } else if (item === 'wed') {
         this.openTime = this.setWedTime1;
         this.closeTime = this.setWedTime2;
      } else if (item === 'thu') {
         this.openTime = this.setThuTime1;
         this.closeTime = this.setThuTime2;
      } else if (item === 'fri') {
         this.openTime = this.setFriTime1;
         this.closeTime = this.setFriTime2;
      } else if (item === 'sat') {
         this.openTime = this.setSatTime1;
         this.closeTime = this.setSatTime2;
      }
   }
}
