import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import {HomeComponent} from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserService } from './user.service';
import { HttpClientModule} from '@angular/common/http';
import { DataService } from "./data.service";
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SeoService } from './seo.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [UserService,DataService,DatePipe,CookieService,SeoService],
  bootstrap: [AppComponent]
})
export class AppModule { }


