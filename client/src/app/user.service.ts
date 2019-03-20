import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import {User} from './Model/user';
import {CandidateProfile} from './Model/CandidateProfile';
import { DataService } from './data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, throwError} from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import {environment} from '../environments/environment';

const URL = environment.backend_url;

@Injectable()
export class UserService {


  currentUser: User;
  token;
  constructor(private http: HttpClient,private route: ActivatedRoute,
              private router: Router ,private dataservice: DataService)
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser)
    {
      this.token = this.currentUser.jwt_token;
    }

  }

  getAll()
  {
    return this.http.get(URL+'users', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  candidate_detail(_id :any )
  {
    return this.http.post(URL+'users/candidate_detail', {_id:_id}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error )
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }
    }));

  }


  getById(_id: string)
  {
    return this.http.get(URL+'users/current/' + _id,  {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {

      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  getProfileById(_id:string)
  {
    return this.http.get(URL+'users/current/' + _id,  {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        console.log(res);
        if(!res['candidate'].terms_id)
        {
          this.router.navigate(['/terms-and-condition']);
        }

        else if(!res['contact_number'] || !res['nationality'] || !res['first_name'] || !res['last_name'])
        {
          this.router.navigate(['/about']);
        }
        else if(!res['candidate'].employee && !res['candidate'].contractor && !res['candidate'].volunteer)
        {
          this.router.navigate(['/job']);
        }
        else if(!res['candidate'].why_work && !res['candidate'].interest_areas)
        {
          this.router.navigate(['/resume']);
        }

        else if(!res['candidate'].description)
        {
          this.router.navigate(['/experience']);

        }

        else
        {
          return res;
        }
        // return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  getByRefrenceCode(code: string){

    return this.http.post(URL+'users/get_refrence_code', {code:code} )
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error)
        {
          return throwError(error);
        }

      }));
  }

  getReferenceDetail(email: string){

    return this.http.post(URL + 'users/get_refrence_detail',  {email:email},{
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error )
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }


  createCandidate(inputBody: any)
  {
    return this.http.post(URL+'v2/users/candidates', inputBody) .pipe(map(user => {
      return user
    }));

  }

  create(user: User)
  {
    return this.http.post(URL+'users/candidates', user) .pipe(map(user => {
      return user
    }));

  }

  create_employer(employer: any)
  {
    return this.http.post(URL+'users/create_employer', employer) .pipe(map(employer => {
      return employer
    }));

  }

  upload(image: string)
  {
    return this.http.post(URL+'/about', image) .pipe(map(user => {
      return image;
    }));
  }

  update(user: User)
  {
    return this.http.put(URL+'users/' + user._id, user);

  }

  forgot_password(email: string)
  {
    //return this.http.put('http://localhost:4000/users/forgot_password/' + email , '');
    return this.http.put(URL+'users/forgot_password/' + email , '')
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error)
        {
          if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }
          else return throwError(error);
        }
      }));

  }

  verify_client(email: string)
  {
    //return this.http.put('http://localhost:4000/users/forgot_password/' + email , '');
    return this.http.put(URL+'users/verify_client/' + email , '') .pipe(map(data => {
      return data;
    }));

  }

  delete(_id: string)
  {
    return this.http.delete(URL+'users/' + _id);
  }

  candidate_login(queryInput : any)
  {
    return this.http.post(URL+'v2/users/auth', queryInput)
      .pipe(map(user => {
        if (user)
        {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }
        else
        {
          return user;
        }

      }));
  }

  terms(user_id: string, data: any)
  {

    return this.http.put(URL+'users/welcome/terms', data , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);                }
    }));

  }

  prefilled_profile(basics: any , work:any , education : any)
  {

    return this.http.put(URL+'users/welcome/prefilled_profile' , {basics : basics , workHistory : work , educationHistory : education} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  about(user_id: string, detail: any)
  {

    return this.http.put(URL+'users/welcome/about' , detail , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error )
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  job(user_id: string, detail: CandidateProfile)
  {

    return this.http.put(URL+'users/welcome/job' , detail , {
      headers: new HttpHeaders().set('Authorization', this.token)
    } ).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  experience(user_id: string,detail : any ,  exp : any , history : any,language_roles :any )
  {

    return this.http.put(URL+'users/welcome/exp' , { detail :detail , education: exp  , work : history ,  language_exp : language_roles  } , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }
    }));

  }

  company_terms(user_id: string, detail: any)
  {

    return this.http.put(URL+'users/company_wizard' , detail, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));                }

    }));
  }

  about_company(user_id: string, detail: any)
  {

    return this.http.put(URL+'users/about_company' , detail, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));
      }

    }));
  }

  company_image(imageObject: any)
  {

    return this.http.post(URL+ 'users/employer_image' , imageObject, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));
      }

    }));
  }


  candidate_prefernece(prefernces: any)
  {

    return this.http.put(URL + 'users/saved_searches' , {saved_searches : prefernces }, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));
      }

    }));
  }


  verify_email(email_hash: string)
  {
    return this.http.put(URL+'users/emailVerify/'+ email_hash , '').pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }
    }));
  }

  reset_password(hash: string, data: User)
  {

    return this.http.put(URL+'users/reset_password/' + hash, data)
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error)
        {
          if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }
          else return throwError(error);
        }

      }));
  }

  change_password(params : any)
  {

    return this.http.put(URL+'users/change_password' , params, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
      {
        localStorage.setItem('jwt_not_found', 'Jwt token not found');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('googleUser');
        localStorage.removeItem('close_notify');
        localStorage.removeItem('linkedinUser');
        localStorage.removeItem('admin_log');
        window.location.href = '/login';
      }
      else return throwError(error);

    }));
  }

  send_refreal(email: string, subject: string, body: string,share_url: string, first_name: string, last_name: string){
    return this.http.post(URL+'users/send_refreal/', { email: email, subject: subject, body: body,share_url:share_url,first_name:first_name,last_name:last_name }, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  getCurrentCompany(_id: string)
  {
    return this.http.get(URL+'users/current_company/' +_id, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {

      if (res)
      {
        return res  ;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
        {
          this.router.navigate(['/not_found']);
        }

        else return throwError(new Error(error));
      }

    }));
  }

  get_user_messages_comp(receiver_id: string)
  {
    return this.http.get(URL+'v2/conversations/'+receiver_id+'/messages/', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {

      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  get_user_messages(receiver_id: string, sender_id: any)
  {
    let queryString = '?user_id='+sender_id+'&admin=true';
    //return this.http.get(URL+'v2/conversations/'+queryString, {
    return this.http.get(URL+'v2/conversations/'+receiver_id+'/messages'+queryString , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {

      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  get_user_messages_only_comp()
  {
    return this.http.get(URL+'v2/conversations', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

  get_user_messages_only(id:any)
  {
    let queryString = '?user_id='+id+'&admin=true';
    return this.http.get(URL+'v2/conversations/'+queryString, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

  /////candidate edit profile

  edit_candidate_profile(user_id : any,queryBody: any, admin:boolean)
  {
    let urlString;
    if(admin === true) urlString = URL+'v2/users/' +user_id+ '/candidates?admin='+ true;
    else urlString = URL+'v2/users/' +user_id+ '/candidates';

    return this.http.patch( urlString, queryBody , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  edit_company_profile(queryBody :any   )
  {
    return this.http.patch(URL+'v2/users/'+ this.currentUser._id +'/companies', queryBody , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(new Error(error));
      }

    }));
  }

  //////////////filters function call////////////////////////////////
  getVerrifiedCandidate(current : string)
  {
    return this.http.post(URL+'users/verified_candidate' , {_id : current} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error )
        {
          if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }
          else return throwError(error);
        }

      }));

  }


  filterSearch(queryBody : any)
  {
    return this.http.post(URL+'users/filter', queryBody, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error )
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  send_file(formData: any)
  {
    return this.http.post(URL+'v2/messages',formData, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

  refered_id(_id: number , data : number)
  {
    return this.http.put(URL+'users/refered_id/' + _id, {info : data} ,  {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map(data => {

      if (data)
      {
        return data;
      }

    }));
  }
  //////////////call admin functions//////////////////
  aprrove_user(user_id:string , detail :number )
  {

    return this.http.put(URL+'users/approve/' + user_id, {is_approve : detail}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }



  admin_candidate_filter(queryBody:any)
  {
    return this.http.post(URL+'users/admin_candidate_filter', queryBody, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  update_candidate_profile(user_id: string, detail: any,  edu :any , history:any )
  {

    return this.http.post(URL+'users/update_candidate_profile' , { user_id : user_id ,detail: detail, education: edu  , work : history} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }
  allCompanies()
  {
    return this.http.get(URL+'users/company', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }



  admin_company_filter(queryBody : any)
  {
    return this.http.post(URL+'users/admin_company_filter', queryBody, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  update_chat_msg_status_new(sender_id: string){
    return this.http.patch(URL+'v2/conversations/'+sender_id+'/messages', {},{
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  update_chat_msg_status(receiver_id: string,status:number){
    return this.http.post(URL+'users/update_chat_msg_status', {receiver_id:receiver_id,status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  pages_content(info:any )
  {
    return this.http.put(URL+'users/add_privacy_content/', info,  {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  get_page_content(title :string)
  {
    return this.http.get(URL+'users/get_pages_content/'+ title);

  }

  send_message(receiver_id:string,msg_tag:string, message:any){
    return this.http.post(URL+'v2/messages', {receiver_id:receiver_id,msg_tag:msg_tag,message:message}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

  set_unread_msgs_emails_status(status: any)
  {
    return this.http.post(URL+'users/set_unread_msgs_emails_status', {status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(new Error(error.status));
      }

    }));
  }

  account_settings(user_id: string, status: any)
  {
    return this.http.post(URL+'users/account_settings', {user_id:user_id,status:status} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  destroyToken(_id:string)
  {
    return this.http.post(URL+'users/destroy_token', {id:_id} , {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));

  }

  updateExplanationPopupStatus(status:any){
    return this.http.post(URL+'users/updatePopupStatus', {status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  add_new_pages_content(info:any ) {
    return this.http.put(URL + 'users/add_terms_and_conditions_content/', info, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res) {
        return res;
      }
    }), catchError((error: any) => {
      if (error.status) {
        return throwError(new Error(error.status));
      }
    }));
  }

  getUnreadMessageCount(sender_id:string) {
    return this.http.get(URL+'v2/messages?sender_id='+sender_id, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res) {
        return res;
      }
    }), catchError((error: any) => {
      if (error.status) {
        return throwError(new Error(error.status));
      }
    }));
  }

  getLastJobDesc() {
    return this.http.get(URL+'v2/messages/', {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res) {
        return res;
      }
    }), catchError((error: any) => {
      if (error.status) {
        return throwError(new Error(error.status));
      }
    }));
  }

  getRefCode(email:any) {
    return this.http.post(URL+'users/get_ref_code', {email:email} )
      .pipe(map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }), catchError((error: any) =>
      {
        if (error )
        {
          return throwError(error);
        }

      }));
  }
  uploadCandImage(detail: any) {
    return this.http.post(URL + 'users/image', detail, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) => {
      if (res) {
        return res;
      }
    }), catchError((error: any) => {
      if (error) {
        if (error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false) {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }
    }));
  }

  autoSuggestOptions(queryInput:any, country : boolean) {
    let input = {'autosuggest' :queryInput , 'countries' : country };
    return this.http.post(URL+'users/auto_suggest/'+{}, input ,{
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }

  get_users_statistics()
  {
    return this.http.get(URL+'users/statistics');

  }

  candidate_status_history(user_id: string,queryInput:any , admin:boolean)
  {
    let urlString;
    if(admin === true) urlString = URL+'v2/users/'+ user_id +'/candidates/history?admin='+ true;
    else urlString = URL+'v2/users/'+ user_id +'/candidates/history';

    return this.http.post(urlString , queryInput, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error)
      {
        if(error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false)
        {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        else return throwError(error);
      }

    }));
  }


  add_to_subscribe_list(first_name:string, last_name:string, email:string){
    return this.http.post(URL+'v2/subscribers', {first_name:first_name,last_name:last_name,email:email}).pipe(map((res: Response) =>
    {
      if (res)
      {
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error.status )
      {
        return throwError(error);
      }

    }));
  }

}
