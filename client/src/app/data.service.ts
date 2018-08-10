import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject<string>("");
  currentMessage = this.messageSource.asObservable();
    
    private emessageSource = new BehaviorSubject<string>("");
  ecurrentMessage = this.emessageSource.asObservable();
    
     private emailmessageSource = new BehaviorSubject<string>("");
    eemailMessage = this.emailmessageSource.asObservable();
    

  constructor() { }

  changeMessage(message: string) 
  {
    this.messageSource.next(message)
  }
    
    errorMessage(message: string) 
    {
    this.emessageSource.next(message)
  }
    
     emailMessage(message: string) {
    this.emailmessageSource.next(message)
  }

}