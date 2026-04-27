import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);
  getAllBrands(pageNumber: any = 1): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/brands`, {
      params: {
        page: pageNumber,
        limit: 15
      }
    })
  }
  getSpecificBrand(bransId: any): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/brands/${bransId}`)
  }

}
