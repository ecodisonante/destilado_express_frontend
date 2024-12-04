import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator, passwordStregthValidator } from '../../../validators/custom-validator';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { Rol, User } from '../../../models/user.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

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
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  /**
   * metodo inicial de la clase
   */
  ngOnInit(): void {
    this.authService.isAdmin.subscribe((adminStatus: boolean) => { this.isAdmin = adminStatus; });

    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      passwd: ['', [Validators.required, passwordStregthValidator()]],
      repasswd: ['', Validators.required],
      isadmin: [false]
    }, {
      validators: passwordMatchValidator('passwd', 'repasswd')
    });
  }

  /**
   * Genera un nuevo usuario con los datos ingresados en el formulario
   * @param form formulario de registro
   */
  register() {

    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      const form = this.registerForm.value;

      let nuevoRol: Rol = {
        id: form.isadmin ? 1 : 2,
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
      this.userService.createUser(nuevo).subscribe({
        next: (data) => result = data != null,

        error: (msg) => {
          console.log(msg);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: msg,
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

}
