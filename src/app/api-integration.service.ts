import { Injectable } from '@angular/core';
import { ConstantModule } from './constants'
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { retry, catchError } from 'rxjs/operators';

import * as Rx from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Route, Router } from "@angular/router";
import { BehaviorSubject, Subject } from 'rxjs/Rx';


@Injectable({
  providedIn: 'root'
})

export class ApiIntegrationService {
  public httpOptions: any
  public baseURL = this.constants.basePath;
  public baseURL2 = this.constants.basePath2;
  constructor(private http: HttpClient, private constants: ConstantModule) {
    // const token = sessionStorage.getItem('authtkn');
    // httpOptions = httpOptions = {
    //                      headers: new HttpHeaders(
    //                        { 'Content-Type': 'application/json' ,
    //                          'x-medilocks-auth-token': token

    //                        })
    //                    };
  }

  sendOtp(data) {
    return this.http.post(this.baseURL + 'doctor/sendOTP', data).pipe(
      retry(5)
    );
  }
  signup(data) {
    return this.http.post(this.baseURL + 'doctor/signUp', data).pipe(
      retry(5)
    );
  }

  verifyOTP(data) {
    return this.http.post(this.baseURL + 'doctor/verifyOTP', data).pipe(
      retry(5)
    );
  }

  login(data) {
    return this.http.post(this.baseURL + 'doctor/login', data).pipe(
      retry(5)
    );
  }

