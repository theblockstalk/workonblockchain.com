import { Component, OnInit,AfterViewInit  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
//declare var synapseThrow: any;
//import { synapseThrow } from '../wob';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit,AfterViewInit {

  experimented_platform = [];
  commercially_worked = [];
  expYear=[];
  platform=[];expYear_db=[];
  referringData;value;why_work;count=0;exp_class;
  currentUser: User;commercial_expYear=[];db_valye=[];db_lang;
  platforms=[];
  active_class;
  job_active_class;
  exp_active_class;resume_active_class;
  platformreferringData;
  term_active_class;term_link;
  exp_disable;
  error_msg;
  skill_expYear_db=[];
  skillDbArray=[];
  skillDb;
  formalDbArray=[];
  formal_expYear_db=[];
  formalSkillDb;
  about_active_class;
  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;

  constructor(private route: ActivatedRoute, private http: HttpClient,
              private router: Router,
              private authenticationService: UserService) { }

  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);

  }
  ngOnInit()
  {
    this.exp_disable = "disabled";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }
    if(this.currentUser && this.currentUser.type=='candidate')
    {
      this.commercially.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.designed.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.experimented.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.otherSkills.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.otherFormalSkills.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.exp_class="";
      this.active_class="fa fa-check-circle text-success";
      this.authenticationService.getById(this.currentUser._id)
        .subscribe(
          data => {
            if(data['candidate'].terms_id)
            {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }
            if(data['contact_number']  && data['nationality'])
            {
              this.about_active_class = 'fa fa-check-circle text-success';
            }

            if(data['candidate'].why_work){

              this.why_work=data['candidate'].why_work;
            }
            if(data['candidate'].blockchain)
            {

              if(data['candidate'].blockchain.commercial_platforms)
              {
                this.commercial_expYear =data['candidate'].blockchain.commercial_platforms;
                for (let key of data['candidate'].blockchain.commercial_platforms)
                {
                  for(var i in key)
                  {


                    for(let option of this.commercially)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;
                        this.db_valye.push(key[i]);
                        this.db_lang= ({value: key[i]});
                        this.commercially_worked.push(this.db_lang);

                      }
                      else
                      {

                      }

                    }

                    for(let option of this.exp_year)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;
                        this.expYear_db.push(key[i]);

                      }

                    }

                  }
                }
              }

              if(data['candidate'].blockchain.description_commercial_platforms)
              {
                this.description_commercial_platforms = data['candidate'].blockchain.description_commercial_platforms;
              }


              if(data['candidate'].blockchain.experimented_platforms)
              {
                for (let plat of data['candidate'].blockchain.experimented_platforms)
                {

                  for(let option of this.experimented)
                  {

                    if(option.value === plat)
                    {
                      option.checked=true;
                      this.experimented_platform.push(plat);

                    }

                  }

                }
              }

              if(data['candidate'].blockchain.description_experimented_platforms)
              {
                this.description_experimented_platforms = data['candidate'].blockchain.description_experimented_platforms;
              }


            }

            if(data['candidate'] && data['candidate'].blockchain && data['candidate'].blockchain.commercial_skills && data['candidate'].blockchain.commercial_skills.length>0)
            {
              this.commercialSkillsExperienceYear = data['candidate'].blockchain.commercial_skills;
              for (let key of data['candidate'].blockchain.commercial_skills)
              {
                for(var i in key)
                {

                  for(let option of this.otherSkills)
                  {

                    if(option.value === key[i])
                    {
                      option.checked=true;
                      this.skillDbArray.push(key[i]);
                      this.skillDb= ({value: key[i]});
                      this.commercialSkills.push(this.skillDb);

                    }
                    else
                    {

                    }

                  }

                  for(let option of this.exp_year)
                  {

                    if(option.value === key[i])
                    {
                      option.checked=true;
                      this.skill_expYear_db.push(key[i]);

                    }

                  }

                }
              }
            }

            if(data['candidate'].blockchain.description_commercial_skills)
            {
              this.description_commercial_skills = data['candidate'].blockchain.description_commercial_skills;
            }

            if(data['candidate'].locations && data['candidate'].roles && data['candidate'].interest_areas || data['candidate'].expected_salary || data['candidate'].availability_day )
            {
              this.job_active_class = 'fa fa-check-circle text-success';

            }

            if(data['candidate'].why_work )
            {
              this.exp_class = "/experience";
              this.exp_disable = "";
              this.resume_active_class='fa fa-check-circle text-success';
              // this.router.navigate(['/resume']);
            }

            if( data['candidate'].description)
            {

              this.exp_active_class = 'fa fa-check-circle text-success';
              //this.router.navigate(['/experience']);
            }



          },
          error => {
            if(error['message'] === 500 || error['message'] === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error['message'] === 403)
            {
              this.router.navigate(['/not_found']);
            }

          });
      //this.router.navigate(['/about']);
    }
    else
    {
      this.router.navigate(['/not_found']);
    }


  }



  commercially=
  [
    {name:'Bitcoin', value:'Bitcoin', checked:false},
    {name:'Ethereum', value:'Ethereum', checked:false},
    {name:'Ripple', value:'Ripple', checked:false},
    {name:'Stellar', value:'Stellar', checked:false},
    {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
    {name:'Hyperledger Sawtooth', value:'Hyperledger Sawtooth', checked:false},
    {name:'Quorum', value:'Quorum', checked:false},
    {name:'Corda', value:'Corda', checked:false},
    {name:'EOS', value:'EOS', checked:false},
    {name:'NEO', value:'NEO', checked:false},
    {name:'Waves', value:'Waves', checked:false},
    {name:'Steemit', value:'Steemit', checked:false},
    {name:'Lisk', value:'Lisk', checked:false},
    {name:'Quantum', value:'Quantum', checked:false},
    {name:'Tezos', value:'Tezos', checked:false},
    {name:'Cardano', value:'Cardano', checked:false},
    {name:'Litecoin', value:'Litecoin', checked:false},
    {name:'Monero', value:'Monero', checked:false},
    {name:'ZCash', value:'ZCash', checked:false},
    {name:'IOTA', value:'IOTA', checked:false},
    {name:'NEM', value:'NEM', checked:false},
    {name:'NXT', value:'NXT', checked:false},

  ]

  otherSkills =
    [
      {name:'P2P protocols', value:'P2P protocols', checked:false},
      {name:'Distributed computing and networks', value:'Distributed computing and networks', checked:false},
      {name:'Security', value:'Security', checked:false},
      {name:'Formal verification', value:'Formal verification', checked:false},
      {name:'Cryptography', value:'Cryptography', checked:false},
      {name:'Game theory', value:'Game theory', checked:false},
      {name:'Economics', value:'Economics', checked:false},
      {name:'Smart contract audits', value:'Smart contract audits', checked:false},
      {name:'Zero Knowlege Proofs', value:'Zero Knowlege Proofs', checked:false},
    ]
  otherFormalSkills =
    [
      {name:'P2P protocols', value:'P2P protocols', checked:false},
      {name:'Distributed computing and networks', value:'Distributed computing and networks', checked:false},
      {name:'Security', value:'Security', checked:false},
      {name:'Formal verification', value:'Formal verification', checked:false},
      {name:'Cryptography', value:'Cryptography', checked:false},
      {name:'Game theory', value:'Game theory', checked:false},
      {name:'Economics', value:'Economics', checked:false},
      {name:'Smart contract audits', value:'Smart contract audits', checked:false},
      {name:'Zero Knowlege Proofs', value:'Zero Knowlege Proofs', checked:false},
    ]

  designed=
    [
      {name:'Bitcoin', value:'Bitcoin', checked:false},
      {name:'Ethereum', value:'Ethereum', checked:false},
      {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
      {name:'Hyperledger Sawtooth', value:'Hyperledger Sawtooth', checked:false},
      {name:'Quorum', value:'Quorum', checked:false},
      {name:'Corda', value:'Corda', checked:false},
      {name:'Waves', value:'Waves', checked:false},
      {name:'NEO', value:'NEO', checked:false},
      {name:'EOS', value:'EOS', checked:false},
      {name:'Lisk', value:'Lisk', checked:false},
      {name:'Quantum', value:'Quantum', checked:false},
      {name:'Cardano', value:'Cardano', checked:false},
      {name:'NEM', value:'NEM', checked:false},
      {name:'NXT', value:'NXT', checked:false},
    ]

  experimented=
    [
      {name:'Bitcoin', value:'Bitcoin', checked:false},
      {name:'Ethereum', value:'Ethereum', checked:false},
      {name:'Ripple', value:'Ripple', checked:false},
      {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
      {name:'Corda', value:'Corda', checked:false},
      {name:'EOS', value:'EOS', checked:false},
      {name:'Waves', value:'Waves', checked:false},
      {name:'Steemit', value:'Steemit', checked:false},
      {name:'Lisk', value:'Lisk', checked:false},
      {name:'Quantum', value:'Quantum', checked:false},
      {name:'Tezos', value:'Tezos', checked:false},
      {name:'Cardano', value:'Cardano', checked:false},
      {name:'Litecoin', value:'Litecoin', checked:false},
      {name:'Monero', value:'Monero', checked:false},
      {name:'ZCash', value:'ZCash', checked:false},
      {name:'IOTA', value:'IOTA', checked:false},
      {name:'NEM', value:'NEM', checked:false},
      {name:'NXT', value:'NXT', checked:false},
      {name:'Dash', value:'Dash', checked:false},
      {name:'Doge', value:'Doge', checked:false},
    ]


  exp_year=
    [
      {name:'0-1', value:'0-1', checked:false},
      {name:'1-2', value:'1-2', checked:false},
      {name:'2-4', value:'2-4', checked:false},
      {name:'4-6', value:'4-6', checked:false},
      {name:'6+', value:'6+', checked:false}
    ]



  onExpOptions(e)
  {

    if(e.target.checked)
    {
      this.experimented_platform.push(e.target.value);
    }
    else{
      let updateItem = this.experimented_platform.find(this.findIndexToUpdateExperimented, e.target.value);

      let index = this.experimented_platform.indexOf(updateItem);

      this.experimented_platform.splice(index, 1);
    }

  }

  findIndexToUpdateExperimented(type) {
    return type == this;
  }

  findIndexToUpdate(obj)
  {
    return obj.value === this;
  }

  why_work_log;commercial_log;
  formal_skills=[];
  commercial_skill_log;
  blockchain_exp(expForm: NgForm)
  {
    this.error_msg="";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.commercially_worked.length !== this.commercial_expYear.length )
    {
      this.commercial_log = "Please fill year of experience";
    }
    if(this.commercialSkills.length !== this.commercialSkillsExperienceYear.length)
    {
      this.commercial_skill_log = "Please fill year of experience";
    }

    if(!this.why_work)
    {
      this.why_work_log = "Please fill why do you want to work on blockchain?";
    }
    if(this.why_work && this.commercially_worked.length === this.commercial_expYear.length
      && this.commercialSkills.length === this.commercialSkillsExperienceYear.length)
    {
      expForm.value.unset_commercial_platforms = false;
      if(this.commercially_worked.length === 0) {
        expForm.value.unset_commercial_platforms = true;
        expForm.value.commercial_platforms = [];
      }
      else {
        expForm.value.commercial_platforms = this.commercial_expYear;
      }

      expForm.value.unset_commercial_skills = false;
      if(this.commercialSkills.length === 0) {
        expForm.value.unset_commercial_skills = true;
        expForm.value.value.commercial_skills = [];
      }
      else {
        expForm.value.commercial_skills = this.commercialSkillsExperienceYear;
      }

      expForm.value.description_commercial_platforms = '';
      if(this.description_commercial_platforms){
        expForm.value.description_commercial_platforms = this.description_commercial_platforms;
      }

      expForm.value.description_experimented_platforms = '';
      if(this.description_experimented_platforms){
        expForm.value.description_experimented_platforms = this.description_experimented_platforms;
      }

      expForm.value.description_commercial_skills = '';
      if(this.description_commercial_skills){
        expForm.value.description_commercial_skills = this.description_commercial_skills;
      }

      expForm.value.unset_experimented_platforms = false;
      if(this.experimented_platform.length == 0) {
        expForm.value.unset_experimented_platforms = true;
      }

      this.authenticationService.edit_candidate_profile(this.currentUser._id , expForm.value,false)
        .subscribe(
          data => {
            if(data && this.currentUser)
            {
              this.router.navigate(['/experience']);
              //window.location.href = '/experience';
            }


          },
          error => {

            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.router.navigate(['/not_found']);
            }

          });
    }
    else{
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";

    }
  }

  oncommerciallyOptions(obj)
  {
    let updateItem = this.commercially_worked.find(this.findIndexToUpdate, obj.value);
    let index = this.commercially_worked.indexOf(updateItem);
    if(index > -1)
    {
      this.commercially_worked.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercial_expYear, 'name',  obj.value);
      let index2 = this.commercial_expYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.commercial_expYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.commercially_worked.push(obj);
    }
  }

  onExpYearOptions(e , value)
  {

    this.langValue = value;
    let updateItem = this.findObjectByKey(this.expYear, 'experimented_platform', value);
    let index = this.expYear.indexOf(updateItem);

    if(index > -1)
    {

      this.expYear.splice(index, 1);
      this.value=value;
      this.referringData = { experimented_platform:this.value, exp_year: e.target.value};
      this.expYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { experimented_platform :this.value, exp_year: e.target.value};
      this.expYear.push(this.referringData);

    }

  }

  selectedValue;langValue;
  onComExpYearOptions(e, value)
  {
    this.langValue = value;
    let updateItem = this.findObjectByKey(this.commercial_expYear, 'name', value);
    let index = this.commercial_expYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercial_expYear.splice(index, 1);
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);
    }
    this.commercial_expYear.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })

  }


  onPlatformYearOptions(e, value)
  {
    this.langValue = value;
    /*this.value=value;
    this.platformreferringData = { name:this.value, exp_year: e.target.value};
    this.platforms.push(this.platformreferringData);
    */

    let updateItem = this.findObjectByKey(this.platforms, 'name', value);
    let index = this.platforms.indexOf(updateItem);

    if(index > -1)
    {

      this.platforms.splice(index, 1);
      this.value=value;
      this.platformreferringData = { name:this.value, exp_year: e.target.value};
      this.platforms.push(this.platformreferringData);

    }
    else
    {
      this.value=value;
      this.platformreferringData = { name:this.value, exp_year: e.target.value};
      this.platforms.push(this.platformreferringData);

    }
    this.platforms.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
  }



  findObjectByKey(array, key, value)
  {
    for (var i = 0; i < array.length; i++)
    {
      if (array[i][key] === value)
      {
        return array[i];
      }

    }
    return null;
  }

  commercialSkills=[];
  commercialSkillsExperienceYear=[];

  oncommercialSkillsOptions(obj)
  {

    let updateItem = this.commercialSkills.find(this.findIndexToUpdate, obj.value);
    let index = this.commercialSkills.indexOf(updateItem);
    if(index > -1)
    {
      this.commercialSkills.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill',  obj.value);
      let index2 = this.commercialSkillsExperienceYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.commercialSkillsExperienceYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.commercialSkills.push(obj);
    }

  }

  onComSkillExpYearOptions(e, value)
  {
    let updateItem = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill', value);
    let index = this.commercialSkillsExperienceYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercialSkillsExperienceYear.splice(index, 1);
      this.value = value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    this.commercialSkillsExperienceYear.sort(function(a, b){
      if(a.skill < b.skill) { return -1; }
      if(a.skill > b.skill) { return 1; }
      return 0;
    })

  }

}
