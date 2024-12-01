import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Componente encargado de manejar el carrito de compras.
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;

  cart!: Cart;
  email?: string;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((authStatus: boolean) => { this.isAuthenticated = authStatus; });
    this.authService.isAdmin.subscribe((adminStatus: boolean) => { this.isAdmin = adminStatus; });

    if (!this.isAuthenticated) this.router.navigate(['/user/login']);
    if (this.isAdmin) this.router.navigate(['/']);

    this.email = this.authService.getTokenEmail();
    this.getActiveCart();
  }

  getActiveCart() {
    if (this.email) {
      this.cart = this.cartService.getActiveCart() ?? new Cart(this.email, [], 0, 0);
    }
  }

  removeFromChart(id: number) {
    this.cartService.removeFromActiveCart(id);
    this.getActiveCart();
  }

  clearChart() {
    this.cart = new Cart(this.email!, [], 0, 0);
    this.cartService.setActiveCart(this.cart);
  }

  pagar() {
    //TODO
    Swal.fire({
      icon: "success",
      title: "Tu compra se ha realizado.",
      text: "Recibirás un correo de confirmación indicando la fecha en que tu compra será despachada.",
      footer: "(mentira XD)"
    }).then(() => {
      this.clearChart();
      this.router.navigate(['/']);
    });

  }
}
