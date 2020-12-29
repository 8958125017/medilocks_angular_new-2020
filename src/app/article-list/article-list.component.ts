import { Component, OnInit } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})

export class ArticleListComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  docId:any;

  constructor(
    private data: ApiIntegrationService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.docId = sessionStorage.getItem('docId');
  }

  ngOnInit(): void {
    this.getArticle();
  }


  //***********************Get article list api intregration start here***********************//

  articlePendingRequest: any;
  articleSetTimeOut: any;
  getArticleRes: any;
  getArticleList: any = [];

  getArticle() {
    let postData = {}

    this.blockUI.start();

    this.articlePendingRequest = this.data.getCategory(postData).subscribe((data) => {

      clearTimeout(this.articleSetTimeOut); 
      
      this.blockUI.stop();
      this.getArticleRes = data;

      if (this.getArticleRes.statusCode == '200') {
        this.getArticleList = [];
        this.getArticleList = this.getArticleRes.data;
      }

    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })

    this.articleSetTimeOut = setTimeout(() => {
      this.articlePendingRequest.unsubscribe();
      this.blockUI.stop();
    }, 600);

  }

  //***********************Get article list api intregration end here***********************//





}
