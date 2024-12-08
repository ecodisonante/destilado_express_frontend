import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent {

  sales!: Cart[];
  totalVentas: number = 0;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly cartService: CartService
  ) { }

  ngOnInit(): void {
    if (!this.authService.checkAdmin()){
      this.router.navigate(['/']);
      return;
    } 

    this.getAllSales();
  }


  getAllSales() {
    this.cartService.getSales().subscribe({
      next: sales => this.sales = sales,
      complete: () => this.actualizaMontos()
    });
  }


  private actualizaMontos() {
    this.totalVentas = 0

    this.sales.forEach(cart => {
      cart.total = 0;

      cart.productos!.forEach(prod => {
        cart.total += prod.precioUnidad * prod.cantidad;
      });

      this.totalVentas += cart.total;
    });

  }
}
