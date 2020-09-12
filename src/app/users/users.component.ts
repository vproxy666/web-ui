import { Component, OnInit, Renderer2 , Inject} from '@angular/core';
import { WebApiService } from '../web-api.service';
import { ToastService } from '../toast.service';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  username: string = "";
  password: string = "";
  level : number = 1;
  isFormValidated :boolean = false;
  users : Array<any> = [];
  states : any = {};

  constructor(private webApi: WebApiService,
    public toastService: ToastService,
    @Inject(APP_BASE_HREF) public baseHref:string,
    private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loadUsers();
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

  loadUsers() {
    this.states = {};
    this.webApi.getUsers().subscribe(
      (json) => this.users = json.items,
      (err) => this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 })
    );
  }

  deleteUser(elem : HTMLElement, id : string) {
    let unloading = this.startLoading(elem);
    this.webApi.delUser(id).subscribe(
      (_) => {
        unloading();
        this.loadUsers();
        this.toastService.show("User is deleted successfully", { classname: 'bg-success text-light', delay: 2000 })
      },
      (err) => {
        unloading();
        this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 });
      }
    );
  }


  addUser(elem : HTMLElement) {

    this.isFormValidated = true;
    if( this.username && this.password ){
      let unloading = this.startLoading(elem);
      this.webApi.addUser( this.username, this.password, this.level).subscribe(
        (_) => {
          unloading();
          this.loadUsers();
          this.toastService.show("User is added successfully", { classname: 'bg-success text-light', delay: 2000 })
        },
        (err) => {
          unloading();
          this.toastService.show(err.message, { classname: 'bg-danger text-light', delay: 5000 });
        }
      );
    }

  }
}
