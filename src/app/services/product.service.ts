import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

/**
 * Clase de servicios relacionados a Producto
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // private readonly productArray = new BehaviorSubject<Product[]>([]);
  private readonly productosUrl = `${environment.apiUrl}:8081/api/productos`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) { }

  /**
   * Construye los headers con el token de autenticación.
   * @returns HttpHeaders con el token incluido.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró un token válido');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProductList(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productosUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productosUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productosUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<string> {
    return this.http.put<string>(`${this.productosUrl}/${id}`, product, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productosUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
