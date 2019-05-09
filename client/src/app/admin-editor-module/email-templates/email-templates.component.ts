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
    if (!editorForm.value.editor_content) {
      this.editor_log = 'Please enter body';
      errorCount++;
    }
    if (this.new_template === true && !editorForm.value.name) {
      this.name_log = 'Please enter name';
      errorCount++;
    }
    if (errorCount === 0) {

    }
    else {
      this.error_msg = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }

  }

  newTemplate(value: boolean) {
    this.new_template = value;
    if (!value) {
      this.name = '';
    }
  }

}
