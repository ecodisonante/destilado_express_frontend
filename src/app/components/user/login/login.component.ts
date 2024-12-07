import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

/**
 * @description
 * Componente encargado del inicio de sesion.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cartService: CartService
  ) { }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {

      const login = this.loginForm.value;
      let token: string;

      this.authService.authenticate(login.username, login.password).subscribe({
        next: (data) => token = data.token,
        error: (error) => console.log(error),
        complete: () => {

          if (this.authService.isValidToken(token)) {
            this.authService.logIn(token);
            let nombre = this.authService.getTokenName() ?? login.username;

            // Crear carrito del usuario
            if (!this.authService.checkAdmin()) {
              this.cartService.getActiveCart().subscribe({
                next: cart => this.cartService.setStorageCartId(cart.id)
              });
            }

            Swal.fire({
              icon: "success",
              title: "Bienvenido, " + nombre,
            }).then(() => {
              this.router.navigate(['/']);
            });

          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Credenciales Incorrectas",
            });
          }
        }
      });
    }
  }

}
