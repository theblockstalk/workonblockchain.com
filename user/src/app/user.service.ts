import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from './Model/user';
import {CandidateProfile} from './Model/CandidateProfile';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
//const URL = 'http://workonblockchain.mwancloud.com:4000/';
const URL = 'http://localhost:4000/';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

    getAll() 
    {
        return this.http.get<any>(URL+'users');
    }
 
    getById(_id: string) 
    {
        return this.http.get<any>(URL+'users/current/' + _id);
    }
    
    getByRefrenceCode(code: string){
        return this.http.post<any>(URL+'users/get_refrence_code', {code:code}) .map(ref_code => {
            return ref_code
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
 
    delete(_id: string) 
    {
        return this.http.delete(URL+'users/' + _id);
    }

    candidate_login(username: string, password: string) 
    {
      return this.http.post<any>(URL+'users/authenticate', { email: username, password: password })
            .map(user => {
                if (user && user.token) 
                {
                    console.log(user);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    return user;
                }
                else
                {   //console.log(user.error);
                    return user;

                }
 
                
            });
    }

    about(user_id: string, detail: CandidateProfile) 
    {
        
        return this.http.put<any>(URL+'users/welcome/about/' + user_id, detail)
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    //localStorage.setItem('currentUser', JSON.stringify(user));
                    return data;
                }
                else
                {
                    return data.msg;

                }
 
                
            });

    }

    job(user_id: string, detail: CandidateProfile) 
    {
        
        return this.http.put<any>(URL+'users/welcome/job/' + user_id, detail)
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    //localStorage.setItem('currentUser', JSON.stringify(user));
                    return data;
                }
                else
                {
                    return data.msg;

                }
 
                
            });

    }

    resume(user_id: string, detail: CandidateProfile) 
    {
        
        return this.http.put<any>(URL+'users/welcome/resume/' + user_id, detail)
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                else
                {
                    return data.msg;

                }
 
                
            });

    }

    experience(user_id: string, detail: CandidateProfile , exp : CandidateProfile , history : CandidateProfile,language_roles :CandidateProfile , platform_exp : CandidateProfile ) 
    {
        
        return this.http.put<any>(URL+'users/welcome/exp/' + user_id, { detail: detail, education: exp  , work : history ,  language_exp : language_roles , platform_exp : platform_exp })
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                else
                {
                    return data.msg;

                }
 
                
            });

    }
    
    company_terms(user_id: string, detail: any) 
    {
        
        return this.http.put<any>(URL+'users/company_wizard/' + user_id, detail)
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                else
                {
                    return data;

                }
 
                
            });

    }
    
    about_company(user_id: string, detail: any) 
    {
        
        return this.http.put<any>(URL+'users/about_company/' + user_id, detail)
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                else
                {
                    return data;

                }
 
                
            });

    }
 
    logout() 
    {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('googleUser');
    }

    upload_image(formData:any) 
    {
        
        return this.http.post(URL+'users/image' , { photo: formData}) .map(img => {
            return img;
        });

    }

    search(data: String) 
    {
        return this.http.post<any>(URL+'users/search', data) .map(Data => {
            return Data;
        });

    }

    intro(user_id: string, detail: CandidateProfile) 
    {
        
        return this.http.put<any>(URL+'users/welcome/intro/' + user_id, detail)
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    //localStorage.setItem('currentUser', JSON.stringify(user));
                    return data;
                }
                else
                {
                    return data.msg;

                }
 
                
            });

    }

    verify_email(email_hash: string) 
    {
        /*console.log(email_hash);
        return this.http.post<any>('http://localhost:4000/users/emailVerify/'+ email_hash).map(data => {
            return data;
        });*/
        //console.log("dhsdg");
        console.log("data");
        return this.http.put(URL+'users/emailVerify/'+ email_hash , '').map(data => {  
        
           // console.log("data");       
                if (data) 
                {
                    
                    return data;
                }
                else
                {
                    //console.log(data);
                    return data;

                }
 
                
            });
    }

    reset_password(hash: string, data: User) 
    {
        
        return this.http.put<any>(URL+'users/reset_password/' + hash, data)
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                else
                {
                    console.log(data);
                    return data.msg;

                }
 
                
            });

    }   
    
    send_refreal(email: string, subject: string, body: string){
        return this.http.post<any>(URL+'users/send_refreal/', { email: email, subject: subject, body: body })
            .map(data => {
                if (data){
                    return data;
                }
                else{
                    return data.msg;
                }
            });
    }
    
    getCandidate(type: string) 
    {
        return this.http.post<any>(URL+'users/get_candidate', {type:type}) .map(data => {
            return data
        });
    }
    
    getCurrentCompany(_id: string) 
    {
        return this.http.get<any>(URL+'users/current_company/' + _id);
    }
    
    insertMessage(sender_id: string,receiver_id:string,sender_name:string,receiver_name:string,message:string,job_title:string,salary:string,date_of_joining:string,job_type:string,msg_tag:string,is_company_reply:number) 
    {
        return this.http.post<any>(URL+'users/insert_message', {sender_id:sender_id,receiver_id:receiver_id,sender_name:sender_name,receiver_name:receiver_name,message:message,job_title:job_title,salary:salary,date_of_joining:date_of_joining,job_type:job_type,msg_tag:msg_tag,is_company_reply:is_company_reply}) .map(data => {
            return data
        });
    }
    
    get_user_messages(receiver_id: string,sender_id: string) 
    {
        return this.http.post<any>(URL+'users/get_messages', {receiver_id:receiver_id,sender_id:sender_id}) .map(data => {
            return data
        });
    }
    
    get_user_messages_only(id: string) 
    {
        return this.http.post<any>(URL+'users/get_user_messages', {id:id}) .map(data => {
            return data
        });
    }
    
    /////candidate edit profile
    
    edit_candidate_profile(user_id: string, detail: any,  edu :any , history:any ) 
    {
        
        return this.http.put<any>(URL+'users/update_profile/' + user_id, { detail: detail, education: edu  , work : history})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });

    }
    
    edit_company_profile(user_id:string , detail :any )
    {
        return this.http.put<any>(URL+'users/update_company_profile/' + user_id, detail)
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
    } 
    
    //////////////filters function call////////////////////////////////
    getVerrifiedCandidate()
    {
       return this.http.get<any>(URL+'users/verified_candidate' );

    }
    
   /* searchByskill(skill:string)
    {
        console.log(skill);
         return this.http.post<any>(URL+'users/search_skill', { search: skill})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
    }
    
    searchBylocation(location:string)
    {
         return this.http.post<any>(URL+'users/search_location', { search: location})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
    }
    
    searchByAvailability( availability :string)
    {
        
        return this.http.post<any>(URL+'users/search_availibility', { search: availability})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
    }
    
   
    
    searchByposition(position :any)
    {
         return this.http.post<any>(URL+'users/search_position', { search: position})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
    }
    
    searchByBlockchain(blockchain:any)
    {
        return this.http.post<any>(URL+'users/search_blockchain', { search: blockchain})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
    }*/
    
    searchByWord(word:string)
    {
         return this.http.post<any>(URL+'users/search_word', { search: word})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
    }
    
    filterSearch(skill : string , location: string , position:any , blockchain:any , avail:string, salary :string ,currency :string)
    {
         return this.http.post<any>(URL+'users/filter', { skill : skill , location :location , position :position , blockchain : blockchain , availability : avail,salary:salary , currency :currency})
            .map(data => {
           
                if (data) 
                {
                    //console.log(data);
                    return data;
                }
                
            });
         
    }
	
	send_file(sender_id: string,receiver_id:string,sender_name:string,receiver_name:string,message:string,job_title:string,salary:string,date_of_joining:string,job_type:string,msg_tag:string,is_company_reply:number,file_name:string) 
    {
        return this.http.post<any>(URL+'users/insert_chat_file', {sender_id:sender_id,receiver_id:receiver_id,sender_name:sender_name,receiver_name:receiver_name,message:message,job_title:job_title,salary:salary,date_of_joining:date_of_joining,job_type:job_type,msg_tag:msg_tag,is_company_reply:is_company_reply,file_name:file_name}) .map(data => {
            return data
        });
    }
	
	insert_job_message(sender_id: string,receiver_id:string,sender_name:string,receiver_name:string,message:string,job_title:string,salary:string,date_of_joining:string,job_type:string,msg_tag:string,is_company_reply:number,job_offered:number) 
    {
        return this.http.post<any>(URL+'users/insert_message_job', {sender_id:sender_id,receiver_id:receiver_id,sender_name:sender_name,receiver_name:receiver_name,message:message,job_title:job_title,salary:salary,date_of_joining:date_of_joining,job_type:job_type,msg_tag:msg_tag,is_company_reply:is_company_reply,job_offered:job_offered}) .map(data => {
            return data
        });
    }
	
	update_job_message(id:string,status:number) 
    {
        return this.http.post<any>(URL+'users/update_job_message', {id:id,status:status}) .map(data => {
            return data
        });
    }
    
    refered_id(_id: number , data : number)
    {
          return this.http.put<any>(URL+'users/refered_id/' + _id, {info : data})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
    }
    //////////////call admin functions//////////////////
    aprrove_user(user_id:string , detail :number )
    {
        //console.log(user_id);
       // console.log(detail);
        return this.http.put<any>(URL+'users/approve/' + user_id, {is_approve : detail})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
    } 
    
    searchByName(word:string)
    {
        return this.http.post<any>(URL+'users/search_by_name', { search: word})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });
        
     }
    
    admin_candidate_filter(is_approve : number , msg_tags : any)
    {
        return this.http.post<any>(URL+'users/admin_candidate_filter', { is_approve: is_approve , msg_tags : msg_tags})
            .map(data => {
           
                if (data) 
                {
                    //console.log(data);
                    return data;
                }
                
            });
    }
    allCompanies()
    {
        return this.http.get<any>(URL+'users/company');
        
    }
    
    admin_search_by_name(word:string)
    {
        return this.http.post<any>(URL+'users/admin_search_by_name', { search: word})
            .map(data => {
           
                if (data) 
                {
                    console.log(data);
                    return data;
                }
                
            });        
    }
    
    admin_company_filter(is_approve : number , msg_tags : any)
    {
        return this.http.post<any>(URL+'users/admin_company_filter', { is_approve: is_approve , msg_tags : msg_tags})
            .map(data => {
           
                if (data) 
                {
                    //console.log(data);
                    return data;
                }
                
            });
    }
    
    getCompanyById(_id: string) 
    {
        return this.http.get<any>(URL+'users/get_company_by_id/' + _id);

    }
}
