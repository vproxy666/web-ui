import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Renderer2 , Inject} from '@angular/core';
import { WebApiService } from '../web-api.service';
import { ToastService } from '../toast.service';
import { APP_BASE_HREF } from '@angular/common';


@Component({
  selector: 'app-request-certificate-dlg',
  templateUrl: './request-certificate-dlg.component.html',
  styleUrls: ['./request-certificate-dlg.component.css']
})
export class RequestCertificateDlgComponent implements OnInit {

  sslDomainName : string = "";
  sslEmail : string = "";
  sslOutput : string = "";
  constructor(private webApi: WebApiService,
    public toastService: ToastService,
    @Inject(APP_BASE_HREF) public baseHref:string,
    private renderer: Renderer2,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
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

  requestSslCert(elem : HTMLElement)  {
    let unloading = this.startLoading(elem);
    this.webApi.requestSslCertificates(this.sslDomainName, this.sslEmail).subscribe(
      (json) => {
        this.sslOutput = json.output;
        unloading();
        this.toastService.show("Congratulation! SSL certificate is added.", { classname: 'bg-success text-light', delay: 2000 })
        if( json.success ){
          this.activeModal.close(true);
        }
      },
      (err) => {
        unloading();
        this.sslOutput = err.output;
        this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 });
      }
    );
  }
}
