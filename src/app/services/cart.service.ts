import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { Cart } from '../models/cart.model';
import { StorageService } from './storage.service';
import { ProductDTO } from '../models/productDto.model';

/**
 * Clase de servicios relacionados a Producto
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {

  // private readonly productArray = new BehaviorSubject<Product[]>([]);
  private readonly ventasUrl = 'http://localhost:8083/api/ventas';
  private readonly cartKey = 'CartIdKey';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly storageService: StorageService
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

  getSales(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.ventasUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Obtiene el carrito de compras del usuario activo.
   * Si no tiene se creara un nuevo registro
   */
  getActiveCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.ventasUrl}/activa`, {
      headers: this.getAuthHeaders()
    });
  }

  getCartById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.ventasUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createSale(product: Product): Observable<Product> {
    return this.http.post<Product>(this.ventasUrl, product);
  }

  /**
   * Agrega un producto al carrito de compras del usuario activo
   */
  addSaleProduct(product: Product): Observable<Product> {
    let prod: ProductDTO = {
      idProducto: product.id, 
      cantidad: 1,
      precioUnidad: (product.oferta > 0 ? product.oferta : product.precio)
    };
    
    return this.http.post<Product>(`${this.ventasUrl}/${this.getStorageCartId()}/productos`, prod, {
      headers: this.getAuthHeaders()
    });
  }

  updateSaleProduct(id: number, product: Product): Observable<string> {
    return this.http.put<string>(`${this.ventasUrl}/${id}`, product, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  unactivateSale(id:number) {
    return this.http.put<Cart>(`${this.ventasUrl}/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Elimina un producto del carrito de compras del usuario activo
   */
  deleteSaleProduct(cartId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.ventasUrl}/${cartId}/productos/${productId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Obtiene el Id del carrito de compras del usuario activo
   */
  getStorageCartId(): number | null {
    let cartId = this.storageService.getItem(this.cartKey);
    return cartId ? JSON.parse(cartId) : null;
  }

  /**
   * Almacena el Id del carrito de compras del usuario activo
   */
  setStorageCartId(cartId: number | null) {
    this.storageService.setItem(this.cartKey, JSON.stringify(cartId));
  }
}
