import { Component, OnInit, InjectionToken, FactoryProvider, Inject  } from '@angular/core';
import { WebApiService } from '../web-api.service';
import { ToastService } from '../toast.service';
import { APP_BASE_HREF } from '@angular/common';

export const WINDOW = new InjectionToken<Window>('window');

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => window
};

export const WINDOW_PROVIDERS = [
    windowProvider
]

@Component({
  providers: [WINDOW_PROVIDERS],
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  basicInfo : any = {};
  sslCertificates : Array<any> = [];
  isHttp : boolean  = false;
  constructor(@Inject(WINDOW) private window: Window,
     private webApi: WebApiService,
     public toastService: ToastService,
     @Inject(APP_BASE_HREF) public baseHref:string) { }

  ngOnInit(): void {
    this.isHttp = this.window.location.protocol == "http:";
    if( this.isHttp ){
      this.loadSslCertificates();
    }
  }

  loadSslCertificates() {
    this.webApi.getSslCertificates().subscribe(
      (json) => {
        this.sslCertificates = json.items;
        if( json.items.length > 0){
          this.loadBasicInfo();
        }
      },
      (err) => {},
    );
  }

  loadBasicInfo() {
    this.webApi.getBasicInfo().subscribe(
      (json) => this.basicInfo = json,
      (err) => this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 })
    );
  }

 
}
 