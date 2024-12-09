import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RecoveryComponent } from './recovery.component';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';

describe('RecoveryComponent', () => {
  let component: RecoveryComponent;
  let fixture: ComponentFixture<RecoveryComponent>;

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['recover']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RecoveryComponent,
        ReactiveFormsModule
      ],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit() corre aquí, inicializa el formulario.
  });

  it('debería inicializar el component', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.recoveryForm).toBeDefined();
    const correoControl = component.recoveryForm.get('correo');
    expect(correoControl).not.toBeNull();
    expect(correoControl?.valid).toBeFalse();
  });

  it('no debería llamar recover si el formulario es inválido', () => {
    // Por defecto el campo correo está vacío y es inválido
    component.recovery();
    expect(userServiceSpy.recover).not.toHaveBeenCalled();
  });

  it('debería llamar recover si el formulario es válido', () => {
    component.recoveryForm.setValue({ correo: 'test@example.com' });
    userServiceSpy.recover.and.returnValue(of('Mensaje de recuperación enviado'));

    component.recovery();

    expect(userServiceSpy.recover).toHaveBeenCalledWith('test@example.com');
  });

  // it('debería mostrar Swal de éxito y navegar a "/" si recover() es exitoso', fakeAsync(() => {
  //   component.recoveryForm.setValue({ correo: 'test@example.com' });
  //   userServiceSpy.recover.and.returnValue(of('Correo enviado con éxito'));
  
  //   const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
  
  //   component.recovery();
  //   tick(); // Procesa la promesa de Swal
  
  //   expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
  //     icon: "success",
  //     title: "Correo Enviado",
  //     text: "Correo enviado con éxito"
  //   }));
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  // }));
  

  // it('debería mostrar Swal de error y navegar a "/" si recover() falla', fakeAsync(() => {
  //   component.recoveryForm.setValue({ correo: 'fail@example.com' });
  //   userServiceSpy.recover.and.returnValue(throwError(() => 'Error en la recuperación'));

  //   const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

  //   component.recovery();
  //   tick(); // Procesa la promesa de Swal

  //   expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
  //     icon: "error",
  //     title: "Error al Recuperar",
  //     text: 'Error en la recuperación'
  //   }));
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  // }));
});
