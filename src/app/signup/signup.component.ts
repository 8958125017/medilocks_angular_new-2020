import { Component, OnInit, Directive, HostListener, ViewChildren } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators, MustMatch } from '../validators';


declare var $;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  @Directive({
    selector: '[appAlphabetOnly]'
  })
  key;
  // @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
  //   this.key = event.keyCode;
  //   console.log(this.key);
  //   if ((this.key >= 15 && this.key <= 64) || (this.key >= 123) || (this.key >= 96 && this.key <= 105)) {
  //     event.preventDefault();
  //   }
  // }

  @BlockUI() blockUI: NgBlockUI;
  public emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public userNamePattern = /^[a-zA-Z0-9]*$/;
  showEmail: boolean = false;
  submitted: boolean = false;
  sendOtpstatus: boolean = true;
  clearSetTimeout: any;
  pendingRequest: any;
  signUpForm: FormGroup;

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
    this.forSignupInit();
    this.setOtpForm();
  }

  //------------------Initilize sign up form start here------------------//
  forSignupInit() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, CustomValidators.removeSpaces]],
      lastName: ['', [Validators.required, CustomValidators.removeSpaces]],
      userName: ['', [Validators.required, Validators.pattern(this.userNamePattern), CustomValidators.removeSpaces]],
      mobNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), CustomValidators.removeSpaces]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern), CustomValidators.removeSpaces]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  //------------------Initilize sign up form end here-----------------//

  // convenience getter for easy access to form fields
  get f() { return this.signUpForm.controls; }

  //------------------signup start here-----------------------------//
  refNo: any;
  submit(item: any) {
    this.submitted = true;
    if (this.signUpForm.value.firstName == '') {
      this.toastr.error('Please enter name');
      return false;
    } else if (this.signUpForm.value.lastName == '') {
      this.toastr.error('Please enter last name');
      return false;
    } else if (this.signUpForm.value.userName == '') {
      this.toastr.error('Please enter user name');
      return false;
    }
    else if (this.signUpForm.value.mobNo == '') {
      this.toastr.error('Please enter mobile number');
      return false;
    }
    else if (this.signUpForm.value.email == '') {
      this.toastr.error('Please enter your Email id');
      return false;
    }
    else if (this.signUpForm.value.password == '') {
      this.toastr.error('Please enter password');
      return false;
    }
    else if (this.signUpForm.value.confirmPassword == '') {
      this.toastr.error('Please enter confirmPassword');
      return false;
    } else if (this.signUpForm.value.password != this.signUpForm.value.confirmPassword) {
      this.toastr.error('Confirm Password do not match');
      return false;
    } else if (!this.isAccept) {
      this.toastr.error('Please select i agree to the terms and conditions');
      return false
    } else if (this.signUpForm.valid) {
      if (item) {
        $('#exampleModalCenter').modal('toggle');
        this.sendotp();
      } else {
        this.signup();
      }
    }
  }

  sendotp() {
    let postData = {
      "mobNo": "+91" + this.signUpForm.value.mobNo,
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
        "mobNo": "+91" + this.signUpForm.value.mobNo,
        "otp": otp,
        "refNo": this.refNo
      }      

      this.blockUI.start();
      this.pendingRequest = this.data.verifyOTP(postData).subscribe((data) => {
        clearTimeout(this.clearSetTimeout);
        this.blockUI.stop();
        this.resetOtp();
        //this.refNo = "";
        if (data['statusCode'] == 200) {
          $('#exampleModalCenter').modal('hide');
          this.sendOtpstatus = false;
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

//***************************Verify otp end here**************************************//


  signup() {
    let postData = {
      "firstName": this.signUpForm.value.firstName,
      "lastName": this.signUpForm.value.lastName,
      "userName": this.signUpForm.value.userName,
      "mobNo": "+91" + this.signUpForm.value.mobNo,
      "email": this.signUpForm.value.email,
      "password": this.signUpForm.value.password,
      "refNo": this.refNo
    }
    this.blockUI.start();
    this.pendingRequest = this.data.signup(postData).subscribe((data) => {
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
    }, 60000);
  }

  //=============================use for Terms and condition==========================//
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


  ngOnDestroy() {

  }


}
