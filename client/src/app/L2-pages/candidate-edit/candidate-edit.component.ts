import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../user.service';
import { EmailAddressComponent } from '../../L1-items/users/email-address/email-address.component';
import { FirstNameComponent } from '../../L1-items/users/first-name/first-name.component';
import { LastNameComponent } from '../../L1-items/users/last-name/last-name.component';
import { ContactNumberComponent } from '../../L1-items/users/contact-number/contact-number.component';
import { GithubUrlComponent } from '../../L1-items/candidate/github-url/github-url.component';
import { StackexchangeUrlComponent } from '../../L1-items/candidate/stackexchange-url/stackexchange-url.component';
import { LinkedinUrlComponent } from '../../L1-items/candidate/linkedin-url/linkedin-url.component';
import { MediumUrlComponent } from '../../L1-items/candidate/medium-url/medium-url.component';
import { StackoverflowUrlComponent } from '../../L1-items/candidate/stackoverflow-url/stackoverflow-url.component';
import { PersonalWebsiteUrlComponent } from '../../L1-items/candidate/personal-website-url/personal-website-url.component';
import { NationalityComponent } from '../../L1-items/users/nationality/nationality.component';
import { ProfilePicComponent } from '../../L1-items/users/profile-pic/profile-pic.component';
import { BioComponent } from '../../L1-items/candidate/bio/bio.component';
import { CountryComponent } from '../../L1-items/users/country/country.component';
import { CityComponent} from '../../L1-items/users/city/city.component';
import { CurrentSalaryComponent } from '../../L1-items/candidate/current-salary/current-salary.component';
import { WorkTypesComponent } from '../../L1-items/candidate/work-types/work-types.component';
import {ContractorComponent} from '../../L1-items/candidate/contractor/contractor.component';
import { VolunteerComponent } from '../../L1-items/candidate/volunteer/volunteer.component';
import {EmployeeComponent} from '../../L1-items/candidate/employee/employee.component';
import { WhyWorkComponent } from '../../L1-items/candidate/why-work/why-work.component';
import { InterestsComponent } from '../../L1-items/candidate/interests/interests.component';
import { CommercialExperienceComponent } from '../../L1-items/candidate/commercial-experience/commercial-experience.component';
import { ExperimentedWithComponent } from '../../L1-items/candidate/experimented-with/experimented-with.component';
import { CommercialSkillsComponent } from '../../L1-items/candidate/commercial-skills/commercial-skills.component';
import { LanguagesComponent } from '../../L1-items/candidate/languages/languages.component';
import { WorkHistoryComponent } from '../../L1-items/candidate/work-history/work-history.component';
import { EducationHistoryComponent } from '../../L1-items/candidate/education-history/education-history.component';
import {CandJobActivityComponent} from '../../L1-items/candidate/cand-job-activity/cand-job-activity.component';
import {constants} from '../../../constants/constants';

@Component({
  selector: 'app-p-candidate-edit',
  templateUrl: './candidate-edit.component.html',
  styleUrls: ['./candidate-edit.component.css']
})

