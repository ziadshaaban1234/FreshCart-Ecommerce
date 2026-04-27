import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);
  getAllCategories(pageNumber: any = 1): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`, {
      params: {
        page: pageNumber, limit: 15
      }
    });
  }
  getSpecificCategory(categoryId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories/${categoryId}`);
  }
}
