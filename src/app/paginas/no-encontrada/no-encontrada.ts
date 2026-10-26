import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * @class NoEncontrada
 * @description Avisa que la ruta no existe y devuelve al inicio.
 */
@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink],
  templateUrl: './no-encontrada.html',
})
export class NoEncontrada {}
