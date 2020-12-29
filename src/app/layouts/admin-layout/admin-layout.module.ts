import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { MypatientsComponent } from '../../mypatients/mypatients.component';
import { CreatePatientComponent } from '../../create-patient/create-patient.component';
import { CreatePrescriptionComponent } from '../../create-prescription/create-prescription.component';
import { MyVisitComponent } from '../../my-visit/my-visit.component';
import { CreateVisitComponent } from '../../create-visit/create-visit.component';
import { MycalanderComponent } from '../../mycalander/mycalander.component';
import { PromotionsComponent } from '../../promotions/promotions.component'
import { CreatePromotionsComponent } from '../../create-promotions/create-promotions.component';
import { SubscriptionComponent } from '../../subscription/subscription.component';
import { MyProfileComponent } from '../../my-profile/my-profile.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { SettingComponent } from '../../setting/setting.component';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule } from '../../shared.module';
import { ChangePasswordComponent } from '../../change-password/change-password.component';
import { FilterPipe } from '../../pipes/pipe';
import { AddReportComponent } from '../../add-report/add-report.component';
import { SearchResultComponent } from '../../search-result/search-result.component';
import { BySubscriptionComponent } from '../../by-subscription/by-subscription.component';
import { CheckoutComponent } from '../../checkout/checkout.component';
import { NotificationDetailsComponent } from '../../notification-details/notification-details.component';
import { PrescriptionFormComponent } from '../../prescription-form/prescription-form.component';
import { PreviousePlanComponent } from '../../previouse-plan/previouse-plan.component';
import { InvoiceComponent } from '../../invoice/invoice.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {NgxPrintModule} from 'ngx-print';
import { NewsFeedsComponent } from '../../news-feeds/news-feeds.component';
import { ArticleComponent } from '../../article/article.component';
import { ArticleListComponent } from '../../article-list/article-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgxPaginationModule,
    BlockUIModule.forRoot(),
    SharedModule,
    SlickCarouselModule,
    NgxPrintModule

  ],
  declarations: [
    DashboardComponent,
    MypatientsComponent,
    CreatePatientComponent,
    CreatePrescriptionComponent,
    MyVisitComponent,
    CreateVisitComponent,
    MycalanderComponent,
    PromotionsComponent,
    CreatePromotionsComponent,
    SubscriptionComponent,
    UserProfileComponent,
    MyProfileComponent,
    SettingComponent,
    ChangePasswordComponent, FilterPipe,

    AddReportComponent,
    SearchResultComponent,
    BySubscriptionComponent,
    CheckoutComponent,
    NotificationDetailsComponent,
    PrescriptionFormComponent,
    PreviousePlanComponent,
    NewsFeedsComponent,
    InvoiceComponent,
    ArticleComponent,
    ArticleListComponent
  ]
})

export class AdminLayoutModule { }
