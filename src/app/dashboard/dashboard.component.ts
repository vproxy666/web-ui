import { Component, OnInit, Inject } from '@angular/core';
import { WebApiService } from '../web-api.service';
import { ToastService } from '../toast.service';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  basicInfo : any = {};
  constructor(private webApi: WebApiService,
    public toastService: ToastService,
    @Inject(APP_BASE_HREF) public baseHref:string) { }

  ngOnInit(): void {
    this.loadBasicInfo();
  }


  loadBasicInfo() {
    this.webApi.getBasicInfo().subscribe(
      (json) => this.basicInfo = json,
      (err) => this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 })
    );
  }

}