export class CandidateEditComponent implements OnInit, AfterViewInit {
  @ViewChild(EmailAddressComponent) emailAddress: EmailAddressComponent;
  @ViewChild(FirstNameComponent) firstName: FirstNameComponent;
  @ViewChild(LastNameComponent) lastName: LastNameComponent;
  @ViewChild(ContactNumberComponent) contactNumber: ContactNumberComponent;
  @ViewChild(GithubUrlComponent) githubUrl: GithubUrlComponent;
  @ViewChild(StackexchangeUrlComponent) stackexchangeUrl: StackexchangeUrlComponent;
  @ViewChild(LinkedinUrlComponent) linkedinUrl: LinkedinUrlComponent;
  @ViewChild(MediumUrlComponent) mediumUrl: MediumUrlComponent;
  @ViewChild(StackoverflowUrlComponent) stackoverflowUrl: StackoverflowUrlComponent;
  @ViewChild(PersonalWebsiteUrlComponent) personalWebsiteUrl: PersonalWebsiteUrlComponent;
  @ViewChild(NationalityComponent) nationalities: NationalityComponent;
  @ViewChild(ProfilePicComponent) profileImage: ProfilePicComponent;
  @ViewChild(BioComponent) bioDescription: BioComponent;
  @ViewChild(CountryComponent) baseCountry: CountryComponent;
  @ViewChild(CityComponent) baseCity: CityComponent;
  @ViewChild(CurrentSalaryComponent) currentSalary: CurrentSalaryComponent;
  @ViewChild(WorkTypesComponent) workTypes: WorkTypesComponent;
  @ViewChild(VolunteerComponent) volunteerType: VolunteerComponent;
  @ViewChild(ContractorComponent) contractorType: ContractorComponent;
  @ViewChild(EmployeeComponent) employeeType: EmployeeComponent;
  @ViewChild(WhyWorkComponent) whyWork: WhyWorkComponent;
  @ViewChild(InterestsComponent) interestType: InterestsComponent;
  @ViewChild(CommercialExperienceComponent) commercialExp: CommercialExperienceComponent;
  @ViewChild(ExperimentedWithComponent) experimentedWith: ExperimentedWithComponent;
  @ViewChild(CommercialSkillsComponent) commercialSkills: CommercialSkillsComponent;
  @ViewChild(LanguagesComponent) languageExp: LanguagesComponent;
  @ViewChild(WorkHistoryComponent) workHistoryComp: WorkHistoryComponent;
  @ViewChild(EducationHistoryComponent) educationHistoryComp: EducationHistoryComponent;
  @ViewChild(CandJobActivityComponent) candJobActivity: CandJobActivityComponent;

  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "candidate"
  email_address;
  first_name;
  last_name;
  contact_number;
  github_account;
  stackexchange_account;
  linkedin_account;
  medium_account;
  stackoverflow_url;
  personal_website_url;
  nationality;
  image;
  bio_description = '<ul><li> 2-5 sentences </li><li> Quick overview of your current role and responsibilities and your principal development stack and skills </li><li> What value do you add to a project? </li></ul>';
  description;
  country;
  city;
  current_salary;
  current_currency;
  work_types = [];
  employeeCheck;
  contractorCheck;
  volunteerCheck;
  contractor: any = {};
  volunteer: any = {};
  employee: any = {};
  why_work;
  interest_areas;
  commercial_platforms: any = {};
  description_commercial_platforms;
  experimented_platforms = [];
  description_experimented_platforms;
  commercial_skills = [];
  description_commercial_skills;
  programming_languages = [];
  work_history = [];
  education_history = [];
  error_msg;
  errMsg;
  reasons_of_leaving = constants.reasons_of_leaving;
  job_activity_value;// = 'Not now';
  currently_employ;
  reason_selectedValue = [];
  other_reasons;
  counter_offer;
  allData = 0;

  constructor(private authenticationService: UserService, private router: Router) {}

  ngAfterViewInit(): void {
    const tree = this.router.parseUrl(this.router.url);
    if (tree.fragment) {
      const element = document.querySelector('#' + tree.fragment);
      if (element) {
        element.scrollIntoView();
      }
    }
  }

