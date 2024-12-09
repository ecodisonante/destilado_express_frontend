import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ProductDTO } from '../models/productDto.model';
import { provideHttpClient } from '@angular/common/http';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  const mockToken = 'mock-jwt-token';
  const mockCart: Cart = { id: 1, userId: 1, activa: true } as Cart;

  const mockProduct: Product = { id: 1, nombre: 'Product 1', precio: 100, oferta: 90 } as Product;
  const mockProductDTO: ProductDTO = { idProducto: 1, cantidad: 1, precioUnidad: 90 };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CartService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy }
      ]
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy.getToken.and.returnValue(mockToken);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get sales', () => {
    const mockCarts: Cart[] = [mockCart];

    service.getSales().subscribe(carts => {
      expect(carts.length).toBe(1);
      expect(carts).toEqual(mockCarts);
    });

    const req = httpMock.expectOne(service['ventasUrl']);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockCarts);
  });

  it('should get active cart', () => {
    service.getActiveCart().subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne(`${service['ventasUrl']}/activa`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockCart);
  });

  it('should get cart by id', () => {
    service.getCartById(1).subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne(`${service['ventasUrl']}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockCart);
  });

  it('should create a new sale', () => {
    service.createSale(mockCart).subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne(service['ventasUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockCart);
  });

  it('should add a product to the sale', () => {
    storageServiceSpy.getItem.and.returnValue(JSON.stringify(1));

    service.addSaleProduct(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['ventasUrl']}/1/productos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProductDTO);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockProduct);
  });

  it('should update sale product', () => {
    service.updateSaleProduct(1, mockProduct).subscribe(response => {
      expect(response).toBe('Product updated');
    });

    const req = httpMock.expectOne(`${service['ventasUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush('Product updated');
  });

  it('should delete a product from the sale', () => {
    service.deleteSaleProduct(1, 1).subscribe(response => {
      expect(response).toBeNull(); //revisar
    });

    const req = httpMock.expectOne(`${service['ventasUrl']}/1/productos/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(null);
  });

  it('should get storage cart id', () => {
    storageServiceSpy.getItem.and.returnValue('1');

    const cartId = service.getStorageCartId();
    expect(cartId).toBe(1);
    expect(storageServiceSpy.getItem).toHaveBeenCalledWith(service['cartKey']);
  });

  it('should set storage cart id', () => {
    service.setStorageCartId(1);

    expect(storageServiceSpy.setItem).toHaveBeenCalledWith(service['cartKey'], JSON.stringify(1));
  });
});
