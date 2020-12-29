import { Component, OnInit } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalConstant } from '../globalconstant';
import { CustomValidators } from '../validators';
import { ChartDataSets, ChartOptions, Chart } from 'chart.js';
declare var $;
import * as _ from 'underscore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  docId: any;
  clearSetTimeout: any;
  pendingRequest: any;
  LineChart = [];
  dataLength: boolean = true;
  constructor(
    private data: ApiIntegrationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.docId = sessionStorage.getItem('docId');
  }

  ngOnInit() {
    this.dashBoardGraph();
    this.getFrequentVisit();
    this.getStatusWiseCountOfPatient();
    // this.getNewsFeed();   Commented By Ajeet Becasue Get News Feed Api has been changed
    this.getShortNews();
    
  }


  //----------------------getStatusWiseCountOfPatient api start here------------------//
  totalPatients: any = 0;
  pendingPatients: any = 0;
  visitdPatients: any = 0;
  countData: any;

  getStatusWiseCountOfPatient() {
    let postData = {
      //"docId":this.docId
    }
    this.blockUI.start();
    this.pendingRequest = this.data.getStatusWiseCountOfPatient(postData).subscribe((data) => {
      clearTimeout(this.clearSetTimeout);
      this.blockUI.stop();

      if (data['statusCode'] == 200) {
        this.countData = data['data'];
        this.totalPatients = this.countData.total ? this.countData.total : "0";
        this.pendingPatients = this.countData.pending ? this.countData.pending : "0";
        this.visitdPatients = this.countData.visited ? this.countData.visited : "0";
        //this.toastr.success(data['message']);  
        //  console.log("data['message'"+data['message']) ;
      } else {
        //this.toastr.error(data['message']);  
      }
    }, error => {
      this.blockUI.stop();
      //  this.toastr.error('Not able to connect host, please try again');  
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.clearSetTimeout = setTimeout(() => {
      this.pendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }

  //----------------------getStatusWiseCountOfPatient api end here------------------//

  //----------------------------getTodayVisit api start here------------------------//

  getTodayVisit() {
    let postData = {
      "from": 1595410200000,
      "to": 1595410300000,
      "page": 1,
      "limit": 10
    }
    this.blockUI.start();
    this.pendingRequest = this.data.getTodayVisit(postData).subscribe((data) => {
      clearTimeout(this.clearSetTimeout);
      this.blockUI.stop();

      if (data['statusCode'] == 200) {
        // this.toastr.success(data['message']);  
        // console.log("data['message'"+data['message']) ;
      } else {
        this.toastr.error(data['message']);
      }
    }, error => {
      this.blockUI.stop();
      // this.toastr.error('Not able to connect host, please try again');  
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.clearSetTimeout = setTimeout(() => {
      this.pendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }

  //----------------------------getTodayVisit api end here--------------------------//

  //----------------------------getBookingRecord api start here--------------------//

  getBookingRecord() {
    let postData = {
      "docId": "DC89439493",
      "ts": "1593754847"
    }

    this.blockUI.start();
    this.pendingRequest = this.data.getBookingRecord(postData).subscribe((data) => {
      clearTimeout(this.clearSetTimeout);
      this.blockUI.stop();

      if (data['statusCode'] == 200) {

        //this.toastr.success(data['message']);  
        // console.log("data['message'"+data['message']) ;
      } else {
        this.toastr.error(data['message']);
      }
    }, error => {
      this.blockUI.stop();
      // this.toastr.error('Not able to connect host, please try again');  
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.clearSetTimeout = setTimeout(() => {
      this.pendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }

  //----------------------------getBookingRecord api end here---------------------//

  //----------------------------getFrequentVisit api start here------------------//
  taskBoardList: any = [];
  pendingReq: any
  clearSetTimes: any;
  getFrequentVisit() {
    let postData = {
      "page": 1,
      "limit": 10
    }
    this.blockUI.start();
    this.pendingReq = this.data.getFrequentVisit(postData).subscribe((data) => {
      clearTimeout(this.clearSetTimes);
      this.blockUI.stop();

      if (data['statusCode'] == 200) {
         this.taskBoardList = data['data'];
        if (this.taskBoardList.length) {
          this.dataLength = false;
        } else {
          this.dataLength = true;
        }
      } else {
        //  this.toastr.error(data['message']);  
      }
    }, error => {
      this.blockUI.stop();
      //this.toastr.error('Not able to connect host, please try again');  
    })
    this.clearSetTimes = setTimeout(() => {
      this.pendingReq.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }


  //----------------------------getFrequentVisit api end here-------------------//
  pendReq: any;
  clearTime: any;
  shortNewsDataList: any = [];
  shortNews: any
  newsdataLength: boolean = true;
  getShortNews() {
    debugger
    let postData = {
      "page": 1,
      "limit": 10
    }
    this.blockUI.start();
    this.pendReq = this.data.getShortNews(postData).subscribe((data) => {
      clearTimeout(this.clearTime);
      this.blockUI.stop();
      this.shortNews = data;
      if (this.shortNews.statusCode == 200) {
        this.shortNewsDataList = [];
        this.shortNewsDataList = this.shortNews.data;
        console.log(this.shortNewsDataList);
        if (this.shortNewsDataList.length) {
          this.newsdataLength = false;
        } else {
          this.newsdataLength = true;
        }
      } else {
        // this.toastr.error(data['message']);  
      }
    }, error => {
      this.blockUI.stop();
      //this.toastr.error('Not able to connect host, please try again');  
    })
    this.clearTime = setTimeout(() => {
      this.pendReq.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }



  //---------------bar chart start here--------------//
  pendingGraphRequest: any;
  clearGraphSetTimeout: any;
  graphResp: any;
  graphDeatls: any;
  activeCases: any = [];
  totalActive: any = 0;
  dashBoardGraph() {
    let postData = {

    }
    this.blockUI.start();
    this.pendingGraphRequest = this.data.dashBoardGraph(postData).subscribe((resp) => {
      clearTimeout(this.clearGraphSetTimeout);
      this.blockUI.stop();

      this.graphResp = resp;
      if (resp['statusCode'] == 200) {
        this.graphDeatls = this.graphResp.data;
        this.activeCases = _.pluck(this.graphDeatls, 'active');
        // this.totalActive = this.activeCases;  // Variable to hold your total
        let xAxisLebel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].filter((monthName, index) => index <= new Date().getMonth())

        var myChart = new Chart("lineChar1", {
          type: 'line',
          data: {
            labels: xAxisLebel,
            datasets: [{
              label: 'Number of Active cases',
              data: this.activeCases,
              fill: false,
              lineTension: 0.2,
              borderColor: "#6ee2f4",
              borderWidth: 4
            }]
          },
          options: {
            title: {
              //text: "Line Chart",
              display: true
            },
            legend: {
              display: false,

            },
            scales: {
              xAxes: [{
                display: true,
                gridLines: {
                  drawOnChartArea: false,
                  drawBorder: false,
                }
              }],
              yAxes: [{
                display: true,
                gridLines: {
                  drawOnChartArea: false,
                  drawBorder: false,
                  color: "white"
                },
                ticks: {
                  beginAtZero: true,
                  display: false
                }
              }],

            }
          }
        });

        for (var i = 0; i < this.activeCases.length; i++) {
          //   
          this.totalActive += this.activeCases[i];  // Iterate over your first array and then grab the second element add the values up
        }

      } else {
        //   this.toastr.error(resp['message']);  
      }
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
      // this.showErrorToaster('Not able to connect host, please try again');
    })
    this.clearGraphSetTimeout = setTimeout(() => {
      this.pendingGraphRequest.unsubscribe();
      this.blockUI.stop();
    }, 60000);
  }
  lineChart() {
    //second line chart
    var myChart = new Chart("lineChar1", {
      type: 'line',
      data: {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        datasets: [{
          label: 'Number of Active cases',
          data: this.activeCases,
          fill: false,
          lineTension: 0.2,
          borderColor: "#6ee2f4",
          borderWidth: 4
        }]
      },
      options: {
        title: {
          //text: "Line Chart",
          display: true
        },
        legend: {
          display: false,

        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: true
            }
          }],

        }
      }
    });
  }



  //--------------chart end here------------------//


  // ---------------- patient slider ----------------//
  patientSliderConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

}
