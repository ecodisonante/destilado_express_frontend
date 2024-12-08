import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  catalogo: Product[] = [];
  isAdmin!: boolean;
  isAuthenticated!: boolean;

  constructor(
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.authService.isAdmin.subscribe((adminStatus: boolean) => { this.isAdmin = adminStatus; });
    this.authService.isAuthenticated.subscribe((authStatus: boolean) => { this.isAuthenticated = authStatus; });
    this.loadProductList();
  }

  loadProductList() {
    this.productService.getProductList().subscribe({
      next: (cat) => this.catalogo = cat,
      error: (error) => console.log(error)
    });
  }


  addToCart(id: number) {
    if (!this.isAuthenticated) {

      Swal.fire({
        icon: "info",
        title: "Ingreso de Usuario",
        text: "Debes registrarte o iniciar sesion para comprar",
        confirmButtonText: "Ir al login",
      }).then(() => {
        this.router.navigate(['/user/login']);
      });

    } else {


      let prod = this.catalogo.find(x => x.id === id);
      this.cartService.addSaleProduct(prod!).subscribe({
        next: data => console.log(data),
        error: () => {
          Swal.fire({
            icon: "error",
            title: "Producto NO Agregado",
            text: "Ocurrio un error al agrtegar tu producto al carrito.",
            showCancelButton: true,
            confirmButtonText: "Ver mi carrito",
            cancelButtonText: "Seguir comprando"
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/cart']);
            } else {
              return;
            }
          });
        },
        complete: () => {

          Swal.fire({
            icon: "success",
            title: "Producto Agregado",
            showCancelButton: true,
            confirmButtonText: "Ver mi carrito",
            cancelButtonText: "Seguir comprando"
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/cart']);
            } else {
              return;
            }
          });

        }

      });
    }

  }

}

