import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';

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
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    // private cartService: CartService
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
      let logingUser: User | undefined;

      this.userService.findUser(login.username, login.password).subscribe({
        next: (data) => logingUser = data,
        error: (error) => console.log(error),
        complete: () => {

          if (logingUser) {
            this.userService.logIn(logingUser);

            // Crear carrito del usuario
            // if (!logingUser.isAdmin) {
            //   this.cartService.setActiveCart(new Cart(logingUser.username, [], 0, 0));
            // }

            Swal.fire({
              icon: "success",
              title: "Bienvenido, " + logingUser.nombre,
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
