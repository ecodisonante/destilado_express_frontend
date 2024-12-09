import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockToken = 'mock-jwt-token';
  const mockProduct: Product = { id: 1, nombre: 'Product 1' } as Product;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy.getToken.and.returnValue(mockToken);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get product list', () => {
    const mockProducts: Product[] = [mockProduct];

    service.getProductList().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(service['productosUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get product by id', () => {
    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['productosUrl']}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockProduct);
  });

  it('should create a new product', () => {
    service.createProduct(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(service['productosUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should update a product', () => {
    const updatedProduct = { ...mockProduct, name: 'Updated Product' };

    service.updateProduct(1, updatedProduct).subscribe(response => {
      expect(response).toBe('Product updated');
    });

    const req = httpMock.expectOne(`${service['productosUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush('Product updated');
  });

  it('should delete a product', () => {
    service.deleteProduct(1).subscribe(response => {
      expect(response).toBeNull(); // revisar
    });

    const req = httpMock.expectOne(`${service['productosUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(null);
  });
});
