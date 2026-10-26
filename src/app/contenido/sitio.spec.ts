import { enlaceWhatsapp, lineaPedidos, registroInvima, textoPublicado } from './sitio';

describe('sitio', () => {
  it('arma el WhatsApp de pedidos con el indicativo de Colombia', () => {
    expect(lineaPedidos.whatsapp.startsWith('https://wa.me/573216820822?text=')).toBe(true);
    expect(lineaPedidos.telefono).toBe('tel:+573216820822');
  });

  it('codifica el mensaje del enlace de WhatsApp', () => {
    expect(enlaceWhatsapp('313 635 1406', 'Hola, Cool Ice')).toBe(
      'https://wa.me/573136351406?text=Hola%2C%20Cool%20Ice',
    );
  });

  it('conserva el registro INVIMA impreso en las etiquetas', () => {
    expect(registroInvima).toBe('RSA-0024680-2023');
  });

  it('trata un campo vacío como información sin publicar', () => {
    expect(textoPublicado('  ')).toBeNull();
    expect(textoPublicado('Calle 1')).toBe('Calle 1');
  });
});
