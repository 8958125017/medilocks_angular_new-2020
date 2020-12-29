import { Component, OnInit, ElementRef } from '@angular/core';
import { ApiIntegrationService } from '../../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy,formatDate} from '@angular/common';
import { Router, ActivatedRoute,NavigationEnd } from '@angular/router';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from '../../messageservice.service';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    public show:boolean =false;
    public  searchItem:any;
    jstoday = '';
    constructor(private element: ElementRef, private location:Location, 
                private data : ApiIntegrationService,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private messageService:MessageService) {      
       this.sidebarVisible = false;  
       setInterval(() => {
                   this.getCurrenttime();
              }, 1000);  
    }
   
    ngOnInit(){
          
    }

    getCurrenttime(){
       var d = new Date();
       this.jstoday = moment(d).format('MMMM Do YYYY, h:mm a');
    }
    pendReq:any;
    clearTime:any;
    resp:any;    
    doctorSearch(){
              if(this.searchItem){
                 this.messageService.searchPatients(this.searchItem);               
                 this.router.navigate(['/searchResult',this.searchItem ]);  
              }else{
                this.location.back();
              }
              
  }
    
    logout(){
      this.router.navigate(['/login'])
    }



}
