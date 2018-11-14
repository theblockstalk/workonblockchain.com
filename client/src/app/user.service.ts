import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import {User} from './Model/user';
import {CandidateProfile} from './Model/CandidateProfile';
import { Observable } from 'rxjs/Observable';
import { DataService } from "./data.service";
import { Router, ActivatedRoute,NavigationExtras } from '@angular/router';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

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
          ////console.log(this.token);
      }
      ////console.log(this.currentUser);

  }

    getAll()
    {
        return this.http.get<any>(URL+'users', {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });
    }

    candidate_detail(_id :any )
    {
         return this.http.post<any>(URL+'users/candidate_detail', {_id:_id}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });

    }


    getById(_id: string)
    {
        return this.http.get<any>(URL+'users/current/' + _id,  {
            headers: new HttpHeaders().set('Authorization', this.token)
        }).map((res: Response) =>
            {

                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });
    }

    getProfileById(_id:string)
    {
        return this.http.get<any>(URL+'users/current/' + _id,  {
            headers: new HttpHeaders().set('Authorization', this.token)
        }).map((res: Response) =>
            {
                if (res)
                {
                    if(!res['terms_id'])
                {
                     this.router.navigate(['/terms-and-condition']);

                }

               else if(!res['contact_number'] || !res['nationality'] || !res['first_name'] || !res['last_name'])
               {
                        this.router.navigate(['/about']);
               }
               else if(res['locations'].length < 1  || res['roles'].length < 1 || res['interest_area'].length < 1 || !res['expected_salary'] || !res['current_salary'] )
               {

                    this.router.navigate(['/job']);
                }
                else if(!res['why_work'] )
                {
                    this.router.navigate(['/resume']);
                }

                else if(!res['description'])
                {
                    this.router.navigate(['/experience']);

                }

                else
                {
                        return res;
                 }
                       // return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });

    }

    getVerifiedCandidateDetail(_id:string)
    {
         return this.http.get<any>(URL+'users/verified_candidate_detail/'+_id,  {
            headers: new HttpHeaders().set('Authorization', this.token)
        }).map((res: Response) =>
            {
            //console.log(res);
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                //console.log(error.status);
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }




    getByRefrenceCode(code: string){

        return this.http.post<any>(URL+'users/get_refrence_code', {code:code} )
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

  getReferenceDetail(email: string){

    return this.http.post<any>(URL + 'users/get_refrence_detail',  {email:email},{
      headers: new HttpHeaders().set('Authorization', this.token)
    }).map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }).catch((error: any) =>
      {
        if (error.status )
        {
          return Observable.throw(new Error(error.status));
        }

      });
  }


  create(user: User)
    {
        return this.http.post<any>(URL+'users/register', user) .map(user => {
            return user
        });

    }

    create_employer(employer: any)
    {
        return this.http.post<any>(URL+'users/create_employer', employer) .map(employer => {
            return employer
        });

    }

    upload(image: string)
    {
        return this.http.post<any>(URL+'/about', image) .map(user => {
            return image;
        });
    }

    update(user: User)
    {
        return this.http.put(URL+'users/' + user._id, user);

    }

    forgot_password(email: string)
    {
        //return this.http.put('http://localhost:4000/users/forgot_password/' + email , '');
        return this.http.put(URL+'users/forgot_password/' + email , '') .map(data => {
            return data;
        });

    }

    verify_client(email: string)
    {
        //return this.http.put('http://localhost:4000/users/forgot_password/' + email , '');
        return this.http.put(URL+'users/verify_client/' + email , '') .map(data => {
            return data;
        });

    }

    delete(_id: string)
    {
        return this.http.delete(URL+'users/' + _id);
    }

    candidate_login(username: string, password: string, linkedin_id : any)
    {
      return this.http.post<any>(URL+'users/authenticate', { email: username, password: password , linkedin_id  : linkedin_id })
            .map(user => {
                if (user && user.jwt_token)
                {
                    //console.log(user);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    return user;
                }
                else
                {
                ////console.log(user);
                    ////console.log(user.error);
                    return user;

                }


            });
    }

    terms(user_id: string, data: any)
    {

        return this.http.put<any>(URL+'users/welcome/terms', data , {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);                }

            });

    }

    prefilled_profile(basics: any , work:any , education : any)
    {

      return this.http.put<any>(URL+'users/welcome/prefilled_profile' , {basics : basics , workHistory : work , educationHistory : education} , {
        headers: new HttpHeaders().set('Authorization', this.token)
      })
      .map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }).catch((error: any) =>
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
          else return Observable.throw(error);
        }

      });

    }

    about(user_id: string, detail: any)
    {

        return this.http.put<any>(URL+'users/welcome/about' , detail , {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });

    }

    job(user_id: string, detail: CandidateProfile)
    {

        return this.http.put<any>(URL+'users/welcome/job' , detail , {
            headers: new HttpHeaders().set('Authorization', this.token)
        } )
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });

    }

    resume(user_id: string, detail: CandidateProfile)
    {

        return this.http.put<any>(URL+'users/welcome/resume' , detail , {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });




    }

    experience(user_id: string,detail : any ,  exp : any , history : any,language_roles :any , platform_exp : any )
    {

        return this.http.put<any>(URL+'users/welcome/exp' , { detail :detail , education: exp  , work : history ,  language_exp : language_roles , platform_exp : platform_exp } , {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });

    }

    company_terms(user_id: string, detail: any)
    {

        return this.http.put<any>(URL+'users/company_wizard' , detail, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(new Error(error));                }

            });
    }

    about_company(user_id: string, detail: any)
    {

        return this.http.put<any>(URL+'users/about_company' , detail, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(new Error(error));
                }

            });
    }

    logout()
    {
        // remove user from local storage to log user out
       /* localStorage.removeItem('currentUser');
        localStorage.removeItem('googleUser');
         localStorage.removeItem('linkedinUser');
        localStorage.removeItem('admin_log');*/

    }

    upload_image(formData:any)
    {

        return this.http.post(URL+'users/image' , { photo: formData}) .map(img => {
            return img;
        });

    }


    verify_email(email_hash: string)
    {
    //console.log(email_hash);
        return this.http.put(URL+'users/emailVerify/'+ email_hash , '').map(data => {

                    ////console.log(data);
                    return data;



            });
    }

    reset_password(hash: string, data: User)
    {

        return this.http.put<any>(URL+'users/reset_password/' + hash, data)
            .map(data => {

                if (data)
                {
                   // //console.log(data);
                    return data;
                }
                else
                {
                    ////console.log(data);
                    return data.msg;

                }


            });

    }

    change_password(params : any)
    {

        return this.http.put<any>(URL+'users/change_password' , params, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
              else return Observable.throw(error);

            });

    }

    send_refreal(email: string, subject: string, body: string,share_url: string, first_name: string, last_name: string){
        return this.http.post<any>(URL+'users/send_refreal/', { email: email, subject: subject, body: body,share_url:share_url,first_name:first_name,last_name:last_name }, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    getCandidate(sender_id:string,receiver_id:string,is_company_reply:number,type: string)
    {
        return this.http.post<any>(URL+'users/get_candidate', {type:type,sender_id:sender_id,receiver_id:receiver_id,is_company_reply:is_company_reply}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    getCurrentCompany(_id: string)
    {
        return this.http.get<any>(URL+'users/current_company/' +_id, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {

                if (res)
                {
                        return res  ;
                }
            }).catch((error: any) =>
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

                   else return Observable.throw(new Error(error));
                }

            });
    }

    insertMessage(receiver_id:string,sender_name:string,receiver_name:string,message:string,description:string,job_title:string,salary:string,currency:string,date_of_joining:string,job_type:string,msg_tag:string,is_company_reply:number,interview_location:string,interview_time:string)
    {
        return this.http.post<any>(URL+'users/insert_message', {receiver_id:receiver_id,sender_name:sender_name,receiver_name:receiver_name,message:message,description:description,job_title:job_title,salary:salary,currency:currency,date_of_joining:date_of_joining,job_type:job_type,msg_tag:msg_tag,is_company_reply:is_company_reply,interview_location:interview_location,interview_time:interview_time}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    get_user_messages(receiver_id: string, sender_id: any)
    {
        return this.http.post<any>(URL+'users/get_messages', {receiver_id:receiver_id,sender_id:sender_id}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {

                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    get_user_messages_only(id:any)
    {
        return this.http.post<any>(URL+'users/get_user_messages', {id:id}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    /////candidate edit profile

    edit_candidate_profile(user_id: string, detail: any,  edu :any , history:any )
    {

        return this.http.put<any>(URL+'users/update_profile' , { detail: detail, education: edu  , work : history} , {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    edit_company_profile(user_id:string , detail :any )
    {
        return this.http.put<any>(URL+'users/update_company_profile', detail, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(new Error(error));
                }

            });
    }

    //////////////filters function call////////////////////////////////
    getVerrifiedCandidate(current : string)
    {
       return this.http.post<any>(URL+'users/verified_candidate' , {_id : current} , {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });

    }


    searchByWord(word:string)
    {
         return this.http.post<any>(URL+'users/search_word', { search: word}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    filterSearch(word :string , skill : string , location: string , position:any , blockchain:any , avail:string, salary :string ,currency :string)
    {
         return this.http.post<any>(URL+'users/filter', {word : word, skill : skill , location :location , position :position , blockchain : blockchain , availability : avail,salary:salary , currency :currency}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error )
                {
                  console.log(error);
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
                  else return Observable.throw(error);
                }

            });

    }

	send_file(formData: any)
    {
        return this.http.post<any>(URL+'users/insert_chat_file',formData, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

	insert_job_message(formData: any)
    {
        return this.http.post<any>(URL+'users/insert_message_job',formData,{
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

	update_job_message(id:string,status:number)
    {
        return this.http.post<any>(URL+'users/update_job_message', {id:id,status:status}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    refered_id(_id: number , data : number)
    {
          return this.http.put<any>(URL+'users/refered_id/' + _id, {info : data} ,  {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map(data => {

                if (data)
                {
                    ////console.log(data);
                    return data;
                }

            });
    }
    //////////////call admin functions//////////////////
    aprrove_user(user_id:string , detail :number )
    {
        ////console.log(user_id);
       // //console.log(detail);
        return this.http.put<any>(URL+'users/approve/' + user_id, {is_approve : detail}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }



    admin_candidate_filter(is_approve : number , msg_tags : any,word:any)
    {
        return this.http.post<any>(URL+'users/admin_candidate_filter', { is_approve: is_approve , msg_tags : msg_tags, word : word}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }
    allCompanies()
    {
        return this.http.get<any>(URL+'users/company', {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });

    }



    admin_company_filter(is_approve : number , msg_tags : any,word:any)
    {
        return this.http.post<any>(URL+'users/admin_company_filter', { is_approve: is_approve , msg_tags : msg_tags , word:word}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

	update_chat_msg_status(receiver_id: string,status:number){
		return this.http.post<any>(URL+'users/update_chat_msg_status', {receiver_id:receiver_id,status:status}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    pages_content(info:any )
    {
        return this.http.put<any>(URL+'users/add_privacy_content/', info,  {
            headers: new HttpHeaders().set('Authorization', this.token)
        }).map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                //console.log(error.status);
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

    get_page_content(title :string)
    {
        return this.http.get<any>(URL+'users/get_pages_content/'+ title);

    }

	get_job_desc_msgs(receiver_id:string,msg_tag:string){
		return this.http.post<any>(URL+'users/get_job_desc_msgs', {receiver_id:receiver_id,msg_tag:msg_tag}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
	}

	set_unread_msgs_emails_status(status: any)
    {
		return this.http.post<any>(URL+'users/set_unread_msgs_emails_status', {status:status}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

	get_unread_msgs_of_user(sender_id:string){
		return this.http.post<any>(URL+'users/get_unread_msgs_of_user', {sender_id:sender_id}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
	}


    set_disable_status(user_id: string, status: any)
    {
        return this.http.post<any>(URL+'users/set_disable_status', {user_id:user_id,status:status} , {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
        .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
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
                  else return Observable.throw(error);
                }

            });
    }

    destroyToken(_id:string)
    {
        //console.log(this.token);

     return this.http.post<any>(URL+'users/destroy_token', {id:_id} , {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });

    }


	update_is_company_reply_status(id:string,status:number)
    {
        return this.http.post<any>(URL+'users/update_is_company_reply_status', {id:id,status:status}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
    }

	get_employment_offer_info(receiver_id:string,msg_tag:string){
		return this.http.post<any>(URL+'users/get_employ_offer', {receiver_id:receiver_id,msg_tag:msg_tag}, {
            headers: new HttpHeaders().set('Authorization', this.token)
        })
            .map((res: Response) =>
            {
                if (res)
                {
                        return res;
                }
            }).catch((error: any) =>
            {
                if (error.status )
                {
                    return Observable.throw(new Error(error.status));
                }

            });
	}

  updateExplanationPopupStatus(status:any){
    return this.http.post<any>(URL+'users/updatePopupStatus', {status:status}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
      .map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }).catch((error: any) =>
      {
        if (error.status )
        {
          return Observable.throw(new Error(error.status));
        }

      });
  }

  add_new_pages_content(info:any ) {
    return this.http.put<any>(URL + 'users/add_terms_and_conditions_content/', info, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).map((res: Response) => {
      if (res) {
        return res;
      }
    }).catch((error: any) => {
      //console.log(error.status);
      if (error.status) {
        return Observable.throw(new Error(error.status));
      }
    });
  }

  getLastJobDesc() {
    return this.http.post<any>(URL + 'users/get_last_job_desc_msg', {}, {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
      .map((res: Response) => {
        if (res) {
          return res;
        }
      }).catch((error: any) => {
        if (error.status) {
          return Observable.throw(new Error(error.status));
        }
      });
  }

  getRefCode(email:any) {
    return this.http.post<any>(URL+'users/get_ref_code', {email:email} )
      .map((res: Response) =>
      {
        if (res)
        {
          return res;
        }
      }).catch((error: any) =>
      {
        if (error.status )
        {
          return Observable.throw(new Error(error.status));
        }

      });
  }

}
