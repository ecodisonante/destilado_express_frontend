import { Product } from "./product.model";

/**
 * Modelo para Carrito de Compras
 */
export class Cart {
    id: number;
    userId: number;
    productos: Product[];
    activa: boolean;
    created: Date;
    updated: Date;

    discount: number = 0;
    total: number = 0;

    constructor(
        id: number,
        userId: number,
        productos: Product[],
        activa: boolean,
        created: Date,
        updated: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.productos = productos;
        this.activa = activa;
        this.created = created;
        this.updated = updated;
    }
}