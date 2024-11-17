import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Clase de servicios relacionados a Producto
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productosUrl = '/data/product.json'; // Ruta al archivo JSON

  constructor(private http: HttpClient) { }


  getProductList(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productosUrl);
  }

  getProduct(id: number): Observable<Product | undefined> {
    return this.http.get<Product[]>(this.productosUrl).pipe(
      map((prods: Product[]) => {
        return prods.find(p => p.id === id);
      })
    );
  }

  updateProduct(prod: Product): Observable<boolean> {
    const result = new Subject<boolean>();

    this.getProductList().subscribe({
      next: (products) => {
        // actualiza producto
        let index = products.findIndex(x => x.id === prod.id);
        products[index] = prod;

        this.http.post(this.productosUrl, products).pipe(
          map(() => {
            result.next(true);
            result.complete();
          }),
          catchError((error) => {
            result.error(false);
            return of(false);
          })
        ).subscribe();
      },
      error: (err) => {
        result.error(false);
      }
    });

    return result.asObservable();
  }

}
