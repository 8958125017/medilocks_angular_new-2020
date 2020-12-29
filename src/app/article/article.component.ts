import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';


import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators, MustMatch } from '../validators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { debounceTime } from 'rxjs/operators';


declare var $;
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  docId:any;
  // createArticle:FormGroup;
  public createArticleForm: FormGroup;
  submitted :boolean=false;
  pendingRequest:any;
  clearSetTimeout:any;

  constructor(
    private data: ApiIntegrationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {
    this.docId = sessionStorage.getItem('docId');  
   }

  ngOnInit(): void {
    this.createArticleFormInit();
    this.getCategory();
  }

	// convenience getter for easy access to form fields
   get f() { return this.createArticleForm.controls; }
   
   createArticleFormInit(){
	  	this.createArticleForm = this.fb.group({ 
              newsTitle: ['',[Validators.required,CustomValidators.removeSpaces]],  
              newsDescription : [''],
              addTags: ['',[Validators.required,CustomValidators.removeSpaces]],    
              // newsCategory : ['',[Validators.required,CustomValidators.removeSpaces]],  
              
	     })
	}

  createArticle(){
    debugger;
      this.submitted = true; 

     if(this.createArticleForm.value.newsTitle == ''){
        this.toastr.error('Please enter News Title');
         return false;    
     }
  
    else if(this.createArticleForm.value.newsDescription == ''){
      this.toastr.error('Please enter new description');
       return false;    
     } 

     else if(this.createArticleForm.value.addTags== ''){
        this.toastr.error('Please enter add Tags'); 
         return false; 
     } 

  //    else if(this.createArticleForm.value.newsCategory== ''){
  //     this.toastr.error('Please enter news category'); 
  //       return false; 
  //  } 
  
else{
       let postData={
              "newsTitle": this.createArticleForm.value.newsTitle,
              "newsDescription": this.createArticleForm.value.newsDescription,
              "newsContent": this.createArticleForm.value.newsDescription,
              "newsAuthor": "Dr. Pankaj Joshi",
              "newsPublishedOn": 1602690423,
              // "newsCategory": this.createArticleForm.value.newsCategory,
              "newsCategory": "Supplements",
              "newsImage": ["https://i.ibb.co/p2dq0bC/download.png, https://i.ibb.co/p2dq0bC/download.png"],
              "newsFile": ["abc, def"]
     }	    

     this.blockUI.start();              
         this.pendingRequest = this.data.createNews(postData).subscribe((data) => {
                    clearTimeout(this.clearSetTimeout);        
                    this.blockUI.stop();
                    if (data['statusCode'] == 200) {   
                         this.router.navigate(['/newsFeed']);
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


//***********************Get category api intregration start here***********************//
categoryPendingRequest:any;
getStateResp:any;
stateTimeout:any
categoryList:any=[];

getCategory(){
     let postData= {               
                   
              }
              this.blockUI.start();              
              this.categoryPendingRequest = this.data.getCategory(postData).subscribe((data) => {
              clearTimeout(this.stateTimeout);        
              this.blockUI.stop();   
              this.getStateResp=data;
              if (this.getStateResp.statusCode === "200") { 
                     this.categoryList=[];                   
                     this.categoryList=this.getStateResp.data;                       
                 } 
              },error => {
                    this.blockUI.stop();
                    this.toastr.error('Not able to connect host, please try again');  
                    // this.showErrorToaster('Not able to connect host, please try again');
              })
              this.stateTimeout = setTimeout(() => {
                   this.categoryPendingRequest.unsubscribe();
                   this.blockUI.stop();
              }, 60000);
}

//***********************Get category api intregration end here************************//



  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
 }
 
  clearFile(){
    this.createArticleForm.controls['profilePic'].setValue("");
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
            this.createArticleForm.controls['profilePic'].setValue(response.data.url);    
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

  // Create Text Editor
  name = 'Angular 6';
  newsDescription = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    // toolbarHiddenButtons: [
    //   [
    //     'subscript',
    //     'superscript',
    //     'heading',
    //     'fontName'
    //   ],
    //   [
    //     'fontSize',
    //     'textColor',
    //     'backgroundColor',
    //     'customClasses',
    //     'link',
    //     'unlink',
    //     'insertImage',
    //     'insertVideo',
    //     'insertHorizontalRule',
    //     'removeFormat',
    //     'toggleEditorMode'
    //   ]
    // ]
  };




//*********************************With mobile number profile updatation ends here(Get OTP)*************//
// Profile() {
//   this.submitted = true;
//     // if (this.updatePrForm.invalid) {
//     //     return false;
//     // }
//      if (!this.updatePrForm.value.Name) {
//       this.toastr.clear();
//       this.showErrorToaster("Please entre your Name")
//        return false;
//         }else if (!this.updatePrForm.value.Mobile) {
//           this.toastr.clear();
//           this.showErrorToaster("Please entre your Mobile number")
//           return false;
//       }else if (!this.updatePrForm.value.Designation) {
//         this.toastr.clear();
//         this.showErrorToaster("Please entre your Designation")
//         return false;
//       }else if (!this.updatePrForm.value.email) {
//         this.toastr.clear();
//         this.showErrorToaster("Please entre your Email Id")
//         return false;
//       }
//     else if (!this.profileDoc) {
//         this.toastr.clear();
//         this.showErrorToaster("Please upload Authorization document")
//          return false;
//      }else {
//       let postData = {
//         id:this.tmId,
//         eclass:'TM',    
//         name: this.updatePrForm.value.Name,
//         mobileNumber: this.updatePrForm.value.Mobile,
//         designation: this.updatePrForm.value.Designation,
//         email: this.updatePrForm.value.email,
//         ename :this.tmName,
//         doc  :this.uploadData.data,
//       }     

//     this.blockUI.start();
//     this.pendingRequest=this.data.editProfile(postData).subscribe((data) => {  
//         clearTimeout(this.clearSetTimeout);
//         this.blockUI.stop();
//          this.response = data;
//       if (this.response.statusCode == 200) {        
//           this.router.navigate(['/user-profile']);
//           $(".modal-backdrop.show").remove();
//           this.showSuccessMessage(data['message']);
//           // this.referenceNo = this.res.data; // comment on 07-01-2019

//       } 
//       else {
//           this.showErrorToaster(data['message']);
//            $("#otpModalCenter").remove();
//            // this.router.navigate(['/user-profile']);        
//       }      
//     },error => {               
//                this.blockUI.stop();          
//                this.showErrorToaster('Not able to connect host, please try again');      
//                })        
//                this.clearSetTimeout = setTimeout(() => {
//                     this.pendingRequest.unsubscribe();
//                     this.blockUI.stop();
//                },10000);  }
// }

//   // ************************************file upload for Profile Updation starts here*********************//
//   fileUpload(event,doc){
//     let reader = new FileReader();
//     let file = event.target.files[0];
//     var allowedExtensions = ["jpg","jpeg","png","JPEG","JPG","PNG", "pdf", "PDF"];    
//     this.isprofilefile = false
//     this.fileExtension = file.name.split('.').pop();
//     if(file){
//     this.toastr.clear();
//       if(['JPEG', 'jpeg', 'JPG', 'jpg', 'PNG', 'png'].includes(this.fileExtension) && file.size > 100000){
//         this.showErrorToaster('Please Upload JPG, JPEG, or PNG file size up to 100 KB.');
//         this.file = "";
//         this.profileDoc = "";
//         this.profilefile = "";
//         this.uploadData = '';
//         return false;
//       }
//     }

//     if(this.isInArray(allowedExtensions, this.fileExtension)){
//         var postData = new FormData;
//         postData.append('doc', file, file.name);
//       clearTimeout(this.clearSetTimeout);
//         this.blockUI.start('Uploading Document...');
//         this.pendingRequest=this.data.uploaddoc(postData).subscribe((data)=>{
//           clearTimeout(this.clearSetTimeout);
//           this.blockUI.stop();
//           if(data['statusCode'] ==200){
//              $('#bootAlert').hide();
//               this.file = "";
//               this.uploadData = data;
//               //this.profilefile.append(doc,data['data'])
//               this.blockUI.stop();
//               this.isprofilefile = true;
//           }
//         },error => {  
//                 this.profileDoc='';
//                 this.blockUI.stop();
//                 clearTimeout(this.clearSetTimeout);
//                 this.showErrorToaster('Not able to connect host, please try again');     
//                })
//          this.clearSetTimeout = setTimeout(() => {
//                     this.profileDoc='';
//                     this.pendingRequest.unsubscribe();
//                     this.blockUI.stop();
//                },30000);  

//     }else{        
//       this.isprofilefile = false;
//       this.showErrorToaster('Please upload .pdf, .png, .jpg, .jpeg, format only')      
//     }

// }


//   isInArray(array, word) {
//      return array.indexOf(word.toLowerCase()) > -1;
//  }











}
