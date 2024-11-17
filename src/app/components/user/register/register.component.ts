import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { minAgeValidator, passwordMatchValidator, passwordStregthValidator } from '../../../validators/custom-validator';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { Rol, User } from '../../../models/user.model';
import Swal from 'sweetalert2';
import { error } from 'console';

/**
 * Componente para manejar el registro de nuevos usuarios.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  /**
   * Formulario de registro
   */
  registerForm!: FormGroup;
  /**
   * Indicador de registro exitoso
   */
  successRegister: boolean = false;
  /**
   * Indicador de usuario con permisos de Admin
   */
  isAdmin: boolean = false;

  /**
   * constructor de la clase
   */
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  /**
   * metodo inicial de la clase
   */
  ngOnInit(): void {
    this.userService.isAdminAuth.subscribe((adminStatus: boolean) => { this.isAdmin = adminStatus; });

    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, , Validators.email]],
      direccion: ['', Validators.required],
      passwd: ['', [Validators.required, passwordStregthValidator()]],
      repasswd: ['', Validators.required],
      isadmin: [false]
    }, {
      validators: passwordMatchValidator('passwd', 'repasswd')
    });
  }

  /**
   * Procesa los datos ingresados en el formulario
   * - Verifica que el username no haya sido utilizado previamente
   * - Solo los administradores pueden crear nuevos usuarios con rol admin
   */
  register() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      let existingUser: User | undefined

      this.userService.findUserByEmail(formValue.email).subscribe({
        next: (data) => existingUser = data,
        error: (error) => console.log(error),
        complete: () => {

          if (existingUser) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Ya hay un registro con ese correo",
            });
          } else {

            this.saveUser(formValue);
          }
        }
      });
    }
  }

  /**
   * Genera un nuevo usuario con los datos ingresados en el formulario
   * @param form formulario de registro
   */
  private saveUser(form: any) {

    let nuevoRol: Rol = {
      id: form.isadmin ? 1 : 0,
      nombre: form.isadmin ? "ADMIN" : "USER"
    }

    const nuevo: User = {
      nombre: form.nombre,
      email: form.email,
      password: form.passwd,
      direccion: form.direccion,
      rol: nuevoRol
    };

    let result: boolean;
    this.userService.addUser(nuevo).subscribe({
      next: (data) => result = data,

      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error,
        });
      },

      complete: () => {
        if (result) {

          Swal.fire({
            icon: "success",
            title: "Usuario registrado",
          }).then(() => {
            this.router.navigate(['/']);
          });

          console.log("Success Register!!");
          this.successRegister = true;
        }
      }
    });
  }

}
