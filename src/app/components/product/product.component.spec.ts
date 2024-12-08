import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ProductComponent } from "./product.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ProductService } from "../../services/product.service";
import { of, Subject, throwError } from "rxjs";
import { Product } from "../../models/product.model";
import Swal from "sweetalert2";

describe('ProductComponent', () => {
    let component: ProductComponent;
    let fixture: ComponentFixture<ProductComponent>;

    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let productServiceSpy: jasmine.SpyObj<ProductService>;
    let routerSpy: jasmine.SpyObj<Router>;

    let routeParamMap$: Subject<any>; // Subject para simular paramMap en ActivatedRoute

    let fakeProd: Product = { id: 1, nombre: "Fake Product 1", descripcion: "", disponible: true, fechaCreacion: "", fechaActualizacion: "", imagen: "", oferta: 0, precio: 10000, stock: 100 };


    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['checkAdmin']);
        productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById', 'updateProduct']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        routeParamMap$ = new Subject();

        await TestBed.configureTestingModule({
            imports: [ProductComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ProductService, useValue: productServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: { paramMap: routeParamMap$.asObservable() } }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductComponent);
        component = fixture.componentInstance;

        // Por defecto, simular que es admin
        authServiceSpy.checkAdmin.and.returnValue(true);

        // Por defecto, getProductById retorna el producto
        productServiceSpy.getProductById.and.returnValue(of(fakeProd));

        fixture.detectChanges(); // Ejecuta ngOnInit
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('debería navegar a "/" si el usuario no es admin', () => {
        authServiceSpy.checkAdmin.and.returnValue(false);
        fixture = TestBed.createComponent(ProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('debería navegar a "/" si el id del producto no es válido', () => {
        routeParamMap$.next({ get: () => 'abc' }); // no es un número
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);

        // Reset para nueva prueba
        routerSpy.navigate.calls.reset();

        routeParamMap$.next({ get: () => null }); // id null
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

});
