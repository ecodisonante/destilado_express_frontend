import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Clase de servicios relacionados a Producto
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly productArray = new BehaviorSubject<Product[]>([]);
  private readonly productosUrl = '/data/product.json'; // Ruta al archivo JSON

  constructor(private readonly http: HttpClient) { this.loadData() }

  loadData() {
    if (this.productArray.getValue().length == 0) {
      this.http.get<Product[]>(this.productosUrl).subscribe(
        data => this.productArray.next(data)
      );
    }
  }

  getProductList(): Observable<Product[]> {
    this.loadData();
    return this.productArray.asObservable();
  }

  getProduct(id: number): Observable<Product | undefined> {
    let prod = this.productArray.getValue().find(p => p.id === id);
    return of(prod);
  }

  updateProduct(prod: Product): Observable<boolean> {
    this.loadData();

    const currentArray = this.productArray.getValue();
    let index = currentArray.findIndex(x => x.id === prod.id);

    // Si el producto existe, actualizar
    if (index !== -1) {
      currentArray[index] = prod;
      this.productArray.next([...currentArray]);
      return of(true);
    }

    return of(false);
  }

}
