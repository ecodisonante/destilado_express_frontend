import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
    {
        path: 'catalogo',
        title: 'Catálogo',
        component: ProductListComponent,
    },
    { // Momentaneamente el home es la pagina categorias
        path: '**',
        redirectTo: 'catalogo',
        pathMatch: 'full'
    }
];
