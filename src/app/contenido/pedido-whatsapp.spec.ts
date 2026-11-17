import {
  construirMensajePedido,
  enlacePedidoWhatsapp,
  normalizarTelefonoColombia,
  parsearCantidad,
  validarPedido,
} from './pedido-whatsapp';

describe('pedido-whatsapp', () => {
  it('acepta celulares colombianos de 10 dígitos y con prefijo 57', () => {
    expect(normalizarTelefonoColombia('321 682 0822')).toBe('3216820822');
    expect(normalizarTelefonoColombia('+57 3216820822')).toBe('3216820822');
    expect(normalizarTelefonoColombia('123')).toBeNull();
    expect(normalizarTelefonoColombia('1111111111')).toBeNull();
  });

  it('parsea cantidades enteras dentro del rango', () => {
    expect(parsearCantidad('3')).toBe(3);
    expect(parsearCantidad('0')).toBeNull();
    expect(parsearCantidad('51')).toBeNull();
    expect(parsearCantidad('1.5')).toBeNull();
    expect(parsearCantidad('abc')).toBeNull();
  });

  it('rechaza un pedido vacío con errores claros', () => {
    const resultado = validarPedido({
      nombre: '',
      telefono: '',
      direccion: '',
      cantidad: '',
      mensaje: '',
    });

    expect(resultado.ok).toBe(false);
    if (resultado.ok) {
      return;
    }
    expect(resultado.errores.nombre).toContain('nombre');
    expect(resultado.errores.telefono).toContain('celular');
    expect(resultado.errores.direccion).toContain('dirección');
    expect(resultado.errores.cantidad).toContain('entero');
  });

  it('normaliza y arma el mensaje cuando el pedido es válido', () => {
    const resultado = validarPedido({
      nombre: '  María   Gómez ',
      telefono: '3001234567',
      direccion: 'Barrio San Fernando, Cali',
      cantidad: '2',
      mensaje: 'Entregar en la mañana',
    });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) {
      return;
    }

    const mensaje = construirMensajePedido(resultado.pedido);
    expect(mensaje).toContain('Nombre: María Gómez');
    expect(mensaje).toContain('WhatsApp/Teléfono: 300 123 4567');
    expect(mensaje).toContain('Cantidad de bidones 18,9 L: 2');
    expect(mensaje).toContain('Mensaje: Entregar en la mañana');

    const url = enlacePedidoWhatsapp('3216820822', resultado.pedido);
    expect(url.startsWith('https://wa.me/573216820822?text=')).toBe(true);
    expect(url).toContain(encodeURIComponent('María Gómez'));
  });

  it('exige dirección para domicilio', () => {
    const resultado = validarPedido({
      nombre: 'Ana Pérez',
      telefono: '3101112233',
      direccion: 'Cll',
      cantidad: '1',
      mensaje: '',
    });

    expect(resultado.ok).toBe(false);
    if (resultado.ok) {
      return;
    }
    expect(resultado.errores.direccion).toBeTruthy();
  });
});

