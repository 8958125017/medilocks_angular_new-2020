import { Component, OnInit, ViewChildren } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators } from '../validators';
// import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public noWhitespace = /^\S[\w\d]* ?[\w\d\S]*/
  public emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validPin = "^((?!(0))[0-9]{6})$";
  validPhone = "^((?!(0))[0-9]{10})$";
  validPinO = "^((?!(0))[0-9]{4,10})$";
  validPhoneO = "^((?!(0))[0-9]{8,15})$";
  showEmail: boolean = false;
  loginbyEmail: boolean = true;
  loginbyNumber: boolean = false;

  // start all var for signup
  public isValidFormSubmitted = null;
  public isSignupValidFormSubmitted = null;
  clearSetTimeout: any;
  pendingRequest: any;
  public loginForm: FormGroup;
  firstNum: any;
  secondNum: any;
  thirdNum: any;
  fourthNum: any;
  fiftNum: any;
  sixthNum: any;

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
    this.loginForm = this.fb.group({
      id: new FormControl('', [Validators.required, CustomValidators.removeSpaces]),
      password: new FormControl('', [Validators.required]),
      keepLogin: new FormControl('')
    });
    this.setOtpForm();
  }

  submitted = false;
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  isAccept: boolean = false;
  isSelected: any;
  isSelect(e) {
    if (e.target.checked) {
      this.isAccept = true;
    } else {
      this.isAccept = false;
      // this.headerDoc='';
    }
  }

  loginByMNumber() {
    this.loginbyEmail = false;
    this.loginbyNumber = true
  }

  loginByEmail() {
    this.loginbyEmail = true;
    this.loginbyNumber = false;
  }

  //-----------------Login start here--------------------//
  response: any;
  resp: any
  login() {
    debugger
    let postData = {
      "id": this.loginForm.value.id,
      "password": this.loginForm.value.password,
      "userType": "DT"
    }
    this.submitted = true;
    if (!this.loginForm.value.id) {
      this.toastr.error('Please enter Email Id');
      return false;
    } else if (!this.loginForm.value.password) {
      this.toastr.error('Please Enter Your Password');
      return false;
    } else {

      clearTimeout(this.clearSetTimeout);
      this.blockUI.start();
      this.pendingRequest = this.data.login(postData).subscribe((data) => {
        clearTimeout(this.clearSetTimeout);

        if (data['statusCode'] == 200) {
          this.resp = data['data'].token;
          sessionStorage.setItem('authtkn', this.resp);
          sessionStorage.setItem('docId', data['data'].docId);
          this.router.navigate(['/dashboard']).then(() => {
            this.blockUI.stop();
            this.toastr.clear();
            this.toastr.success(data['message']);
          })
        } else {
          this.blockUI.stop();
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
      }, 60000);

    }
  }


  /********************New Toaster Messages*****************/
  showErrorToaster(msg) {

    $('#bootAlert').hide();
    $('#bootAlert').removeClass('alert-success').addClass('alert-error').show(function () {
      $('.myclass').html(msg);
    });
  }


  showSuccessMessage(msg) {
    setTimeout(() => {
      $('#bootAlert').hide();
    }, 5000)
    $('#bootAlert').removeClass('alert-error').addClass('alert-success').show(function () {
      $('.myclass').html(msg);
    });
  }


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

  refNo: any;
  VerifyOTP() {
    if (this.addOtpForm.invalid) {
      this.toastr.error('Please Fill OTP');
      return false;
    }
    console.log(this.addOtpForm.value);
  }
  //***************************Verify otp end here**************************************//

  sendotp() {

  }


  ngOnDestroy() {

  }

}
