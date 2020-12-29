import { Component, OnInit, ViewChildren, AfterViewInit, Renderer2 } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';


import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators, MustMatch } from '../validators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { debounceTime } from 'rxjs/operators';

declare var $;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  docId: any;
  clearSetTimeout: any;
  pendingRequest: any;
  public cardForm: FormGroup;
  public changePasswordForm: any;
  submitted: boolean = false;

  addPrescriptionTemplate: FormGroup;
  prescribedMedicines: FormArray;
  prescribedMedicinesColumns: FormArray;

  addTableRow: FormArray;
  addTableNewRows: FormArray;
  addTableFieldName: FormArray;

  //Add Comments formArray 
  addComments: FormArray;

  setDate = new Date();
  setTime = "00:00";

  // For OTP
  addOtpForm: FormGroup;
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];
  @ViewChildren('formRow') rows: any;

  constructor(
    private data: ApiIntegrationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,

  ) {
    this.docId = sessionStorage.getItem('docId');    
  }

  ngOnInit() {
    this.getDoctorDetails();
    this.cardFormInit();
    this.getCardDetails();
    this.changePasswordFormInit();
    this.forEmailInit();
    //this.addPrescriptionTemplate.disable();
    this.setOtpForm();
  }

  cardFormInit() {
    this.cardForm = this.fb.group({
      cardNo: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16), CustomValidators.removeSpaces]],
      expireDate: new FormControl('', [Validators.required]),
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), CustomValidators.removeSpaces]],
    }),

      this.addPrescriptionTemplate = this.fb.group({
        prescribedMedicines: this.fb.array([this.prescribedMedicinesItem()]),
        prescribedMedicinesColumns: this.fb.array([this.prescribedMedicinesColumnsItem()]),

        addTableRow: this.fb.array([this.addTableItem()]),

        addTableFieldName: this.fb.array([this.addTableField()]),

        addTableNewRows: this.fb.array([this.addtableNewRowsName()]),

        addComments: this.fb.array([this.takeCommentsFields()]),
      })
  }

  prescribedMedicinesItem() {
    return this.fb.group({
      medicinesName: ['',],
      day: [''],
      tablate: ['']
    })
  }

  prescribedMedicinesColumnsItem() {
    return this.fb.group({
      defaultColumns: ['',],
    })
  }

  addRow() {
    this.prescribedMedicines = this.addPrescriptionTemplate.get('prescribedMedicines') as FormArray;
    this.prescribedMedicines.push(this.prescribedMedicinesItem());
  }

  addColumns() {
    this.prescribedMedicinesColumns = this.addPrescriptionTemplate.get('prescribedMedicinesColumns') as FormArray;
    this.prescribedMedicinesColumns.push(this.prescribedMedicinesColumnsItem());
  }


  // Functanality start Add table row and columns

  addTableItem() {
    return this.fb.group({
      item1: ['',],
      item2: ['']
    })
  }

  addTableField() {
    return this.fb.group({
      defaultField: ['',],
    })
  }

  addtableNewRowsName() {
    return this.fb.group({
      item3: ['',],
      item4: ['']
    })
  }

  addTable() {
    this.addTableRow = this.addPrescriptionTemplate.get('addTableRow') as FormArray;
    this.addTableRow.push(this.addTableItem());
  }

  addTableColumns() {
    this.addTableFieldName = this.addPrescriptionTemplate.get('addTableFieldName') as FormArray;
    this.addTableFieldName.push(this.addTableField());
  }

  addTableNewRow() {
    this.addTableNewRows = this.addPrescriptionTemplate.get('addTableNewRows') as FormArray;
    this.addTableNewRows.push(this.addtableNewRowsName());
  }

  //start Add Comment Functionality

  takeCommentsFields() {
    return this.fb.group({
      defaulComments: ['',],
    })
  }

  addCommentField() {
    this.addComments = this.addPrescriptionTemplate.get('addComments') as FormArray;
    this.addComments.push(this.takeCommentsFields());
  }

  removeCommentField(index) {
    (this.addPrescriptionTemplate.get('addComments') as FormArray).removeAt(index);
  }
  //End Add Comment Functionality





  removeSection(index, value) {

    if (value == 'prescribedMedicinesItem') {
      (this.addPrescriptionTemplate.get('prescribedMedicines') as FormArray).removeAt(index);
    }

    else if (value == "removeMedicineDefaultCoumns") {
      (this.addPrescriptionTemplate.get('prescribedMedicinesColumns') as FormArray).removeAt(index);
    }

    else if (value == "removeTableRow") {
      (this.addPrescriptionTemplate.get('addTableRow') as FormArray).removeAt(index);
    }

    else if (value == "removedefaultField") {
      (this.addPrescriptionTemplate.get('addTableFieldName') as FormArray).removeAt(index);
    }

    else if (value == "removeNewTableRowItem") {
      (this.addPrescriptionTemplate.get('addTableNewRows') as FormArray).removeAt(index);
    }

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



  hideSection(value) {

    if (value == 'symptoms') {
      this.symptoms = false;
    }

    else if (value == "Diagnosis") {
      this.diagnosis = false;
    }


    else if (value == "prescribedmedcines") {
      this.prescribemedicine = false;
    }

    else if (value == "comments") {
      this.comments = false;
    }

  }


  showSection(value) {

    if (value == 'symptoms') {
      this.symptoms = true;
    }

    else if (value == "diagnosis") {
      this.diagnosis = true;
    }

    else if (value == "prescribedmedcines") {
      this.prescribemedicine = true;
    }

    else if (value == "comments") {
      this.comments = true;
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
    this.changePasswordForm = this.fb.group({
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
    this.emailForm = this.fb.group({
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
  respMob: any;

  sendOtp() {
    if (!this.docMob) {
      this.toastr.error("please enter mobile number");
      return false
    } else {
      $('#exampleModalCenter').modal('toggle');
      this.updateNumber();
    }
  }

  updateNumber() {
    let postData = {
      "mobNo": "+91" + this.docMob
    }
    this.blockUI.start();
    this.pendingMobRequest = this.data.updateMobNo(postData).subscribe((data) => {
      clearTimeout(this.clearMobSetTimeout);
      this.blockUI.stop();
      this.respMob = data;
      if (this.respMob.statusCode == 200) {
        this.refNo = data['data'];
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


  //***************************update mobile number end here******************************//

  //***************************Verify otp start here**************************************//

  setOtpForm(){
    this.addOtpForm = this.toFormGroup(this.formInput);
  }

  toFormGroup(elements) {
    const group: any = {};

    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  keyUpEvent(event, index) {
    debugger
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }
  }

  resetOtp(){
    this.addOtpForm.reset();
  }

  refNo: any;
  VerifyOTP() {
    if (this.addOtpForm.invalid) {
      this.toastr.error('Please Fill OTP');
      return false;
    }
    //console.log(this.addOtpForm.value);
    let firstNum = this.addOtpForm.get('input1').value;
    let secondNum = this.addOtpForm.get('input2').value;
    let thirdNum = this.addOtpForm.get('input3').value;
    let fourthNum = this.addOtpForm.get('input4').value;
    let fiftNum = this.addOtpForm.get('input5').value;
    let sixthNum = this.addOtpForm.get('input6').value;

    let otp = firstNum + secondNum + thirdNum + fourthNum + fiftNum + sixthNum;
    let postData = {
      "mobNo": "+91" + this.docMob,
      "otp": otp,
      "refNo": this.refNo
    }

    this.blockUI.start();
    this.pendingRequest = this.data.verifyOTP(postData).subscribe((data) => {
      //console.log(data);
      this.resetOtp();
      clearTimeout(this.clearSetTimeout);
      this.blockUI.stop();
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
        "email": this.docEmail
      }
      this.blockUI.start();
      this.pendingMobRequest = this.data.updateEmail(postData).subscribe((data) => {
        this.blockUI.stop();
        clearTimeout(this.clearMobSetTimeout);
        this.respMob = data;
        if (this.respMob.statusCode == 200) {
          this.toastr.success(this.respMob.message + " " + this.docEmail);
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
  docEmail: any;
  docMob: any;
  isMobileVerified: boolean = false;
  isEmailVerified: boolean = false;
  response

  getDoctorDetails() {
    let postData = {
      "docId": this.docId
    }

    clearTimeout(this.clearSetTimeoutDoctor);
    this.pendingRequestDocor = this.data.getDocById(postData).subscribe((data) => {
      clearTimeout(this.clearSetTimeoutDoctor);

      this.response = data;

      console.log(this.response);

      $('#updateEmail').modal('hide');
      if (this.response.statusCode == 200) {

        this.doctorDeatils = this.response.data;
        this.docEmail = this.doctorDeatils.email;
        this.docMob = this.doctorDeatils.mobNumber;
        this.emailForm.setValue({ email: this.doctorDeatils.email });

        if (this.doctorDeatils.isMobVerified == true) {
          this.isMobileVerified = true;
        }

        else if (this.doctorDeatils.isEmailVerified == true) {
          this.isEmailVerified = true;
        }

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
    editable: false,
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





}
