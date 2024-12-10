import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Cart } from '../../../models/cart.model';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockCartService: jasmine.SpyObj<CartService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const fakeCart: Cart = {
        id: 123,
        detalle: [
          { productoId: 1, precio: 100, oferta: 0 },
          { productoId: 2, precio: 200, oferta: 50 }, // oferta menor al precio, debe contar el descuento
        ]
      } as unknown as Cart;

    beforeEach(async () => {
        mockAuthService = jasmine.createSpyObj('AuthService', ['authenticate', 'isValidToken', 'logIn', 'getTokenName', 'checkAdmin']);
        mockCartService = jasmine.createSpyObj('CartService', ['getActiveCart', 'setStorageCartId']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule],
            declarations: [],
            providers: [
                provideRouter([]),
                provideHttpClient(),
                provideHttpClientTesting(),
                FormBuilder,
                { provide: AuthService, useValue: mockAuthService },
                { provide: CartService, useValue: mockCartService }
            ]
        }).compileComponents();
    });


    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;

        mockCartService.getActiveCart.and.returnValue(of(fakeCart));
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize login form on init', () => {
        fixture.detectChanges();

        expect(component.loginForm).toBeDefined();
        expect(component.loginForm.controls['username']).toBeTruthy();
        expect(component.loginForm.controls['password']).toBeTruthy();
    });

    it('should handle login successfully', () => {
        const formBuilder: FormBuilder = TestBed.inject(FormBuilder);
        component.loginForm = formBuilder.group({
            username: ['testuser'],
            password: ['Password123!']
        });

        const mockToken = 'mock-jwt-token';
        mockAuthService.authenticate.and.returnValue(of({ token: mockToken }));
        mockAuthService.isValidToken.and.returnValue(true);
        mockAuthService.getTokenName.and.returnValue('testuser');

        const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

        component.login();

        expect(mockAuthService.authenticate).toHaveBeenCalled();
        expect(mockAuthService.isValidToken).toHaveBeenCalledWith(mockToken);
        expect(mockAuthService.logIn).toHaveBeenCalledWith(mockToken);
    });

    it('should handle login failure due to invalid credentials', () => {
        const formBuilder: FormBuilder = TestBed.inject(FormBuilder);
        component.loginForm = formBuilder.group({
            username: ['testuser'],
            password: ['Password123!']
        });

        const mockToken = 'mock-jwt-token';
        mockAuthService.authenticate.and.returnValue(of({ token: mockToken }));
        mockAuthService.isValidToken.and.returnValue(false);

        const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

        component.login();

        expect(mockAuthService.authenticate).toHaveBeenCalled();
        expect(mockAuthService.isValidToken).toHaveBeenCalledWith(mockToken);
        expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            icon: "error",
            title: "Error",
            text: "Credenciales Incorrectas",
        }));
    });

    it('should handle login error', () => {
        const formBuilder: FormBuilder = TestBed.inject(FormBuilder);
        component.loginForm = formBuilder.group({
            username: ['testuser'],
            password: ['Password123!']
        });

        mockAuthService.authenticate.and.returnValue(throwError('Login Error'));
        spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

        component.login();

        expect(mockAuthService.authenticate).toHaveBeenCalled();
    });
});
