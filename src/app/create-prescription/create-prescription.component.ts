import { Component, OnInit} from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup,FormsModule, ReactiveFormsModule,FormArray, Form } from '@angular/forms';
import { Router , RouterModule ,ActivatedRoute, Routes} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators } from '../validators';
import * as moment from 'moment';

@Component({
  selector: 'app-create-prescription',
  templateUrl: './create-prescription.component.html',
  styleUrls: ['./create-prescription.component.css']
})

export class CreatePrescriptionComponent implements OnInit {
 @BlockUI() blockUI: NgBlockUI; 
  clearSetTimeout:any;
  pendingRequest:any;
  myForm: FormGroup;
  addNewField: FormArray;
  addTable: FormArray;
  addTableRow: FormArray;
  docId:any;
  // removeAddSection:boolean=false;

  constructor(private data:ApiIntegrationService,
              private toastr: ToastrService,
              private fb: FormBuilder,
              private router:Router,
              public  constants:GlobalConstant, 
              private actRoute:ActivatedRoute) {
              this.docId = sessionStorage.getItem('docId'); 
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      addNewField: this.fb.array([this.registercreateItem()]),
      addTable: this.fb.array([this.addTableItem()]),
      addTableRow: this.fb.array([this.addRowItem()])
    
    })
    this.patientId = this.actRoute.snapshot.paramMap.get('id');
     this.getPatientsDetails()
     this.getDoctorDetails();
  }

//*********************************Get Doctor Details start here******************************//
          degreeType:any=[];
          doctSpecialization:any=[];
          pendingRequestDocor:any;
          clearSetTimeoutDoctor:any;
          doctorDeatils:any={};
          docName:any;
          response:any;
           getDoctorDetails(){
            let postData={
                    "docId":this.docId
              }
              clearTimeout(this.clearSetTimeoutDoctor);              
              this.pendingRequestDocor = this.data.getDocById(postData).subscribe((data) => {
              clearTimeout(this.clearSetTimeoutDoctor);        
              // this.blockUI.stop();              
              this.response=data;
              if (this.response.statusCode == 200) {  
                debugger
                            this.doctorDeatils="";
                            this.doctorDeatils = this.response.data;
                            this.docName = this.doctorDeatils.name.firstName+" "+this.doctorDeatils.name.lastName;
                            if(this.doctorDeatils.degree.length){
                              this.degreeType =this.doctorDeatils.degree;
                            }  
                            if(this.doctorDeatils.specialization.length){
                              this.doctSpecialization =this.doctorDeatils.specialization;
                            }                          
              } else{                       
                     //this.toastr.error(this.response.message);  
                    }
              },error => {
                    // this.blockUI.stop();
                    this.toastr.error('Not able to connect host, please try again'); 
              })
              this.clearSetTimeoutDoctor = setTimeout(() => {
                   this.pendingRequestDocor.unsubscribe();
                   // this.blockUI.stop();
              }, 60000);
    }

//*********************************Get Doctor Details end here**********************************//


 //-----------------------Get getPatientsDetails api api-integration start here-----------------//
  patientsDtails:any={};
  patientsResp:any;
  pendingReq:any
  clearTimeouts:any;
  userId:any;
  parentPatientId:any;
  patientId:any;
  patientsName:any;
  mobNumber:any;
  email:any;
  getPatientsDetails(){
    debugger  
              let postData={
                            "patientId": this.patientId
                           }
              this.blockUI.start();              
              this.pendingReq = this.data.getPatientDetails(postData).subscribe((resp) => {
              clearTimeout(this.clearTimeouts);        
              this.blockUI.stop();              
              this.patientsResp=resp;
              if (this.patientsResp.statusCode == 200) {  
                debugger
                            this.patientsDtails=this.patientsResp.data;
                            var name= this.patientsDtails.name;
                            this.patientsName=name.firstName+" "+name.lastName;
                            this.mobNumber=this.patientsDtails.mobNum;
                            this.email=this.patientsDtails.email;
                            
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

//----------------------Get getPatientsDetails api api-integration end here----------//
  registercreateItem() {
    return this.fb.group({
      createField: ['']
   })
  }


  addRowItem() {
    return this.fb.group({
      addRowItem1: [''],
      addRowItem2: [''],
      addRowItem3: ['']
   })
  }

  addTableItem() {
    return this.fb.group({
      item1: [''],
      item2: [''],
      item3: ['']
   })
  }
 
  addItem(value) { 
    if(value == "addField"){
      this.addNewField = this.myForm.get('addNewField') as FormArray;
      this.addNewField.push(this.registercreateItem()); 
    }

    else if(value == "addNewTable"){
      this.addTable = this.myForm.get('addTable') as FormArray;
      this.addTable.push(this.addTableItem()); 
    }

    else if(value == "addNewRow"){
      this.addTableRow = this.myForm.get('addTableRow') as FormArray;
      this.addTableRow.push(this.addRowItem()); 
    }
     
  }

  removeSection(index, value) {
    debugger
    if(value == "removeNewField"){
       (this.myForm.get('addNewField') as FormArray).removeAt(index);
    }
    if(value == "removeAddTable"){
      (this.myForm.get('addTable') as FormArray).removeAt(index);
   }
   if(value == "remvoeTableRow"){
    (this.myForm.get('addTableRow') as FormArray).removeAt(index);
   }
   
  }


  onSubmit() {
    console.log(this.myForm.value);
    let postData={
              "patientId": this.patientId,
              "prescriptionUrl": "http://xyz",
              "digitalPrescription": {
                  "foo": "bar"
              }
          }
        clearTimeout(this.clearSetTimeout);
        this.blockUI.start();              
        this.pendingRequest = this.data.createPrescription(postData).subscribe((data) => {
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
