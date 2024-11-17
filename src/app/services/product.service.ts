import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Clase de servicios relacionados a Producto
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productArray: Product[] = [];

  private readonly productosUrl = '/data/product.json'; // Ruta al archivo JSON

  constructor(private readonly http: HttpClient) { this.loadData() }

  loadData() {
    if (this.productArray.length == 0) {
      this.http.get<Product[]>(this.productosUrl).subscribe(data => {
        this.productArray = data;
      });
    }
  }

  getProductList(): Observable<Product[]> {
    return of(this.productArray);
  }

  getProduct(id: number): Observable<Product | undefined> {
    let prod = this.productArray.find(p => p.id === id);
    return of(prod);
  }

  updateProduct(prod: Product): Observable<boolean> {
    let index = this.productArray.findIndex(x => x.id === prod.id);
    this.productArray[index] = prod;

    return of(true);
  }

}
