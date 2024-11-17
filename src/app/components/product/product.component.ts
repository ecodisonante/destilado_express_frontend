import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

/**
 * @description
 * Componente encargado de los detalles de un producto.
 */
@Component({
    selector: 'app-product',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css'
})
export class ProductComponent {

    productForm!: FormGroup;
    title: string = "";
    producto?: Product;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private productService: ProductService
    ) {
        if (!this.userService.checkAdmin()) this.router.navigate(['/']);

        this.productForm = this.fb.group({
            id: [0],
            imagen: [''],
            nombre: ['', [Validators.required]],
            descripcion: ['', [Validators.required]],
            precio: [0, [Validators.required, Validators.min(0)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            oferta: [0, [Validators.required, Validators.min(0)]],
            disponible: [true],
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (!id || isNaN(Number(id))) this.router.navigate(['/']);

            this.productService.getProduct(Number(id)).subscribe(
                data => {
                    this.producto = data;
                    if (this.producto) {
                        this.productForm.patchValue(this.producto);
                        this.title = this.producto.nombre;
                    }
                }
            );
        });
    }

    edit() {
        if (this.productForm.valid) {
            let edited = this.productForm.value;
            edited.image = this.producto!.imagen;

            this.productService.updateProduct(edited).subscribe(result => {
                if (result) {

                    Swal.fire({
                        icon: "success",
                        title: "Producto actualizado",
                    }).then(() => {
                        this.router.navigate(['']);
                    });

                }
            });

        }
    }

}
