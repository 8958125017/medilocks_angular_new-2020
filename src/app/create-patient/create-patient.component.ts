import { Component, OnInit} from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router , RouterModule ,ActivatedRoute, Routes} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators } from '../validators';
import * as moment from 'moment';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI; 
  public emailPattern =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public isValidFormSubmitted = null;
  public isSignupValidFormSubmitted = null;
  clearSetTimeout:any;
  pendingRequest:any;
  public createPatientForm:FormGroup;

  submitted :boolean=false;
     docId:any;
  constructor(private data:ApiIntegrationService,
              private toastr: ToastrService,
              private fb: FormBuilder,
              private router:Router,
              public  constants:GlobalConstant, 
              private activatedRoute:ActivatedRoute) { 
              this.docId = sessionStorage.getItem('docId'); 
  }

	ngOnInit(){
		this.createPatientsFormInit();
    this.getBloodGroup();
    this.getState();
    this.state="";
    this.city="";
	}

	// convenience getter for easy access to form fields
   get f() { return this.createPatientForm.controls; }
	createPatientsFormInit(){
	  	this.createPatientForm = this.fb.group({
	            fName: ['',[Validators.required,CustomValidators.removeSpaces]],  
              lName: ['',[Validators.required,CustomValidators.removeSpaces]],    
              mobNum : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),CustomValidators.removeSpaces]], 
              email: ['', [Validators.pattern(this.emailPattern), CustomValidators.removeSpaces]],
              address: ['',[CustomValidators.removeSpaces]], 
              state: [''],      
              city:[''], 
              pincode: ['', [Validators.minLength(6),Validators.maxLength(6),CustomValidators.removeSpaces]], 
              age:[''],
              dob: [''],       
              bloodGroup:[''], 
              height : [''], 
              weight : [''], 
              profilePic:[''],             	      
	     })
	}

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

    createForm(){
      debugger;
    	         var date = new Date();
                 var curentData=moment(date).format('YYYY-MM-DD');
    	         this.submitted = true; 
    	          if(this.createPatientForm.value.fName == ''){
			           this.toastr.error('Please enter first name');
			           return false;    
			         }else if(this.createPatientForm.value.lname == ''){
                 this.toastr.error('Please enter last name');
                 return false;    
               }
			          else if(this.createPatientForm.value.mobNo== ''){
			             this.toastr.error('Please enter mobile number'); 
			           return false; 
			          } 
			         //  else if(this.createPatientForm.value.email== ''){
			         //    this.toastr.error('Please enter your Email id'); 
			         //    return false; 
			         // }
			        else if(this.createPatientForm.value.dob >curentData){
		                 this.toastr.error('dob should not be greater then current date'); 
		                 return false
                    }else{
                      let name={
                        "firstName":this.createPatientForm.value.fName,
                        "lastName":this.createPatientForm.value.lName
                      }
                      let postData={
      							    "name": name,
      							    "mobNum": this.createPatientForm.value.mobNum,
      							    "email": this.createPatientForm.value.email,
      							    "address": this.createPatientForm.value.address,
      							    "city": this.createPatientForm.value.city,
      							    "state": this.createPatientForm.value.state,
      							    "pincode": this.createPatientForm.value.pincode,
      							    "age": this.getAge(this.createPatientForm.value.dob),
      							    "dob": Date.parse(this.createPatientForm.value.dob)/1000,//this.createPatientForm.value.dob,
      							    "bloodGroup": this.createPatientForm.value.bloodGroup,
      							    "height": this.createPatientForm.value.height,
                        "weight": this.createPatientForm.value.weight,
      							    "onBoardType": "D",
      							    "countryCode": "+91",
      							    "profilePic": "https://i.ibb.co/p2dq0bC/download.png"
	    					}	    	
					    	this.blockUI.start();              
				            this.pendingRequest = this.data.addPatients(postData).subscribe((data) => {
				                       clearTimeout(this.clearSetTimeout);        
				                       this.blockUI.stop();
				                       if (data['statusCode'] == 200) {   
				                       	   this.router.navigate(['/mypatient']);
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


clearFile(){
    this.createPatientForm.controls['profilePic'].setValue("");
       return false;
    }
    fileExtension: any;
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
          postData.append('module', this.docId);
          postData.append('file', file, file.name);
        debugger
        this.blockUI.start('Uploading...');
        this.data.uploaddoc(postData).subscribe((response: any) => {
          this.blockUI.stop();
          debugger
          if(response.statusCode == 200){
            this.createPatientForm.controls['profilePic'].setValue(response.data.url);    
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



getBloodResp:any;
bloodPendingRequest:any;
getBloodTimeout:any;
bloodGroupList:any=[];
getBloodGroup(){               
              let postData= {               
                   
              }
              this.blockUI.start();              
              this.bloodPendingRequest = this.data.getBloodGroup(postData).subscribe((data) => {
              clearTimeout(this.getBloodTimeout);        
              this.blockUI.stop(); 
              this.getBloodResp=data;
              if (this.getBloodResp.statusCode === "200") { 
                     this.bloodGroupList=this.getBloodResp.data;                       
                 } 
              },error => {
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
statePendingRequest:any;
getStateResp:any;
stateTimeout:any
state:any;
stateList:any=[];

getState(){
     let postData= {               
                   
              }
              this.blockUI.start();              
              this.statePendingRequest = this.data.getState(postData).subscribe((data) => {
              clearTimeout(this.stateTimeout);        
              this.blockUI.stop();   
              this.getStateResp=data;
              if (this.getStateResp.statusCode === "200") { 
                     this.stateList=[];                   
                     this.stateList=this.getStateResp.data;                       
                 } 
              },error => {
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
cityPendingRequest:any;
getCityResp:any;
city:any;
cityTimeout:any
cityList:any=[];
getCity(state){
     let postData= {
                    "state": state
                   }
                   debugger
              this.blockUI.start();              
              this.cityPendingRequest = this.data.getCity(postData).subscribe((data) => {
              clearTimeout(this.cityTimeout);        
              this.blockUI.stop();      
                      debugger
              this.getCityResp=data;
              if (this.getCityResp.statusCode === "200") { 
                     this.cityList=[];
                     this.cityList=this.getCityResp.data;                       
                 } 
              },error => {
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

}
