import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';

export const routes: Routes = [
  {
    path: '',
    component: Inicio,
    title: 'Embotelladora Cool Ice | Agua potable tratada',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./paginas/no-encontrada/no-encontrada').then((modulo) => modulo.NoEncontrada),
    title: 'Página no encontrada | Cool Ice',
  },
];
