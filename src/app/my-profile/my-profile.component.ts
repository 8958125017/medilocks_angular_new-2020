import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormArray, Form } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
import { GlobalConstant } from '../globalconstant';
import * as moment from 'moment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  myProfileForm: FormGroup;
  specialization: FormArray;
  degree: FormArray;
  experience: FormArray;
  achievement: FormArray;
  public isValidFormSubmitted = null;
  public noWhitespace = /^\S[\w\d]* ?[\w\d\S]*/
  public emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public regex = /^[a-zA-Z ]*$/;
  // removeAddSection:boolean=false;

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
  slot: any;

  @ViewChild('file') elFile: ElementRef;

  fileToUpload = [];

  constructor(private data: ApiIntegrationService,
    private toastr: ToastrService,
    private router: Router,
    public constants: GlobalConstant,
    private fb: FormBuilder
  ) {
    this.docId = sessionStorage.getItem('docId');

  }

  ngOnInit() {
    this.state = '';
    this.city = '';
    this.slotDuration = '';
    this.myProfileFormInit();
    this.getDoctorDetails();
    this.getSchedule();
    this.getState();
    // this.searchSpecialization();

  }

  myProfileFormInit() {
    this.myProfileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(this.regex), CustomValidators.removeSpaces]],
      lastName: ['', [Validators.required, Validators.pattern(this.regex), CustomValidators.removeSpaces]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern), CustomValidators.removeSpaces]],
      mobNumber: ['', [Validators.required, CustomValidators.removeSpaces]],
      gender: new FormControl(''),
      address: ['', [Validators.required, CustomValidators.removeSpaces]],
      state: new FormControl(''),
      city: new FormControl(''),
      profilePic: new FormControl(''),
      signature: new FormControl(''),
      pincode: new FormControl(''),
      openTime: new FormControl(''),
      closeTime: new FormControl(''),
      slot: new FormControl(''),
      recepMobNo: ['', [Validators.required, CustomValidators.removeSpaces]],
      from: ['', [CustomValidators.removeSpaces]],
      to: ['', [CustomValidators.removeSpaces]],
      description: ['', [CustomValidators.removeSpaces]],
      specialization: this.fb.array([this.specializationItem()], [Validators.required]),
      degree: this.fb.array([this.degreecreateItem()], [Validators.required]),
      experience: this.fb.array([this.experiencecreateItem()], [Validators.required]),
      achievement: this.fb.array([this.achievementsItem()], [Validators.required])
    })
  }

  get f() { return this.myProfileForm.controls; }
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
  breakTime: any;
  breakTime1: any;
  breakTime2: any;
  slotDuration: any;
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

        this.myProfileForm.patchValue({
          slot: this.scheduleDetails.slot
        })
        this.sun = this.getsplitvalueByFourDigit(this.scheduleDetails.sun);
        this.mon = this.getsplitvalueByFourDigit(this.scheduleDetails.mon);
        this.tue = this.getsplitvalueByFourDigit(this.scheduleDetails.tue);
        this.wed = this.getsplitvalueByFourDigit(this.scheduleDetails.wed);
        this.thu = this.getsplitvalueByFourDigit(this.scheduleDetails.thu);
        this.fri = this.getsplitvalueByFourDigit(this.scheduleDetails.fri);
        this.sat = this.getsplitvalueByFourDigit(this.scheduleDetails.sat);
        this.breakTime = this.getsplitvalueByFourDigit(this.scheduleDetails.breakTime);

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

        var output15 = this.getsplitvalue(this.breakTime[0]);
        var output16 = this.getsplitvalue(this.breakTime[1]);
        this.breakTime1 = output15[0] + ":" + output15[1];
        this.breakTime2 = output16[0] + ":" + output16[1];

        // this.breakTime1 = output7[2] + ":" + output7[3];
        // this.breakTime2 = output8[0] + ":" + output8[1];

      }
      else {
        //  alert("this.respSchedule.message"+this.respSchedule.message);           
        this.toastr.error(this.respSchedule.message);
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

  // -------------------manageSchedule time api start here--------------------//

  pendingSchRequest: any;
  clearSchSetTimeout: any;
  respSche: any

  updateSchedual() {
    let date = new Date();
    let YYYY_MM = `${moment().format('YYYY-MM')}`
    let breakTime = {
      "from": `${moment().format('YYYY-MM-DD')} ${this.breakTime1}:00`,
      "to": `${moment().format('YYYY-MM-DD')} ${this.breakTime2}:00`
    }

    let days = {
      "sun": {
        "from": `${this.setSunTime1}:00`,
        "to": `${this.setSunTime2}:00`
      },
      "mon": {
        "from": `${this.setMonTime1}:00`,
        "to": `${this.setMonTime2}:00`
      },
      "tue": {
        "from": `${this.setTueTime1}:00`,
        "to": `${this.setTueTime2}:00`
      },
      "wed": {
        "from": `${this.setWedTime1}:00`,
        "to": `${this.setWedTime2}:00`
      },
      "thu": {
        "from": `${this.setThuTime1}:00`,
        "to": `${this.setThuTime2}:00`
      },
      "fri": {
        "from": `${this.setFriTime1}:00`,
        "to": `${this.setFriTime2}:00`
      },
      "sat": {
        "from": `${this.setSatTime1}:00`,
        "to": `${this.setSunTime2}:00`
      },
    }

    // for each day of days, include manipulated date (as required in API) in value of 'from' and 'to' key
    Object.entries(days).forEach((day, index) => {
      let dayDiff = index - date.getDay();  // returns '-ve' or '+ve' value
      let dateDiff = date.getDate() + dayDiff
      let dayDate = `${YYYY_MM}-${dateDiff < 10 ? ('0' + dateDiff) : dateDiff}`
      day[1].from = `${dayDate} ${day[1].from}`
      day[1].to = `${dayDate} ${day[1].to}`
    })

    let postData = {
      "slot": this.myProfileForm.value.slot ? this.myProfileForm.value.slot : 30,
      "breakTime": breakTime,
      "days": days
    }

    this.blockUI.start();
    this.pendingSchRequest = this.data.manageSchedule(postData).subscribe((data) => {
      clearTimeout(this.clearSchSetTimeout);
      this.blockUI.stop();
      this.respSche = data;
      if (this.respSche.statusCode == 200) {
        this.toastr.success(this.respSche.message);
        this.getSchedule();
      } else {
        this.toastr.error(this.respSche.message);
      }
    }, error => {
      this.toastr.error('Not able to connect host, please try again');
    })
    this.clearSchSetTimeout = setTimeout(() => {
      this.pendingRequest.unsubscribe();
    }, 60000);
  }

  // -------------------manageSchedule time api end here--------------------//

  lat: any;
  lng: any;
  zoom: any;
  location: any
  latLang: any;
  getUserLocation() {
    // get Users current position

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.latLang = this.lat + "," + this.lng
        this.location = {
          "longitude": this.lat,
          "latitude": this.lng
        }
        this.zoom = 16;
        console.log("position", position)
      });
    }
  }

  updateEmail() {
    let postData = {
      "email": this.myProfileForm.value.email
    }

    this.pendingRequest = this.data.updateEmail(postData).subscribe((data) => {
      clearTimeout(this.clearSetTimeout);
      this.response = data;

      if (this.response.statusCode == 200) {
        this.toastr.success(this.response.message);
      } else {
        this.toastr.error(this.response.message);
      }
    }, error => {
      this.toastr.error('Not able to connect host, please try again');
    })
    this.clearSetTimeout = setTimeout(() => {
      this.pendingRequest.unsubscribe();
    }, 60000);
  }

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
        this.doctSpecialization = this.doctorDeatils.specialization;
        this.doctDegree = this.doctorDeatils.degree;
        this.docAchivment = this.doctorDeatils.achievement;
        this.doctWorkExperience = this.doctorDeatils.experience;
        this.latLang = this.doctorDeatils.location.longitude + "," + this.doctorDeatils.location.latitude;
        this.getCity(this.doctorDeatils.state);

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

        this.doctorDeatils.closeTime = this.doctorDeatils.closeTime.toString();
        this.searchSpecialization()
        this.myProfileForm.patchValue({
          firstName: this.doctorDeatils.name.firstName,
          lastName: this.doctorDeatils.name.lastName,
          gender: this.doctorDeatils.gender,
          mobNumber: this.doctorDeatils.mobNumber,
          email: this.doctorDeatils.email,
          address: this.doctorDeatils.address,
          state: this.doctorDeatils.state,
          city: this.doctorDeatils.city,
          openTime: this.doctorDeatils.openTime.match(/.{1,2}/g).join(':'),
          closeTime: this.doctorDeatils.closeTime.match(/.{1,2}/g).join(':'),
          pincode: this.doctorDeatils.pincode,
          description: this.doctorDeatils.description,
          recepMobNo: this.doctorDeatils.recepMobNo,
          specialization: this.fb.array([this.patchspecializationList()]),
          degree: this.fb.array([this.patchdegreeList()]),
          experience: this.fb.array([this.patchexperiencList()]),
          achievement: this.fb.array([this.patchachievementList()]),
        });
        //this.setValue(this.doctSpecialization);
      } else {
        this.toastr.error(this.response.message);
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



  // this method patches FormArray
  patchspecializationList() {
    (this.myProfileForm.get('specialization') as FormArray).removeAt(0);
    this.specialization = this.myProfileForm.get('specialization') as FormArray;
    this.doctSpecialization.forEach(item => {
      this.specialization.push(this.fb.group({
        specialization: item.specialization,
        regNumber: item.regNumber,
        regCouncil: item.regCouncil,
        regYear: item.regYear,
        doc: item.doc
      }));
    });
  }

  specializationItem() {
    return this.fb.group({
      specialization: ['', [Validators.required, CustomValidators.removeSpaces]],
      regNumber: ['', [Validators.required, CustomValidators.removeSpaces]],
      regCouncil: ['', [Validators.required, CustomValidators.removeSpaces]],
      regYear: ['', [Validators.required, CustomValidators.removeSpaces]],
      doc: "https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg",
    })
  }

  patchdegreeList() {

    (this.myProfileForm.get('degree') as FormArray).removeAt(0);
    this.degree = this.myProfileForm.get('degree') as FormArray;
    this.doctDegree.forEach(item => {
      this.degree.push(this.fb.group({
        degreeType: item.degreeType,
        degree: item.degree,
        college: item.college,
        year: item.year,
        doc: item.doc
      }));
    });

  }

  degreecreateItem() {
    return this.fb.group({
      degreeType: ['', [Validators.required, CustomValidators.removeSpaces]],
      degree: ['', [Validators.required, CustomValidators.removeSpaces]],
      college: ['', [CustomValidators.removeSpaces, Validators.required]],
      year: ['', [Validators.required, CustomValidators.removeSpaces]],
      doc: "https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg",
    })
  }



  patchexperiencList() {
    (this.myProfileForm.get('experience') as FormArray).removeAt(0);
    this.experience = this.myProfileForm.get('experience') as FormArray;
    this.doctWorkExperience.forEach(item => {
      this.experience.push(this.fb.group({
        institutionName: item.institutionName,
        from: item.from,
        to: item.to,
        designation: item.designation,
        department: item.department,
      }));
    });
  }

  experiencecreateItem() {
    return this.fb.group({
      institutionName: ['', [CustomValidators.removeSpaces, Validators.required]],
      from: ['', [CustomValidators.removeSpaces, Validators.required]],
      to: ['', [CustomValidators.removeSpaces, Validators.required]],
      designation: ['', [CustomValidators.removeSpaces, Validators.required]],
      department: ['', [CustomValidators.removeSpaces, Validators.required]]
    })
  }


  patchachievementList() {
    (this.myProfileForm.get('achievement') as FormArray).removeAt(0);
    this.achievement = this.myProfileForm.get('achievement') as FormArray;
    this.docAchivment.forEach(item => {
      this.achievement.push(this.fb.group({
        title: item.title,
        year: item.year,
      }));
    });

  }

  achievementsItem() {
    return this.fb.group({
      title: ['', [CustomValidators.removeSpaces, Validators.required]],
      year: ['', [CustomValidators.removeSpaces, Validators.required]]
    })
  }

  addItem(value) {
    if (value == "specialization") {
      this.specialization = this.myProfileForm.get('specialization') as FormArray;
      this.specialization.push(this.specializationItem());
      // console.log(this.register);
    }

    else if (value == "degree") {
      this.degree = this.myProfileForm.get('degree') as FormArray;
      this.degree.push(this.degreecreateItem());
    }

    else if (value == "experience") {
      this.experience = this.myProfileForm.get('experience') as FormArray;
      this.experience.push(this.experiencecreateItem());
    }

    else if (value == "achievements") {

      this.achievement = this.myProfileForm.get('achievement') as FormArray;
      this.achievement.push(this.achievementsItem());
    }
  }

  removeSection(index, value) {
    ;
    if (value == 'specialization') {
      (this.myProfileForm.get('specialization') as FormArray).removeAt(index);
    }

    else if (value == "degree") {
      (this.myProfileForm.get('degree') as FormArray).removeAt(index);
    }

    else if (value == "exp") {
      (this.myProfileForm.get('experience') as FormArray).removeAt(index);
    }

    else if (value == "achv") {
      (this.myProfileForm.get('achievement') as FormArray).removeAt(index);
    }

    else if (value == "achv") {
      (this.myProfileForm.get('achievement') as FormArray).removeAt(index);
    }

  }

  openTime: any;
  closeTime: any;
  resp: any
  onSubmit() {
    debugger
    console.log(this.myProfileForm.value);
    this.isValidFormSubmitted = false;
    this.submitted = true
    if (!this.myProfileForm.value.firstName) {
      this.toastr.error('Please enter first name');
      return false;
    } else if (!this.myProfileForm.value.lastName) {
      this.toastr.error('Please enter last name');
      return false;
    } else if (!this.myProfileForm.value.mobNumber) {
      this.toastr.error('Please enter mobile number');
      return false;
    } else if (!this.myProfileForm.valid) {
      this.toastr.error('Invalid field');
      return false;
    } else {
      this.isValidFormSubmitted = true;
      var open = this.myProfileForm.value.openTime.replace(/(^:)|(:$)/g, '').split(":");
      this.openTime = open[0] + "" + open[1];
      var close = this.myProfileForm.value.closeTime.replace(/(^:)|(:$)/g, '').split(":");
      this.closeTime = close[0] + "" + close[1];
      let postData = {
        "name": {
          "firstName": this.myProfileForm.value.firstName,
          "lastName": this.myProfileForm.value.lastName,
        },
        "gender": this.myProfileForm.value.gender,
        "openTime": +this.openTime,
        "closeTime": +this.closeTime,
        "location": this.location,
        "address": this.myProfileForm.value.address,
        "city": this.myProfileForm.value.city,
        "state": this.myProfileForm.value.state,
        "pincode": this.myProfileForm.value.pincode,
        "recepMobNo": this.myProfileForm.value.recepMobNo,
        "description": this.myProfileForm.value.description,
        "specialization": this.myProfileForm.value.specialization,
        "degree": this.myProfileForm.value.degree,
        "experience": this.myProfileForm.value.experience,
        "achievement": this.myProfileForm.value.achievement,
        "signature": "https://i.ibb.co/p2dq0bC/download.png",
        "profilePic": "https://i.ibb.co/Ks9rk5X/pexels-photo-1484810.jpg"
      }


      this.blockUI.start();
      this.pendingRequest = this.data.updateProfile(postData).subscribe((data) => {
        clearTimeout(this.clearSetTimeout);

        this.blockUI.stop();
        if (data['statusCode'] == 200) {
          this.toastr.success(data['message']);
          this.router.navigate(['/userProfile'])
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
        this.blockUI.stop();
        this.pendingRequest.unsubscribe();

      }, 60000);
    }

  }


  //************************Upload document starts here****************************//


  clearFile() {
    if (this.imageFor == "profileImg") {
      this.myProfileForm.controls['profilePic'].setValue("");
      return false;
    } else {
      this.myProfileForm.controls['signature'].setValue("");
      return false;
    }

  }

  fileExtension: any;
  imageFor: any;
  submitted: boolean = false;
  fileUpload(event, image) {
    this.imageFor = image;
    let file = event.target.files[0];
    var allowedExtensions = ["jpg", "jpeg", "png", "JPEG", "JPG", "PNG", "pdf", "PDF"];
    if (!file) {
      this.clearFile();
    } else {
      let index = file.name.lastIndexOf('.');
      this.fileExtension = file.name.substr(index + 1);
      this.toastr.clear();
      if (['JPEG', 'jpeg', 'JPG', 'jpg', 'PNG', 'png'].includes(this.fileExtension) && file.size > 2099999) {
        this.toastr.error('Please upload .jpg, .jpeg, or .png file size up to 2 MB');
        this.clearFile();
      } else if (['pdf', 'PDF'].includes(this.fileExtension) && file.size > 2099999) {
        this.toastr.error('Please upload .pdf file size up to 2 MB');
        this.clearFile();
      } else if (!this.isInArray(allowedExtensions, this.fileExtension)) {
        this.toastr.error('Please upload .pdf, .png, .jpg, .jpeg, format only');
        this.clearFile();
      } else {
        var postData = new FormData;
        postData.append('module', this.docId);
        postData.append('file', file, file.name);
        this.blockUI.start('Uploading...');
        this.data.uploaddoc(postData).subscribe((response: any) => {
          this.blockUI.stop();
          if (response.statusCode == 200) {

            if (this.imageFor == "profileImg") {
              this.myProfileForm.controls['profilePic'].setValue(response.data.url);
            } else {
              this.myProfileForm.controls['signature'].setValue(response.data.url);
            }

          } else if (!response) {
            this.toastr.error('File uploading faild, Please try again');
          } else {
            this.toastr.error('Document not uploaded, ' + response.message)
          }
        }, error => {
          this.clearFile();
        })
      }
    }
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }



  //***********************Get State api intregration start here***********************//
  statePendingRequest: any;
  getStateResp: any;
  stateTimeout: any
  state: any;
  stateList: any = [];
  getState() {
    let postData = {

    }
    this.blockUI.start();
    this.statePendingRequest = this.data.getState(postData).subscribe((data) => {
      clearTimeout(this.stateTimeout);
      this.blockUI.stop();

      this.getStateResp = data;
      if (this.getStateResp.statusCode === "200") {
        this.stateList = [];
        this.stateList = this.getStateResp.data;
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.stateTimeout = setTimeout(() => {
      this.statePendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }

  //***********************Get State api intregration end here************************//


  //***********************Get State api intregration start here***********************//
  cityPendingRequest: any;
  getCityResp: any;
  city: any;
  cityTimeout: any
  cityList: any = [];
  getCity(state) {
    let postData = {
      "state": state
    }

    this.blockUI.start();
    this.cityPendingRequest = this.data.getCity(postData).subscribe((data) => {
      clearTimeout(this.cityTimeout);
      this.blockUI.stop();
      this.getCityResp = data;
      if (this.getCityResp.statusCode === "200") {
        this.cityList = [];
        this.cityList = this.getCityResp.data;
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.cityTimeout = setTimeout(() => {
      this.cityPendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }

  //***********************Get City api intregration start here***********************//


  //**---------------------search Specialization api intregration start here*******************//


  searchPendingRequest: any;
  searchSpeResp: any;
  searchKey: any;
  searchTimeout: any
  searchList: any = [];
  searchSpecialization() {
    let postData = {
      "keyword": this.searchKey
    }
    // this.blockUI.start();              
    this.searchPendingRequest = this.data.searchSpecialization(postData).subscribe((data) => {
      clearTimeout(this.searchTimeout);
      // this.blockUI.stop(); 
      this.searchSpeResp = data;
      if (this.searchSpeResp.statusCode === "200") {
        this.searchList = [];
        this.searchList = this.searchSpeResp.data;
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.searchTimeout = setTimeout(() => {
      this.searchPendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);

  }

  //***********************Get State api intregration end here************************//

  myUploadPic;
  // picSplitName = [];
  picSplitNameForSpecilization = [];
  picSplitNameForDegree = [];
  uploadProofFn(event, i, uploadFor) {
    //console.log(event,i);
    //console.log(event.target.files[0].name);

    if (event.length === 0) {
      return;
    }

    let type = event.target.files[0].type;
    let fileName = event.target.files[0].name;
    let file = event.target.files[0];

    let patt = /^[a-z0-9_()\-\[\]]+\.pdf$/i;

    if (type.match(/image\/*/) == null && fileName.search(patt) < 0) {
      this.toastr.error('Please upload .pdf, .png, .jpg, .jpeg, format only');
      this.elFile.nativeElement.value = '';
      return;
    }

    this.fileToUpload[i] = event.target.files[0];
    //console.log(this.fileToUpload[i]);

    var postData = new FormData();
    postData.append('module', this.docId);
    postData.append('file', this.fileToUpload[i], this.fileToUpload[i].name);

    this.data.uploaddoc(postData).subscribe(res => {
      this.myUploadPic = res['data'];
      // this.picSplitName.push(this.myUploadPic.url.split('-')[1]);
      if (uploadFor == 'spec') {
        this.picSplitNameForSpecilization.push(this.myUploadPic.url.split('-')[1]);
      } else if (uploadFor == 'deg') {
        this.picSplitNameForDegree.push(this.myUploadPic.url.split('-')[1]);
      }
      // console.log(this.picSplitName);
    })

  }

  myArray = ['satish', 'sahil', 'aryan'];


  // getDegree function start by ajeet

  degreeType:any;
  findDegreeName:any;
  degreeName:boolean = false ;
  getDegreeType(event){
    debugger
   this.findDegreeName = event.target.value;

   if(this.findDegreeName == 'Other'){
     this.degreeName = true;
   }
   else{
    this.degreeName = false;
   }

  }




}

