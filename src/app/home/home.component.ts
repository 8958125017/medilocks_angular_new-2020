import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiIntegrationService } from '../api-integration.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService } from '../messageservice.service';
import * as moment from 'moment';
import { Router } from '@angular/router';


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

	@BlockUI() blockUI: NgBlockUI;
	teamForm: FormGroup;
	isValidFormSubmitted = null;
	landingPage: boolean = true;
	searchPage: boolean = false;
	allSkills: Observable<any[]>;

	constructor(
		private formBuilder: FormBuilder,
		private data: ApiIntegrationService,
		private toastr: ToastrService,
		private router: Router,
	) {
	}

	createVisitForm = new FormGroup({
		firstName: new FormControl('', [Validators.required]),
		lastName: new FormControl('', [Validators.required]),
		mobNum: new FormControl('', [Validators.required]),
		illness: new FormControl('', [Validators.required]),
		userOtp: new FormControl('', [Validators.required]),
	});

	ngOnInit() {
		// this.allSkills = this.teamMngService.getSkills();
		this.teamForm = this.formBuilder.group({
			teamName: ['', Validators.required],
			employees: this.formBuilder.array(
				[this.createEmpFormGroup()],
				[Validators.required])
		});
	}

	getsplitvalue(value) {
		var result = value.toString().match(/(\d{2})(?=(\d{2})+(?!\d)|$)/g);
		return result
	}

	createEmpFormGroup() {
		return this.formBuilder.group({
			empName: ['', [Validators.required]],
			age: ['', [Validators.required, Validators.min(21)]],
			skill: ['', [Validators.required]],
		})
	}
	get teamName() {
		return this.teamForm.get('teamName');
	}
	get employees(): FormArray {
		return this.teamForm.get('employees') as FormArray;
	}
	addEmployee() {
		let fg = this.createEmpFormGroup();
		this.employees.push(fg);
	}
	deleteEmployee(idx: number) {
		this.employees.removeAt(idx);
	}
	onFormSubmit() {
		this.isValidFormSubmitted = false;
		if (this.teamForm.invalid) {
			return;
		}
		this.isValidFormSubmitted = true;
		// let team: Team = this.teamForm.value;
		// this.teamMngService.saveTeam(team);
		this.teamForm.reset();
	}
	resetTeamForm() {
		this.teamForm.reset();
	}

	//------------------------------------------
	// searchKey(){
	// 	this.landingPage = false;
	// 	this.searchPage = true;
	// }
	//------------------------------------------


	//----------------------Get allDoctors api integration start here----------//
	searchItem: any = '';
	pendingRequest: any;
	allDoctors: any = [];
	respDoctors: any;
	postData: any;
	searchPageNo: any = 1;
	clearSetTimeout: any;

	searchKey() {
		this.landingPage = false;
		this.searchPage = true;
		this.postData = {
			"keyword": this.searchItem,
			"page": this.searchPageNo,
			"limit": 10
		}
		this.blockUI.start();
		this.pendingRequest = this.data.doctorSearchHome(this.postData).subscribe((data) => {
			clearTimeout(this.clearSetTimeout);
			this.blockUI.stop();
			this.respDoctors = data;
			if (this.respDoctors.statusCode == 200) {
				this.allDoctors = [];
				if (this.respDoctors.data.length) {
					this.allDoctors = this.respDoctors.data;
				}
			} else {
				this.toastr.error(this.respDoctors.message);
			}
		}, error => {
			this.blockUI.stop();
			this.toastr.error('Not able to connect host, please try again');
		})
		this.clearSetTimeout = setTimeout(() => {
			this.pendingRequest.unsubscribe();
			this.blockUI.stop();
		}, 1000);
	}
	//----------------------Get allDoctors api integration end here----------//

	//----------------------Get getAvailableSlot api integration start here----------//
	respAvailableSLots: any;
	docId: string;
	availableSlots: any;
	availableSlotsDocId: any;
	doctorIndex: any;
	selectedBookDate: any;
	selectedBookSlot: any = '';
	selectedBookSlotFormatted: any;
	aptSlot: any;

	getAvailableSlot(docId, i, bookDateVal) {
		debugger
		this.selectedBookSlot = '';
		this.selectedBookSlotFormatted = ''
		this.selectedBookDate = bookDateVal;
		this.doctorIndex = i
		this.docId = docId
		let postData = {
			"date": this.selectedBookDate,
			"docId": docId
		}
		this.blockUI.start();
		this.pendingRequest = this.data.getAvailableSlotHome(postData).subscribe((data) => {
			clearTimeout(this.clearSetTimeout);
			this.blockUI.stop();
			this.respAvailableSLots = data;
			if (this.respAvailableSLots.statusCode == 200) {
				if (this.respAvailableSLots.data) {
					this.availableSlots = this.respAvailableSLots.data.availableSlots.map(availableSlot => {
						return this.getsplitvalue(availableSlot)
					}).map(slot => {
						let meridiem = ''
						if (slot[2] < 12) meridiem = 'AM'; else meridiem = 'PM'
						return { slotFormatted: `${slot[0]}:${slot[1]}-${slot[2]}:${slot[3]} ${meridiem}`, slotValue: `${slot[0]}${slot[1]}${slot[2]}${slot[3]}` }
					})
					this.availableSlotsDocId = docId;
				}
			} else {
				this.toastr.error(this.respAvailableSLots.message);
			}
		}, error => {
			this.blockUI.stop();
			this.toastr.error('Not able to connect host, please try again');
			// this.showErrorToaster('Not able to connect host, please try again');
		})
		this.clearSetTimeout = setTimeout(() => {
			this.pendingRequest.unsubscribe();
			// this.blockUI.stop();
		}, 1000);
	}
	//----------------------Get getAvailableSlot api integration end here----------//

	getSelectedSlot(event) {
		debugger
		this.selectedBookSlotFormatted = event.target.options[event.target.options.selectedIndex].text
	}

	bookAppointment(bookDateVal, i) {
		if (this.doctorIndex !== i) {
			this.selectedBookSlot = '';
			this.selectedBookSlotFormatted = ''
		}
		this.selectedBookDate = bookDateVal;
		this.verifyOtpShow = false;
		this.disableConfirmBooking = false;

		if (!this.selectedBookDate || this.selectedBookDate == undefined) {
			this.toastr.error('Book date is required');
		} else if (!this.selectedBookSlot || this.selectedBookSlot == undefined) {
			this.toastr.error('Book slot is required');
		}
	}

	//----------------------Get createVisit api integration start here----------//
	pendingReq: any;
	clearTimeouts: any
	disableConfirmBooking: boolean = false;
	createVisitPostData: any;
	verifyOtpShow: boolean = false;
	systemOtp: any;

	createVisit() {
		if (!this.selectedBookDate) {
			this.toastr.error('Book date is required');
			return false
		} else if (!this.selectedBookSlot) {
			this.toastr.error('Book slot is required');
			return false
		} else if (!this.createVisitForm.value.firstName) {
			this.toastr.error('First Name is required');
			return false
		} else if (!this.createVisitForm.value.lastName) {
			this.toastr.error('Last Name is required');
			return false
		} else if (!this.createVisitForm.value.mobNum) {
			this.toastr.error('Phone Number is required');
			return false
		} else if (!this.createVisitForm.value.illness) {
			this.toastr.error('Illness is required');
			return false
		} else {
			this.disableConfirmBooking = false;
			// check if mobNum exists
			// if exist create visit
			// if not exist create patient and patientDetais and then create visit
			//------------------------------------------
			let postData = {
				"docId": this.docId,
				"firstName": this.createVisitForm.value.firstName,
				"lastName": this.createVisitForm.value.lastName,
				"mobNum": this.createVisitForm.value.mobNum,
				"illness": this.createVisitForm.value.illness,
				"duration": "30",
				"bookSlot": moment(this.selectedBookDate).valueOf(),
				"slot": [this.selectedBookSlot]
			}
			this.createVisitPostData = postData;
			this.blockUI.start();
			this.pendingReq = this.data.getPatientDetailsHome(postData).subscribe((resp) => {
				this.blockUI.stop();
				if (resp['statusCode'] == 200) {
					this.disableConfirmBooking = true;
					this.toastr.success(resp['message']);
					if (resp['data'].visitId) {
						// this.router.navigate(['/home']);
						// $("#noAuthUserBookAppointment").find("button.close").click()
					} else if (resp['data'].otp) {
						this.otpData = resp['data'];
						this.systemOtp = resp['data'].otp
						this.verifyOtpShow = true;
					}
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
	//----------------------Get createVisit api integration end here----------//

	//----------------------Get verifyOtp api integration start here----------//
	otpData: any;
	disableVerifyOtpBtn: any = false;
	userOtp: any;

	verifyOtp(userOtp) {
		// client side verifyOtp
		if (this.systemOtp !== userOtp) {
			this.toastr.error('Invalid OTP');
		} else {
			// verify OTP
			// create patient and patientDetails in db
			// create visit
			//------------------------------------------
			this.disableVerifyOtpBtn = true;
			//------------------------------------------
			// server side verifyOtp
			let otpPostData = {
				mobNo: this.createVisitForm.value.mobNum,
				otp: this.otpData.otp,
				refNo: this.otpData.refNo
			}
			this.blockUI.start();
			this.pendingReq = this.data.verifyOTP(otpPostData).subscribe((resp) => {
				this.blockUI.stop();
				if (resp['statusCode'] == 200) {
					this.toastr.success(resp['message']);
					this.addVisit();
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
	//----------------------Get verifyOtp api integration end here----------//

	//----------------------Get addVisit api integration start here----------//
	addVisit() {
		this.pendingReq = this.data.addVisitHome(this.createVisitPostData).subscribe((resp) => {
			if (resp['statusCode'] == 200) {
				this.toastr.success(resp['message']);
			} else {
				this.toastr.error(resp['message']);
			}
		}, error => {
			this.toastr.error('Not able to connect host, please try again');
		})
		this.clearTimeouts = setTimeout(() => {
			this.pendingReq.unsubscribe();
		}, 60000);
	}
	//----------------------Get addVisit api integration start here----------//

}