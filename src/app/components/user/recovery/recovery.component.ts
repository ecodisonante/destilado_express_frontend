import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';

/**
 * @description
 * Componente encargado de la recuperación de contraseña.
 */
@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.css'
})
export class RecoveryComponent {

  recoveryForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.recoveryForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  recovery() {
    if (this.recoveryForm.valid) {
      const formValue = this.recoveryForm.value;

      let message: string = "";

      this.userService.recover(formValue.correo).subscribe({
        next: (data) => message = data,
        error: (error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error al Recuperar",
            text: error
          }).then(() => {
            this.router.navigate(['/']);
          });
        },
        complete: () => {
          Swal.fire({
            icon: "success",
            title: "Correo Enviado",
            text: message
          }).then(() => {
            this.router.navigate(['/']);
          });
        }
      });
    }
  }
}