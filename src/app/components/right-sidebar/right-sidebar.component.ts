import { Component, OnInit, HostListener } from '@angular/core';
import { ApiIntegrationService } from '../../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../../globalconstant';
import { CustomValidators } from '../../validators';
declare var $;
import * as moment from 'moment';
import { MessageService } from '../../messageservice.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
      selector: 'app-right-sidebar',
      templateUrl: './right-sidebar.component.html',
      styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent implements OnInit {
      @BlockUI() blockUI: NgBlockUI;
      subscription: Subscription;
      docId: any;
      clearSetTimeout: any;
      pendingRequest: any;
      page: any;
      jstoday: any;
      public dayLable: any = [];
      currdate: any;

      constructor(private data: ApiIntegrationService,
            private route: ActivatedRoute,
            private router: Router,
            private toastr: ToastrService,
            private message: MessageService,
            private fb: FormBuilder) {
            this.docId = sessionStorage.getItem('docId');

            this.subscription = this.message.getMessage().subscribe(message => {
                  if (message.text != "undefined") {
                        this.docName = message.text;
                  }
            });
            $(".progress-bar").loading();
            this.getDoctorDetails(this.docId);
            this.getDateAfterCurrentDate();
      }


      @HostListener('window:scroll', ['$event'])
      onScroll(event) {

            if (this.todayVisitList.length >= 10 && event.type == 'scroll') {
                  this.page = this.page + 1;
                  this.getTodayVisit(this.page, event.type)
            }
      }

      subVar;
      ngOnInit() {
            this.getBookedSlot();
            this.profileCompletionPercent();
            //this.getTodayVisit(this.page,this.from);
            this.subscriptioncall();
            this.unreadNotificationsCount();
            // setInterval(() => {
            //                     this.getCurrenttime();
            //                    }, 1000);

            this.data.currentMessage.subscribe(message => {
                  this.subVar = message
            });

      }

      updateSubjectMethod(newName) {
            this.data.changeMessage(newName)
      }

      getBookedSlot() {
            var d = new Date();
            var todayDate = moment(d).format('YYYY-MM-DDTHH:mm');
            var selectedDate = Date.parse(todayDate) / 1000;
            var dateMilisecond = selectedDate * 1000
            this.getBookedSlotByDate(dateMilisecond);
      }

      pendReq: any;
      clearTime: any;
      resp: any;
      resPercentage: any;
      profileCompletionPercent() {
            let postData = {

            }

            // this.blockUI.start();              
            this.pendReq = this.data.profileCompletionPercent(postData).subscribe((res) => {
                  clearTimeout(this.clearTime);
                  //this.blockUI.stop();

                  this.resp = res;
                  if (this.resp.statusCode == 200) {
                        this.resPercentage = '';
                        this.resPercentage = this.resp.data;
                  } else {
                        //this.toastr.error(this.resp.message);  
                  }
            }, error => {
                  //this.blockUI.stop();
                  //this.toastr.error('Not able to connect host, please try again');  
            })
            this.clearTime = setTimeout(() => {
                  this.pendReq.unsubscribe();
                  this.blockUI.stop();
            }, 60000);
      }

      ischecked: boolean = true;
      setToggle() {
            this.ischecked = !this.ischecked;
            let postData = {
                  "isOnline": this.ischecked
            }
            this.blockUI.start();
            this.pendReq = this.data.setToggle(postData).subscribe((res) => {
                  clearTimeout(this.clearTime);
                  this.blockUI.stop();

                  this.resp = res;
                  if (this.resp.statusCode == 200) {
                        this.resPercentage = '';
                        this.resPercentage = this.resp.data;
                  } else {
                        this.toastr.error(this.resp.message);
                  }
            }, error => {
                  //this.blockUI.stop();
                  // this.toastr.error('Not able to connect host, please try again');  
            })
            this.clearTime = setTimeout(() => {
                  this.pendReq.unsubscribe();
                  this.blockUI.stop();
            }, 60000);
      }


      response: any
      todayVisitList: any = [];
      pendingReq: any
      clearSetTimes: any;

      fromDate: any;
      toDate: any;
      selectFromDate: any;
      selectToDate: any;
      curentData: any;
      startTime: any = '00:00'
      endTime: any;
      startObj: any;
      toObj: any
      from: any = '';
      date: any = new Date();
      dataLength: boolean = true;

      getTodayVisit(page, from) {
            var newDate = moment(this.date).format('YYYY-MM-DD');
            this.startObj = moment(newDate + this.startTime, 'YYYY-MM-DDLT');
            this.toObj = moment(newDate + this.endTime, 'YYYY-MM-DDLT');
            var fromDateTime = this.startObj.format('YYYY-MM-DDTHH:mm');
            var toDateTime = this.toObj.format('YYYY-MM-DDTHH:mm');
            this.selectFromDate = Date.parse(fromDateTime) / 1000;
            this.selectToDate = Date.parse(toDateTime) / 1000;
            this.from = from;
            let postData = {
                  "from": this.selectFromDate,
                  "to": this.selectToDate,
                  "page": page,
                  "limit": 5
            }

            this.blockUI.start();
            this.pendingRequest = this.data.getTodayVisit(postData).subscribe((data) => {
                  clearTimeout(this.clearSetTimeout);
                  this.blockUI.stop();

                  this.response = data;
                  if (data['statusCode'] == 200) {
                        if (this.from == 'scroll') {
                              this.todayVisitList = this.todayVisitList.concat(this.response.data);
                        } else {
                              this.todayVisitList = [];
                              if (this.response.data.length) {
                                    this.todayVisitList = this.response.data;
                                    this.dataLength = false;
                              } else {
                                    this.dataLength = true;
                              }
                        }
                        // console.log("data['message'"+data['message']) ;
                  } else {
                        // this.toastr.error(data['message']);  
                  }
            }, error => {
                  //this.blockUI.stop();
                  //this.toastr.error('Not able to connect host, please try again');  
                  // this.showErrorToaster('Not able to connect host, please try again');
            })
            this.clearSetTimeout = setTimeout(() => {
                  this.pendingRequest.unsubscribe();
                  this.blockUI.stop();
            }, 60000);
      }


      docRating: any;
      respRating: any
      pendReqRating: any;
      clearTimeRating: any
      getDoctorRating() {
            let postData = {

            }
            this.blockUI.start();
            this.pendReqRating = this.data.getDoctorRating(postData).subscribe((res) => {
                  clearTimeout(this.clearTimeRating);
                  this.blockUI.stop();
                  this.respRating = res;
                  if (this.respRating.statusCode == 200) {
                        this.docRating = '';
                        this.docRating = this.respRating.data;
                  } else {
                        //  this.toastr.error(this.respRating.message);  
                  }
            }, error => {
                  // this.blockUI.stop();
                  // this.toastr.error('Not able to connect host, please try again');  
            })
            this.clearTimeRating = setTimeout(() => {
                  this.pendReqRating.unsubscribe();
                  this.blockUI.stop();
            }, 60000);
      }


      userPartiCount: any;
      respPartiCount: any
      pendReqPartiCount: any;
      clearTimePartiCount: any
      getParticipantsUserCount() {
            let postData = {

            }
            this.blockUI.start();
            this.pendReqPartiCount = this.data.getParticipantsUserCount(postData).subscribe((res) => {
                  clearTimeout(this.clearTimePartiCount);
                  this.blockUI.stop();
                  this.respPartiCount = res;
                  if (this.respPartiCount.statusCode == 200) {
                        this.userPartiCount = '';
                        this.userPartiCount = this.respPartiCount.data;
                  } else {
                        // this.toastr.error(this.respPartiCount.message);  
                  }
            }, error => {
                  // this.blockUI.stop();
                  // this.toastr.error('Not able to connect host, please try again');  
            })
            this.clearTimePartiCount = setTimeout(() => {
                  this.pendReqPartiCount.unsubscribe();
                  this.blockUI.stop();
            }, 60000);
      }
      getCurrenttime() {
            this.endTime = moment(this.date).format('h:mm a');
      }

      degreeType: any;
      pendingRequestDocor: any;
      clearSetTimeoutDoctor: any;
      doctorDeatils:any = [];
      doctorSpecializationList: any = [];  
      docName: any;
      getDoctorDetails(id) {
            
            let postData = {
                  "docId": id
            }
            // this.blockUI.start();    
            clearTimeout(this.clearSetTimeoutDoctor);
            this.pendingRequestDocor = this.data.getDocById(postData).subscribe((data) => {
                  clearTimeout(this.clearSetTimeoutDoctor);
                  // this.blockUI.stop();              
                  this.response = data;
                  if (this.response.statusCode == 200) {
                        this.doctorDeatils = "";
                        this.doctorDeatils = this.response.data;
                        console.log("Right Side bAr", this.doctorDeatils);
                        this.doctorSpecializationList = this.response.data.specialization;
                        this.docName = this.doctorDeatils.name.firstName + " " + this.doctorDeatils.name.lastName;
                        if (this.doctorDeatils.degree.length) {
                              this.degreeType = this.doctorDeatils.degree;
                        }
                  } else {
                        //this.toastr.error(this.response.message);  
                  }
            }, error => {
                  // this.blockUI.stop();
                  //  this.toastr.error('Not able to connect host, please try again'); 
            })
            this.clearSetTimeoutDoctor = setTimeout(() => {
                  this.pendingRequestDocor.unsubscribe();
                  // this.blockUI.stop();
            }, 60000);
      }

      subscriptioncall() {

      }

      ngOnDestroy() {
            this.subscription.unsubscribe();
      }
      //-------------------------------unread count start here------------------//
      unreadCount: any;
      pendingcountRequest: any;
      clearcountSetTimeout: any;
      unreadNotificationsCount() {
            let postData = {
                  //"docId":this.docId
            }
            this.blockUI.start();
            this.pendingcountRequest = this.data.unreadNotificationsCount(postData).subscribe((data) => {
                  clearTimeout(this.clearcountSetTimeout);
                  this.blockUI.stop();
                  if (data['statusCode'] == 200) {
                        this.unreadCount = data['data'];
                  } else {
                        //this.toastr.error(data['message']);  
                  }
            }, error => {
                  //this.blockUI.stop();
                  // this.toastr.error('Not able to connect host, please try again');  
                  // this.showErrorToaster('Not able to connect host, please try again');
            })
            this.clearcountSetTimeout = setTimeout(() => {
                  this.pendingcountRequest.unsubscribe();
                  this.blockUI.stop();
            }, 60000);
      }


      notificatonResp: any;
      notificationList: any = [];
      pendingNotifyRequest: any;
      clearNotifySetTimeout: any;
      getallnotifications() {
            debugger
            let postData = {

            }
            this.blockUI.start();
            this.pendingNotifyRequest = this.data.getallnotifications(postData).subscribe((data) => {
                  clearTimeout(this.clearNotifySetTimeout);
                  this.blockUI.stop();

                  this.notificatonResp = data;
                  if (this.notificatonResp.statusCode === "200") {
                        this.notificationList = [];
                        var notifyList = this.notificatonResp.data;
                        for (var i = 0; i < 5; i++) {

                              this.notificationList.push(notifyList[i]);

                        }

                  } else {
                        // this.toastr.error(data['message']);  
                  }
            }, error => {
                  this.blockUI.stop();
                  // this.toastr.error('Not able to connect host, please try again');  
                  // this.showErrorToaster('Not able to connect host, please try again');
            })
            this.clearNotifySetTimeout = setTimeout(() => {
                  this.pendingNotifyRequest.unsubscribe();
                  this.blockUI.stop();
            }, 60000);
      }




      selectDate: boolean = false;
      selectDatePoint: boolean = false;

      dayNames: any = [];
      getDateAfterCurrentDate() {

            this.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            this.currdate = new Date();
            for (var i = 0; i < 7; i++) {
                  var last = new Date(this.currdate.getTime() + (i * 24 * 60 * 60 * 1000));
                  var day = last.getDate();
                  const fulld = {
                        "dayName": this.dayNames[last.getDay()],
                        "date": Number(day),
                        "dateTime": last
                  };

                  this.dayLable.push(fulld);
                  this.activeElement = this.dayLable[0].date;
            }
      }
      public activeElement: any;
      selectItem(item) {
            var date = item.dateTime
            var toDateTime = moment(item.dateTime).format('YYYY-MM-DDTHH:mm');
            var dateMilisecond = Date.parse(toDateTime) / 1000;
            this.selectedDate = dateMilisecond * 1000;
            this.activeElement = item.date;
            this.getBookedSlotByDate(this.selectedDate);
      }

      getBookedResp: any;
      getBookedList: any = [];;
      getBookedPendingRequest: any;
      getBookedSetTimeout: any;
      selectedDate: any;

      getBookedSlotByDate(item) {
            let postData = { "date": item }

            this.blockUI.start();
            this.getBookedPendingRequest = this.data.getBookedSlotByDate(postData).subscribe((data) => {
                  clearTimeout(this.getBookedSetTimeout);
                  this.blockUI.stop();

                  this.getBookedResp = data;
                  if (this.getBookedResp.statusCode === "200") {
                        this.todayVisitList = [];

                        var notifyList = this.getBookedResp.data;
                        if (notifyList.length) {
                              for (var i = 0; i < notifyList.length; i++) {
                                    this.todayVisitList.push(notifyList[i]);
                                    this.dataLength = false;
                              }
                        } else {
                              this.dataLength = true;
                        }

                  }
            }, error => {
                  this.blockUI.stop();
                  this.toastr.error('Not able to connect host, please try again');
                  // this.showErrorToaster('Not able to connect host, please try again');
            })
            this.getBookedSetTimeout = setTimeout(() => {
                  this.getBookedPendingRequest.unsubscribe();
                  this.blockUI.stop();
            }, 60000);

      }


      goTaskboard(patientId) {
            this.message.gotaskboardPatient(patientId);
            this.router.navigate(['/mypatient', patientId]);
      }


      //***********************Get updateVisitTimeSlot api intregration start here***********************//
      visitTimeSlotRequest: any;
      getVisitTimeSlotResp: any;
      visitSlotTimeout: any;
      visitSlotStatus: any;

      updateVisitTimeSlot(visitId: any, status: any) {
            //console.log(visitId, status)
            let postData = { "visitId": visitId, "operation": status }

            this.blockUI.start();
            this.visitTimeSlotRequest = this.data.updateVisitTimeSlot(postData).subscribe(data => {
                  console.log(data);
                  clearTimeout(this.visitSlotTimeout);
                  this.blockUI.stop();

                  this.getVisitTimeSlotResp = data;
                  //console.log(this.getVisitTimeSlotResp);
                  if (this.getVisitTimeSlotResp.statusCode === "200") {
                        this.toastr.success(this.getVisitTimeSlotResp.message);
                        this.visitSlotStatus = this.getVisitTimeSlotResp;
                        console.log(this.visitSlotStatus);
                        this.getBookedSlot();
                  }

            }, error => {
                  this.blockUI.stop();
                  this.toastr.error('Not able to connect host, please try again');
            })
            this.visitSlotTimeout = setTimeout(() => {
                  this.visitTimeSlotRequest.unsubscribe();
                  this.blockUI.stop();
            }, 60000);

      }

}