  forgetPassword(data) {
    return this.http.post(this.baseURL + 'doctor/forgotPassword', data).pipe(
      retry(5)
    );
  }
  verifyEmail(data) {
    return this.http.post(this.baseURL + 'doctor/verifyEmail', data).pipe(
      retry(5)
    );
  }
  updateEmail(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/updateEmail', data, httpOptions).pipe(
      retry(5)
    );
  }
  updateMobNo(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/updateMobNo', data, httpOptions).pipe(
      retry(5)
    );
  }
  resetPassword(data) {
    return this.http.post(this.baseURL + 'doctor/resetPassword', data).pipe(
      retry(5)
    );
  }



  //-------------Dashboard api service start here------------------//

  doctorSearch(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/doctorSearch', data, httpOptions).pipe(
      retry(1)
    );
  }

  doctorSearchHome(data) {
    return this.http.post(this.baseURL + 'doctor/doctorSearchHome', data).pipe(
      retry(1)
    );
  }

  setToggle(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/setToggle', data, httpOptions).pipe(
      retry(1)
    );
  }

  profileCompletionPercent(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/profileCompletionPercent', data, httpOptions).pipe(
      retry(1)
    );
  }

  getStatusWiseCountOfPatient(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getStatusWiseCountOfPatient', data, httpOptions).pipe(
      retry(1)
    );
  }

  getTodayVisit(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getTodayVisit', data, httpOptions).pipe(
      retry(2)
    );
  }
  getBookingRecord(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getBookingRecord', data, httpOptions).pipe(
      retry(2)
    );
  }

  getFrequentVisit(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getFrequentVisit', data, httpOptions).pipe(
      retry(2)
    );
  }

  getGraphData(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getFrequentVisit', data, httpOptions).pipe(
      retry(2)
    );
  }
  getNewsFeed(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getNewsFeed', data, httpOptions).pipe(
      retry(2)
    );
  }

  getShortNews(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getShortNews', data, httpOptions).pipe(
      retry(2)
    );
  }

  getParticipantsUserCount(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getParticipantsUserCount', data, httpOptions).pipe(
      retry(2)
    );
  }

  getDoctorRating(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getDoctorRating', data, httpOptions).pipe(
      retry(2)
    );
  }

  dashBoardGraph(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/dashBoardGraph', data, httpOptions).pipe(
      retry(2)
    );
  }

  unreadNotificationsCount(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/unreadNotificationsCount', data, httpOptions).pipe(
      retry(2)
    );
  }

  getallnotifications(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getallnotifications', data, httpOptions).pipe(
      retry(2)
    );
  }


  //--------------------------Dashboard api service End here-------------------------------//

  //--------------------------Patients Api Intregrated start here-------------------------//
  httpOption: any;
  uploaddoc(data) {

    const token = sessionStorage.getItem('authtkn');
    this.httpOption = {
      headers: new HttpHeaders(
        {
          // 'Content-Type': 'multipart/form-data; boundary=--------------------------828783833938347658637552' ,
          'x-medilocks-auth-token': token

        })
    };
    return this.http.post(this.baseURL + 'doctor/uploadDoc', data, this.httpOption).pipe(
      retry(2)
    );
  }

  uploadChatFile(data) {
    const token = sessionStorage.getItem('authtkn');
    this.httpOption = {
      headers: new HttpHeaders(
        {
          // 'Content-Type': 'multipart/form-data; boundary=--------------------------828783833938347658637552' ,
          'x-medilocks-auth-token': token

        })
    };
    return this.http.post(this.baseURL + 'doctor/uploadChatFile', data, this.httpOption).pipe(
      retry(2)
    );
  }

  addPatients(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/addPatient', data, httpOptions).pipe(
      retry(2)
    );
  }

  getAllPatients(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getPatient', data, httpOptions).pipe(
      retry(2)
    );
  }

  getPatientDetails(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getPatientDetails', data, httpOptions).pipe(
      retry(2)
    );
  }

  getPendingUsersOnChat(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getPendingUsersOnChat', data, httpOptions).pipe(
      retry(2)
    );
  }

  addMember(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/addMember', data, httpOptions).pipe(
      retry(2)
    );
  }

  getParentMember(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getParentMember', data, httpOptions).pipe(
      retry(2)
    );
  }

  getChildMember(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getChildMember', data, httpOptions).pipe(
      retry(2)
    );
  }

  getFamilyMember(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getFamilyMember', data, httpOptions).pipe(
      retry(2)
    );
  }


  chatSearch(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/chatSearch', data, httpOptions).pipe(
      retry(2)
    );
  }

  changeRequestStatus(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/changeRequestStatus', data, httpOptions).pipe(
      retry(2)
    );
  }

  sendChatMessage(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/sendChatMessage', data, httpOptions).pipe(
      retry(2)
    );
  }

  getUserChatHistory(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getUserChatHistory', data, httpOptions).pipe(
      retry(2)
    );
  }

  endChatByDoctor(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/endChatByDoctor', data, httpOptions).pipe(
      retry(2)
    );
  }


  getTaskBoardDetails(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getTaskBoardDetails', data, httpOptions).pipe(
      retry(2)
    );
  }

  //-----------------------patients Api Intregrated end here------------------------------//

  //-----------------------add card deatils (Setting page) api start here----------------//


  addCardDetails(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/addCardDetails', data, httpOptions).pipe(
      retry(2)
    );
  }

  getCardDetails(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getCardDetails', data, httpOptions).pipe(
      retry(2)
    );
  }

  verifyUpdateEmail(data) {
    return this.http.post(this.baseURL + 'doctor/resetPassword', data).pipe(
      retry(5)
    );
  }
  //-----------------------------Setting page api end here-----------------------------------//




  //-------------------------------Prescription services start here--------------------------//

  createPrescription(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/createPrescription', data, httpOptions).pipe(
      retry(2)
    );
  }

  getPrescription(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getPrescription', data, httpOptions).pipe(
      retry(2)
    );
  }

  //-----------------------------Prescription services start here-----------------------------//

  //-----------------------------Promotion services start here-------------------------------//

  createPromotion(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/createPromotion', data, httpOptions).pipe(
      retry(2)
    );
  }

  getAllPromo(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getAllPromo', data, httpOptions).pipe(
      retry(2)
    );
  }

  getPromo(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getPromo', data, httpOptions).pipe(
      retry(2)
    );
  }

  sendPromotion(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/sendPromotion', data, httpOptions).pipe(
      retry(2)
    );
  }

  //---------------------------Prescription services start here-------------------------------//

  //--------------------------subscription services start here-------------------------------//

  createSubscriptionPlan(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/createSubscriptionPlan', data, httpOptions).pipe(
      retry(2)
    );
  }

  getSubscriptionPlan(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getSubscriptionPlan', data, httpOptions).pipe(
      retry(2)
    );
  }

  getSubscriptionPlanById(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getSubscriptionPlanById', data, httpOptions).pipe(
      retry(2)
    );
  }

  getSubscriptionWithFeature(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getSubscriptionWithFeature', data, httpOptions).pipe(
      retry(2)
    );
  }

  //------------------------subscription services start here-------------------------------//

  //-------------------------doctor profile service start here-----------------------------//

  getDocById(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getDocById', data, httpOptions).pipe(
      retry(2)
    );
  }

  getSchedule(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getSchedule', data, httpOptions).pipe(
      retry(2)
    );
  }

  manageSchedule(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/manageSchedule', data, httpOptions).pipe(
      retry(2)
    );
  }

  updateProfile(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/updateProfile', data, httpOptions).pipe(
      retry(2)
    );
  }

  //-------------------------doctor profile service end here-----------------------------//

  //------------------------- Visit service start here-----------------------------//

  addVisit(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/addVisit', data, httpOptions).pipe(
      retry(2)
    );
  }

  addVisitHome(data) {
    return this.http.post(this.baseURL + 'doctor/addVisitHome', data).pipe(
      retry(2)
    );
  }
  //-------------------------Visit service end here-----------------------------//


  getAvailableSlot(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getAvailableSlot', data, httpOptions).pipe(
      retry(2)
    );
  }

  getAvailableSlotHome(data) {
    return this.http.post(this.baseURL + 'doctor/getAvailableSlotHome', data).pipe(
      retry(2)
    );
  }


  createReport(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/createReport', data, httpOptions).pipe(
      retry(2)
    );
  }

  getBookedSlotByDate(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getBookedSlotByDate', data, httpOptions).pipe(
      retry(2)
    );
  }

  searchPatient(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/searchPatient', data, httpOptions).pipe(
      retry(2)
    );
  }


  getBloodGroup(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getBloodGroup', data, httpOptions).pipe(
      retry(2)
    );
  }


  getPromotionCount(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getPromotionCount', data, httpOptions).pipe(
      retry(2)
    );
  }



  getState(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getState', data, httpOptions).pipe(
      retry(2)
    );
  }

  getCity(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getCity', data, httpOptions).pipe(
      retry(2)
    );
  }

  searchSpecialization(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/searchSpecialization', data, httpOptions).pipe(
      retry(2)
    );
  }

  getBookedSlotMonthwise(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getBookedSlotMonthwise', data, httpOptions).pipe(
      retry(2)
    );
  }


  updateVisitTimeSlot(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/updateVisitTimeSlot', data, httpOptions).pipe(
      retry(2)
    );
  }

  getInvoice(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getInvoiceByUserId', data, httpOptions).pipe(
      retry(2)
    );
  }



  //-------------------------Create News service start here added by Ajeet-----------------------------//

  createNews(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/createnewsfeed', data, httpOptions).pipe(
      retry(2)
    );
  }

  getCategory(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/newsCategory', data, httpOptions).pipe(
      retry(2)
    );
  }

  //-------------------------Create News service end here-----------------------------//


























  private messageSource = new BehaviorSubject('test');
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  // for download excel/pdf/images file saver
  downloadStaticFile(filePath, fileName) {
    this.http.get(filePath, { responseType: "blob", headers: { 'Accept': 'application/vnd.ms-excel' } })
      .subscribe(blob => {
        saveAs(blob, fileName);
      });
  }

  // for checkout PayU Money

  checkOutPayUMoney(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/checkOutPayUMoney', data, httpOptions).pipe(
      retry(2)
    );
  }

  getPaymentDetailStatus(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getPaymentDetailStatusById', data, httpOptions).pipe(
      retry(2)
    );
  }

  getPatientDetailsHome(data) {
    return this.http.post(this.baseURL + 'doctor/getPatientDetailsHome', data).pipe(
      retry(2)
    );
  }

  getPlanByUserId(data) {
    const token = sessionStorage.getItem('authtkn');
    const httpOptions = this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-medilocks-auth-token': token }) };
    return this.http.post(this.baseURL + 'doctor/getPlanByUserId', data, httpOptions).pipe(
      retry(2)
    );
  }
}
