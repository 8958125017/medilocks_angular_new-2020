import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ApiIntegrationService } from '../api-integration.service';
// import { DomSanitizer } from "@angular/platform-browser"; 
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  userId;
  userInvoiceDetail;
  unitPrice;
  doctorDetail;

  constructor(private _activatedRoute: ActivatedRoute, private data: ApiIntegrationService, private toastr: ToastrService) {
    this._activatedRoute.params.subscribe(params => {
      //console.log(params);
      this.userId = params.id;
    })
  }

  ngOnInit(): void {
    this.getInvoice();
    this.getDocById();
  }

  getInvoice() {

    let model = { 'userSubId': this.userId };
    this.blockUI.start();
    this.data.getInvoice(model).subscribe(res => {
      console.log(res);
      this.blockUI.stop();
      this.userInvoiceDetail = res['data'][0];
      this.unitPrice = this.userInvoiceDetail.planAmtWithoutGst / this.userInvoiceDetail.planMonth;
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })
  }

  docName: any;
  getDocById() {

    let docID = sessionStorage.getItem('docId');
    //console.log(docID)
    let model = { 'docId': docID };
    this.blockUI.start();
    this.data.getDocById(model).subscribe(res => {
      console.log(res);
      this.blockUI.stop();
      this.doctorDetail = res['data'];
      this.docName = this.doctorDetail.name.firstName + " " + " " + this.doctorDetail.name.lastName;
      console.log(this.doctorDetail);
    }, error => {
      this.blockUI.stop();
      this.toastr.error('Not able to connect host, please try again');
    })
  }


  //   print(): void {
  //     let printContents, popupWin;
  //     printContents = document.getElementById('invoice').innerHTML;
  //     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //     popupWin.document.open();
  //     popupWin.document.write(`
  //       <html>
  //         <head>
  //           <title>Print tab</title>
  //           <style>
  //           //........Customized style.......
  //           </style>
  //         </head>
  //       <body onload="window.print();window.close()">${printContents}</body>
  //       </html>`
  //     );
  //     popupWin.document.close();
  // }

  downloadPdfInvoice() {
    this.toastr.success('Your invoice is downloading');
    let pdfInvoiceData = document.getElementById("invoice");
    html2canvas(pdfInvoiceData).then(canvas => {
      let imgWidth = 200;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let invoiceDataUrl = canvas.toDataURL('image/png');
      let pdfInvoice = new jspdf('p', 'mm', 'a4'); // A4 size page of pdf
      let postion = 0;
      pdfInvoice.addImage(invoiceDataUrl, 'PNG', 0, postion, imgWidth, imgHeight);
      let pdfInvoiceName = `Invoice-${Date.now()}.pdf`
      pdfInvoice.save(pdfInvoiceName) // generating pdf
    }).catch(error => {
      // console.log(error);
      this.toastr.error('Error in invoice downloading');
    })
  }

}
