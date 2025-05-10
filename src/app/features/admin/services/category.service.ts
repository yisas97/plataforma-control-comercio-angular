import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;


  constructor() { }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/categories`);
  }


  updateCategory(id:number , category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/categories/${id}`, category);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/categories`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/categories/${id}`);
  }
}
