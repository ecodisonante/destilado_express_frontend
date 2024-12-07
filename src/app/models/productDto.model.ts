
export class ProductDTO {
    idProducto: number;
    cantidad: number;
    precioUnidad: number;

    constructor(
        idProducto: number,
        cantidad: number,
        precioUnidad: number,
    ) {
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.precioUnidad = precioUnidad;
    }
}
