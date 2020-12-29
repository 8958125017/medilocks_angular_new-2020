import { Component, OnInit, ViewChildren } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators, MustMatch } from '../validators';
declare var $;
@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})

export class ForgotPassComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public noWhitespace = /^\S[\w\d]* ?[\w\d\S]*/
  public emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  submitted: boolean = false;
  isvalid: boolean = false;
  sendOtpstatus: boolean = true;

  clearSetTimeout: any;
  pendingRequest: any;
  public showPassowrd: boolean = true;
  public recoverForm: FormGroup;
  public forgotPasswordForm: FormGroup;
  refNo: any;

  // For OTP
  addOtpForm: FormGroup;
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];
  @ViewChildren('formRow') rows: any;

  constructor(
    private data: ApiIntegrationService,
    private toastr: ToastrService,

    private fb: FormBuilder,
    private router: Router,
    public constants: GlobalConstant,
    private activatedRoute: ActivatedRoute,
    //  private messgage : MessageService
  ) { }

  ngOnInit() {
    this.recoverPasswordInit();
    this.forgotPasswordInit();
    this.setOtpForm();
  }

  recoverPasswordInit() {
    this.recoverForm = this.fb.group({
      mobNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), CustomValidators.removeSpaces]],

    })
  }

  forgotPasswordInit() {
    this.forgotPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.recoverForm.controls; }

  submit() {
    this.submitted = true;
    if (this.recoverForm.value.mobNo == '') {
      this.toastr.error('Please enter mobile number');
      return false;
    }
    else {
      $('#exampleModalCenter').modal('toggle');
      this.sendotp();
    }
  }

  sendotp() {
    let postData = {
      "mobNo": "+91" + this.recoverForm.value.mobNo,
    }
    this.blockUI.start();
    this.pendingRequest = this.data.sendOtp(postData).subscribe((data) => {
      clearTimeout(this.clearSetTimeout);
      this.blockUI.stop();
      if (data['statusCode'] == 200) {
        this.refNo = data['data'];
        // $('#exampleModalCenter').modal('toggle');   
        this.toastr.success(data['message']);
      } else {
        this.toastr.error(data['message']);
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })

    this.clearSetTimeout = setTimeout(() => {
      this.pendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }

  //-----------------signup end here--------------------//


  //***************************Verify otp start here**************************************//

  setOtpForm() {
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

  resetOtp() {
    this.addOtpForm.reset();
  }

  VerifyOTP() {

    if (this.addOtpForm.invalid) {
      this.toastr.error('Please Fill OTP');
      return false;
    }
    console.log(this.addOtpForm.value);
    
    let firstNum = this.addOtpForm.get('input1').value;
    let secondNum = this.addOtpForm.get('input2').value;
    let thirdNum = this.addOtpForm.get('input3').value;
    let fourthNum = this.addOtpForm.get('input4').value;
    let fiftNum = this.addOtpForm.get('input5').value;
    let sixthNum = this.addOtpForm.get('input6').value;

    let otp = firstNum + secondNum + thirdNum + fourthNum + fiftNum + sixthNum;
    let postData = {
      "mobNo": "+91" + this.recoverForm.value.mobNo,
      "otp": otp,
      "refNo": this.refNo
    }

    this.blockUI.start();
    this.pendingRequest = this.data.verifyOTP(postData).subscribe((data) => {
      clearTimeout(this.clearSetTimeout);
      this.blockUI.stop();
      this.resetOtp();
      if (data['statusCode'] == 200) {
        $('#exampleModalCenter').modal('hide');
        this.showPassowrd = false;
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
    }, 10000);
  }


  //***************************Verify otp start here**************************************//

  get h() { return this.forgotPasswordForm.controls; }

  forgotPassword() {
    this.isvalid = true;
    if (this.forgotPasswordForm.value.password == '') {
      this.toastr.error('Please enter password');
      return false;
    }
    else if (this.forgotPasswordForm.value.confirmPassword == '') {
      this.toastr.error('Please enter confirmPassword');
      return false;
    } else if (this.forgotPasswordForm.value.password != this.forgotPasswordForm.value.confirmPassword) {
      this.toastr.error('Confirm Password do not match');
      return false;
    } else if (this.forgotPasswordForm.valid) {
      let postData = {
        "mobNo": "+91" + this.recoverForm.value.mobNo,
        "password": this.forgotPasswordForm.value.password
      }
      this.blockUI.start();
      this.pendingRequest = this.data.forgetPassword(postData).subscribe((data) => {
        clearTimeout(this.clearSetTimeout);
        this.blockUI.stop();
        if (data['statusCode'] == 200) {
          this.router.navigate(['/login']);
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

}
