import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient);
  checkoutSession(cartId: any, data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`, data)
  }
  createCashOrder(cartId: any, data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/${cartId}`, data);
  }
  getAllOrders() {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/orders/`);
  }
  getUserOrders(userId:string) {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/orders/user/${userId}`);
  }
}
