# Registro de cambios

Historial de cambios relevantes del frontend. El detalle de arquitectura vive en
[`MANUAL.md`](./MANUAL.md).

## 2026-07-07 — Rebrand Sodimac, login por credenciales y acceso por rol

### Identidad visual
- Se reemplazó la paleta naranja anterior por la del **logo de Sodimac**: azul `#0072CE`
  (primario), rojo `#E30613`, amarillo `#FFD100` y negro azulado `#16202B`, con fondo
  `#F5F7FA`. Afecta `styles.scss` y todas las plantillas.
- Nueva franja de marca (`.sv-franja-marca`) en la tarjeta de login.

### Imágenes de producto
- Los productos ya no muestran la inicial: ahora usan imágenes en
  `public/img/productos/*.svg` (una ilustración por categoría, paleta Sodimac).
- Nuevo campo `imagen` en `Producto`. Listo para reemplazar por URLs de base de datos.

### Login
- Se eliminaron las **tarjetas de selección de rol**. Ahora el acceso es por
  **usuario + contraseña**; el rol se deriva de las credenciales.
- Nueva tabla `CREDENCIALES` y función `autenticar()` en `datos.ts`. Interfaz `Credencial`
  en `modelos.ts`.
- Se quitaron de la pantalla el bloque de estadísticas ("8 módulos / 6 casos de uso / 5
  roles") y la lista de credenciales de demostración. Las credenciales quedan solo en
  TypeScript.
- Botón mostrar/ocultar contraseña y validación con los iconos propios de Bootstrap.

### Control de acceso por rol
- Nuevo `modulo.guard.ts`: restringe cada módulo de `/admin` según `Rol.modulos`; redirige
  al módulo inicial del rol si el acceso no está permitido.
- Nuevo campo `modulos` en `Rol` y `'consulta'` agregado a `ModuloAdmin`.
- El menú lateral del panel (`admin-layout`) se filtra por rol.
- Mapa de acceso: **gerente** (todo), **cajero** (solo POS), **logística** (solo
  inventario), **asesor** (solo consulta). Ver tabla en `MANUAL.md`.

### Nuevo módulo: Consulta de productos (asesor)
- `paginas/admin/consulta.{ts,html}`: buscador de solo lectura con stock disponible,
  ubicación, precio, descripción ("para qué sirve") y características por producto.
- Nuevos campos `descripcion` y `caracteristicas` en `Producto`, con el mapa `DETALLES`
  por SKU en `datos.ts`.

### Textos y detalles de UI
- Redacción revisada en login, catálogo, tienda, checkout, inventario y POS (tono natural,
  sin códigos "CUS-0X" visibles).
- Enlaces de texto: nueva clase `.sv-enlace` sin subrayado permanente (aparece al pasar el
  cursor, con foco de teclado visible).
- Ajustes responsive y de accesibilidad (labels visibles, touch targets, color no como
  único indicador de estado).
