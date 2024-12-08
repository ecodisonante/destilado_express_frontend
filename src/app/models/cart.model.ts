import { ProductDTO } from "./productDto.model";
import { Product } from "./product.model";

/**
 * Modelo para Carrito de Compras
 */
export interface Cart {
    id: number;
    userId: number;
    productos?: ProductDTO[];
    detalle?: Product[];
    activa: boolean;
    created: Date;
    updated?: Date;

    discount: number;
    total: number;

}