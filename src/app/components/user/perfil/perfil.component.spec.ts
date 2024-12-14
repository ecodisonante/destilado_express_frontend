import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, throwError } from 'rxjs';
import { PerfilComponent } from './perfil.component';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { provideRouter, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../../models/user.model';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let isAuthenticatedSubject: Subject<boolean>;

  const mockUser: User = {
    email: 'test@example.com',
    nombre: 'Test User',
    password: '12345',
    direccion: 'Test Address',
    rol: 'user',
  } as unknown as User;

  beforeEach(async () => {
    const userService = jasmine.createSpyObj('UserService', ['getUserById', 'updateUser']);

    isAuthenticatedSubject = new Subject<boolean>();
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getTokenId'], { isAuthenticated: isAuthenticatedSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [
        PerfilComponent,
        ReactiveFormsModule,
      ],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userService },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Configurar comportamientos comunes para los spies
    authServiceSpy.getTokenId.and.returnValue(123);
    userServiceSpy.getUserById.and.returnValue(of(mockUser));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;

    isAuthenticatedSubject.next(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user data on ngOnInit', () => {
    expect(component.updateForm.get('nombres')?.value).toBe(mockUser.nombre);
    expect(component.updateForm.get('direccion')?.value).toBe(mockUser.direccion);
    expect(component.updateForm.get('correo')?.value).toBe(mockUser.email);
  });

  it('should update user successfully', () => {
    // Configurar datos válidos en el formulario
    component.updateForm.setValue({
      nombres: 'Updated Name',
      direccion: 'Updated Address',
      correo: 'test@example.com',
      passwd: 'NewPassword123!',
      repasswd: 'NewPassword123!'
    });

    // Simular respuesta exitosa del servicio
    userServiceSpy.updateUser.and.returnValue(of("Usuario actualizado"));

    // Espiar SweetAlert
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

    component.update();

    expect(userServiceSpy.updateUser).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: "success",
      title: "Perfil actualizado",
    }));
  });

  it('should handle update error', () => {
    // Configurar datos válidos en el formulario
    component.updateForm.setValue({
      nombres: 'Updated Name',
      direccion: 'Updated Address',
      correo: 'test@example.com',
      passwd: 'NewPassword123!',
      repasswd: 'NewPassword123!'
    });

    // Simular error del servicio
    const errorMessage = 'Update failed';
    userServiceSpy.updateUser.and.returnValue(throwError(() => errorMessage));

    // Espiar SweetAlert
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

    component.update();

    expect(userServiceSpy.updateUser).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: "error",
      title: "Error",
      text: errorMessage,
    }));
    expect(component.successUpdate).toBeFalsy();
  });

  it('should validate password match', () => {
    component.updateForm.setValue({
      nombres: 'Test User',
      direccion: 'Test Address',
      correo: 'test@example.com',
      passwd: 'ValidPass123!',
      repasswd: 'DifferentPass123!'
    });

    expect(component.updateForm.valid).toBeFalsy();
    expect(component.updateForm.hasError('passwordMatch')).toBeTruthy();
  });
});