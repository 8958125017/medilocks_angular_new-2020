import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { MypatientsComponent } from '../../mypatients/mypatients.component';
import { CreatePatientComponent } from '../../create-patient/create-patient.component';
import { AddReportComponent } from '../../add-report/add-report.component';
import { CreatePrescriptionComponent } from '../../create-prescription/create-prescription.component';
import { MyVisitComponent } from '../../my-visit/my-visit.component';
import { CreateVisitComponent } from '../../create-visit/create-visit.component';
import { MycalanderComponent } from '../../mycalander/mycalander.component';
import { PromotionsComponent } from '../../promotions/promotions.component'
import { CreatePromotionsComponent } from '../../create-promotions/create-promotions.component';
import { SubscriptionComponent } from '../../subscription/subscription.component';
import { MyProfileComponent } from '../../my-profile/my-profile.component';
import { SettingComponent } from '../../setting/setting.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ChangePasswordComponent } from '../../change-password/change-password.component';
import { SearchResultComponent } from '../../search-result/search-result.component';
import { AuthGuardService } from '../../auth-guard.service';
import { BySubscriptionComponent } from '../../by-subscription/by-subscription.component';
import { CheckoutComponent } from '../../checkout/checkout.component';
import { NotificationDetailsComponent } from '../../notification-details/notification-details.component';
import { PrescriptionFormComponent } from '../../prescription-form/prescription-form.component';
import { PreviousePlanComponent } from '../../previouse-plan/previouse-plan.component';
import {PaymentResponseStatusComponent} from '../../payment-response-status/payment-response-status.component';
import { NewsFeedsComponent } from '../../news-feeds/news-feeds.component';
//import { PaymentResponseStatusComponent } from '../../payment-response-status/payment-response-status.component';
import { InvoiceComponent } from 'src/app/invoice/invoice.component';
import { ArticleComponent } from 'src/app/article/article.component';
import { ArticleListComponent } from '../../article-list/article-list.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
    { path: 'mypatient', component: MypatientsComponent, canActivate: [AuthGuardService] },
    { path: 'createpatient', component: CreatePatientComponent, canActivate: [AuthGuardService] },
    { path: 'createPrescription/:id', component: CreatePrescriptionComponent, canActivate: [AuthGuardService] },
    { path: 'mypatient/:id', component: MypatientsComponent, canActivate: [AuthGuardService] },
    { path: 'createVisit/:id', component: CreateVisitComponent, canActivate: [AuthGuardService] },
    { path: 'createPromotions', component: CreatePromotionsComponent, canActivate: [AuthGuardService] },
    { path: 'promotions', component: PromotionsComponent, canActivate: [AuthGuardService] },
    { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuardService] },
    { path: 'myVisit', component: MyVisitComponent, canActivate: [AuthGuardService] },
    { path: 'mycalander', component: MycalanderComponent, canActivate: [AuthGuardService] },
    { path: 'myProfile', component: MyProfileComponent, canActivate: [AuthGuardService] },
    { path: 'setting', component: SettingComponent, canActivate: [AuthGuardService] },
    { path: 'userProfile', component: UserProfileComponent, canActivate: [AuthGuardService] },
    { path: 'changePassword', component: ChangePasswordComponent, canActivate: [AuthGuardService] },
    { path: 'addReport/:id', component: AddReportComponent, canActivate: [AuthGuardService] },
    { path: 'searchResult/:patientName', component: SearchResultComponent, canActivate: [AuthGuardService] },
    { path: 'searchResult', component: SearchResultComponent, canActivate: [AuthGuardService] },
    { path: 'bySubscription/:id', component: BySubscriptionComponent, canActivate: [AuthGuardService] },
    { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuardService] },
    { path: 'notificationDetails', component: NotificationDetailsComponent, canActivate: [AuthGuardService] },
    { path: 'prescriptionForm/:id', component: PrescriptionFormComponent, canActivate: [AuthGuardService] },
    { path: 'previousePlan', component: PreviousePlanComponent, canActivate: [AuthGuardService] },
    { path: 'paymentStatus', component: PaymentResponseStatusComponent, canActivate: [AuthGuardService] },
    { path: 'newsFeed', component: NewsFeedsComponent, canActivate: [AuthGuardService] },
    { path: 'article', component: ArticleComponent, canActivate: [AuthGuardService] },
    { path: 'invoice/:id', component: InvoiceComponent, canActivate: [AuthGuardService] },
    { path: 'articleList', component: ArticleListComponent, canActivate: [AuthGuardService] }
];
