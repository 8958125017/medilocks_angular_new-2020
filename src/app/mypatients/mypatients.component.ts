import { Component, OnInit, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators } from '../validators';
import { MessageService } from '../messageservice.service';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

declare var $;
@Component({
  selector: 'app-mypatients',
  templateUrl: './mypatients.component.html',
  styleUrls: ['./mypatients.component.css']
})

export class MypatientsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showMessage: boolean = true;
  clickUserToChat: boolean = true;
  acceptedChatList: boolean = false;
  isFavorite: boolean = true;
  docId: any;
  clearSetTimeout: any;
  pendingRequest: any
  searchPatients: any;
  from: any = '';
  relation: any;
  subscription: Subscription;

  doctorSuggestList = [];

  constructor(private render: Renderer2,
    private chatService: SocketioService,
    private data: ApiIntegrationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder, private messageService: MessageService) {
    this.docId = sessionStorage.getItem('docId');
    this.subscription = this.messageService.gettaskboardPatient().subscribe(message => {
      if (message.text != "undefined") {
        this.pat = message.text;
        this.getAllPatients(this.page, this.from);
      }
    });
    $('body').on('keydown', '#removeSpace', function (e) {
      if (e.which === 32 && e.target.selectionStart === 0) {
        return false;
      }
    });
    var today = new Date();
    this.today = moment(today).format('DD-MM-YYYY');

  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (this.showMessage) {
      if (this.allPatients.length >= 10 && event.type == 'scroll') {
        this.page = this.page + 1;
        this.getAllPatients(this.page, event.type)
      }
    } else {
      if (this.allPendingPatients.length >= 4 && event.type == 'scroll') {
        this.page = this.page + 1;
        // this.getPendingUsersOnChat(this.page, event.type)
        this.getAllPendingPatients(this.page, event.type)
      }
    }

  }
  pat: any

  subVar;
  ngOnInit() {

    // this.pendingChat();
    this.createFamilyMemberFormInit();
    if (this.route.snapshot.paramMap.get('id')) {
      this.pat = this.route.snapshot.paramMap.get('id');

    }
    this.getAllPatients(this.page, this.from);
    this.getBloodGroup();
    this.getState();
    this.relation = '';

    this.data.currentMessage.subscribe(message => {
      this.subVar = message
    });

    this.suggestList();

  }

  updateSubjectMethod(newName) {
    this.data.changeMessage(newName)
  }

  showChat() {
    this.showMessage = true;
  }

  clickHere() {

  }

  result: any;
  startChat: boolean = false;
  page: any = 1
  patientId: any;
  searchKey: any;
  pendingChat() {
    this.searchKey = "";
    this.searchPatientKey = "";
    this.showMessage = false;
    this.isFavorite = true;
    this.patientsDtails = [];
    this.page = 1;
    this.from = ''
    // this.getPendingUsersOnChat(this.page, this.from);
    this.getAllPendingPatients(this.page, this.from);
  }

  acceptedChat() {
    this.searchPatientKey = "";
    this.searchKey = "";
    this.isFavorite = false;
    this.showMessage = true;
    this.page = 1;
    this.from = ''
    this.allPendingPatients = [];
    this.getAllPatients(this.page, this.from);
  }

  showUpload: boolean = false;
  showUploadSection() {
    this.showUpload = !this.showUpload;
  }

  ngAfterViewInit() {
    this.result = document.getElementsByClassName("user-list-box")[0];
  }


  selectedItem: boolean = false;
  public activeElement: any;
  getChatmessage(item) {
    this.selectedItem = true;
    this.acceptedChatList = true;
    this.clickUserToChat = false;
    this.patientId = item.patientId;
    this.activeElement = this.patientId;
    this.getPatientsDetails(this.patientId);
    //----------------
    this.chatFile = '';
    this.attachedFile = '';
    this.chatFileName = '';
  }

  endChat() {
    this.acceptedChatList = false;
    this.clickUserToChat = true;
  }


  //-------------------------intregrate search api start here------------------------------------//
  searchPatientKey: any;
  searchresult(event) {

    this.searchPatientKey = event.target.value;

    if (this.searchPatientKey) {
      var page = 1;
      var from = '';
      if (this.showMessage) {
        this.getAllPatients(page, from);
      } else {
        // this.getPendingUsersOnChat(page, from);
        this.getAllPendingPatients(page, from);
      }

    } else {
      var page = 1;
      var from = '';
      if (this.showMessage) {
        this.getAllPatients(page, from);
      } else {
        // this.getPendingUsersOnChat(page, from);
        this.getAllPendingPatients(page, from);
      }
    }

    // if (this.searchPatientKey) {
    //   var page = 1;
    //   var from = '';
    //   this.getAllPatients(page, from);
    //   console.log('searching with search key in if');

    // } else {
    //   var page = 1;
    //   var from = '';
    //   console.log('searching with search key in else');
    //   if (this.showMessage) {
    //     this.getAllPatients(page, from);
    //     console.log('searching with search key in 2nd if');
    //   } else {
    //     this.getPendingUsersOnChat(page, from);
    //     console.log('searching with search key in 2nd else');
    //   }

    // }

  }
  //------------------------intregrate search api end here---------------------------------------//

  //----------------------Get allPatients api api-integration start here----------//

  allPatients: any = [];
  respPatients: any;
  postData: any;
  getAllPatients(page, from) {
    this.postData = {
      "search": this.searchPatientKey,
      "page": page,
      "limit": 10
    }
    this.blockUI.start();
    this.from = from;
    this.pendingRequest = this.data.searchPatient(this.postData).subscribe((data) => {
      clearTimeout(this.clearSetTimeout);
      this.blockUI.stop();

      this.respPatients = data;
      if (this.respPatients.statusCode == 200) {

        if (this.from == 'scroll') {
          this.allPatients = this.allPatients.concat(this.respPatients.data);
        } else {
          this.allPatients = [];
          if (this.respPatients.data.length) {
            this.allPatients = this.respPatients.data
            if (this.pat) {
              this.getPatientsDetails(this.pat);
              this.activeElement = this.pat;
            } else {

              this.patientId = this.allPatients[0].patientId
              this.activeElement = this.patientId
              this.getPatientsDetails(this.patientId);
            }

          }
        }
        // this.toastr.success(resp['message']);  

      } else {
        this.toastr.error(this.respPatients.message);
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

  //----------------------Get allPatients api api-integration end here----------//


  //----------------------Get allPendingPatients api api-integration start here----------//

  allPendingPatients: any = [];
  respPendingPatients: any;
  postDataPending: any;
  getAllPendingPatients(page, from) {

    this.postData = {
      "search": this.searchPatientKey,
      "page": page,
      "limit": 10,
      "allPendingPatients": true
    }
    this.blockUI.start();
    this.from = from;
    this.pendingRequest = this.data.searchPatient(this.postData).subscribe((data) => {
      clearTimeout(this.clearSetTimeout);
      this.blockUI.stop();
      this.respPendingPatients = data;
      if (this.respPendingPatients.statusCode == 200) {
        if (this.from == 'scroll') {
          this.allPendingPatients = this.allPendingPatients.concat(this.respPendingPatients.data);
        } else {
          this.allPendingPatients = [];
          if (this.respPendingPatients.data.length) {
            this.allPendingPatients = this.respPendingPatients.data
            if (this.pat) {
              this.getPatientsDetails(this.pat);
              this.activeElement = this.pat;
            } else {
              this.patientId = this.allPendingPatients[0].patientId
              this.activeElement = this.patientId
              this.getPatientsDetails(this.patientId);
            }
          }
        }
        // this.toastr.success(resp['message']);  
      } else {
        this.toastr.error(this.respPendingPatients.message);
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

  //----------------------Get allPendingPatients api api-integration end here----------//



  //----------------------Get getPendingUsersOnChat api api-integration start here----------//

  // allPendingPatients: any = [];
  // respPendingPatients: any;

  // getPendingUsersOnChat(page, from) {
  //   let postData = {
  //     "page": page,
  //     "limit": 10
  //   }
  //   this.blockUI.start();
  //   this.from = from;

  //   this.pendingRequest = this.data.getPendingUsersOnChat(postData).subscribe((data) => {
  //     clearTimeout(this.clearSetTimeout);
  //     this.blockUI.stop();
  //     console.log('all pending data from api');
  //     console.log(data);



  //     this.respPendingPatients = data;
  //     if (this.respPendingPatients.statusCode == 200) {
  //       if (this.from == 'scroll') {
  //         this.allPendingPatients = this.allPendingPatients.concat(this.respPendingPatients.data);
  //       } else {
  //         this.allPendingPatients = [];
  //         if (this.respPendingPatients.data.length) {

  //           this.allPendingPatients = this.respPendingPatients.data
  //           this.getPatientsDetails(this.allPendingPatients[0].patientId);
  //         }
  //       }
  //       // this.toastr.success(resp['message']);  

  //     } else {
  //       this.toastr.error(this.respPendingPatients.message);
  //     }
  //   }, error => {
  //     this.blockUI.stop();
  //     this.toastr.error('Not able to connect host, please try again');
  //     // this.showErrorToaster('Not able to connect host, please try again');
  //   })
  //   this.clearSetTimeout = setTimeout(() => {
  //     this.pendingRequest.unsubscribe();
  //     this.blockUI.stop();
  //   }, 60000);
  // }

  //------------------------Get getPendingUsersOnChat api api-integration end here----------------//





  message: any = '';
  chatResp: any;
  chatRequest: any;
  chatSetTimeout: any;
  chatFile: any;

  addInput() {
    debugger
    if (this.message == '' && (this.chatFile == undefined || this.chatFile == '')) {
      return false
    } else if (this.message !== '' || this.chatFile !== undefined || this.chatFile !== '') {
      var date = new Date();
      var endDate = moment(date).format('YYYY-MM-DDTHH:mm');
      var ts = Date.parse(endDate) / 1000;
      let postData;
      if (this.chatFile == undefined || this.chatFile == '') {
        postData = {
          "patientId": this.patientId,
          "message": this.message,
          "ts": ts
        }
        this.blockUI.start();
        clearTimeout(this.chatSetTimeout);
        this.chatRequest = this.data.sendChatMessage(postData).subscribe((data) => {
          clearTimeout(this.chatSetTimeout);
          this.blockUI.stop();

          this.message = '';
          this.chatResp = data;
          if (this.chatResp.statusCode == 200) {
            this.getUserChatHistory();
            // this.toastr.success(resp['message']);  
          } else {
            this.getUserChatHistory();
            //this.toastr.error(this.chatResp.message);  
          }
        }, error => {
          this.blockUI.stop();
          this.toastr.error('Not able to connect host, please try again');
          // this.showErrorToaster('Not able to connect host, please try again');
        })
        this.chatSetTimeout = setTimeout(() => {
          this.chatRequest.unsubscribe();
          this.blockUI.stop();
        }, 60000);
      } else {
        //--------------------------------------
        // upload chatFile 
        if (this.chatFilePostData == undefined || this.chatFilePostData == '') {
          this.toastr.error('Please select file to upload');
          return false
        }
        this.data.uploadChatFile(this.chatFilePostData).subscribe((response: any) => {
          if (response.statusCode == 200) {
            postData = {
              "patientId": this.patientId,
              "message": this.message,
              "file": [{
                "fileName": this.chatFileName,
                "fileType": this.chatFileExtension,
                "fileUrl": response.data.url
              }],
              "ts": ts
            }
            //-------------------------------
            this.blockUI.start();
            clearTimeout(this.chatSetTimeout);
            this.chatRequest = this.data.sendChatMessage(postData).subscribe((data) => {
              clearTimeout(this.chatSetTimeout);
              this.blockUI.stop();

              this.message = '';
              this.chatResp = data;
              if (this.chatResp.statusCode == 200) {
                this.getUserChatHistory();
                this.chatFilePostData = '';
                this.chatFile = '';
                this.attachedFile = '';
                this.chatFileName = '';
              } else {
                this.getUserChatHistory();
                // this.toastr.error(this.chatResp.message);
              }
            }, error => {
              this.blockUI.stop();
              this.toastr.error('Not able to connect host, please try again');
              // this.showErrorToaster('Not able to connect host, please try again');
            })
            this.chatSetTimeout = setTimeout(() => {
              this.chatRequest.unsubscribe();
              this.blockUI.stop();
            }, 60000);
            //-------------------------------
          } else if (!response) {
            this.toastr.error('File uploading faild, Please try again');
          } else {
            this.toastr.error('Document not uploaded, ' + response.message)
          }
        }, error => {
          return false
        })
        //--------------------------------------

      }
    }
  }


  //----------------------Get getPendingUsersOnChat api api-integration start here----------//
  chatHistoryList: any = [];
  // chatHistoryList:any=[
  //   {
  //     "from": "DT462A9D6D994D48DB96DFEABB1AAA3135",
  //     "to": "PT629CFF8F2E1C4DA099E3FEE3EDF65420",
  //     "message": "hi ",
  //     "_id": "5f43871d15d8a66066f7b6c4",
  //     "cts": 1598261021593
  //   },
  //   {
  //     "from": "PT629CFF8F2E1C4DA099E3FEE3EDF65420",
  //     "to": "DT462A9D6D994D48DB96DFEABB1AAA3135",
  //     "message": "hello",
  //     "_id": "5f43871d15d8a66066f7b6c4",
  //     "cts": 1598261021593
  //   }, {
  //     "from": "DT462A9D6D994D48DB96DFEABB1AAA3135",
  //     "to": "PT629CFF8F2E1C4DA099E3FEE3EDF65420",
  //     "message": "hello pankaj",
  //     "_id": "5f43871d15d8a66066f7b6c4",
  //     "cts": 1598261021593
  //   } ,{
  //     "from": "PT629CFF8F2E1C4DA099E3FEE3EDF65420",
  //     "to": "DT462A9D6D994D48DB96DFEABB1AAA3135",
  //     "message": "hi ajeet",
  //     "_id": "5f43871d15d8a66066f7b6c4",
  //     "cts": 1598261021593
  //   }
  // ];
  respChatHistory: any;
  pendingChatRequest: any;
  clearChatSetTimeout: any;
  showChatWindow: boolean = false
  getUserChatHistory() {
    let postData = {
      "patientId": this.patientId ? this.patientId : this.pat
    }
    this.blockUI.start();

    clearTimeout(this.clearChatSetTimeout);
    this.pendingChatRequest = this.data.getUserChatHistory(postData).subscribe((data) => {
      //console.log(data);
      clearTimeout(this.clearChatSetTimeout);
      this.blockUI.stop();
      this.respChatHistory = data;
      if (this.respChatHistory.statusCode == 200) {

        this.chatHistoryList = [];

        this.chatHistoryList = this.respChatHistory.data.reverse();;
        if (this.chatHistoryList.length) {
          this.showChatWindow = true;
        } else {
          this.showChatWindow = false;
        }
      } else {
        this.toastr.error(this.respChatHistory.message);
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.clearChatSetTimeout = setTimeout(() => {
      this.pendingChatRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }

  //------------------------Get getPendingUsersOnChat api api-integration end here----------------//



  //-----------------------Get getPatientsDetails api api-integration start here-----------------//
  patientsDtails: any = {};
  patientsResp: any;
  pendingReq: any
  clearTimeouts: any;
  userId: any;
  parentPatientId: any;
  patientsName: any = {};
  getPatientsDetails(id) {
    this.clearMemberForm();
    let postData = {
      "patientId": id
    }
    this.blockUI.start();
    this.pendingReq = this.data.getPatientDetails(postData).subscribe((resp) => {
      clearTimeout(this.clearTimeouts);
      this.blockUI.stop();
      this.patientsResp = resp;
      if (this.patientsResp.statusCode == 200) {
        this.patientsDtails = this.patientsResp.data;
        this.patientsName = this.patientsDtails.name;
        this.userId = this.patientsDtails.userId;
        this.parentPatientId = this.patientsDtails.patientId;

        this.createFamilyMemberForm.patchValue({
          "email": this.patientsDtails.email,
          "mobNum": this.patientsDtails.mobNum
        });
        this.getUserChatHistory();

        this.getChildMember(this.parentPatientId);

        if (this.pat) {
          this.getTaskBoardDetails(this.pat);
          this.getChildMember(this.pat);
        } else {
          this.getTaskBoardDetails(this.patientId);
          this.getChildMember(this.parentPatientId);
        }

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

  //----------------------Get getPatientsDetails api api-integration end here----------//
  //----------------------Start Get Family member---------------------------//


  memberList: any = [];
  memberResp: any;
  pendingMemberReq: any
  clearMemberTimeouts: any;
  parentsName: any;
  isParentMember: boolean = false;
  getChildMember(id) {
    let postData = {
      "patientId": id
    }
    this.blockUI.start();
    // code refactored for getting familyMember (required for 'family details' tab) instead of childMember as per the requirement
    // this.pendingReq = this.data.getChildMember(postData).subscribe((resp) => {
    this.pendingReq = this.data.getFamilyMember(postData).subscribe((resp) => {
      clearTimeout(this.clearTimeouts);
      this.blockUI.stop();
      this.memberResp = resp;
      if (this.memberResp.statusCode == 200) {
        this.isParentMember = true;
        this.memberList = this.memberResp.data;
        if (this.memberList.length >= 0) {
          this.showButton = false;
        } else {
          this.showButton = true;
        }
        //this.parentsName=this.memberList.name.firstName+" "+this.memberList.name.lastName;
        // this.userId=this.patientsDtails.patientId;                          
      } else {
        this.isParentMember = false;
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

  //----------------------End Get Family Member----------------------//
  //------------------- add family member start here-----------------//

  public createFamilyMemberForm: FormGroup;

  get fa() { return this.createFamilyMemberForm.controls; }
  createFamilyMemberFormInit() {
    this.createFamilyMemberForm = this.fb.group({
      fName: ['', [Validators.required, CustomValidators.removeSpaces]],
      lName: ['', [Validators.required, CustomValidators.removeSpaces]],
      mobNum: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), CustomValidators.removeSpaces]],
      email: ['', [Validators.pattern(this.emailPattern), CustomValidators.removeSpaces]],
      relation: ['', [Validators.required, CustomValidators.removeSpaces]],
      address: ['', [CustomValidators.removeSpaces]],
      state: [''],
      city: [''],
      pincode: ['', [Validators.minLength(6), Validators.maxLength(6), CustomValidators.removeSpaces]],
      age: [''],
      dob: [''],
      bloodGroup: [''],
      weight: [''],
      height: [''],
      profilePic: [''],
    })
  }

  addFamilyMember() {

    var date = new Date();
    var curentData = moment(date).format('YYYY-MM-DD');
    this.submitted = true;
    if (!this.userId) {
      this.toastr.error('Please select patient');
      return false;
    }
    if (this.createFamilyMemberForm.value.fName == '') {
      this.toastr.error('Please enter first name');
      return false;
    } else if (this.createFamilyMemberForm.value.lName == '') {
      this.toastr.error('Please enter last name');
      return false;
    }
    else if (this.createFamilyMemberForm.value.mobNo == '') {
      this.toastr.error('Please enter mobile number');
      return false;
    }
    else if (this.createFamilyMemberForm.value.email == '') {
      this.toastr.error('Please enter your Email id');
      return false;
    }
    else if (this.createFamilyMemberForm.value.dob > curentData) {
      this.toastr.error('dob should not be greater then current date');
      return false
    } else {
      let name = {
        "firstName": this.createFamilyMemberForm.value.fName,
        "lastName": this.createFamilyMemberForm.value.lName
      }

      let postData = {
        "name": name,
        "mobNum": this.createFamilyMemberForm.value.mobNum,
        "email": this.createFamilyMemberForm.value.email,
        "address": this.createFamilyMemberForm.value.address,
        "city": this.createFamilyMemberForm.value.city,
        "state": this.createFamilyMemberForm.value.state,
        "pincode": this.createFamilyMemberForm.value.pincode,
        "age": this.getAge(this.createFamilyMemberForm.value.dob),
        "dob": Date.parse(this.createFamilyMemberForm.value.dob) / 1000,//this.createFamilyMemberForm.value.dob,
        "bloodGroup": this.createFamilyMemberForm.value.bloodGroup,
        "height": this.createFamilyMemberForm.value.height,
        // "weight": this.createFamilyMemberForm.value.weight,
        "onBoardType": "D",
        "isParent": false,
        "relation": this.createFamilyMemberForm.value.relation,
        "countryCode": "+91",
        "userId": this.userId,
        "profilePic": this.createFamilyMemberForm.value.profilePic
      }
      this.blockUI.start();
      this.pendingRequest = this.data.addMember(postData).subscribe((data) => {
        clearTimeout(this.clearSetTimeout);
        this.blockUI.stop();

        if (data['statusCode'] == 200) {

          this.getChildMember(this.parentPatientId);
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

  }


  //-----------------------------------Get Child patient details---------------------------------//

  public childPatientsDtails: any;
  childpatientsResp: any;
  childResp: any;
  memberDeatils: any;
  getChieldPatientsDetails(item) {
    this.memberDeatils = item;
    let postData = {
      "patientId": this.memberDeatils.patientId
    }
    this.blockUI.start();
    this.pendingReq = this.data.getPatientDetails(postData).subscribe((resp) => {
      clearTimeout(this.clearTimeouts);
      this.blockUI.stop();
      this.showButton = false;
      this.childResp = resp;
      if (this.childResp.statusCode == "200") {
        this.childPatientsDtails = this.childResp.data;
        var dob = this.childPatientsDtails.dob * 1000
        this.childPatientsDtails.dob = moment(dob).format('YYYY-MM-DD');

        this.getCity(this.childPatientsDtails.state)
        this.createFamilyMemberForm.patchValue({
          fName: this.memberDeatils.name.firstName,
          lName: this.memberDeatils.name.lastName,
          relation: this.memberDeatils.parentRelation,
          address: this.childPatientsDtails.address,
          bloodGroup: this.childPatientsDtails.bloodGroup,
          state: this.childPatientsDtails.state,
          city: this.childPatientsDtails.city,
          dob: this.childPatientsDtails.dob,
          pincode: this.childPatientsDtails.pincode,
          height: this.childPatientsDtails.height,
          weight: this.childPatientsDtails.weight
        });

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

  //----------------------------end get child details-------------------------------------------//
  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  //************************Upload document starts here****************************//

  //************************Upload document starts here****************************//

  defaultUrl: any;

  clearFile() {
    this.createFamilyMemberForm.controls['profilePic'].setValue("");
    return false;
  }
  fileExtension: any;
  submitted: boolean = false;
  fileUpload(event) {
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
        postData.append('module', this.userId);
        postData.append('file', file, file.name);

        this.blockUI.start('Uploading...');
        this.data.uploaddoc(postData).subscribe((response: any) => {
          this.blockUI.stop();

          if (response.statusCode == 200) {
            this.createFamilyMemberForm.controls['profilePic'].setValue(response.data.url);
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

  //-------------------add family member end here-------------------//
  showButton: boolean = false;
  addMoreFamilyMember() {
    this.showButton = true;
    // this.clearMemberForm();

    this.createFamilyMemberForm.patchValue({
      "fName": "",
      "lName": "",
      "address": "",
      "city": "",
      "state": "",
      "pincode": "",
      "age": "",
      "dob": "",//this.createFamilyMemberForm.value.dob,
      "bloodGroup": "",
      "height": "",
      "weight": "",
      "relation": "",
      "countryCode": "+91",
      "profilePic": "https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg"
    });
  }

  clearMemberForm() {
    this.createFamilyMemberForm.patchValue({
      "fName": "",
      "lName": "",
      "email": "",
      "mobNum": "",
      "address": "",
      "city": "",
      "state": "",
      "pincode": "",
      "age": "",
      "dob": "",//this.createFamilyMemberForm.value.dob,
      "bloodGroup": "",
      "height": "",
      "weight": "",
      "relation": "",
      "countryCode": "+91",
      "profilePic": "https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg"
    });
  }

  //------------------intregrate chat api from here---------------------------------//



  //========================end chat pi start here==========================//

  endChatByDoctor() {
    let postData = {
      "patientId": this.patientId
    }
    this.blockUI.start();

    this.pendingReq = this.data.endChatByDoctor(postData).subscribe((resp) => {
      clearTimeout(this.clearTimeouts);
      this.blockUI.stop();

      this.memberResp = resp;
      if (this.memberResp.statusCode == 200) {
        this.toastr.success(resp['message']);
      } else {
        this.isParentMember = false;
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



  //****************************Taskboard api intregrate start here********************************//

  taskBoardList: any = [];

  taskResp: any;
  pendingTaskReq: any
  clearTaskTimeouts: any;
  taskPage: any = 1;
  showAddButton: boolean = true;
  today: any;
  getTaskBoardDetails(id) {
    let postData = {
      "patientId": id,
      "page": 1,
      "limit": 3
    }

    clearTimeout(this.clearTaskTimeouts);
    this.blockUI.start();
    this.pendingTaskReq = this.data.getTaskBoardDetails(postData).subscribe((resp) => {
      clearTimeout(this.clearTaskTimeouts);
      this.blockUI.stop();

      this.taskResp = resp;
      if (this.taskResp.statusCode == 200) {
        // return false                           
        this.taskBoardList = this.taskResp.data;
        if (this.taskBoardList.length) {
          this.showAddButton = false;

        } else {
          var today = new Date();
          this.today = moment(today).format('DD-MM-YYYY');
          this.showAddButton = true;
        }
      } else {
        this.toastr.error(resp['message']);
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })
    this.clearTaskTimeouts = setTimeout(() => {
      this.pendingTaskReq.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }


  //-------------------------- Start : Chat File upload --------------------------
  chatFileName: any;
  chatFileExtension: any;
  chatFilePostData: any;
  attachedFile: any;

  clearChatFile() {
    this.chatFilePostData = '';
    return false;
  }

  selectChatFile(event) {
    let file = event.target.files[0];
    this.attachedFile = event.target.files[0];
    let allowedExtensions = ["jpg", "jpeg", "png", "JPEG", "JPG", "PNG", "pdf", "PDF"];
    if (!file) {
      this.clearChatFile();
    } else {
      let index = file.name.lastIndexOf('.');
      this.chatFileExtension = file.name.substr(index + 1);
      this.toastr.clear();
      if (['JPEG', 'jpeg', 'JPG', 'jpg', 'PNG', 'png'].includes(this.chatFileExtension) && file.size > 2099999) {
        this.toastr.error('Please upload .jpg, .jpeg, or .png file size up to 2 MB');
        this.clearChatFile();
      } else if (['pdf', 'PDF'].includes(this.chatFileExtension) && file.size > 2099999) {
        this.toastr.error('Please upload .pdf file size up to 2 MB');
        this.clearChatFile();
      } else if (!this.isInArray(allowedExtensions, this.chatFileExtension)) {
        this.toastr.error('Please upload .pdf, .png, .jpg, .jpeg, format only');
        this.clearChatFile();
      } else {
        this.chatFilePostData = new FormData;
        this.chatFilePostData.append('chatFile', file, file.name);
        this.chatFileName = file.name;
      }
    }
  }

  //-------------------------- End : Chat File upload --------------------------


  //-------------------------- Start : Remove File attachment --------------------------

  removeChatFile() {
    this.chatFile = '';
    this.attachedFile = '';
    this.chatFileName = '';
    this.chatFileExtension = '';
    this.chatFilePostData = '';
  }

  //-------------------------- End : Remove File attachment --------------------------


  //***************************Taskboard api integration end here**********************************//

  getBloodResp: any;
  bloodPendingRequest: any;
  getBloodTimeout: any;
  bloodGroupList: any = [];
  getBloodGroup() {
    let postData = {

    }
    this.blockUI.start();
    this.bloodPendingRequest = this.data.getBloodGroup(postData).subscribe((data) => {
      clearTimeout(this.getBloodTimeout);
      this.blockUI.stop();

      this.getBloodResp = data;
      if (this.getBloodResp.statusCode === "200") {
        this.bloodGroupList = this.getBloodResp.data;
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.getBloodTimeout = setTimeout(() => {
      this.bloodPendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);

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


  //***********************Get City api intregration start here***********************//


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


  openImageDoc(item) {

    window.open(item.url, "_blank");
  }

  //***********************Get updateVisitTimeSlot api intregration start here***********************//
  visitTimeSlotRequest: any;
  getVisitTimeSlotResp: any;
  visitSlotTimeout: any;
  visitSlotStatus: any;

  updateVisitTimeSlot(visitId: any, status: string) {
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
        //console.log(this.visitSlotStatus);
        if (this.pat) {
          this.getTaskBoardDetails(this.pat);
        } else {
          this.getTaskBoardDetails(this.patientId);
        }
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


  //********************************Change patients status api intregration start here************************//
  requestResp: any;
  changeRequestStatus(patientId: any, status: string) {
    //console.log(visitId, status)
    let postData = { "patientId": patientId, "sts": status }
    this.blockUI.start();
    clearTimeout(this.visitSlotTimeout);
    this.visitTimeSlotRequest = this.data.changeRequestStatus(postData).subscribe(data => {
      console.log(data);
      clearTimeout(this.visitSlotTimeout);
      this.blockUI.stop();
      this.requestResp = data;
      //console.log(this.getVisitTimeSlotResp);
      if (this.requestResp.statusCode === "200") {
        this.toastr.success(this.requestResp.message);
        this.getAllPatients('1', '');
      } else if (this.requestResp.statusCode === "400") {
        this.toastr.error(this.requestResp.message);
      } else if (this.requestResp.statusCode === "500") {
        this.toastr.error(this.requestResp.message);
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

  //********************************Change patients status api intregration end here************************//


  suggestList() {
    //let docNames = ['Jacob', 'Isabella', 'Ethan'];
    let docNames = [
      { 'name': 'Jacob', 'userName': 'jacob@123' },
      { 'name': 'Isabella', 'userName': 'isabella@123' },
      { 'name': 'Ethan', 'userName': 'ethan@123' }
    ];

    let docNamesList = $.map(docNames, function (value, i) {
      return { 'id': i, 'name': value.name, 'userName': value.userName };
      //console.log(value.name, value.email)
    });

    var at_config = {
      at: "@",
      data: docNamesList,
      //headerTpl: '<div class="atwho-header">Member List<small>↑&nbsp;↓&nbsp;</small></div>',
      insertTpl: '${atwho-at}${name}',
      displayTpl: "<li class='chat-list'><img src='assets/img/defaultPic.png'><div class='chat-name'>${name}<span>${userName}</span></div></li>",
      limit: 200
    }

    $('#inputor').atwho(at_config);

  }


}
