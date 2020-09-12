import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { ToastsContainerComponent } from './toasts-container/toasts-container.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { BannerComponent } from './banner/banner.component';
import { RequestCertificateDlgComponent } from './request-certificate-dlg/request-certificate-dlg.component';



export const BASE_HREF : string = (function() {
  var matches = /^(\/[^\/]+\/)/.exec(location.pathname);
  if( matches && matches.length > 1 )
    return matches[1];
  return "/";
})();

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, BASE_HREF + "assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    ToastsContainerComponent,
    DashboardComponent,
    UsersComponent,
    BannerComponent,
    RequestCertificateDlgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [{
      provide: APP_BASE_HREF, 
      useValue: BASE_HREF
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [RequestCertificateDlgComponent]
})
export class AppModule { }
