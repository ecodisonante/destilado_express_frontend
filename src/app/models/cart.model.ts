import { ProductDTO } from "./productDto.model";
import { Product } from "./product.model";

/**
 * Modelo para Carrito de Compras
 */
export class Cart {
    id: number;
    userId: number;
    productos?: ProductDTO[];
    detalle?: Product[];
    activa: boolean;
    created: Date;
    updated: Date;

    discount: number = 0;
    total: number = 0;

    constructor(
        id: number,
        userId: number,
        detalle: Product[],
        productos: ProductDTO[],
        activa: boolean,
        created: Date,
        updated: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.productos = productos;
        this.detalle = detalle;
        this.activa = activa;
        this.created = created;
        this.updated = updated;
    }
}