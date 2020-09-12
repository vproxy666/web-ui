import { Component, OnInit, Renderer2 , Inject, ViewChild} from '@angular/core';
import { WebApiService } from '../web-api.service';
import { ToastService } from '../toast.service';
import { APP_BASE_HREF } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { RequestCertificateDlgComponent } from '../request-certificate-dlg/request-certificate-dlg.component';
import { BannerComponent } from "../banner/banner.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild(BannerComponent) banner: BannerComponent;

  sslDomain: string = "";
  sslKey: File = null;
  sslCert: File = null;
  isSslFormValidated :boolean = false;
  basicInfo : any = {};
  sslCertificates : Array<any> = [];

  constructor(private webApi: WebApiService,
     public toastService: ToastService,
     @Inject(APP_BASE_HREF) public baseHref:string,
     private renderer: Renderer2,
     private modalService: NgbModal,
     private router: Router) { 

  }

  ngOnInit(): void {
    this.loadSslCertificates()
    this.loadBasicInfo();
  }

  ngAfterViewInit() {
    
  }

  loadBasicInfo() {
    this.webApi.getBasicInfo().subscribe(
      (json) => this.basicInfo = json,
      (err) => this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 })
    );
  }

  selectPrivateKey(files: FileList){
    if( files.length > 0)
      this.sslKey = files[0];
  }

  selectCertificate(files: FileList){
    if( files.length > 0)
      this.sslCert = files[0];
  }

  loadSslCertificates() {
    this.webApi.getSslCertificates().subscribe(
      (json) => this.sslCertificates = json.items,
      (err) => this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 })
    );
  }

  startLoading(elem : HTMLElement) : Function {
    while(elem != null && elem.tagName.toUpperCase() != "BUTTON" ){
      elem = elem.parentElement;
    }
    if( elem != null ){
      this.renderer.setAttribute(elem, "disabled", "disabled");
      this.renderer.addClass(elem, 'loading');
      return () => {
        this.renderer.removeAttribute(elem, "disabled");
        this.renderer.removeClass(elem, 'loading');
      };
    }
    return () => { };
  } 

  addSslCertificate(elem : HTMLElement) {

    this.isSslFormValidated = true;
    if( this.sslDomain && this.sslCert && this.sslKey ){
      let unloading = this.startLoading(elem);
      this.webApi.uploadSslCertificate( this.sslDomain, this.sslCert, this.sslKey).subscribe(
        (_) => {
          this.banner.loadSslCertificates();
          unloading();
          this.loadSslCertificates();
          this.toastService.show("SSL certificate is added successfully", { classname: 'bg-success text-light', delay: 2000 })
        },
        (err) => {
          unloading();
          this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 });
        }
      );
    }

  }

  deleteSslCertificate(elem : HTMLElement, id : string) {
    let unloading = this.startLoading(elem);
    this.webApi.delSslCertificate(id).subscribe(
      (_) => {
        this.banner.loadSslCertificates();
        unloading();
        this.loadSslCertificates();
        this.toastService.show("SSL certificate is deleted successfully", { classname: 'bg-success text-light', delay: 2000 })
      },
      (err) => {
        unloading();
        this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 });
      }
    );
  }

  updateSettings(elem : HTMLElement) {
    let unloading = this.startLoading(elem);
    this.webApi.updateSettings(this.basicInfo.origin_url, this.basicInfo.http_proxy, this.basicInfo.disguise_mode).subscribe(
      (_) => {
        unloading();
        this.toastService.show("Setting is uploaded", { classname: 'bg-success text-light', delay: 2000 })
      },
      (err) => {
        unloading();
        this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 });
      }
    );
  }


  showLetsencryptDlg() {
    const modalRef = this.modalService.open(RequestCertificateDlgComponent, { size: 'lg' });
    modalRef.result.then((result) => {
      
      if( result ){
        this.banner.loadSslCertificates();
        this.loadSslCertificates();
      }
        
    }, (reason) => {
    });
  }
}
