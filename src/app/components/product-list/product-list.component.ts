import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private userService: UserService,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.userService.isAdminAuth.subscribe((adminStatus: boolean) => { this.isAdmin = adminStatus; });

    this.route.queryParams.subscribe(params => {
      this.loadProductList();
    });
  }

  loadProductList(sale?: boolean, category?: number) {
    this.productService.getProductList().subscribe({
      next: (cat) => this.catalogo = cat,
      error: (error) => console.log(error)
    });
  }


  addToCart(id: number) {
    let prod = this.catalogo.find(x => x.id === id);
    this.cartService.addToActiveCart(prod!);

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

}

