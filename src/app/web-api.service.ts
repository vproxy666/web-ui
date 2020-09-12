import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {


  constructor(private httpClient: HttpClient, @Inject(APP_BASE_HREF) private baseHref:string) { 
  }

  public getSslCertificates(): Observable<any> {
    const endpoint = this.baseHref + 'api/ssl_certificate';
    return this.httpClient
      .get(endpoint).pipe(
        catchError(this.errorHandle)
      );
  }

  public getBasicInfo(): Observable<any> {
    const endpoint = this.baseHref + 'api/basic_info';
    return this.httpClient
      .get(endpoint).pipe(
        catchError(this.errorHandle)
      );
  }

  public uploadSslCertificate(domainName:string, sslCert: File, sslKey: File): Observable<any> {
    const endpoint = this.baseHref + 'api/ssl_certificate';
    const formData: FormData = new FormData();
    formData.append('ssl_cert', sslCert, sslCert.name);
    formData.append('ssl_key', sslKey, sslKey.name);
    formData.append('ssl_domain', domainName);
    return this.httpClient
      .post(endpoint, formData).pipe(
        catchError(this.errorHandle)
      );
  }

  public delSslCertificate(id:string): Observable<any> {
    const endpoint = this.baseHref + 'api/ssl_certificate?id=' + id;
    return this.httpClient
      .delete(endpoint).pipe(
        catchError(this.errorHandle)
      );
  }


  public requestSslCertificates(domain : string, email : string): Observable<any> {
    const endpoint = this.baseHref + 'api/ssl_certificate/letsencrypt';

    const params = new HttpParams()
      .set(`domain`, domain)
      .set(`email`, email);
    return this.httpClient
      .get(endpoint, { params: params }).pipe(
        catchError(this.errorHandle)
      );
  }


  public updateSettings(originUrl:string, httpProxy:boolean, disguiseMode:boolean): Observable<any> {
    const endpoint = this.baseHref + 'api/settings';
    
    const body = new HttpParams()
      .set(`origin_url`, originUrl)
      .set(`http_proxy`, httpProxy.toString())
      .set(`disguise_mode`, disguiseMode.toString());
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.httpClient
      .post(endpoint, body.toString(), { headers, observe: 'response' }).pipe(
        catchError(this.errorHandle)
      );
  }


  public getUsers(): Observable<any> {
    const endpoint = this.baseHref + 'api/user';
    return this.httpClient
      .get(endpoint).pipe(
        catchError(this.errorHandle)
      );
  }

  public addUser(username:string, password:string, level:number): Observable<any> {
    const endpoint = this.baseHref + 'api/user';
    
    const body = new HttpParams()
      .set(`username`, username)
      .set(`password`, password)
      .set(`level`, level.toString());
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.httpClient
      .post(endpoint, body.toString(), { headers, observe: 'response' }).pipe(
        catchError(this.errorHandle)
      );
  }

  public updateUser(id:string, password:string, level:number): Observable<any> {
    const endpoint = this.baseHref + 'api/user';
    
    const body = new HttpParams()
      .set(`id`, id)
      .set(`password`, password)
      .set(`level`, level.toString());
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.httpClient
      .post(endpoint, body.toString(), { headers, observe: 'response' }).pipe(
        catchError(this.errorHandle)
      );
  }

  public delUser(id:string): Observable<any> {
    const endpoint = this.baseHref + 'api/user?id=' + id;
    return this.httpClient
      .delete(endpoint).pipe(
        catchError(this.errorHandle)
      );
  }

  errorHandle(response) {
    if(response.error && response.error.message) {
      return throwError(response.error);
    } else {
      return throwError({
        'message' : response.message,
        'status' : response.status
      });
    }    
 }
}
