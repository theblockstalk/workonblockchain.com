import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {UserService} from '../../user.service';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.css']
})
export class EmailTemplatesComponent implements OnInit, AfterViewInit {
  new_template = false;
  name;
  currentUser;
  admin_log;
  @ViewChild('myckeditor') ckeditor: any;
  ckeConfig: any;
  template_log;
  editor_log;
  error_msg;
  name_log;
  success;
  error;
  templates = [];
  templateDoc;
  subject;
  body;
  template;
  subject_log;
  template_id;
  templateName;
  constructor(private router: Router, private authenticationService: UserService) { }

  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
  }

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      height: '35rem',
      minHeight: '10rem',
    };

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    if (this.currentUser && this.admin_log ) {
      if (this.admin_log.is_admin === 1) {
         this.getTemplateOptions(false);
        setTimeout(() => {
          $('.selectpicker').selectpicker();
        }, 200);
      }
      else {
        this.router.navigate(['/not_found']);
      }
    }
    else {
      this.router.navigate(['/not_found']);
    }
  }

  editor(editorForm: NgForm) {
    this.success = '';
    this.error_msg = '';
    let errorCount = 0;
    if (!editorForm.value.template && this.new_template === false) {
      this.template_log = 'Please select template name';
      errorCount++;
    }
    if (!editorForm.value.body) {
      this.editor_log = 'Please enter body';
      errorCount++;
    }
    if (!editorForm.value.subject) {
      this.subject_log = 'Please enter subject';
      errorCount++;
    }
    if (this.new_template === true && !editorForm.value.name) {
      this.name_log = 'Please enter name';
      errorCount++;
    }
    if (errorCount === 0) {
      let InputBody : any = {};
      if(editorForm.value.subject) InputBody.subject = editorForm.value.subject;
      if(editorForm.value.body) InputBody.body = editorForm.value.body;
      if (!this.template_id) {
        if(editorForm.value.name !== this.templateName) InputBody.name = editorForm.value.name;
        this.authenticationService.email_templates_post(InputBody)
          .subscribe(
            data =>
            {
              if(data)
              {
                this.success = "Content Successfully Updated";
                setTimeout(() => {
                  this.success = '';
                }, 1000);
                this.getTemplateOptions(true);
                this.new_template = false;

              }

            },
            error =>
            {
              if(error.message === 403)
              {
                this.router.navigate(['/not_found']);
              }
              else {
                this.error_msg = error['error'].message;
              }
            });
      }
      else {
        if (editorForm.value.name) InputBody.name = editorForm.value.name;
        this.authenticationService.email_templates_patch(InputBody, this.template_id)
          .subscribe(
            data =>
            {
              if(data)
              {
                this.success = "Content Successfully Updated";
                setTimeout(() => {
                  this.success = '';
                }, 1000);
                this.getTemplateOptions(true);

              }
            },
            error =>
            {
              if(error.message === 403)
              {
                this.router.navigate(['/not_found']);
              }
              else {
                this.error_msg = error['error'].message;
              }
            });
      }

    }
    else {
      this.error_msg = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }
  }


  getTemplateOptions(bindData: boolean)  {
    this.templates = [];
    this.authenticationService.email_templates_get()
      .subscribe(
        data =>
        {
          if(data) {
            this.templateDoc = data;
            for(let x of this.templateDoc) {
              this.templates.push(x.name);
            }
            if(bindData) {
              this.fillFields('', this.name);
            }
             // if(this.template)this.fillFields('', this.template);
             // else if(this.name)this.fillFields('', this.name);
            // else this.fillFields('', this.templates[0]);

            window.scrollTo(0, 0);
            setTimeout(() => {
              $('.selectpicker').selectpicker();
            }, 200);

            setTimeout(() => {
              $('.selectpicker').selectpicker('refresh');
            }, 300);
          }
        },
        error =>
        {
          if(error.message === 403)
          {
            this.router.navigate(['/not_found']);
          }

        });
  }

  newTemplate(value: boolean) {
    this.new_template = value;
    if (!value) {
      this.name = '';
      this.subject = '';
      this.body = '';
      this.template = '';
      this.error_msg='';
      this.name_log= '';
      this.template_log='';
      this.editor_log='';
      this.subject_log='';
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 200);
    }
    else {
      this.name = '';
      this.subject = '';
      this.body = '';
      this.template = '';
      this.error_msg='';
      this.name_log= '';
      this.template_log='';
      this.editor_log='';
      this.subject_log='';
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 200);
    }
  }

  fillFields(event, name) {
    this.new_template = true;
    let template;
    if(name && name !== '') template = this.templateDoc.find(x => x.name === name);
    else template = this.templateDoc.find(x => x.name === event.target.value);
    // if('subject' in template) this.subject = template.subject;
    // else this.subject = '';
    this.body = template.body;
    this.template = template.name;
    this.template_id = template._id;
    this.name = template.name;
    this.templateName = template.name;
    this.subject = template.subject;
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 200);
  }

}
