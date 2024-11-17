import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { User } from '../../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { passwordMatchValidator, passwordStregthValidator } from '../../../validators/custom-validator';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  /**
   * constructor de la clase
   */
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    let activeUser = this.userService.getActiveUser();
    if (activeUser) this.currentUser = activeUser;
    else this.router.navigate(['/']);
  }

  /**
   * metodo inicial de la clase
   */
  ngOnInit(): void {

    this.updateForm = this.fb.group({
      nombres: [this.currentUser.nombre, Validators.required],
      direccion: [this.currentUser.direccion, Validators.required],
      correo: [this.currentUser.email, [Validators.required, , Validators.email]],
      passwd: [this.currentUser.password, [Validators.required, passwordStregthValidator()]],
      repasswd: ['', Validators.required],
    }, {
      validators: passwordMatchValidator('passwd', 'repasswd')
    });
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

      this.userService.updateUser(actualiza).subscribe({
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

