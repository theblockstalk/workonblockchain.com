import {Component, OnInit,ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient} from '@angular/common/http';
import {FormGroup} from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-admin-display-chat',
  templateUrl: './admin-display-chat.component.html',
  styleUrls: ['./admin-display-chat.component.css']
})
export class AdminDisplayChatComponent implements OnInit {
  user_id;
  user_type ;
  log = '';
  currentUser: User;
  form: FormGroup;
  type = 'candidate';
  credentials: any = {};
  users = [];
  msgs = '';
  new_msgss : any = {};
  show_msg_area = 1;
  display_list = 0;
  count=0;
  candidate = '';
  job_title = '';
  salary = '';
  date_of_joining = '';
  first_message = 0;
  msg_tag = '';
  job_desc = '';
  is_company_reply = 0;
  company_reply = 0;
  cand_offer = 0;
  job_type='';
  email;
  length;
  company_type;
  admin_log;
  profile_pic;
  display_name;
  new_messges = [];

  constructor(private http: HttpClient,private el: ElementRef,private route: ActivatedRoute,private authenticationService: UserService,private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
      this.user_type = params['type'];
    });
  }

  ngOnInit() {
    var styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.type = "text/css";
    styles.href = "../../assets/css/chat.css";
    document.getElementsByTagName("head")[0].appendChild(styles);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
    if(this.user_id && this.admin_log && this.currentUser){
      if(this.admin_log.is_admin == 1){
        this.get_user_type();
        this.count=0;
        if(this.user_type=="company"){
          this.display_list = 1;
          this.display_list = 1;
          this.authenticationService.get_user_messages_only(this.user_id)
          .subscribe(
            msg_data =>{
              if(msg_data['conversations']){
                this.new_messges.push(msg_data['conversations']);
                this.new_messges = this.filter_array(msg_data['conversations']);
                this.users = this.new_messges;
						    this.length = 1;
                for (var key_users_new in this.users) {
                  if(this.count == 0){
                    this.openDialog(this.users[key_users_new].name,this.users[key_users_new].user_id,'');
                  }
                  this.count = this.count + 1;
                }
              }
              else{
                this.length = 0;
					    }
					  },
            error => {
              if(error.status === 400){
                this.length = 0;
              }
              if(error.status === 500 || error.status === 401){
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }
              if(error.status === 404){
                this.log = error.error.message;
              }
            }
          );
        }
        else{
          this.authenticationService.get_user_messages_only(this.user_id)
          .subscribe(
            msg_data =>{
              if(msg_data['conversations']){
                this.new_messges.push(msg_data['conversations']);
                this.new_messges = this.filter_array(msg_data['conversations']);
                this.users = this.new_messges;
                this.length = 1;
                for (var key_users_new in this.users) {
                  if(this.count === 0){
                    this.openDialog('',this.users[key_users_new].user_id,this.users[key_users_new].name);
                  }
                  this.count = this.count + 1;
                }
              }
              else{
                this.length = 0;
              }
            },
            error => {
              if(error.status === 400){
                this.length = 0;
              }
              if(error.status === 500 || error.status === 401){
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }
              if(error.status === 404){
                this.log = error.error.message;
              }
            }
          );
          this.display_list = 0;
        }
      }
      else
        this.router.navigate(['/not_found']);
    }
    else{
      this.router.navigate(['/not_found']);
    }
  }

  openDialog(email: string, id:string,current_compnay_name:string){
    this.msgs = '';
    this.new_msgss = '';
    this.authenticationService.get_user_messages(id,this.user_id)
    .subscribe(
      data =>{
        this.new_msgss = data['messages'];

        this.job_desc = data['messages'][0].message.approach;
        if(data['datas'][1]){
          if(data['datas'][1].is_company_reply==1){
            this.company_reply = 1;
          }
          else{
              this.company_reply = 0;
          }
        }
        else{
          this.company_reply = 0;
          if(this.user_type=='candidate'){
            this.cand_offer = 1;
            this.credentials.msg_body = 'Yes ! i will join you';
          }
          else{
            this.cand_offer = 0;
          }
        }
        if(data['datas'].length >= 1){
          this.first_message = 0;
          this.show_msg_area = 1;
          if(this.user_type=='candidate' && this.cand_offer == 1){
            this.credentials.msg_body = 'Yes ! i will join you';
          }
          else{
            this.credentials.msg_body = '';
          }
        }
        else{
          this.company_reply = 1;
          this.cand_offer = 1;
          this.first_message = 1;
          this.show_msg_area = 0;
          this.credentials.msg_body = "Hi ! join us";
        }
      },
      error =>{
        if(error.message === 500 || error.message === 401){
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          window.location.href = '/login';
        }
        if(error.message === 403){}
      }
    );
    this.candidate = email;
    this.credentials.email = email;
    this.credentials.id = id;
  }

  get_user_type() {
    if(this.user_type == 'company'){
      this.authenticationService.getCurrentCompany(this.user_id)
			.subscribe(
			  data =>{
			    if(data['company_logo']!=''){
						this.profile_pic = data['company_logo'];
					}
					this.display_name = data['company_name'];
					this.user_type = data['_creator'].type;
					this.email  = data['_creator'].email;
				},
        error =>{
          if(error.message === 500 || error.message === 401){
						localStorage.setItem('jwt_not_found', 'Jwt token not found');
						window.location.href = '/login';
					}
					if(error.message === 403){}
        }
			);
		}
		else{
			this.authenticationService.getCandidateProfileById(this.user_id, true)
			.subscribe(
				data =>{
				  if(data['error']){
				    this.log= "Something Went Wrong";
						localStorage.removeItem('company_type');
					}
					else{
					  if(data['image']!=''){
							this.profile_pic = data['image'];
						}
						this.display_name = data['first_name'] +' '+data['last_name'];
						this.user_type = data['type'];
						this.email  = data['email'];
					}
				}
			);
		}
  }

	filter_array(arr) {
    let hashTable = {};
    return arr.filter(function (el) {
      let key = JSON.stringify(el);
      let match = Boolean(hashTable[key]);
      return (match ? false : hashTable[key] = true);
    });
  }

}
