import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCertificateDlgComponent } from './request-certificate-dlg.component';

describe('RequestCertificateDlgComponent', () => {
  let component: RequestCertificateDlgComponent;
  let fixture: ComponentFixture<RequestCertificateDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCertificateDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCertificateDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
