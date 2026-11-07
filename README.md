# Embotelladora Cool Ice

Sitio informativo de Embotelladora Cool Ice SAS. Presenta la empresa, las presentaciones de agua y los canales de contacto. No tiene carrito, pagos, cuentas ni backend.

La aplicación usa Angular 22, componentes standalone, TypeScript estricto, detección de cambios sin Zone.js, SCSS y pruebas con Vitest.

## Comandos

Desde la carpeta `embotelladora-cool-ice`:

```bash
npm start
```

Abre el servidor de desarrollo en `http://localhost:4200/`. La configuración por defecto es `development` y usa `proxy.conf.json`. Ese proxy está vacío mientras no exista un servicio real.

```bash
npm run build
```

Compila con la configuración `production` y deja el resultado en `dist/`.

```bash
npm test
```

Ejecuta las pruebas unitarias con Vitest.

Otras compilaciones:

```bash
npx ng build --configuration=github-pages
npx ng build --configuration=demo
npx ng build --configuration=dev
npx ng build --configuration=test
npx ng build --configuration=preprod
```

`github-pages` publica el sitio bajo `/embotelladora-cool-ice/`. Los perfiles sustituyen `src/environments/environment.ts` por el archivo que les corresponde. El sitio actual no consulta esos archivos porque no hay un servicio que consumir.

## Qué puedes editar

| Qué cambiar | Dónde |
| --- | --- |
| Teléfonos, correo, lugar, registro INVIMA y textos por completar | `src/app/contenido/sitio.ts` |
| Presentaciones, descripciones y fotos de producto | `src/app/contenido/productos.ts` |
| Tipos de esos datos | `src/app/contenido/modelos.ts` |
| Colores, tipografía, espacios y radios | `src/styles/_tokens.scss` |
| Estilos de la página | `src/styles/_base.scss` y `src/styles/_sitio.scss` |
| Título, descripción y datos para redes | `src/index.html` |
| Imágenes de la página | `src/assets/imagenes/` |
| Ícono y imagen social | `public/` |

Los campos de `camposPorCompletar` aceptan texto. Si están vacíos, la interfaz omite el dato o sugiere contactar por WhatsApp o teléfono. El detalle de lo pendiente vive solo en esta documentación.

## Datos y recursos pendientes del propietario

No están confirmados en las etiquetas ni en las piezas revisadas, así que no se inventaron en la web:

- Dirección exacta en Miranda, Cauca.
- Horario de atención.
- Municipios o zona de cobertura del domicilio.
- Etapas reales del tratamiento del agua (la propuesta de Figma sugiere cuatro pasos; no se publican hasta confirmarlos).
- Historia y valores redactados por la empresa.
- NIT.
- Dominio público, para convertir la imagen de Open Graph y la URL canónica en direcciones absolutas.
- Fotografías de producto con mejor definición y fondo coherente (sin rectángulo blanco). Hoy el hero y el botellón usan `botellon-dispensador.webp` (~341×983); la botella de 5 L usa la etiqueta; el dispensador usa un recorte estrecho.
- Confirmación de la equivalencia en galones del botellón (en la web solo se muestra **18,9 L**).
- Confirmación de que el número `313 635 1406`, tomado de la publicidad de dispensadores, sigue vigente junto al `321 682 0822` de las etiquetas.

En los archivos de diseño también aparece la marca Agua Baikal (Cali, teléfono `312 778 2448`, correo `aguabaikal1221@gmail.com`). No se publicó en este sitio para no mezclarla con Cool Ice.

No se publican precios, certificaciones distintas del registro INVIMA impreso en la etiqueta, testimonios ni afirmaciones de salud.
