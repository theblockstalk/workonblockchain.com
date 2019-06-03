import { Component , AfterViewInit, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Router, NavigationStart, NavigationCancel, NavigationEnd} from '@angular/router';
import { environment } from '../environments/environment';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  loading;
  title = 'app';
  message: any;

    public ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            let bases = this.document.getElementsByTagName('base');
    
            if (bases.length > 0) {
                bases[0].setAttribute('href', environment.baseHref);
            }
        }
    }

  constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: any, private router: Router) {
    this.loading = true;
  }
  ngAfterViewInit() {
    this.router.events
      .subscribe((event) => {
        if(event instanceof NavigationStart) {
          this.loading = true;
        }
        else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          this.loading = false;
        }
      });
  }

}
