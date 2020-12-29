import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageService {

  constructor() { }

  private subject = new Subject<any>();
  private subjectSearch = new Subject<any>();
  private subjectPatientId = new Subject<any>();
    sendMessage(message: string) {        
        this.subject.next({ text: message });
    }

    
 
 
    clearMessage() {
        this.subject.next();
    }
 
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    
    searchPatients(message: string) {        
        this.subjectSearch.next({ text: message });
    }
    getSearchPatient(): Observable<any> {
        return this.subjectSearch.asObservable();
    }

    gotaskboardPatient(message: string) {        
        this.subjectPatientId.next({ text: message });
    }
    gettaskboardPatient(): Observable<any> {
        return this.subjectPatientId.asObservable();
    }


}