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


     private verifymessageSource = new BehaviorSubject<string>("");
    verifycurrentMessage = this.verifymessageSource.asObservable();


    private verifyerrormessageSource = new BehaviorSubject<string>("");
    verifyerrorMessage = this.verifyerrormessageSource.asObservable();


    private forgertmessageSource = new BehaviorSubject<string>("");
    forgetMessage = this.forgertmessageSource.asObservable();

  private invalidUrlSource = new BehaviorSubject<string>("");
  invalidUrl = this.invalidUrlSource.asObservable();


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

    verifySuccessMessage(message:string)
    {
        this.verifymessageSource.next(message)
   }

    verifyErrorMessage(error:string)
    {

        this.verifyerrormessageSource.next(error)

    }


     forgertMessage(error:string)
    {

        this.forgertmessageSource.next(error)

    }

  invalidUrlFunc(error:string)
  {

    this.invalidUrlSource.next(error)

  }
}
