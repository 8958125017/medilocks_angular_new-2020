import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators, MustMatch } from '../validators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
declare var $;

@Component({
  selector: 'app-prescription-form',
  templateUrl: './prescription-form.component.html',
  styleUrls: ['./prescription-form.component.css']
})

export class PrescriptionFormComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  docId: any;
  clearSetTimeout: any;
  pendingRequest: any;
  public cardForm: FormGroup;
  public changePasswordForm: any;
  submitted: boolean = false;

  addPrescriptionForm: FormGroup;
  setgetTimeSlotForm: FormGroup;


  patientId: any;

  prescriptionObj: any;


  constructor(
    private data: ApiIntegrationService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private _fb: FormBuilder,
  ) {
    this.docId = sessionStorage.getItem('docId');
  }

  pipe = new DatePipe('en-US');
  date = Date.now();

  mySimpleFormat = this.pipe.transform(this.date, 'yyyy-MM-dd');

  ngOnInit() {
    this.patientId = this.actRoute.snapshot.paramMap.get('id');
    this.getDoctorDetails();
    this.cardFormInit();
    this.getCardDetails();
    this.changePasswordFormInit();
    this.forEmailInit();
    this.getPatientsDetails(this.patientId);
    this.setTimeSlotForm();
    this.dateSet();
    this.getAvailableSlot(this.mySimpleFormat);

    this.setPrescriptionForm();
  }

  cardFormInit() {
    this.cardForm = this._fb.group({
      cardNo: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16), CustomValidators.removeSpaces]],
      expireDate: new FormControl('', [Validators.required]),
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), CustomValidators.removeSpaces]],
    })
  }

  setPrescriptionForm() {

    this.addPrescriptionForm = this._fb.group({

      symptomsObservation: this._fb.array([this.symptomsObservationFn()]),

      diagnosis: this._fb.array([this.diagnosisFn()]),

      prescribedMedicines: this._fb.array([this.prescribedMedicinesFn()]),

      addComments: this._fb.array([this.addCommentsFn()]),

      tableRow: this._fb.array([]),

      //tableRow: this._fb.array([this.tableRowFn()]),

    })
  }

  // Start Symptoms & Observation Section
  symptomsObservationFn() {
    return this._fb.group({
      key: [''],
      val: ['']
    })
  }

  symptomsObservationArr() {
    return this.addPrescriptionForm.get('symptomsObservation') as FormArray;
  }

  removeSymRow(i) {
    return this.symptomsObservationArr().removeAt(i);
  }


  // Start Symptoms & Observation Section
  diagnosisFn() {
    return this._fb.group({
      key: [''],
      val: ['']
    })
  }

  diagnosisArr() {
    return this.addPrescriptionForm.get('diagnosis') as FormArray;
  }

  removediaRow(i) {
    return this.diagnosisArr().removeAt(i);
  }


  // Start Prescribed Medicine Section
  prescribedMedicinesFn() {
    return this._fb.group({
      pmHeading: [''],
      pmDetail: this._fb.array([this.pmDetailFn()])
    })
  }

  prescribedMedicinesArr() {
    return this.addPrescriptionForm.get('prescribedMedicines') as FormArray;
  }

  removePmMainRow(i) {
    return this.prescribedMedicinesArr().removeAt(i);
  }

  //--

  pmDetailFn() {
    return this._fb.group({
      name: [''],
      day: [''],
      dose: [''],
      preMediExtCol: this._fb.array([])
    })
  }

  pmDetailArr(i) {
    return this.prescribedMedicinesArr().at(i).get("pmDetail") as FormArray
  }

  removePMDRow(i, j) {
    return this.pmDetailArr(i).removeAt(j);
  }

  AddPresMedicRow(i) {
    this.pmDetailArr(i).push(this.pmDetailFn());
  }

  //---

  pmColFn() {
    return this._fb.group({
      extra: [''],
    })
  }

  pmColArr(i, j) {
    return this.pmDetailArr(i).at(j).get("preMediExtCol") as FormArray
    //return ((<FormArray>this.addPrescriptionForm.controls['prescribedMedicines']).at(i).get('pmDetail') as FormArray).at(j).get('preMediExtCol') as FormArray;
  }

  removePMCol(i, j, k) {
    return this.pmColArr(i, j).removeAt(k);
  }

  AddPMCol(i, j) {
    this.pmColArr(i, j).push(this.pmColFn());
  }


  // Start Comment Section
  addCommentsFn() {
    return this._fb.group({
      key: [''],
      val: ['']
    })
  }

  commentsArr() {
    return this.addPrescriptionForm.get('addComments') as FormArray;
  }

  AddCommentsRow() {
    this.commentsArr().push(this.addCommentsFn());
  }

  removeCommentsRow(i) {
    return this.commentsArr().removeAt(i);
  }


  // Start Table Section
  tableRowFn() {
    return this._fb.group({
      tableHeading: [''],
      tableDetail: this._fb.array([this.tableDetailFn()])
    })
  }

  tableRowArr() {
    return this.addPrescriptionForm.get('tableRow') as FormArray;
  }

  addMainTableRow() {
    return this.tableRowArr().push(this.tableRowFn());
  }

  removeMainTableRow(i) {
    return this.tableRowArr().removeAt(i);
  }

  //--

  tableDetailFn() {
    return this._fb.group({
      tableItemOne: [''],
      tableItemTwo: [''],
      tableItemThree: [''],
      tableExtCol: this._fb.array([])
    })
  }

  tableDetailArr(i) {
    return this.tableRowArr().at(i).get("tableDetail") as FormArray
  }

  addTableDetailRow(i) {
    this.tableDetailArr(i).push(this.tableDetailFn());
  }

  removeTableDetailRow(i, j) {
    return this.tableDetailArr(i).removeAt(j);
  }

  //---

  tableExtColFn() {
    return this._fb.group({
      tdExtra: [''],
    })
  }

  tableExtColArr(i, j) {
    return this.tableDetailArr(i).at(j).get("tableExtCol") as FormArray
    //return ((<FormArray>this.addPrescriptionForm.controls['prescribedMedicines']).at(i).get('pmDetail') as FormArray).at(j).get('preMediExtCol') as FormArray;
  }

  removeTableExtCol(i, j, k) {
    return this.tableExtColArr(i, j).removeAt(k);
  }

  addTableExtCol(i, j) {
    this.tableExtColArr(i, j).push(this.tableExtColFn());
  }


  onProfileForm() {

    console.log(this.addPrescriptionForm.value);

    this.prescriptionObj = this.addPrescriptionForm.value;

    // this.blockUI.start();
    // let post = {
    //   'patientId': this.docId,
    //   "prescriptionUrl": 'http://xyz',
    //   "digitalPrescription": {
    //     'preDetail': this.addPrescriptionForm.value
    //   }
    // }

    // this.data.createPrescription(post).subscribe(res => {
    //   console.log(res)
    //   this.blockUI.start(stop);
    // }, error => {
    //   this.toastr.error('Error');
    // })

  }


  symptoms: boolean = true;
  diagnosis: boolean = true;
  prescribemedicine: boolean = true;
  comments: boolean = true;

  symptomsLabel: boolean = true;
  symptomsEditLabel: boolean = false;

  diagnosisLabel: boolean = true;
  diagnosisEditLabel: boolean = false;

  priscribeLabel: boolean = true;
  priscribeEditLabel: boolean = false;

  commentLabel: boolean = true;
  commentEditLabel: boolean = false;

  tableLabel: boolean = true;
  tableEditLabel: boolean = false;


  showEditLabel(value) {

    if (value == 'symptomsLabel') {
      this.symptomsLabel = !this.symptomsLabel;
      this.symptomsEditLabel = !this.symptomsEditLabel;
    }

    else if (value == 'diagnosisLabel') {
      this.diagnosisLabel = !this.diagnosisLabel;
      this.diagnosisEditLabel = !this.diagnosisEditLabel;
    }
    else if (value == 'priscribe') {
      this.priscribeLabel = !this.priscribeLabel;
      this.priscribeEditLabel = !this.priscribeEditLabel;
    }

    else if (value == 'Comments') {
      this.commentLabel = !this.commentLabel;
      this.commentEditLabel = !this.commentEditLabel;
    }

    else if (value == 'tableName') {
      this.tableLabel = !this.tableLabel;
      this.tableEditLabel = !this.tableEditLabel;
    }

  }

  // convenience getter for easy access to form fields
  get f() { return this.cardForm.controls; }

  addCardDeatails() {
    this.submitted = true;
    if (!this.cardForm.value.cardNo) {
      this.toastr.error("please enter card number");
      return false
    } else if (!this.cardForm.value.expireDate) {
      this.toastr.error("please enter expire Date");
      return false
    } else if (!this.cardForm.value.cvv) {
      this.toastr.error("please enter cvv number");
      return false
    } else {
      let postData = {
        "cardNo": this.cardForm.value.cardNo,
        "userId": this.docId,
        "ets": Date.parse(this.cardForm.value.expireDate) / 1000,
        "paymentMode": "Debit",
        "cvv": this.cardForm.value.cvv
      }
      this.blockUI.start();
      this.pendingRequest = this.data.addCardDetails(postData).subscribe((resp) => {
        clearTimeout(this.clearSetTimeout);
        this.blockUI.stop();
        this.submitted = false;
        if (resp['statusCode'] == 200) {
          this.cardForm.reset();
          this.getCardDetails();
          this.toastr.success(resp['message']);

        } else {
          this.toastr.error(resp['message']);
        }
      }, error => {
        this.blockUI.stop();
        this.toastr.error('Not able to connect host, please try again');
        // this.showErrorToaster('Not able to connect host, please try again');
      })
      this.clearSetTimeout = setTimeout(() => {
        this.pendingRequest.unsubscribe();
        this.blockUI.stop();
      }, 60000);
    }

  }

  pendingReq: any;
  cleartimeouts: any;
  cardDetails: any = [];
  getCardDetails() {
    let postData = {
      "userId": this.docId
    }
    this.blockUI.start();
    this.pendingReq = this.data.getCardDetails(postData).subscribe((resp) => {
      clearTimeout(this.cleartimeouts);
      this.blockUI.stop();
      if (resp['statusCode'] == 200) {
        this.cardDetails = resp['data'];
      } else {
        this.toastr.error(resp['message']);
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.cleartimeouts = setTimeout(() => {
      this.pendingReq.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }

  changePasswordFormInit() {
    this.changePasswordForm = this._fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }


  get h() { return this.changePasswordForm.controls; }
  isvalid: boolean = false;

  resetPassword() {
    this.isvalid = true;
    if (this.changePasswordForm.value.password == '') {
      this.toastr.error('Please enter password');
      return false;
    }
    else if (this.changePasswordForm.value.confirmPassword == '') {
      this.toastr.error('Please enter confirmPassword');
      return false;
    } else if (this.changePasswordForm.value.password != this.changePasswordForm.value.confirmPassword) {
      this.toastr.error('Confirm Password do not match');
      return false;
    } else if (this.changePasswordForm.valid) {
      let postData = {
        "docId": this.docId,
        "password": this.changePasswordForm.value.password
      }
      this.blockUI.start();
      this.pendingRequest = this.data.resetPassword(postData).subscribe((data) => {
        clearTimeout(this.clearSetTimeout);
        this.blockUI.stop();
        $('#resetPassword').modal('hide');
        if (data['statusCode'] == 200) {
          this.changePasswordForm.reset();
          this.toastr.success(data['message']);
          // this.showSuccessMessage(data['message']);  
        } else {
          // this.showErrorToaster(data['message']);
          this.toastr.error(data['message']);
        }
      }, error => {
        this.blockUI.stop();
        this.toastr.error('Not able to connect host, please try again');
        // this.showErrorToaster('Not able to connect host, please try again');
      })

      this.clearSetTimeout = setTimeout(() => {
        this.pendingRequest.unsubscribe();
        this.blockUI.stop();
      }, 10000);
    }
  }
  //****************************Form for Email update start here***************************//

  emailForm: FormGroup;

  public emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  forEmailInit() {
    this.emailForm = this._fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern), CustomValidators.removeSpaces]],
    });
  }

  get em() { return this.emailForm.controls; }
  //****************************Form for Email update start here***************************//
  isMobDisabled: boolean = true;
  editMobile() {
    this.isMobDisabled = false;
  }
  //***************************update Mobile Number start here****************************//

  pendingMobRequest: any;
  clearMobSetTimeout: any;
  respMob: any
  sendOtp() {
    if (!this.docMob) {
      this.toastr.error("please enter mobile number");
      return false
    } else {
      let postData = {
        "mobNo": this.docMob
      }
      this.blockUI.start();
      this.pendingMobRequest = this.data.updateMobNo(postData).subscribe((data) => {
        clearTimeout(this.clearMobSetTimeout);
        this.blockUI.stop();
        this.respMob = data;
        if (this.respMob.statusCode == 200) {
          this.refNo = data['data'];
          $('#exampleModalCenter').modal('toggle');
          this.toastr.success(this.respMob.message);
        } else {
          this.toastr.error(this.respMob.message);
        }
      }, error => {
        this.toastr.error('Not able to connect host, please try again');
      })
      this.clearMobSetTimeout = setTimeout(() => {
        this.pendingMobRequest.unsubscribe();
      }, 60000);
    }

  }


  //***************************update mobile number end here******************************//

  //***************************Verify otp start here**************************************//
  firstNum: any;
  secondNum: any;
  thirdNum: any;
  fourthNum: any;
  fiftNum: any;
  sixthNum: any;
  refNo: any;
  VerifyOTP() {

    if (!this.firstNum) {
      this.toastr.error("please enter otp");
      return false
    } else if (!this.secondNum) {
      this.toastr.error("please enter otp");
      return false
    } else if (!this.thirdNum) {
      this.toastr.error("please enter otp");
      return false
    } else if (!this.fourthNum) {
      this.toastr.error("please enter otp");
      return false
    } else if (!this.fiftNum) {
      this.toastr.error("please enter otp");
      return false
    } else if (!this.sixthNum) {
      this.toastr.error("please enter otp");
      return false
    } else {
      let otp = this.firstNum + this.secondNum + this.thirdNum + this.fourthNum + this.fiftNum + this.sixthNum;
      let postData = {
        "mobNo": "+91" + this.docMob,
        "otp": otp,
        "refNo": this.refNo
      }

      this.blockUI.start();
      this.pendingRequest = this.data.verifyOTP(postData).subscribe((data) => {
        clearTimeout(this.clearSetTimeout);
        this.blockUI.stop();
        this.firstNum = "";
        this.secondNum = "";
        this.thirdNum = "";
        this.fourthNum = "";
        this.fiftNum = "";
        this.sixthNum = "";
        this.refNo = "";
        if (data['statusCode'] == 200) {
          this.isMobDisabled = true;
          $('#exampleModalCenter').modal('hide');
          this.toastr.success(data['message']);
          // this.showSuccessMessage(data['message']);  
        } else {
          this.toastr.error(data['message']);
          //this.showErrorToaster(data['message']);
        }
      }, error => {
        this.blockUI.stop();
        this.toastr.error('Not able to connect host, please try again');
        //this.showErrorToaster('Not able to connect host, please try again');
      })

      this.clearSetTimeout = setTimeout(() => {
        this.pendingRequest.unsubscribe();
        this.blockUI.stop();
      }, 60000);
    }

  }

  //***************************Verify otp end here****************************************//

  //*******************************update Email start here*******************************//
  updateEmailModal() {
    $('#updateEmail').modal('toggle');
  }

  pendingEmailRequest: any;
  clearEmailSetTimeout: any;
  respEmail: any
  isSubmitted: boolean
  updateEmail() {
    this.isSubmitted = true;
    if (this.emailForm.value.email == '') {
      this.toastr.error('Please enter your Email id');
      return false;
    } else {
      let postData = {
        "email": "test123@yopmail.com"
      }
      this.blockUI.start();
      this.pendingMobRequest = this.data.updateEmail(postData).subscribe((data) => {
        this.blockUI.stop();
        clearTimeout(this.clearMobSetTimeout);
        this.respMob = data;
        if (this.respMob.statusCode == 200) {
          this.toastr.success(this.respMob.message);
        } else {
          this.toastr.error(this.respMob.message);
        }
      }, error => {
        this.toastr.error('Not able to connect host, please try again');
      })
      this.clearMobSetTimeout = setTimeout(() => {
        this.pendingMobRequest.unsubscribe();
      }, 60000);
    }

  }


  //********************************update Email end here********************************//


  pendingVerifyRequest: any;
  clearVerifySetTimeout: any;
  respVerify: any
  token: any;
  verifyUpdateEmail() {
    let postData = {
      "token": this.token
    }
    this.pendingVerifyRequest = this.data.verifyUpdateEmail(postData).subscribe((data) => {
      clearTimeout(this.clearVerifySetTimeout);
      this.respVerify = data;
      if (this.respVerify.statusCode == 200) {
        this.toastr.success(this.respVerify.message);
      } else {
        this.toastr.error(this.respVerify.message);
      }
    }, error => {
      this.toastr.error('Not able to connect host, please try again');
    })
    this.clearVerifySetTimeout = setTimeout(() => {
      this.pendingVerifyRequest.unsubscribe();
    }, 60000);
  }


  pendingRequestDocor: any;
  clearSetTimeoutDoctor: any;
  doctorDeatils: any;
  docLic: any;
  docName: any;
  docAddress: any;
  docEmail: any;
  docMob: any;
  response
  getDoctorDetails() {
    let postData = { "docId": this.docId }

    clearTimeout(this.clearSetTimeoutDoctor);
    this.pendingRequestDocor = this.data.getDocById(postData).subscribe((data) => {
      //console.log(data);
      clearTimeout(this.clearSetTimeoutDoctor);

      this.response = data;
      $('#updateEmail').modal('hide');
      if (this.response.statusCode == 200) {
        this.doctorDeatils = this.response.data;
        this.docName = this.doctorDeatils.name.firstName + ' ' + this.doctorDeatils.name.lastName;
        this.docLic = this.doctorDeatils.regNumber;
        this.docAddress = this.doctorDeatils.address;
        this.docEmail = this.doctorDeatils.email;
        this.docMob = this.doctorDeatils.mobNumber;
        this.emailForm.setValue({ email: this.doctorDeatils.email });
      } else {
        //this.toastr.error(this.response.message);  
      }
    }, error => {
      // this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })
    this.clearSetTimeoutDoctor = setTimeout(() => {
      this.pendingRequestDocor.unsubscribe();
      // this.blockUI.stop();
    }, 60000);
  }


  name = 'Angular 6';
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        'heading',
        'fontName'
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };




  //-----------------------Get getPatientsDetails api api-integration start here-----------------//
  patientsDtails: any = {};
  patientsResp: any;
  patientPendingReq: any;
  clearTimeouts: any;
  patientbirthdate: string;
  patientAge: number;

  getPatientsDetails(id) {
    debugger
    let postData = { "patientId": id }
    this.blockUI.start();
    this.patientPendingReq = this.data.getPatientDetails(postData).subscribe(resp => {
      this.patientsResp = resp;
      clearTimeout(this.clearTimeouts);
      this.blockUI.stop();
      //console.log(this.patientsResp);
      if (this.patientsResp.statusCode == 200) {
        this.patientsDtails = this.patientsResp.data;
        //console.log(this.patientsDtails);
        this.patientbirthdate = this.patientsDtails.dob;
        if (this.patientbirthdate) {
          var timeDiff = Math.abs(Date.now() - new Date(this.patientbirthdate).getTime());
          this.patientAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          //console.log(this.patientAge)
        }
        else {
          this.toastr.error(resp['message']);
        }

      }

    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    });
    this.clearTimeouts = setTimeout(() => {
      this.patientPendingReq.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }


  //*************************getAvailableSlot api intregration start here***********************//

  setTimeSlotForm() {
    this.setgetTimeSlotForm = this._fb.group({
      bookSlot: ['', Validators.compose([Validators.required])],
      slot: ['', Validators.compose([Validators.required])]
    })
  }

  dateSet() {
    this.setgetTimeSlotForm.get('bookSlot').setValue(this.mySimpleFormat);
  }

  onSetTimeSlotForm() {
    debugger
    this.submitted = true;
    console.log(this.setgetTimeSlotForm.value);

    var date = moment(this.setgetTimeSlotForm.value.bookSlot).format('YYYY-MM-DD');
    var epochDate = Date.parse(date) / 1000;
    this.setgetTimeSlotForm.value.bookSlot = epochDate * 1000;

    let model = {
      "patientId": this.patientId,
      "mobNo": this.patientsDtails.mobNum,
      "email": this.patientsDtails.email,
      "bookSlot": this.setgetTimeSlotForm.value.bookSlot,
      "illness": '',
      "duration": this.slotDuration,
      "slot": [this.setgetTimeSlotForm.value.slot.replace(/[\- ,:-]+/g, "")]
    }

    this.data.addVisit(model).subscribe(res => {
      console.log(res);

      if (res['statusCode'] == 200) {
        this.toastr.success(res['message']);
      } else {
        this.toastr.error(res['message']);
      }

    }, err => {
      this.toastr.error('error');
    })


  }

  getDate() {
    this.getAvailableSlot(this.setgetTimeSlotForm.value.bookSlot);
  }

  slotList: any = [];
  availSlotResp: any;
  pendingslot: any
  clearTimeoutsSlot: any;
  slotDuration: any;
  output: any = [];
  availableSlotList: any = [];
  getAvailableSlot(date) {
    let postData = { "date": date }
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


}
