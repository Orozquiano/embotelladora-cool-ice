import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SeccionContacto } from './seccion-contacto';

describe('SeccionContacto', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionContacto],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('no abre WhatsApp con el formulario vacío', async () => {
    const fixture = TestBed.createComponent(SeccionContacto);
    await fixture.whenStable();
    const abierto: string[] = [];
    const original = window.open;
    window.open = ((url?: string | URL) => {
      abierto.push(String(url ?? ''));
      return null;
    }) as typeof window.open;

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(abierto).toEqual([]);
    expect(fixture.nativeElement.querySelector('#alerta-formulario')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#error-nombre')).toBeTruthy();
    window.open = original;
  });

  it('abre WhatsApp con un pedido válido', async () => {
    const fixture = TestBed.createComponent(SeccionContacto);
    const componente = fixture.componentInstance as unknown as {
      actualizarCampo: (campo: string, valor: string) => void;
      enviarPedido: (evento: Event) => void;
    };
    await fixture.whenStable();

    componente.actualizarCampo('nombre', 'María Gómez');
    componente.actualizarCampo('telefono', '3001234567');
    componente.actualizarCampo('direccion', 'Barrio San Fernando, Cali');
    componente.actualizarCampo('cantidad', '2');
    componente.actualizarCampo('mensaje', 'Mañana');
    fixture.detectChanges();

    const abierto: string[] = [];
    const original = window.open;
    window.open = ((url?: string | URL) => {
      abierto.push(String(url ?? ''));
      return null;
    }) as typeof window.open;

    componente.enviarPedido(new Event('submit'));
    fixture.detectChanges();

    expect(abierto).toHaveLength(1);
    expect(abierto[0].startsWith('https://wa.me/573216820822?text=')).toBe(true);
    expect(abierto[0]).toContain(encodeURIComponent('María Gómez'));
    expect(fixture.nativeElement.querySelector('#alerta-formulario')).toBeNull();
    window.open = original;
  });
});
