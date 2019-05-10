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
        this.getTemplateOptions();
        this.template = this.templates[0];
        if (this.template) this.fillFields('', this.template);
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
    console.log(editorForm.value);
    let errorCount = 0;
    if (!editorForm.value.template && this.new_template === false) {
      this.template_log = 'Please select template name';
      errorCount++;
    }
    if (!editorForm.value.body) {
      this.editor_log = 'Please enter body';
      errorCount++;
    }
    if (this.new_template === true && !editorForm.value.name) {
      this.name_log = 'Please enter name';
      errorCount++;
    }
    if (errorCount === 0) {
      let InputBody : any = {};
      if(editorForm.value.template && this.new_template === false) InputBody.name = editorForm.value.template;
      if (this.new_template === true && editorForm.value.name) InputBody.name = editorForm.value.name;
      if(editorForm.value.subject) InputBody.subject = editorForm.value.subject;
      if(editorForm.value.body) InputBody.body = editorForm.value.body;
      console.log(InputBody)
      if (this.new_template === true) {
        this.authenticationService.email_templates_post(InputBody)
          .subscribe(
            data =>
            {
              if(data)
              {
                this.success = "Content Successfully Updated";
                this.getTemplateOptions();
                this.fillFields('', InputBody.name);

                setTimeout(() => {
                  $('.selectpicker').selectpicker();
                }, 200);
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
      else {
        this.authenticationService.email_templates_patch(InputBody)
          .subscribe(
            data =>
            {
              if(data)
              {
                this.success = "Content Successfully Updated";
                this.getTemplateOptions();
                this.fillFields('', InputBody.name);
                setTimeout(() => {
                  $('.selectpicker').selectpicker();
                }, 200);
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

    }
    else {
      this.error_msg = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }
  }

  getTemplateOptions()  {
    this.templates = [];
    this.authenticationService.email_templates_get()
      .subscribe(
        data =>
        {
          if(data) {
            console.log(data);
            this.templateDoc = data;
            for(let x of this.templateDoc) {
              this.templates.push(x.name);
            }


            window.scrollTo(0, 0);
            setTimeout(() => {
              $('.selectpicker').selectpicker();
            }, 200);

            setTimeout(() => {
              $('.selectpicker').selectpicker('refresh');
            }, 500);
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
    }
    else {
      this.subject = '';
      this.body = '';
      this.template = '';
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 200);
    }
  }

  fillFields(event, name) {
    let template;
    if(name && name !== '') template = this.templateDoc.find(x => x.name === name);
    else template = this.templateDoc.find(x => x.name === event.target.value);
    this.subject = template.subject;
    this.body = template.body;
    console.log(template);
  }

}
