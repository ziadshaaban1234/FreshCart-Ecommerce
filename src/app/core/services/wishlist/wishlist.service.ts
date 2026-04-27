import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  numberOfWishListItems: WritableSignal<number> = signal(0);
  addProductToWishlist(prodId: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`,
      {
        productId: prodId
      });
  }

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }
  removeProductFromWishlist(prodId: any): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${prodId}`);
  }
}
