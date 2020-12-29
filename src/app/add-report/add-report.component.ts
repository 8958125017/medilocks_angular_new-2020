import { Component, OnInit} from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
declare var $;
import { MessageService } from '../messageservice.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit {
 @BlockUI() blockUI: NgBlockUI; 
   clearSetTimeout:any;
   pendingRequest:any;   
   public isValidFormSubmitted = null;
   bodyRes:any;
   response:any;
   date :any= new Date();
   patientId:any;
   category:any;
  constructor(
     private data:ApiIntegrationService,
     private toastr: ToastrService,
     private fb: FormBuilder,
     private router:Router,
     public  constants:GlobalConstant, 
     private actRoute:ActivatedRoute,
     private messgage : MessageService
  ) { } 
       createReportForm = new FormGroup({
                mobNo: new FormControl('', [Validators.required]),
                name: new FormControl('', [Validators.required]),
                issuedBy: new FormControl('', [Validators.required]),
                category: new FormControl('') ,
                url:new FormControl('') ,
            });
  ngOnInit(): void {
    this.category="";
  	this.patientId = this.actRoute.snapshot.paramMap.get('id');
    this.getPatientsDetails(this.patientId)
  }
  //----------------------Get getPatientsDetails api api-integration start here----------//
  patientsDtails:any={};
  patientsResp:any;
  pendingReq:any
  clearTimeouts:any;
  getPatientsDetails(id){
              let postData={                          
                          "patientId": id
                    }                          
              this.pendingReq = this.data.getPatientDetails(postData).subscribe((resp) => { 
              this.patientsResp=resp;
              if (this.patientsResp.statusCode == 200) {  
                           this.patientsDtails=this.patientsResp.data
                           this.createReportForm.patchValue({
                               email: this.patientsDtails.email,
                               name: this.patientsDtails.name.firstName+""+this.patientsDtails.name.lastName,//this.patientsDtails.firstName+""+this.patientsDtails.lastName;
                               mobNo:this.patientsDtails.mobNum,
                           })
                         
              } else{                       
                     this.toastr.error(resp['message']);  
                    }
              },error => {
                    this.blockUI.stop();
                    this.toastr.error('Not able to connect host, please try again');  
                    // this.showErrorToaster('Not able to connect host, please try again');
              })
              this.clearTimeouts = setTimeout(() => {
                   this.pendingReq.unsubscribe();
                   this.blockUI.stop();
              }, 60000);
  }



  //************************Upload document starts here****************************//

  fileExtension: any;
clearFile(){
    this.createReportForm.controls['url'].setValue("");
       return false;
    }

  fileUpload(event){
    let file = event.target.files[0];
    var allowedExtensions = ["jpg","jpeg","png","JPEG","JPG","PNG", "pdf", "PDF"];
     if(!file){
      this.clearFile();
    }else{
      let index = file.name.lastIndexOf('.');
      this.fileExtension = file.name.substr(index+1);
      this.toastr.clear();
      if(['JPEG', 'jpeg', 'JPG', 'jpg', 'PNG', 'png'].includes(this.fileExtension) && file.size > 2099999){
        this.toastr.error('Please upload .jpg, .jpeg, or .png file size up to 2 MB');
        this.clearFile();
      }else if(['pdf', 'PDF'].includes(this.fileExtension) && file.size > 2099999){
        this.toastr.error('Please upload .pdf file size up to 2 MB');
        this.clearFile();
      }else if(!this.isInArray(allowedExtensions, this.fileExtension)){
        this.toastr.error('Please upload .pdf, .png, .jpg, .jpeg, format only');
        this.clearFile();
      }else{
        var postData = new FormData;
          postData.append('module', this.patientId);
          postData.append('file', file, file.name);
        debugger
        this.blockUI.start('Uploading...');
        this.data.uploaddoc(postData).subscribe((response: any) => {
          this.blockUI.stop();
          debugger
          if(response.statusCode == 200){
            this.createReportForm.controls['url'].setValue(response.data);    
          }else if(!response){
            this.toastr.error('File uploading faild, Please try again');
          }else{
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




//*****************************createReport api start here***********************************//


createReport(){
            let postData={
                        "patientId": this.patientId ,
                        "reportType": this.createReportForm.value.category,
                        "issuedBy": this.createReportForm.value.issuedBy,
                        "url": this.createReportForm.value.issuedBy.url,
                        "issuesId": "DTD18DA61894244255A5A01B4BE9C6B874"
             } 
             clearTimeout(this.clearTimeouts);   
             this.blockUI.start();      
             this.pendingReq = this.data.createReport(postData).subscribe((resp) => {
             this.blockUI.stop();  
              clearTimeout(this.clearTimeouts);                
              if (resp['statusCode'] == 200) {
                           this.toastr.success(resp['message']);   
                           this.router.navigate(['/mypatient'])                         
              } else{                       
                           this.toastr.error(resp['message']);  
                    }
              },error => {
                    this.blockUI.stop();
                    this.toastr.error('Not able to connect host, please try again');  
                    // this.showErrorToaster('Not able to connect host, please try again');
              })
              this.clearTimeouts = setTimeout(() => {
                   this.pendingReq.unsubscribe();
                   this.blockUI.stop();
              }, 60000);
}



//*****************************createReport api start here***********************************//



}
