import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UserService } from './user.service';
import { HttpClientModule} from '@angular/common/http';
import { DataService } from './data.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import {HomeComponent} from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [UserService, DataService, DatePipe, CookieService,FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule { }


