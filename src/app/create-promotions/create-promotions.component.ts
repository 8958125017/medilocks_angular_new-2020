import { Component, OnInit } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators } from '../validators';
import * as moment from 'moment';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-create-promotions',
  templateUrl: './create-promotions.component.html',
  styleUrls: ['./create-promotions.component.css']
})
export class CreatePromotionsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  clearSetTimeout: any;
  pendingRequest: any;
  public createPromotionForm: FormGroup;
  submitted: boolean = false;

  docId: any;
  constructor(private http: HttpClient,
    private data: ApiIntegrationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    public constants: GlobalConstant,
    private activatedRoute: ActivatedRoute) {
    this.docId = sessionStorage.getItem('docId');
  }

  ngOnInit() {
    this.createPromotionsFormInit();
  }

  createPromotionsFormInit() {
    this.createPromotionForm = this.fb.group({
      promoName: ['', [CustomValidators.removeSpaces]],
      scheduleDate: ['', [CustomValidators.removeSpaces]],
      scheduleTime: ['', [CustomValidators.removeSpaces]],
      audienceFile: ['', [CustomValidators.removeSpaces]],
      count: [''],
      extraMessage: ['', [CustomValidators.removeSpaces]],
      image: [''],
      promoMode: [''],
      promoType: [''],
      offerEndTs: ['', [CustomValidators.removeSpaces]],
      offerService: [''],
      additionalMessage: [''],
      promoVersion: ['']
    })
  }

  shedualTime: any;
  shedualDate: any;
  previewMessage: any;
  endTime: any = '00:00'

  messagePreview() {
    var date = new Date();
    var currentDate = moment(date).format('DD-MM-YYYY');
    var scheduleFrom = moment(this.createPromotionForm.value.scheduleDate).format('DD-MM-YYYY');
    var scheduleTo = moment(this.createPromotionForm.value.offerEndTs).format('DD-MM-YYYY');

    if (!this.createPromotionForm.value.scheduleDate) {
      this.toastr.error("please select schedule Date");
      return false
    } else if (!this.createPromotionForm.value.scheduleTime) {
      this.toastr.error("please select schedule Time");
      return false
    } else if (!this.createPromotionForm.value.offerEndTs) {
      this.toastr.error("please select offer end date");
      return false
    } else if (currentDate > scheduleFrom) {
      this.toastr.error("schedual  date should not be less then current date");
      return false
    } else if (scheduleFrom > scheduleTo) {
      this.toastr.error("schedual  date should not be greater then offer end date");
      return false
    } else if (scheduleTo < currentDate) {
      this.toastr.error('offer end date should not be less then current date');
      return false
    } else if (!this.createPromotionForm.value.offerService) {
      this.toastr.error("please enter service title");
      return false
    } else {
      this.previewMessage = this.createPromotionForm.value.offerService + " starting at " + scheduleFrom + "," + this.createPromotionForm.value.scheduleTime + "," + "offer valid till " + scheduleTo + "." + this.createPromotionForm.value.extraMessage + ".";
    }

  }

  saveAsdraft() {
    var date = new Date();
    var currentDate = moment(date).format('DD-MM-YYYY');
    var scheduleFrom = moment(this.createPromotionForm.value.scheduleDate).format('DD-MM-YYYY');
    var scheduleTo = moment(this.createPromotionForm.value.offerEndTs).format('DD-MM-YYYY');
    if (!this.createPromotionForm.value.scheduleDate) {
      this.toastr.error("please select schedule Date");
      return false
    } else if (!this.createPromotionForm.value.scheduleTime) {
      this.toastr.error("please select schedule Time");
      return false
    } else if (!this.createPromotionForm.value.offerEndTs) {
      this.toastr.error("please select offer end date");
      return false
    } else if (currentDate > scheduleFrom) {
      this.toastr.error("schedual  date should not be less then current date");
      return false
    } else if (scheduleFrom > scheduleTo) {
      this.toastr.error("schedual  date should not be greater then offer end date");
      return false
    } else if (scheduleTo < currentDate) {
      this.toastr.error('offer end date should not be less then current date');
      return false
    } else if (!this.createPromotionForm.value.offerService) {
      this.toastr.error("please enter service title");
      return false
    } else if (!this.createPromotionForm.value.promoMode) {
      this.toastr.error("please select promoMode");
      return false
    } else {
      this.shedualDate = this.createPromotionForm.value.scheduleDate;
      this.shedualTime = this.createPromotionForm.value.scheduleTime;
      var scheduleAt = moment(this.shedualDate + this.shedualTime, 'YYYY-MM-DDLT');
      var scheduleFormate = scheduleAt.format('YYYY-MM-DDTHH:mm');
      var finalSchedualTime = Date.parse(scheduleFormate) / 1000;

      //----------For Offer End Date------------//
      var endDate = moment(this.createPromotionForm.value.offerEndTs).format('YYYY-MM-DD');
      var toObj = moment(endDate + this.endTime, 'YYYY-MM-DDLT');
      var toDateTime = toObj.format('YYYY-MM-DDTHH:mm');
      var offerEndTs = Date.parse(toDateTime) / 1000;

      let postData = {
        "promoName": this.createPromotionForm.value.promoName,
        "scheduleAt": finalSchedualTime,
        "audienceFile": "http://49.50.67.44/docs/1598076897215_Web19201.png",
        // "count":"10" ,
        "message": this.previewMessage,
        "image": "http://49.50.67.44/docs/1598076897215_Web19201.png",
        "promoMode": this.createPromotionForm.value.promoMode,
        "promoType": "Discount",
        "offerEndTs": offerEndTs,
        "offerService": this.createPromotionForm.value.offerService,
        "additionalMessage": this.createPromotionForm.value.extraMessage,
        "promoVersion": "Basic"
      }
      clearTimeout(this.clearSetTimeout);
      this.blockUI.start();
      this.pendingRequest = this.data.createPromotion(postData).subscribe((data) => {
        clearTimeout(this.clearSetTimeout);
        this.blockUI.stop();
        if (data['statusCode'] == 200) {
          this.router.navigate(['/promotions']);
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


  //************************Upload document starts here****************************//


  clearFile() {
    if (this.imageFor == "audience") {
      this.createPromotionForm.controls['audienceFile'].setValue("");
      return false;
    } else {
      this.createPromotionForm.controls['profilePic'].setValue("");
      return false;
    }

  }

  fileExtension: any;
  imageFor: any;
  fileUpload(event, image) {
    debugger
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
            if (this.imageFor == "audience") {
              this.createPromotionForm.controls['audienceFile'].setValue(response.data.url);
            } else {
              this.createPromotionForm.controls['image'].setValue(response.data.url);
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



  sendPromo() {
    debugger;
    if (!this.createPromotionForm.value.promoName) {
      this.toastr.error("please enter  promotion name");
      return false
    } else if (!this.previewMessage) {
      this.toastr.error("message is not completed");
      return false
    } else if (!this.createPromotionForm.value.promoMode) {
      this.toastr.error("please select promoMode");
      return false
    } else {
      let postData = {
        "promoName": this.createPromotionForm.value.promoName,
        "audienceFile": this.createPromotionForm.value.audienceFile,
        "message": this.previewMessage,
        "image": this.createPromotionForm.value.image,
        "promoMode": this.createPromotionForm.value.promoMode,
        "offerService": this.createPromotionForm.value.offerService,
        "additionalMessage": this.createPromotionForm.value.extraMessage
      }
      clearTimeout(this.clearSetTimeout);
      this.blockUI.start();
      this.pendingRequest = this.data.sendPromotion(postData).subscribe((data) => {
        clearTimeout(this.clearSetTimeout);
        this.blockUI.stop();
        if (data['statusCode'] == 200) {
          this.router.navigate(['/promotions']);
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


  // for download excel template
  downloadStaticFile() {
    this.http.get('assets/doc/promotion_import_template.xlsx', { responseType: "blob", headers: { 'Accept': 'application/vnd.ms-excel' } })
    .subscribe(blob => {
      saveAs(blob, 'promotion_import_template.xlsx');
    });
  }

}
