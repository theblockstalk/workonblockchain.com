import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './app-shared.module';
import { UserService } from './user.service';
import { HttpClientModule} from '@angular/common/http';
import { DataService } from './data.service';
import { DatePipe, CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import {HomeComponent} from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { NgtUniversalModule } from '@ng-toolkit/universal';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    TransferHttpCacheModule,
    NgtUniversalModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [UserService, DataService, DatePipe, CookieService],
  bootstrap: [AppComponent],
})
export class AppModule { }


