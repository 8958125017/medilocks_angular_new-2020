import { Component, OnInit } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
declare var $;
import { MessageService } from '../messageservice.service';
import * as moment from 'moment';

@Component({
  selector: 'app-create-visit',
  templateUrl: './create-visit.component.html',
  styleUrls: ['./create-visit.component.css']
})
export class CreateVisitComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  clearSetTimeout: any;
  pendingRequest: any;
  public isValidFormSubmitted = null;
  bodyRes: any;
  response: any;
  date: any = new Date();
  patientId: any;
  constructor(
    private data: ApiIntegrationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    public constants: GlobalConstant,
    private actRoute: ActivatedRoute,
    private messgage: MessageService
  ) { }

  createVisitForm = new FormGroup({
    mobNo: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    bookSlot: new FormControl(''),
    illness: new FormControl('', [Validators.required]),
    slot: new FormControl('')
  });


  ngOnInit() {
    this.patientId = this.actRoute.snapshot.paramMap.get('id');
    this.getPatientsDetails(this.patientId)
  }


  //----------------------Get getPatientsDetails api api-integration start here----------//
  patientsDtails: any = {};
  patientsResp: any;
  pendingReq: any
  clearTimeouts: any;
  getPatientsDetails(id) {
    let postData = {
      "patientId": id
    }
    this.pendingReq = this.data.getPatientDetails(postData).subscribe((resp) => {
      this.patientsResp = resp;
      if (this.patientsResp.statusCode == 200) {
        this.patientsDtails = this.patientsResp.data
        this.createVisitForm.patchValue({
          email: this.patientsDtails.email,
          name: this.patientsDtails.name.firstName + " " + this.patientsDtails.name.lastName,
          mobNo: this.patientsDtails.mobNum,
        })

      } else {
        this.toastr.error(resp['message']);
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.clearTimeouts = setTimeout(() => {
      this.pendingReq.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }

  createVisit() {
    if (!this.createVisitForm.value.mobNo) {
      this.toastr.error('Contact Number is required');
      return false
    }
    if (!this.createVisitForm.value.name) {
      this.toastr.error('Patient Name is required');
      return false
    }
    if (!this.createVisitForm.value.email) {
      this.toastr.error('Email is required');
      return false
    }
    if (!this.createVisitForm.value.bookSlot) {
      this.toastr.error('please select schedual date');
      return false
    } else if (!this.createVisitForm.value.slot) {
      this.toastr.error('please select slot');
      return false
    } else if (!this.createVisitForm.value.illness) {
      this.toastr.error('please enter illness');
      return false
    } else {
      var date = moment(this.createVisitForm.value.bookSlot).format('YYYY-MM-DD');
      var epochDate = Date.parse(date) / 1000;
      this.createVisitForm.value.bookSlot = epochDate * 1000;
      let postData = {
        "patientId": this.patientId,
        "mobNo": this.createVisitForm.value.mobNum,
        "email": this.createVisitForm.value.email,
        "bookSlot": this.createVisitForm.value.bookSlot,
        "illness": this.createVisitForm.value.illness,
        "duration": this.slotDuration,
        "slot": [this.createVisitForm.value.slot.replace(/[\- ,:-]+/g, "")]
      }
      this.blockUI.start();
      this.pendingReq = this.data.addVisit(postData).subscribe((resp) => {
        this.blockUI.stop();
        if (resp['statusCode'] == 200) {
          this.toastr.success(resp['message']);
          this.router.navigate(['/mypatient']);
        } else {
          this.toastr.error(resp['message']);
        }
      }, error => {
        this.blockUI.stop();
        this.toastr.error('Not able to connect host, please try again');
      })
      this.clearTimeouts = setTimeout(() => {
        this.pendingReq.unsubscribe();
        this.blockUI.stop();
      }, 60000);
    }
  }

  //*************************Get getPatientsDetails api api-integration end here*****************//


  //*************************Date for getAvailableSlot Start here********************************//


  //*************************Date for getAvailableSlot End here********************************//


  getDate() {

    this.getAvailableSlot(this.createVisitForm.value.bookSlot);



  }


  //*************************getAvailableSlot api intregration start here***********************//

  slotList: any = [];
  availSlotResp: any;
  pendingslot: any
  clearTimeoutsSlot: any;
  slotDuration: any;
  output: any = [];
  availableSlotList: any = [];
  getAvailableSlot(date) {
    let postData = {
      "date": date
    }
    this.blockUI.start();
    this.pendingslot = this.data.getAvailableSlot(postData).subscribe((resp) => {
      this.blockUI.stop();
      this.availSlotResp = resp;
      clearTimeout(this.clearTimeoutsSlot);
      if (this.availSlotResp.statusCode == 200) {
        var slotData = this.availSlotResp.data;
        this.slotDuration = slotData.slot;
        this.slotList = [];
        this.slotList = this.availSlotResp.data.availableSlots;
        for (var i = 0; i < this.slotList.length; i++) {
          this.output = [];
          this.output = this.slotList[i].toString().match(/(\d{2})(?=(\d{2})+(?!\d)|$)/g);
          this.availableSlotList.push(this.output[0] + ":" + this.output[1] + " - " + this.output[2] + ":" + this.output[3]);
        }



      } else {
        this.toastr.error(resp['message']);
      }
    }, error => {
      this.blockUI.stop();
    })
    this.clearTimeoutsSlot = setTimeout(() => {
      this.pendingslot.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }


  //*************************getAvailableSlot api intregration end here*************************//



  getsplitvalue(value) {
    alert(value)
    var result = value.toString().match(/(\d{2})(?=(\d{2})+(?!\d)|$)/g);
    return result
  }
}
