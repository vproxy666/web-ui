import { Component, Renderer2, Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isNavSideBarExpanded: boolean = true;
  isTopNavExpanded: boolean = false;

  selectedLanguage : string = "en";
  languages = {
    "en" : "English",
    "zh-cn" : "简体中文"
  };

  constructor(private renderer: Renderer2, public router: Router,
      @Inject(APP_BASE_HREF) public baseHref:string, public translate: TranslateService) 
  {
      this.renderer.removeClass(document.body, 'sidenav-toggled');
      this.renderer.addClass(document.body, 'sidenav-expanded');

      translate.addLangs(['en', 'zh-cn']);
      translate.setDefaultLang('en');

      const browserLang = translate.getBrowserLang();
      this.selectLanguage(browserLang.match(/zh/) ? 'zh-cn' : 'en');
  }

  public toggleNav(evt) {
    this.isTopNavExpanded = !this.isTopNavExpanded;
  }

  public selectLanguage(lang:string) {
    this.selectedLanguage = lang;
    this.translate.use(lang);
  }

  public toggleSideNav(evt){
      this.isNavSideBarExpanded = !this.isNavSideBarExpanded;

      if( this.isNavSideBarExpanded ){
          this.renderer.removeClass(document.body, 'sidenav-toggled');
          this.renderer.addClass(document.body, 'sidenav-expanded');
      } else {
          this.renderer.removeClass(document.body, 'sidenav-expanded');
          this.renderer.addClass(document.body, 'sidenav-toggled');
      }

  }

}
