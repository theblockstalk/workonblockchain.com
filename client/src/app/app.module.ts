import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UserService } from './user.service';
import { HttpClientModule} from '@angular/common/http';
import { DataService } from './data.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SafeHtmlPipe } from './pipe.safehtml';

import { AppRoutingModule } from './app-routing.module';

import {HomeComponent} from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [UserService, DataService, DatePipe, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }


