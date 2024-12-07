import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './components/user/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { RegisterComponent } from './components/user/register/register.component';
import { RecoveryComponent } from './components/user/recovery/recovery.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { ProductComponent } from './components/product/product.component';
import { VentaComponent } from './components/venta/venta.component';

export const routes: Routes = [
    {
        path: 'catalogo',
        title: 'Catálogo',
        component: ProductListComponent,
    },
    {
        path: 'product/:id',
        title: 'Producto',
        component: ProductComponent,
    },
    {
        path: 'cart',
        title: 'Carrito',
        component: CartComponent,
    },
    {
        path: 'ventas',
        title: 'Ventas',
        component: VentaComponent,
    },
    {
        path: 'user',
        title: 'Usuario',
        children: [
            {
                path: 'login',
                title: 'Ingresar',
                component: LoginComponent,
            },
            {
                path: 'register',
                title: 'Crear Cuenta',
                component: RegisterComponent,
            },
            {
                path: 'recovery',
                title: 'Recuperar Contraseña',
                component: RecoveryComponent,
            },
            {
                path: 'perfil',
                title: 'Modificar Perfil',
                component: PerfilComponent,
            },
        ]
    },
    { // Momentaneamente el home es la pagina categorias
        path: '**',
        redirectTo: 'catalogo',
        pathMatch: 'full'
    }
];
