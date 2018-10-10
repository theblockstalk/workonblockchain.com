import { Component, OnInit,ElementRef, Input,AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {environment} from '../../environments/environment';
import {NgForm} from '@angular/forms';
declare var $: any;

const URL = environment.backend_url;
@Component({
  selector: 'app-linkedin-import',
  templateUrl: './linkedin-import.component.html',
  styleUrls: ['./linkedin-import.component.css']
})
export class LinkedinImportComponent implements OnInit {
  info: any = {};
  currentUser: User;
  skip_value;
  resume_disable;
  job_disable;
  exp_disable;
  active_class;
  term_active_class;
  term_link;
  about_active_class;
  job_active_class;
  resume_class;
  link;
  exp_class;
  resume_active_class;
  exp_active_class;
  error_log;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.skip_value = 0;
    this.job_disable = "disabled";
    this.resume_disable = "disabled";
    this.exp_disable = "disabled";
    this.active_class='fa fa-check-circle text-success';
    if(!this.currentUser)
    {
      this.router.navigate(['/signup']);
    }

    if(this.currentUser && this.currentUser.type=='candidate')
    {
      this.authenticationService.getById(this.currentUser._id)
        .subscribe(
          data =>
          {

            if(data.terms)
            {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }

            if(data.contact_number  && data.nationality && data.first_name && data.last_name)
            {
              this.about_active_class = 'fa fa-check-circle text-success';
              this.job_disable = '';
              this.link= "/job";
            }

            if(data.locations && data.roles && data.interest_area && data.expected_salary && data.availability_day&& data.current_salary )
            {
              this.resume_disable = '';
              this.job_active_class = 'fa fa-check-circle text-success';
              this.resume_class="/resume";
            }

            if(data.why_work )
            {
              this.exp_disable = '';
              this.resume_class="/resume";
              this.exp_class = "/experience";
              this.resume_active_class='fa fa-check-circle text-success';
            }

            if( data.programming_languages.length>0  &&data.description)
            {
              this.exp_class = "/experience";
              this.exp_active_class = 'fa fa-check-circle text-success';
            }



          },
          error =>
          {
            if(error.message === 500 || error.message === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error.message === 403)
            {
              // this.router.navigate(['/not_found']);
            }
          });

    }
    else
    {
      this.router.navigate(['/not_found']);
    }

    $('#fileselect').bind('change', function () {
      var filename = $("#fileselect").val();
      if (/^\s*$/.test(filename)) {
        $(".file-uploadd").removeClass('active');
        $("#noFile").text("No file chosen...");
      }
      else {
        $(".file-uploadd").addClass('active');
        $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
      }
    });
  }

  public fileselected(e) {

    const backendService = this.authenticationService;
    const currentUser = this.currentUser._creator;
    let education_json_array = [];
    let experiencearray = [];
    const filedrag = document.getElementById('filedrag');

    const fileselect = document.getElementById('fileselect');
    let fileName = null;

    interface FileReaderEventTarget extends EventTarget {
      result: string;
    }

    interface FileReaderEvent extends Event {
      target: FileReaderEventTarget;

      getMessage(): string;
    }

    interface Window {
      ga: any;
      Prism: { highlightElement(elem: HTMLElement): void };
    }
    function fileDragHover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.target.className = e.type === 'dragover' ? 'hover' : '';
    }

    let linkedinToJsonResume;
    if ((<any>window).ga) {
      (<any>window).ga('send', 'event', 'linkedin-to-json-resume', 'file-selected');
    }
    Promise.all([
      import('./converter'),
      import('moment'),
      import('isomorphic-unzip/zip-browser'),
      import('./csvtoarray')
    ]).then(modules => {
      const [LinkedInToJsonResume, Moment, Unzip, CsvToArray] = modules;
      const csvToArray = CsvToArray.default;
      const moment = Moment;
      linkedinToJsonResume = new LinkedInToJsonResume.default();
      // cancel event and hover styling
      fileDragHover(e);
      const droppedFiles = e.target.files || e.dataTransfer.files;
      const file = droppedFiles[0];
      fileName = file.name;

      const readBlob = (blob: Blob): Promise<string> => {
        return new Promise(resolve => {
          let reader = new FileReader();
          reader.onload = (e: FileReaderEvent) => {
            resolve(e.target.result);
          };
          reader.readAsText(blob);
        });
      };

      const readEntryContents = (entry: any): Promise<string> => {
        return new Promise(resolve => {
          Unzip.getEntryData(entry, (error, blob) => {
            readBlob(blob).then(resolve);
          });
        });
      };

      let unzip = null;
      const getEntries = (file, onend) => {
        unzip = new Unzip(file);
        unzip.getEntries(function (error, entries) {
          onend(entries);
        });
      };

      getEntries(file, entries => {
        const promises = entries.map(entry => {
          switch (true) {
            case entry.filename.indexOf('Skills.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                contents = contents.replace(/"/g, '');
                let elements = contents.split('\n');
                elements = elements.slice(1, elements.length - 1);
                linkedinToJsonResume.processSkills(elements);
                return;
              });

            case entry.filename.indexOf('Education.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents);
                const education = elements
                  .slice(1, elements.length - 1)
                  .map(elem => ({
                    schoolName: elem[0],
                    startDate: moment(elem[1]).format('YYYY-MM-DD'),
                    endDate: moment(elem[2]).format('YYYY-MM-DD'),
                    notes: elem[3],
                    degree: elem[4],
                    activities: elem[5]
                  }));
                linkedinToJsonResume.processEducation(
                  education.sort(
                    (e1, e2) => -e1.startDate.localeCompare(e2.startDate)
                  )
                );
                return;
              });

            case entry.filename.indexOf('Positions.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents);
                const positions = elements
                  .slice(1, elements.length - 1)
                  .map(elem => {
                    return {
                      companyName: elem[0],
                      title: elem[1],
                      description: elem[2],
                      location: elem[3],
                      startDate: moment(elem[4], 'MMM YYYY').format('YYYY-MM-DD'),
                      endDate: elem[5]
                        ? moment(elem[5], 'MMM YYYY').format('YYYY-MM-DD')
                        : null
                    };
                  });
                linkedinToJsonResume.processPosition(
                  positions.sort(
                    (p1, p2) => -p1.startDate.localeCompare(p2.startDate)
                  )
                );
                return;
              });

            case entry.filename.indexOf('Languages.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents);
                const languages = elements
                  .slice(1, elements.length - 1)
                  .map(elem => ({
                    name: elem[0],
                    proficiency: elem[1]
                  }));
                linkedinToJsonResume.processLanguages(languages);
                return;
              });

            case entry.filename.indexOf('Recommendations Received.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents);
                const recommendations = elements
                  .slice(1, elements.length - 1)
                  .map(elem => ({
                    recommenderFirstName: elem[0],
                    recommenderLastName: elem[1],
                    recommenderCompany: elem[2],
                    recommenderTitle: elem[3],
                    recommendationBody: elem[4],
                    recommendationDate: elem[5],
                    displayStatus: elem[6]
                  }))
                  .filter(
                    recommendation => recommendation.displayStatus === 'VISIBLE'
                  );
                linkedinToJsonResume.processReferences(recommendations);
                return;
              });

            case entry.filename.indexOf('Profile.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents);
                const profile = {
                  firstName: elements[1][0],
                  lastName: elements[1][1],
                  maidenName: elements[1][2],
                  address: elements[1][3],
                  birthDate: elements[1][4],
                  contactInstructions: elements[1][5],
                  headline: elements[1][6],
                  summary: elements[1][7],
                  industry: elements[1][8],
                  country: elements[1][9],
                  zipCode: elements[1][10],
                  geoLocation: elements[1][11],
                  twitterHandles: elements[1][12],
                  websites: elements[1][13],
                  instantMessengers: elements[1][14]
                };
                linkedinToJsonResume.processProfile(profile);
                return;
              });

            case entry.filename.indexOf('Email Addresses.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents, '\t'); // yes, recommendations use tab-delimiter
                const email = elements
                  .slice(1, elements.length - 1)
                  .map(elem => ({
                    address: elem[0],
                    status: elem[1],
                    isPrimary: elem[2] === 'Yes',
                    dateAdded: elem[3],
                    dateRemoved: elem[4]
                  }))
                  .filter(email => email.isPrimary);
                if (email.length) {
                  linkedinToJsonResume.processEmail(email[0]);
                }
                return;
              });

            case entry.filename.indexOf('Interests.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents);
                let interests = [];
                elements.slice(1, elements.length - 1).forEach(elem => {
                  interests = interests.concat(elem[0].split(','));
                });
                linkedinToJsonResume.processInterests(interests);
                return;
              });

            case entry.filename.indexOf('Projects.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents);
                const projects = elements
                  .slice(1, elements.length - 1)
                  .map(elem => ({
                    title: elem[0],
                    description: elem[1],
                    url: elem[2],
                    startDate: moment(elem[3]).format('YYYY-MM-DD'),
                    endDate: elem[4] ? moment(elem[4]).format('YYYY-MM-DD') : null
                  }));
                linkedinToJsonResume.processProjects(
                  projects.sort(
                    (p1, p2) => -p1.startDate.localeCompare(p2.startDate)
                  )
                );
                return;
              });

            case entry.filename.indexOf('Publications.csv') !== -1:
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents);
                const publications = elements
                  .slice(1, elements.length - 1)
                  .map(elem => ({
                    name: elem[0],
                    date: moment(elem[1]).format('YYYY-MM-DD'),
                    description: elem[2],
                    publisher: elem[3],
                    url: elem[4]
                  }));
                linkedinToJsonResume.processPublications(
                  publications.sort((p1, p2) => -p1.date.localeCompare(p2.date))
                );
                return;
              });

            default:
              return Promise.resolve([]);
          }
        });

        Promise.all(promises).then(() => {
          if ((<any>window).ga) {
            (<any>window).ga(
              'send',
              'event',
              'linkedin-to-json-resume',
              'file-parsed-success'
            );
          }

          let linkedinData = JSON.stringify(
            linkedinToJsonResume.getOutput(),
            undefined,
            2
          );

          var obj = JSON.parse(linkedinData);
          let info;
          let name;
          if (!obj.basics && !obj.work && !obj.education) {
            this.error_log = "There is an error message. Your file formate is not supported.";
          }

          else {
            if (obj.basics.name || obj.basics.phone || obj.basics.summary) {
              name = obj.basics.name.split(' ');
              info = {first_name: name[0], last_name: name[1] , summary : obj.basics.summary};


            }

            if(obj.work){
              if (obj.work.length > 0) {

                let end_date_format;
                for (var key in obj.work) {
                  let start_date_format = new Date(obj.work[key].startDate);
                  if (obj.work[key].endDate) {
                    end_date_format = new Date(obj.work[key].endDate);
                    obj.work[key].currentwork = false;
                  }
                  else {
                    end_date_format = new Date();
                    obj.work[key].currentwork = true;
                  }
                  let experiencejson = {
                    companyname: obj.work[key].company,
                    positionname: obj.work[key].position,
                    locationname: obj.work[key].location,
                    description: obj.work[key].summary,
                    startdate: start_date_format,
                    enddate: end_date_format,
                    currentwork: obj.work[key].currentwork
                  };
                  experiencearray.push(experiencejson);

                }
              }
            }


            if(obj.education)
            {
              if (obj.education.length > 0) {

                for (var key in obj.education) {
                  let eduyear = parseInt(obj.education[key].endDate);
                  let educationjson = {
                    uniname: obj.education[key].institution, degreename: obj.education[key].studyType
                    , fieldname: obj.education[key].fieldname, eduyear: eduyear
                  };
                  education_json_array.push(educationjson);

                }
              }
            }


            if (obj.work || obj.education || obj.basics ) {
              backendService.prefilled_profile(info , experiencearray,  education_json_array )
                .subscribe(
                  data => {
                    if(data && this.currentUser)
                    {
                      this.router.navigate(['/about']);
                    }

                    if(data.error )
                    {
                      //this.log= data.error;
                    }

                  },
                  error => {
                    if(error.message === 500 || error.message === 401)
                    {
                      localStorage.setItem('jwt_not_found', 'Jwt token not found');
                      localStorage.removeItem('currentUser');
                      localStorage.removeItem('googleUser');
                      localStorage.removeItem('close_notify');
                      localStorage.removeItem('linkedinUser');
                      localStorage.removeItem('admin_log');
                      window.location.href = '/login';
                    }

                    if(error.message === 403)
                    {
                      this.router.navigate(['/not_found']);
                    }

                  });

            }

            else
            {
              this.error_log = "Please upload only linkedin zip file";
            }

          }
        });
      });
    });
  }

  onSubmit(f: NgForm)
  {

    if(!f.value.fileselect)
    {
      this.error_log= "Please choose file";
    }

    else
    {
       if(f.value.fileselect)
      {
        this.fileselected(this.fileevent);
      }

    }
  }

  fileevent;
  filechoosen(e)
  {
    this.fileevent = e;
  }

  skipbutton()
  {
    this.router.navigate(['/about']);
    //this.skip_value = 1;
  }
}
