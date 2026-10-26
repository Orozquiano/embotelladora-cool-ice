import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./paginas/inicio/inicio').then((modulo) => modulo.Inicio),
    title: 'Embotelladora Cool Ice | Agua potable tratada',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./paginas/no-encontrada/no-encontrada').then((modulo) => modulo.NoEncontrada),
    title: 'Página no encontrada | Cool Ice',
  },
];
