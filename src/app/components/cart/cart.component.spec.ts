import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router, provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Cart } from '../../models/cart.model';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let isAuthenticatedSubject: Subject<boolean>;
  let isAdminSubject: Subject<boolean>;

  const fakeCart: Cart = {
    id: 123,
    detalle: [
      { productoId: 1, precio: 100, oferta: 0 },
      { productoId: 2, precio: 200, oferta: 50 }, // oferta menor al precio, debe contar el descuento
    ]
  } as unknown as Cart;
  // Asegúrate que el modelo Cart contenga las propiedades utilizadas (detalle, total, discount).

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: new Subject<boolean>(),
      isAdmin: new Subject<boolean>()
    });
    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getActiveCart',
      'setStorageCartId',
      'deleteSaleProduct',
      'unactivateSale'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    isAuthenticatedSubject = authServiceSpy.isAuthenticated as Subject<boolean>;
    isAdminSubject = authServiceSpy.isAdmin as Subject<boolean>;

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;

    // Por defecto, simular que el usuario está autenticado y no es admin.
    isAuthenticatedSubject.next(true);
    isAdminSubject.next(false);

    // Por defecto getActiveCart retorna un carrito
    cartServiceSpy.getActiveCart.and.returnValue(of(fakeCart));
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería navegar a /user/login si no está autenticado', () => {
    isAuthenticatedSubject.next(false);
    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user/login']);
  });

  it('debería cargar el carrito activo si es usuario normal autenticado', () => {
    fixture.detectChanges();
    component.getActiveCart();
    expect(cartServiceSpy.getActiveCart).toHaveBeenCalled();
    expect(component.cart).toEqual(fakeCart);
    expect(cartServiceSpy.setStorageCartId).toHaveBeenCalledWith(fakeCart.id);

    expect(component.cart.total).toBe(150);
    expect(component.cart.discount).toBe(150);
  });

  it('removeFromChart debería llamar deleteSaleProduct y recargar el carrito', () => {
    component.cart = fakeCart;
    const newCart = { ...fakeCart, id: 123 }; // nuevo carrito tras eliminar
    cartServiceSpy.getActiveCart.and.returnValue(of(newCart));
    cartServiceSpy.deleteSaleProduct.and.returnValue(of());
    fixture.detectChanges();

    component.removeFromChart(1);

    expect(cartServiceSpy.deleteSaleProduct).toHaveBeenCalledWith(fakeCart.id, 1);
    expect(component.cart.id).toBe(123);
  });

  it('pagar debería manejar error si unactivateSale falla', fakeAsync(() => {
    component.cart = fakeCart;
    cartServiceSpy.unactivateSale.and.returnValue(throwError(() => new Error('Error')));
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

    fixture.detectChanges();
    component.pagar();
    tick(); // procesa la promesa de Swal

    expect(cartServiceSpy.unactivateSale).toHaveBeenCalledWith(fakeCart.id);
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: "error",
      title: "Error",
      text: "Tu compra no se ha podido completar.Intenta de nuevo o elige más productos ;)",
    }));

  }));

  it('pagar debería mostrar éxito, recargar carrito y navegar a /', fakeAsync(() => {
    component.cart = fakeCart;
    cartServiceSpy.unactivateSale.and.returnValue(of());
    cartServiceSpy.getActiveCart.and.returnValue(of({ id: 456 } as Cart));
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    spyOn(component, 'clearChart').and.callThrough(); // Para verificar que se llame clearChart()

    fixture.detectChanges();
    component.pagar();
    tick(); // esperar accion de swal

    expect(cartServiceSpy.unactivateSale).toHaveBeenCalledWith(fakeCart.id);
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: "success",
      title: "Tu compra se ha realizado.",
      text: "Recibirás un correo de confirmación indicando la fecha en que tu compra será despachada.",
      footer: "(mentira XD)"
    }));
    expect(cartServiceSpy.getActiveCart).toHaveBeenCalled(); // tras complete se obtiene de nuevo el carrito
    expect(cartServiceSpy.setStorageCartId).toHaveBeenCalledWith(456);
    expect(component.clearChart).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('debería calcular correctamente los montos con ofertas', () => {
    // Testear el método actualizaMontos directamente
    component.cart = {
      id: 999,
      detalle: [
        { id: 1, precio: 100, oferta: 0 },   // total=100, discount=0
        { id: 2, precio: 200, oferta: 50 },  // total=150, discount=150
        { id: 3, precio: 300, oferta: 300 }  // no hay descuento (total=450, discount=150)
      ]
    } as Cart;

    (component as any).actualizaMontos();

    expect(component.cart.total).toBe(450);
    expect(component.cart.discount).toBe(150);
  });
});
