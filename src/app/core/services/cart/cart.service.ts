import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  numberOfCartItems: WritableSignal<number> = signal(0);
  addProductToCart(prodId: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart`,
      {
        productId: prodId
      }
    );
  }

  updateCartProductQuantity(prodId: any, prodCount: number): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/cart/${prodId}`,
      {
        count: prodCount
      }
    );
  }

  removeSpecificCartItem(prodId: any): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${prodId}`);
  }
  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`);//token will send automatically by headers Interceptor
  }
  ClearUserCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart`);//token will send automatically by headers Interceptor
  }
}
