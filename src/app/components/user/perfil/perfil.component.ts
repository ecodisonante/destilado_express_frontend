import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { User } from '../../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { passwordMatchValidator, passwordStregthValidator } from '../../../validators/custom-validator';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

/**
 * Clase encargada de la actualizacion de perfil de usuario
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  /**
   * Formulario de registro
   */
  updateForm!: FormGroup;
  /**
   * Indicador de registro exitoso
   */
  successUpdate: boolean = false;
  /**
   * Identificador del usuario que modifica su perfil
   */
  currentUser!: User;
  isAuthenticated!: boolean;

  /**
   * constructor de la clase
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {

  }

  /**
   * metodo inicial de la clase
   */
  ngOnInit(): void {
    // Suscríbete al estado de autenticación
    this.authService.isAuthenticated.subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
      if (!this.isAuthenticated) {
        this.router.navigate(['/user/login']);
      }
    });

    // Inicializa el formulario con valores vacíos
    this.updateForm = this.fb.group({
      nombres: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      passwd: ['', [Validators.required, passwordStregthValidator()]],
      repasswd: ['', Validators.required],
    }, {
      validators: passwordMatchValidator('passwd', 'repasswd')
    });

    // Obtén los datos del usuario de forma asíncrona
    const userId = this.authService.getTokenId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.currentUser = user;
          // Actualiza el formulario con los datos del usuario
          this.updateForm.patchValue({
            nombres: user.nombre,
            direccion: user.direccion,
            correo: user.email,
            passwd: '', // No debes cargar contraseñas reales por seguridad
            repasswd: '',
          });
        },
        error: (msg) => {
          console.log(msg);
          this.router.navigate(['/']);
        },
      });
    }
  }


  /**
   * Actualiza la información del usuario con los datos ingresados en el formulario. 
   */
  update() {
    this.updateForm.markAllAsTouched();

    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;

      let actualiza: User = {
        email: this.currentUser.email,
        nombre: formValue.nombres,
        direccion: formValue.direccion,
        password: formValue.passwd,
        rol: this.currentUser.rol,
      };

      let result: boolean;
      let userId = this.authService.getTokenId();

      this.userService.updateUser(userId!, actualiza).subscribe({
        next: (data) => result = data == "Usuario actualizado",

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
              title: "Perfil actualizado",
            }).then(() => {
              this.router.navigate(['/']);
            });

            this.successUpdate = true;
          }
        }
      });

    }
  }
}

