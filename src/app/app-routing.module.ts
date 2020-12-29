import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuardService}from'./auth-guard.service';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes =[
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }, 

  {
    path: 'forgotpassword',
    component: ForgotPassComponent,
  },

  {
    path: 'signup',
    component: SignupComponent,
  },

  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
         path: '',
        loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
  }]},
  {
    path: '**', 
    redirectTo: '/page-not-found'
  },


];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})

export class AppRoutingModule { }