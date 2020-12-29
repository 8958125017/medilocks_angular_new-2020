import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { BlockUIModule } from 'ng-block-ui';
// import { CookieService } from 'ngx-cookie-service';


import { ApiIntegrationService } from './api-integration.service';
import { ConstantModule} from './constants';

import { HttpErrorInterceptor} from './errorInterceptor';
import { ConnectionService } from 'ng-connection-service';

import { GlobalConstant } from './globalconstant';
import { MessageService } from './messageservice.service';


import { AppComponent } from './app.component';

// ****************Home Page Componet start here***********************//

import { HomeComponent } from './home/home.component';
import { HeaderOneComponent } from './home-layouts/header-one/header-one.component';
import { HeaderTwoComponent } from './home-layouts/header-two/header-two.component';
import { HeaderThreeComponent } from './home-layouts/header-three/header-three.component';
import { HeaderFourComponent } from './home-layouts/header-four/header-four.component';
import { FooterComponent } from './home-layouts/footer/footer.component';
import { LiveDataComponent } from './home-layouts/live-data/live-data.component';
import { OnepageNavbarComponent } from './home-layouts/onepage-navbar/onepage-navbar.component';
import { PreloaderComponent } from './home-layouts/preloader/preloader.component';

// ****************Home Page Componet end here***********************//

// For OPT Input Focus
//import { NgOtpInputModule } from  'ng-otp-input';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentResponseStatusComponent } from './payment-response-status/payment-response-status.component';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularEditorModule,
    ComponentsModule,
    ToastrModule.forRoot(),
    RouterModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BlockUIModule.forRoot(),
    //NgOtpInputModule

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ForgotPassComponent,
    PageNotFoundComponent,

    PreloaderComponent,
    FooterComponent,
    FooterComponent,
    HeaderOneComponent,
    HeaderTwoComponent,
    HeaderThreeComponent,
    HeaderFourComponent,
    OnepageNavbarComponent,
    LiveDataComponent,
    PaymentResponseStatusComponent

  ],
  providers: [
               ApiIntegrationService,
               ConstantModule,
               GlobalConstant,
               MessageService
               // CookieService
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
