import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  isLoggedInUser: WritableSignal<boolean> = signal(false);
  userId: WritableSignal<string> = signal('');
  userName: WritableSignal<string> = signal('');



  singUp(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, data)
  }
  singIn(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, data)
  }
  forgotPassword(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }
  verifyResetCode(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }
  resetPassword(data: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, data);
  }

  chanegPassword(data: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/users/changeMyPassword`, data);
  }
  getCurrentUser(userId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/users/${userId}`);
  }
  updataLoggedUserData(data: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/users/updateMe/`, data);
  }
}
