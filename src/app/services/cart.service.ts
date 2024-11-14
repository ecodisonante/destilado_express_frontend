import { Injectable, inject } from '@angular/core';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { StorageService } from './storage.service';

/**
 * Clase de servicios relacionados a Carrito de Compras
 */
@Injectable({
    providedIn: 'root'
})
export class CartService {

    private cartKey = 'cartKey';
    private storage = inject(StorageService);

    getActiveCart(): Cart | null {
        let cartList = this.storage.getItem(this.cartKey);
        return cartList ? JSON.parse(cartList) : null;
    }

    setActiveCart(cart: Cart) {
        this.storage.setItem(this.cartKey, JSON.stringify(cart));
    }

    clearActiveCart() {
        this.storage.removeItem(this.cartKey);
    }

    addToActiveCart(product: Product) {
        let cart = this.getActiveCart();
        if (cart) {
            cart.items.push(product);
            cart = this.getTotals(cart);
            this.setActiveCart(cart);
        }
    }

    removeFromActiveCart(productId: number) {
        let cart = this.getActiveCart();
        if (cart) {
            cart.items = cart.items.filter(x => x.id !== productId);
            cart = this.getTotals(cart);
            this.setActiveCart(cart);
        }
    }

    getTotals(cart: Cart): Cart {
        cart.total = 0;
        cart.discount = 0;

        cart.items.forEach(prod => {
            cart.total += prod.oferta != 0 ? prod.oferta : prod.precio;
            cart.discount += prod.oferta != 0 ? (prod.precio - prod.oferta) : 0;
        });

        return cart;
    }

}
