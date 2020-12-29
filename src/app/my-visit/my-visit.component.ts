import { Component, OnInit ,AfterViewInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-my-visit',
  templateUrl: './my-visit.component.html',
  styleUrls: ['./my-visit.component.css']
})
export class MyVisitComponent implements OnInit {

  showMessage:boolean=true;
  acceptedVisitList:boolean=false;
  isFavorite: boolean = true;

  constructor(private render: Renderer2) { 
   
  }

  ngOnInit() {
    this.pendingChat(); 
  }

  showChat(){
  	  this.showMessage=true;         
  }

  clickHere(){
  	    
  }

  result:any;
  startChat:boolean=false;

  pendingChat(){
           this.showMessage=false; 
           this.isFavorite=true;
           // document.getElementsByClassName("chat-box")[0].style.display = 'none';
           // document.getElementsByClassName("patient-profile")[0].style.display = 'none';
          // var userList =  document.getElementsByClassName("user-list-box")[0];
          //  this.result.style.cssText = "width:100% !important; max-width:100%";
  }

  acceptedChat(){
          // document.getElementsByClassName("chat-box")[0].removeAttribute("style");
          // document.getElementsByClassName("patient-profile")[0].removeAttribute("style");
          this.result.removeAttribute("style");
          this.isFavorite=false;
          this.showMessage=true;
  }

 showUpload:boolean=false;
  showUploadSection(){
   this.showUpload=! this.showUpload;
  }

   ngAfterViewInit(){
    this.result = document.getElementsByClassName("user-list-box")[0];   
  }

  getChatmessage(){
    debugger
    this.startChat=true;
  }

  endChat(){
    this.startChat=false;
  }

  showacceptedVisitList(){
    this.acceptedVisitList=true;

  }

}
