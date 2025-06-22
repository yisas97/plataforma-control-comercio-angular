import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map, Observable} from 'rxjs';
import {Product} from '../model/product.model';
import {Producer} from '../../producer/model/producer.model';
import {DeleteProductResponse, ReactivateProductResponse} from '../model/delete-response.model';

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
        active: product.active !== undefined ? product.active : true,
        status: product.active === false ? 'Inactivo' : 'Activo',
        statusSeverity: product.active === false ? 'danger' : 'success'
      })))
    );
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace`).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  getProducers(): Observable<Producer[]> {
    return this.http.get<Producer[]>(`${this.apiUrl}/marketplace/producers`);
  }

  getProductsByProducer(producerId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/producers/${producerId}/products`).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  searchProductsByProducer(producerName: string): Observable<Product[]> {
    const params = new HttpParams().set('producerName', producerName);
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/search/producer`, { params }).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  searchProducts(name: string): Observable<Product[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/search`, { params }).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/marketplace/${id}`);
  }


  private getInventoryStatus(quantity: number): string {
    if (quantity === 0) {
      return 'AGOTADO';
    } else if (quantity < 10) {
      return 'BAJO STOCK';
    } else {
      return 'EN STOCK';
    }
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

  deleteProduct(id: number): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(`${this.apiUrl}/${id}`);
  }

  reactivateProduct(id: number): Observable<ReactivateProductResponse> {
    return this.http.put<ReactivateProductResponse>(`${this.apiUrl}/${id}/reactivate`, {});
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/by-category/${categoryId}`).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  getProductsByTag(tagId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/by-tag/${tagId}`).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  filterProducts(
    categoryIds?: number[],
    tagIds?: number[],
    minPrice?: number,
    maxPrice?: number
  ): Observable<Product[]> {
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

    if (minPrice !== undefined) {
      params = params.set('minPrice', minPrice.toString());
    }

    if (maxPrice !== undefined) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/filter`, { params }).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
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

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/featured`).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  getProductDetail(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/marketplace/${productId}/detail`).pipe(
      map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      }))
    );
  }

  toggleFavorite(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/marketplace/${productId}/favorite`, {});
  }

  getRelatedProductsByCategory(categoryName: string): Observable<Product[]> {
    const params = new HttpParams().set('name', categoryName);
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/search`, { params }).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  getRecommendations(limit: number = 10): Observable<Product[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Product[]>(`${this.apiUrl}/recommendations`, { params }).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  getPopularRecommendations(limit: number = 10): Observable<Product[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Product[]>(`${this.apiUrl}/recommendations/popular`, { params }).pipe(
      map(products => products.map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      })))
    );
  }

  getProductByIdQuick(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/marketplace/${id}`).pipe(
      map(product => ({
        ...product,
        stock: product.quantity,
        active: true,
        inventoryStatus: this.getInventoryStatus(product.quantity),
        rating: product.rating || 4.5,
        image: product.image || 'product-placeholder.jpg'
      }))
    );
  }




}
