import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ProductListComponent } from "./product-list.component";
import { Router } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { AuthService } from "../../services/auth.service";
import { CartService } from "../../services/cart.service";
import { of, Subject, throwError } from "rxjs";
import { Product } from "../../models/product.model";
import Swal from 'sweetalert2';

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;

    let productServiceSpy: jasmine.SpyObj<ProductService>;
    let cartServiceSpy: jasmine.SpyObj<CartService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    let isAdminSubject: Subject<boolean>;
    let isAuthenticatedSubject: Subject<boolean>;

    let prod1: Product = { id: 1, nombre: "Fake Product 1", descripcion: "", disponible: true, fechaCreacion: "", fechaActualizacion: "", imagen: "", oferta: 0, precio: 10000, stock: 100 };
    let prod2: Product = { id: 2, nombre: "Fake Product 2", descripcion: "", disponible: true, fechaCreacion: "", fechaActualizacion: "", imagen: "", oferta: 0, precio: 10000, stock: 100 };
    let prodList: Product[] = [prod1, prod2];

    beforeEach(async () => {

        productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductList']);
        cartServiceSpy = jasmine.createSpyObj('CartService', ['addSaleProduct']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        // simular isAdmin e isAuthenticated
        isAdminSubject = new Subject<boolean>();
        isAuthenticatedSubject = new Subject<boolean>();
        authServiceSpy = jasmine.createSpyObj('AuthService', [], { isAdmin: isAdminSubject.asObservable(), isAuthenticated: isAuthenticatedSubject.asObservable() });

        productServiceSpy.getProductList.and.returnValue(of(prodList));
        cartServiceSpy.addSaleProduct.and.returnValue(of(prod1));

        await TestBed.configureTestingModule({
            imports: [ProductListComponent],
            providers: [
                { provide: ProductService, useValue: productServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: CartService, useValue: cartServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;

        // Emitimos valores iniciales
        isAdminSubject.next(false);
        isAuthenticatedSubject.next(false);

        fixture.detectChanges();
    });

    it('deberia iniciar el component', () => {
        expect(component).toBeTruthy();
    });

    it('debería cargar la lista de productos al iniciar', () => {
        expect(productServiceSpy.getProductList).toHaveBeenCalled();
        expect(component.catalogo).toEqual(prodList);
    });

    it('debería actualizar isAdmin cuando cambia el valor en el AuthService', () => {
        isAdminSubject.next(true);
        expect(component.isAdmin).toBe(true);

        isAdminSubject.next(false);
        expect(component.isAdmin).toBe(false);
    });

    it('debería actualizar isAuthenticated cuando cambia el valor en el AuthService', () => {
        isAuthenticatedSubject.next(true);
        expect(component.isAuthenticated).toBe(true);

        isAuthenticatedSubject.next(false);
        expect(component.isAuthenticated).toBe(false);
    });

    describe('addToCart', () => {
        beforeEach(() => { component.catalogo = prodList; });

        it('debería mostrar Swal informativo y navegar a login si no está autenticado', fakeAsync(() => {
            const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

            isAuthenticatedSubject.next(false);
            component.addToCart(prod1.id);
            tick(); // Procesa la promesa de Swal

            expect(routerSpy.navigate).toHaveBeenCalledWith(['/user/login']);
        }));

        it('debería agregar producto al carrito si está autenticado', fakeAsync(() => {
            const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
            isAuthenticatedSubject.next(true);

            component.addToCart(prod1.id);
            tick();

            expect(cartServiceSpy.addSaleProduct).toHaveBeenCalledWith(prod1);

            // Como el usuario cancela, no navega
            expect(routerSpy.navigate).not.toHaveBeenCalled();
        }));

        it('debería manejar error si addSaleProduct falla', fakeAsync(() => {
            const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
            isAuthenticatedSubject.next(true);

            cartServiceSpy.addSaleProduct.and.returnValue(throwError(() => new Error('Error al agregar')));

            component.addToCart(prod2.id);
            tick();

            // El usuario confirma ver el carrito
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/cart']);
        }));

    });
});
