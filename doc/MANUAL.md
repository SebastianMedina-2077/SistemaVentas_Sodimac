# Manual del desarrollador — Sistema de Ventas Sodimac (frontend)

Prototipo de interfaz construido con Angular 22 y Bootstrap 5. Este documento describe la
arquitectura del maquetado para que cualquier integrante pueda extenderlo.

## Stack

- **Angular 22** — componentes *standalone*, señales (`signal`/`computed`), nuevo control de
  flujo (`@if`, `@for`), enrutamiento con *lazy loading* (`loadComponent`).
- **Bootstrap 5** — grilla, componentes y clases de validación (`.is-invalid`,
  `.invalid-feedback`), tematizado con la identidad de Sodimac en `src/styles.scss`.
- **Bootstrap Icons** — iconografía vectorial (nada de emojis).

## Identidad visual

Definida en `src/styles.scss` sobre variables de Bootstrap y tokens propios:

- Naranja de marca `#EA580C` (primario), tinta `#1c1917`, fondo crema `#faf9f7`.
- Tipografías: **Archivo** (títulos) y **Public Sans** (texto), cargadas en `index.html`.

## Estructura de carpetas

```
src/app/
├── app.ts / app.config.ts / app.routes.ts   Raíz, providers y rutas
├── nucleo/                                   Dominio y lógica compartida
│   ├── modelos.ts        Interfaces (Producto, LineaCarrito, Rol, Totales…)
│   ├── datos.ts          Datos mock: PRODUCTOS, CATEGORIAS, ROLES, MÉTODOS_PAGO
│   ├── reportes.ts       Datos mock de KPIs y gráficos
│   ├── soles.pipe.ts     Pipe de moneda (S/ 1,234.50)
│   ├── sesion.service.ts       Rol autenticado (señal)
│   ├── sesion.guard.ts         Guard de acceso a /tienda y /admin
│   ├── tienda.service.ts       Estado del catálogo (búsqueda + categoría)
│   ├── carrito.service.ts      Carrito de tienda y ticket POS + IGV 18 %
│   └── inventario.service.ts   Estado de stock y alertas de reposición
└── paginas/
    ├── login/                  Acceso con selección de rol (form validado)
    ├── tienda/                 tienda-layout, catalogo, checkout
    └── admin/                  admin-layout, dashboard, pos, inventario,
                                reportes, devoluciones
```

## Navegación y roles

`SesionService` guarda el rol elegido en el login. `sesionGuard` protege las áreas
`/tienda` y `/admin`. Cada rol aterriza en su módulo inicial:

- **Cliente** → tienda online.
- **Cajero / Asesor** → punto de venta.
- **Jefe de Logística** → inventario.
- **Gerente de Tienda** → dashboard.

## Validaciones (Bootstrap + Reactive Forms)

Los formularios usan `ReactiveFormsModule` y muestran el error con las clases de Bootstrap.
El estado inválido se muestra tras `touched` o tras el primer envío.

| Formulario           | Reglas destacadas |
| -------------------- | ----------------- |
| Login                | usuario ≥ 3, contraseña ≥ 4, rol requerido |
| Checkout             | nombre, DNI/RUC (`\d{8}` o `\d{11}`), teléfono (`9\d{8}`); dirección/distrito **o** tienda según la modalidad; método de pago requerido |
| Inventario (movimiento) | SKU requerido, cantidad ≥ 1 |
| Devoluciones         | comprobante con patrón `LNNN-NNNNNN`; motivo requerido |
| POS                  | validación de SKU inexistente al ingresar código manual |

## Estado y datos

Todo vive en memoria mediante señales; al cerrar sesión se limpian los carritos. Para
conectar un backend real bastaría con reemplazar los servicios de `nucleo/` por llamadas
HTTP manteniendo las mismas interfaces de `modelos.ts`.

## Comandos

```bash
npm start        # desarrollo (http://localhost:4200)
npm run build    # build de producción en dist/
```