  ngOnInit() {
    this.reasons_of_leaving.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });

    const candidateSubDoc = this.userDoc['candidate'];
    this.email_address = this.userDoc['email'];
    this.first_name = this.userDoc['first_name'];
    this.last_name = this.userDoc['last_name'];
    if(this.userDoc['contact_number']) this.contact_number = this.userDoc['contact_number'];
    if(candidateSubDoc.github_account) this.github_account = candidateSubDoc.github_account;
    if(candidateSubDoc.stackexchange_account) this.stackexchange_account = candidateSubDoc.stackexchange_account;
    if(candidateSubDoc.linkedin_account) this.linkedin_account = candidateSubDoc.linkedin_account;
    if(candidateSubDoc.medium_account) this.medium_account = candidateSubDoc.medium_account;
    if(candidateSubDoc.stackoverflow_url) this.stackoverflow_url = candidateSubDoc.stackoverflow_url;
    if(candidateSubDoc.personal_website_url)  this.personal_website_url = candidateSubDoc.personal_website_url;
    if(this.userDoc['nationality']) this.nationality = this.userDoc['nationality'];
    if(this.userDoc['image']) this.image = this.userDoc['image'];
    if(candidateSubDoc.description) this.description = candidateSubDoc.description;
    if(candidateSubDoc.base_country) this.country = candidateSubDoc.base_country;
    if(candidateSubDoc.base_city) this.city = candidateSubDoc.base_city;
    if(candidateSubDoc.current_salary) this.current_salary = candidateSubDoc.current_salary;
    if(candidateSubDoc.current_currency) this.current_currency = candidateSubDoc.current_currency;

    if(candidateSubDoc.job_activity_status) {
      if (candidateSubDoc.job_activity_status.new_work_opportunities) this.job_activity_value = candidateSubDoc.job_activity_status.new_work_opportunities;
      if (candidateSubDoc.job_activity_status.currently_employed) this.currently_employ = candidateSubDoc.job_activity_status.currently_employed;
      if (candidateSubDoc.job_activity_status.leaving_current_employ_reasons) {
        for (let reason of candidateSubDoc.job_activity_status.leaving_current_employ_reasons) {
          for (let option of this.reasons_of_leaving) {
            if (option.value === reason) {
              option.checked = true;
              this.reason_selectedValue.push(reason);
            }
          }
        }
      }
      if (candidateSubDoc.job_activity_status.other_reasons) {
        this.other_reasons = candidateSubDoc.job_activity_status.other_reasons;
      }
      if (candidateSubDoc.job_activity_status.counter_offer) this.counter_offer = candidateSubDoc.job_activity_status.counter_offer;
      this.allData = 1;
    }
    else this.allData = 1;

    if(candidateSubDoc.employee) {
      this.employeeCheck = true;
      this.work_types.push('employee');
      this.employee = candidateSubDoc.employee;
    }
    if(candidateSubDoc.contractor) {
      this.contractorCheck = true;
      this.work_types.push('contractor');
      this.contractor = candidateSubDoc.contractor;
    }
    if(candidateSubDoc.volunteer) {
      this.volunteerCheck = true;
      this.work_types.push('volunteer');
      this.volunteer = candidateSubDoc.volunteer;
    }
    if(candidateSubDoc.why_work) this.why_work = candidateSubDoc.why_work;
    if(candidateSubDoc.interest_areas) this.interest_areas = candidateSubDoc.interest_areas;
    if(candidateSubDoc && candidateSubDoc.blockchain) {
      if(candidateSubDoc.blockchain.commercial_platforms) {
        this.commercial_platforms = candidateSubDoc.blockchain.commercial_platforms;
        this.description_commercial_platforms = candidateSubDoc.blockchain.description_commercial_platforms;
      }
      if(candidateSubDoc.blockchain.experimented_platforms) {
        this.experimented_platforms = candidateSubDoc.blockchain.experimented_platforms;
        this.description_experimented_platforms = candidateSubDoc.blockchain.description_experimented_platforms;
      }
      if(candidateSubDoc.blockchain.commercial_skills) {
        this.commercial_skills = candidateSubDoc.blockchain.commercial_skills;
        this.description_commercial_skills = candidateSubDoc.blockchain.description_commercial_skills;
      }

    }
    if(candidateSubDoc.programming_languages) {
      this.programming_languages = candidateSubDoc.programming_languages;
    }
    if(candidateSubDoc.work_history) this.work_history = candidateSubDoc.work_history;
    if(candidateSubDoc.education_history) this.education_history = candidateSubDoc.education_history;
  }

  update_candidate_profile(){
    let errorCount = 0;
    let visaRequired = 0;
    let workTypeCount = 0;
    this.errMsg = '';
    let queryBody : any = {};
    let candidateBody : any = {};
    let blockchainBody : any = {};
    let job_activity_statuses:any ={};

    if(this.firstName.selfValidate()) queryBody.first_name = this.firstName.first_name;
    else errorCount++;

    if(this.lastName.selfValidate()) queryBody.last_name = this.lastName.last_name;
    else errorCount++;

    if(this.contactNumber.selfValidate()) queryBody.contact_number = this.contactNumber.contact_number;
    else errorCount++;

    if(this.githubUrl.github_account) {
      if(this.githubUrl.selfValidate()) candidateBody.github_account = this.githubUrl.github_account;
      else errorCount++;
    }
    else queryBody.unset_github_account = true;

    if(this.stackexchangeUrl.stackexchange_account) {
      if(this.stackexchangeUrl.selfValidate()) candidateBody.stackexchange_account = this.stackexchangeUrl.stackexchange_account;
      else errorCount++;
    }
    else queryBody.unset_exchange_account = true;

    if(this.linkedinUrl.linkedin_account) {
      if(this.linkedinUrl.selfValidate()) candidateBody.linkedin_account = this.linkedinUrl.linkedin_account;
      else errorCount++;
    }
    else queryBody.unset_linkedin_account = true;

    if(this.mediumUrl.medium_account) {
      if(this.mediumUrl.selfValidate()) candidateBody.medium_account = this.mediumUrl.medium_account;
      else errorCount++;
    }
    else queryBody.unset_medium_account = true;

    if(this.stackoverflowUrl.stackoverflow_url) {
      if(this.stackoverflowUrl.selfValidate()) candidateBody.stackoverflow_url = this.stackoverflowUrl.stackoverflow_url;
      else errorCount++;
    }
    else queryBody.unset_stackoverflow_url = true;

    if(this.personalWebsiteUrl.personal_website_url) {
      if(this.personalWebsiteUrl.selfValidate()) candidateBody.personal_website_url = this.personalWebsiteUrl.personal_website_url;
      else errorCount++;
    }
    else queryBody.unset_personal_website_url = true;

    if(this.nationalities.selfValidate()) queryBody.nationality = this.nationalities.nationality;
    else errorCount++;

    if(this.bioDescription.selfValidate()) candidateBody.description = this.bioDescription.description;
    else errorCount++;

    if(this.baseCountry.selfValidate()) candidateBody.base_country = this.baseCountry.country;
    else errorCount++;

    if(this.baseCity.selfValidate()) candidateBody.base_city = this.baseCity.city;
    else errorCount++;

    if(this.currentSalary.selfValidate()) {
      if(this.currentSalary.current_salary && this.currentSalary.current_currency && this.currentSalary.current_currency !== 'Currency') {
        candidateBody.current_currency = this.currentSalary.current_currency;
        candidateBody.current_salary = this.currentSalary.current_salary;
      }
      else queryBody.unset_curret_currency = true;
    }
    else errorCount++;

    if(this.workTypes.selfValidate()) {
      workTypeCount = this.workTypes.selectedWorkType.length;
      this.checkWorkType();
    }
    else errorCount++;

    if(this.employeeCheck) {
      if(this.employeeType.selfValidate()) {
        if(this.employeeType.employee['location']) {
          let location = this.employeeType.employee['location'];
          if(location.filter(i => i['visa_needed'] === true).length === location.length) {
            visaRequired++;
          }
        }
        candidateBody.employee = this.employeeType.employee;
      }
      else errorCount++;
    }
    else queryBody.unset_employee = true;

    if( this.contractorCheck) {
      if(this.contractorType.selfValidate()) {
        if(this.contractorType.contractor['location']) {
          let location = this.contractorType.contractor['location'];
          if(location.filter(i => i['visa_needed'] === true).length === location.length) {
            visaRequired++;
          }
        }
        candidateBody.contractor = this.contractorType.contractor;
      }
      else errorCount++;
    }
    else queryBody.unset_contractor = true;

    if(this.volunteerCheck) {
      if(this.volunteerType.selfValidate()) {
        if(this.volunteerType.volunteer['location']) {
          let location = this.volunteerType.volunteer['location'];
          if(location.filter(i => i['visa_needed'] === true).length === location.length) {
            visaRequired++;
          }

        }
        candidateBody.volunteer = this.volunteerType.volunteer;
      }
      else errorCount++;
    }
    else queryBody.unset_volunteer = true;

    if(visaRequired === workTypeCount) {
      this.errMsg = 'Please select at least one location which you can work in without needing a visa';
      errorCount++;
    }

    if(this.whyWork.selfValidate()) candidateBody.why_work = this.whyWork.why_work;
    else errorCount++;

    if(this.interestType.selfValidate()) candidateBody.interest_areas = this.interestType.interest_areas;
    else errorCount++;

    if(this.commercialExp.commercial_platforms && this.commercialExp.commercial_platforms.length > 0) {
      if(this.commercialExp.selfValidate()) {
        blockchainBody.commercial_platforms = this.commercialExp.commercial_platforms;
        if(this.commercialExp.description_commercial_platforms) blockchainBody.description_commercial_platforms = this.commercialExp.description_commercial_platforms;
        else queryBody.unset_description_commercial_platforms = true;
      }
      else errorCount++;
    }
    else queryBody.unset_commercial_platforms = true;

    if(this.experimentedWith.experimented_platforms && this.experimentedWith.experimented_platforms.length > 0) {
      if(this.experimentedWith.selfValidate()) {
        blockchainBody.experimented_platforms = this.experimentedWith.experimented_platforms;
        if(this.experimentedWith.description_experimented_platforms)  blockchainBody.description_experimented_platforms = this.experimentedWith.description_experimented_platforms;
        else queryBody.unset_description_experimented_platforms = true;
      }
      else errorCount++;
    }
    else queryBody.unset_experimented_platforms = true;

    if(this.commercialSkills.commercial_skills && this.commercialSkills.commercial_skills.length >0){
      if(this.commercialSkills.selfValidate()) {
        blockchainBody.commercial_skills = this.commercialSkills.commercial_skills;
        if(this.commercialSkills.description_commercial_skills) blockchainBody.description_commercial_skills = this.commercialSkills.description_commercial_skills;
        else queryBody.unset_description_commercial_skills = true;
      }
      else errorCount++;
    }
    else queryBody.unset_commercial_skills = true;

    if(this.languageExp.programming_languages && this.languageExp.programming_languages.length > 0){
      if(this.languageExp.selfValidate()) {
        let programmingLanguages = [];
        let flag = false;
        for (let programming_languages of this.languageExp.programming_languages) {
          if(programming_languages['_id']) {
            flag = true;
            let programmingLanguagesInfo = {
              language: programming_languages['language'],
              exp_year: programming_languages['exp_year']
            };
            programmingLanguages.push(programmingLanguagesInfo);
          }
        }
        if(flag) candidateBody.programming_languages = programmingLanguages;
        else candidateBody.programming_languages = this.languageExp.programming_languages;
      }
      else errorCount++;
    }
    else queryBody.unset_language = true;

    if(this.workHistoryComp.ExperienceForm.value.ExpItems && this.workHistoryComp.ExperienceForm.value.ExpItems.length >0) {
      if(this.workHistoryComp.selfValidate()) {
        candidateBody.work_history = this.workHistoryComp.experiencearray;
      }
      else errorCount++;
    }
    else queryBody.unset_work_history = true;

    if(this.educationHistoryComp.EducationForm.value.itemRows && this.educationHistoryComp.EducationForm.value.itemRows.length >0) {
      if(this.educationHistoryComp.selfValidate()) {
        candidateBody.education_history = this.educationHistoryComp.education_array;
      }
      else errorCount++;
    }
    else queryBody.unset_education_history = true;

    if(this.viewBy === 'candidate') {
      if (!this.candJobActivity.selfValidate()) errorCount++;

      if (this.candJobActivity.jobActivity !== 'Not now') {
        if (!this.candJobActivity.currentEmploymentValidate()) errorCount++;
        if (this.candJobActivity.currentEmploy === 'Yes') {
          if (!this.candJobActivity.validateReasons()) errorCount++;
          if (this.candJobActivity.reasonsOfLeaving.find((obj => obj === 'Other')))
            if (!this.candJobActivity.selfValidateOtherReasons()) errorCount++;

          if (!this.candJobActivity.validateCounterOffer()) errorCount++;
        }
      }
    }

    if(this.profileImage.imageCropData.image) {
      const file = this.profileImage.dataURLtoFile(this.profileImage.imageCropData.image, this.profileImage.imageName);
      const formData = new FormData();
      formData.append('image', file);
      let admin = false;
      if(this.viewBy === 'admin') admin = true;
      this.authenticationService.edit_candidate_profile(this.userDoc['_id'] , formData , admin)
        .subscribe(
          data => {
          },
          error => {
          });
    }

    if(errorCount === 0) {
      if(this.employeeCheck) {
        const locations = this.changeLocationToBEFormat(this.employeeType.employee['location']);
        this.employeeType.employee['location'] = locations;
      }
      if(this.contractorCheck) {
        const locations = this.changeLocationToBEFormat(this.contractorType.contractor['location']);
        this.contractorType.contractor['location'] = locations;
      }
      if(this.volunteerCheck) {
        const locations = this.changeLocationToBEFormat(this.volunteerType.volunteer['location']);
        this.volunteerType.volunteer['location'] = locations;
      }

      if(this.candJobActivity.jobActivity) job_activity_statuses.new_work_opportunities = this.candJobActivity.jobActivity;

      if (this.candJobActivity.jobActivity !== 'Not now' && this.candJobActivity.currentEmploy) job_activity_statuses.currently_employed = this.candJobActivity.currentEmploy;
      else queryBody.unset_currently_employed = true;

      if (this.candJobActivity.jobActivity !== 'Not now' && this.candJobActivity.currentEmploy === 'Yes' && this.candJobActivity.reasonsOfLeaving && this.candJobActivity.reasonsOfLeaving.length > 0) job_activity_statuses.leaving_current_employ_reasons = this.candJobActivity.reasonsOfLeaving;
      else queryBody.unset_leaving_current_employ_reasons = true;

      if (this.candJobActivity.jobActivity !== 'Not now' && this.candJobActivity.currentEmploy === 'Yes' && this.candJobActivity.otherReasons) job_activity_statuses.other_reasons = this.candJobActivity.otherReasons;
      else queryBody.unset_other_reasons = true;

      if (this.candJobActivity.jobActivity !== 'Not now' && this.candJobActivity.currentEmploy === 'Yes' && this.candJobActivity.counterOffer) job_activity_statuses.counter_offer = this.candJobActivity.counterOffer;
      else queryBody.unset_counter_offer = true;

      candidateBody.job_activity_status = job_activity_statuses;
      candidateBody.blockchain = blockchainBody;
      queryBody.candidate = candidateBody;

      if(this.viewBy === 'candidate') {
        this.authenticationService.edit_candidate_profile(this.userDoc['_id'], queryBody, false)
          .subscribe(
            data => {
              if(data )
              {
                this.router.navigate(['/users/talent']);
              }
            },
            error => {

            });
      }
      if(this.viewBy === 'admin') {
        this.authenticationService.edit_candidate_profile(this.userDoc['_id'], queryBody, true)
          .subscribe(
            data => {
              if(data )
              {
                this.router.navigate(['/admins/talent/'+ this.userDoc['_id']]);
              }
            },
            error => {

            });
      }
    }
    else {
      this.error_msg = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }
  }

  checkWorkType() {
    let value = this.workTypes.selectedWorkType
    const employee = value.find(x => x === 'employee');
    if (employee) this.employeeCheck = true;
    else this.employeeCheck = false;

    const contractor = value.find(x => x === 'contractor');
    if (contractor) this.contractorCheck = true;
    else this.contractorCheck = false;

    const volunteer = value.find(x => x === 'volunteer');
    if (volunteer) this.volunteerCheck = true;
    else this.volunteerCheck = false;
  }

  changeLocationToBEFormat(array){
    let validatedLocation = [];
    for(let location of array) {
      if(location.name) {
        if(location.name.includes('city')) {
          validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
        }
        if(location.name.includes('country')) {
          validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
        }
        if(location.name === 'Remote') {
          validatedLocation.push({remote: true, visa_needed : location.visa_needed });
        }
      }
      else {
        if(location.city) validatedLocation.push({city: location.city._id, visa_needed: location.visa_needed});
        if(location.country) validatedLocation.push({country: location.country, visa_needed: location.visa_needed});
        if(location.remote) validatedLocation.push({remote: true, visa_needed: false});
      }
    }
    return validatedLocation;
  }
}
