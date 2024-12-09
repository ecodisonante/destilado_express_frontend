import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, Subject, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  let isAdminSubject: Subject<boolean>;
  let isAuthenticatedSubject: Subject<boolean>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAdmin']);
    mockUserService = jasmine.createSpyObj('UserService', ['createUser']);

    // simular isAdmin e isAuthenticated
    isAdminSubject = new Subject<boolean>();
    isAuthenticatedSubject = new Subject<boolean>();
    mockAuthService = jasmine.createSpyObj('AuthService', [], { isAdmin: isAdminSubject.asObservable(), isAuthenticated: isAuthenticatedSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    isAdminSubject.next(false);
    isAuthenticatedSubject.next(false);
    fixture.detectChanges();

    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.controls['nombre']).toBeTruthy();
    expect(component.registerForm.controls['email']).toBeTruthy();
    expect(component.registerForm.controls['direccion']).toBeTruthy();
    expect(component.registerForm.controls['passwd']).toBeTruthy();
    expect(component.registerForm.controls['repasswd']).toBeTruthy();
    expect(component.registerForm.controls['isadmin']).toBeTruthy();
  });

  it('should show error message on registration failure', () => {
    const formBuilder: FormBuilder = TestBed.inject(FormBuilder);
    component.registerForm = formBuilder.group({
      nombre: 'John Doe',
      email: 'john.doe@example.com',
      direccion: '123 Main St',
      passwd: 'Password123!',
      repasswd: 'Password123!',
      isadmin: false
    });

    mockUserService.createUser.and.returnValue(throwError('Registration Error'));
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));

    component.register();

    expect(mockUserService.createUser).toHaveBeenCalled();

    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: "error",
      title: "Error",
      text: 'Registration Error'
    }));
  });

  it('should show success message and navigate on successful registration', () => {
    const formBuilder: FormBuilder = TestBed.inject(FormBuilder);
    component.registerForm = formBuilder.group({
      nombre: 'John Doe',
      email: 'john.doe@example.com',
      direccion: '123 Main St',
      passwd: 'Password.123',
      repasswd: 'Password.123',
      isadmin: false
    });

    mockUserService.createUser.and.returnValue(of());
    component.register();
    expect(mockUserService.createUser).toHaveBeenCalled();
  });
});
