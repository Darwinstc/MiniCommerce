import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalogo',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalog/catalog.page').then(m => m.CatalogPage)
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/cart/cart.page').then(m => m.CartPage)
  },
  {
    path: 'confirmacion',
    loadComponent: () =>
      import('./pages/confirmation/confirmation.page').then(m => m.ConfirmationPage)
  },
  {
    path: '**',
    redirectTo: 'catalogo'
  }
];
