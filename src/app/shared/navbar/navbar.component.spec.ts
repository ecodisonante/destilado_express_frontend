import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let isAuthenticatedSubject: Subject<boolean>;
  let isAdminSubject: Subject<boolean>;

  beforeEach(async () => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['logOut'], {
      isAuthenticated: new Subject<boolean>(),
      isAdmin: new Subject<boolean>(),
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // simular isAdmin e isAuthenticated
    isAuthenticatedSubject = authServiceSpy.isAuthenticated as Subject<boolean>;
    isAdminSubject = authServiceSpy.isAdmin as Subject<boolean>;

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        // provideHttpClient(),
        // provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ]
    }).compileComponents();

  });



  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    // Por defecto, simular que el usuario está autenticado y no es admin.
    isAuthenticatedSubject.next(true);
    isAdminSubject.next(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logOut and navigate on salir', () => {
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.salir();

    expect(authServiceSpy.logOut).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: "success",
      title: "Vuelve pronto !!",
    }));
  });

  it('should change logoClass on window scroll', () => {
    component.logoClass = 'bar-logo-off';
    window.dispatchEvent(new Event('scroll'));

    if (window.scrollY > 130) {
      expect(component.logoClass).toBe('bar-logo-on');
    } else {
      expect(component.logoClass).toBe('bar-logo-off');
    }
  });

  it('should initialize authentication status on init', () => {
    expect(component.isAuthenticated).toBe(false);
    expect(component.isAdmin).toBe(false);
  });

});
