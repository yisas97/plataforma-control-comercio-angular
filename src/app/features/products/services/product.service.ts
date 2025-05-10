import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map, Observable} from 'rxjs';
import {Product} from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducerProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true
      })))
    );
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any): Observable<any> {
    if (product.categoryIds !== undefined && !Array.isArray(product.categoryIds)) {
      product.categoryIds = [product.categoryIds];
    }

    if (product.tagIds !== undefined && !Array.isArray(product.tagIds)) {
      product.tagIds = [product.tagIds];
    }
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    if (product.categoryIds !== undefined && !Array.isArray(product.categoryIds)) {
      product.categoryIds = [product.categoryIds];
    }

    if (product.tagIds !== undefined && !Array.isArray(product.tagIds)) {
      product.tagIds = [product.tagIds];
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchProducts(name: string): Observable<any[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params });
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-category/${categoryId}`);
  }

  getProductsByTag(tagId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-tag/${tagId}`);
  }

  filterProducts(categoryIds?: number[], tagIds?: number[]): Observable<any[]> {
    let params = new HttpParams();

    if (categoryIds && categoryIds.length > 0) {
      categoryIds.forEach(id => {
        params = params.append('categoryIds', id.toString());
      });
    }

    if (tagIds && tagIds.length > 0) {
      tagIds.forEach(id => {
        params = params.append('tagIds', id.toString());
      });
    }

    return this.http.get<any[]>(`${this.apiUrl}/filter`, { params });
  }

  addCategoryToProduct(productId: number, categoryId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${productId}/categories/${categoryId}`, {});
  }

  removeCategoryFromProduct(productId: number, categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/categories/${categoryId}`);
  }

  addTagToProduct(productId: number, tagId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${productId}/tags/${tagId}`, {});
  }

  removeTagFromProduct(productId: number, tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/tags/${tagId}`);
  }

}
