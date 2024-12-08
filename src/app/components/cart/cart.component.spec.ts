import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Cart } from '../../models/cart.model';


describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let isAuthenticatedSubject: BehaviorSubject<boolean>;
  let isAdminSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    isAdminSubject = new BehaviorSubject<boolean>(false);

    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: isAuthenticatedSubject.asObservable(),
      isAdmin: isAdminSubject.asObservable()
    });
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getActiveCart', 'setStorageCartId', 'deleteSaleProduct', 'unactivateSale']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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

  describe('cuando el usuario es admin', () => {
    beforeEach(() => {
      // Aquí configuramos el estado antes de crear el componente
      isAuthenticatedSubject.next(true);
      isAdminSubject.next(true);

      fixture = TestBed.createComponent(CartComponent);
      component = fixture.componentInstance;
      fixture.detectChanges(); // ngOnInit se ejecuta con isAuthenticated=true y isAdmin=true
    });

    it('debería navegar a "/" si es admin', () => {
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    // Aquí puedes agregar más pruebas relacionadas a este contexto
    // donde el usuario es admin y está autenticado.
  });

  // describe('cuando el usuario NO es admin', () => {
  //   beforeEach(() => {
  //     // Configuramos el estado para este contexto
  //     isAuthenticatedSubject.next(true);  // Autenticado pero no admin
  //     isAdminSubject.next(false);

  //     fixture = TestBed.createComponent(CartComponent);
  //     component = fixture.componentInstance;
  //     fixture.detectChanges();
  //   });

  //   // it('si no es admin, no debería navegar a "/"', () => {
  //   //   expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/']);
  //   // });

  //   // Más pruebas para el contexto "usuario no admin"
  // });
});
