import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private readonly httpClient = inject(HttpClient);
  getLoggesUserAddresses(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/addresses`);
  }
  getSpecificAddress(addressId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/addresses/${addressId}`);
  }
  removeSpecificAddress(addressId: any): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/addresses/${addressId}`);
  }
  addNewAddress(data: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/addresses`, data);
  }
}
