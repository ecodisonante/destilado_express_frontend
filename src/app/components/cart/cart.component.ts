import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';

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
    private readonly cartService: CartService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((authStatus: boolean) => { this.isAuthenticated = authStatus; });
    this.authService.isAdmin.subscribe((adminStatus: boolean) => { this.isAdmin = adminStatus; });

    if (!this.isAuthenticated) this.router.navigate(['/user/login']);
    if (this.isAdmin) this.router.navigate(['/']);

    this.getActiveCart();
  }

  getActiveCart() {
    this.cartService.getActiveCart().subscribe({
      next: cart => this.cart = cart,
      complete: () => {
        this.cartService.setStorageCartId(this.cart.id);
        this.actualizaMontos();
      }
    });
  }

  removeFromChart(id: number) {
    this.cartService.deleteSaleProduct(this.cart.id, id).subscribe({
      next: () => this.getActiveCart(),
      complete: () => this.actualizaMontos()
    });
  }

  clearChart() {
    //TODO
    // this.cart = new OldCart(this.email!, [], 0, 0);
    // this.cartService.setActiveCart(this.cart);
  }

  pagar() {
    this.cartService.unactivateSale(this.cart.id).subscribe({
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Tu compra no se ha podido completar.Intenta de nuevo o elige más productos ;)",
        });
      },
      complete: () => {

        this.cartService.getActiveCart().subscribe((cart) => { this.cartService.setStorageCartId(cart.id) });

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
    });
  }

  private actualizaMontos() {
    this.cart.total = 0;
    this.cart.discount = 0;
    this.cart.detalle!.forEach(prod => {
      let isOferta = prod.oferta > 0 && prod.oferta < prod.precio;
      if (isOferta) {
        this.cart.total += prod.oferta;
        this.cart.discount += prod.precio - prod.oferta;
      } else {
        this.cart.total += prod.precio;
      }
    });
  }
}
