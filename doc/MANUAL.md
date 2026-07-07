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

Definida en `src/styles.scss` sobre variables de Bootstrap y tokens propios. La paleta se
tomó del **logo de Sodimac** (la casa de colores):

- **Azul `#0072CE`** — color primario (botones, enlaces, navegación activa).
- **Rojo `#E30613`** — alertas, estado "agotado" y acentos (`$danger`).
- **Amarillo `#FFD100`** — destacados y la franja de marca del login.
- **Negro azulado `#16202B`** — sidebar y textos (tinta); fondo general `#F5F7FA`.
- Tokens propios: `--sv-azul`, `--sv-rojo`, `--sv-amarillo`, `--sv-ink`, `--sv-fondo`, etc.
- Tipografías: **Archivo** (títulos) y **Public Sans** (texto), cargadas en `index.html`.

> La franja azul/amarillo/rojo de la tarjeta de login (`.sv-franja-marca`) reproduce los
> colores del techo del logo.

## Imágenes de producto

Cada producto tiene una imagen en `public/img/productos/<categoria>.svg` (una ilustración
por categoría, generada con la paleta Sodimac). La ruta vive en el campo `imagen` de
`Producto`; cuando el catálogo pase a base de datos, basta con cambiar ese valor por la URL
real. Se muestran en catálogo, POS, checkout y consulta con `object-fit: cover`.

## Estructura de carpetas

```
src/app/
├── app.ts / app.config.ts / app.routes.ts   Raíz, providers y rutas
├── nucleo/                                   Dominio y lógica compartida
│   ├── modelos.ts        Interfaces (Producto, LineaCarrito, Rol, Credencial, Totales…)
│   ├── datos.ts          Datos mock: PRODUCTOS, DETALLES, CATEGORIAS, ROLES,
│   │                     CREDENCIALES, autenticar(), MÉTODOS_PAGO
│   ├── reportes.ts       Datos mock de KPIs y gráficos
│   ├── soles.pipe.ts     Pipe de moneda (S/ 1,234.50)
│   ├── sesion.service.ts       Rol autenticado (señal)
│   ├── sesion.guard.ts         Guard de acceso a /tienda y /admin
│   ├── modulo.guard.ts         Guard de acceso por rol a cada módulo de /admin
│   ├── tienda.service.ts       Estado del catálogo (búsqueda + categoría)
│   ├── carrito.service.ts      Carrito de tienda y ticket POS + IGV 18 %
│   └── inventario.service.ts   Estado de stock y alertas de reposición
└── paginas/
    ├── login/                  Acceso por usuario + contraseña (form validado)
    ├── tienda/                 tienda-layout, catalogo, checkout
    └── admin/                  admin-layout, dashboard, pos, consulta, inventario,
                                reportes, devoluciones
```

## Acceso: login y roles

El login pide **usuario y contraseña** (ya no hay tarjetas de rol). `autenticar()` valida
contra la tabla `CREDENCIALES` de `datos.ts` y **deriva el rol** automáticamente;
`SesionService` lo guarda en una señal. Las credenciales viven solo en TypeScript, no se
muestran en pantalla.

Credenciales de prueba (usuario / contraseña → rol):

| Usuario     | Contraseña      | Rol                |
| ----------- | --------------- | ------------------ |
| `cliente`   | `cliente123`    | Cliente            |
| `cajero`    | `cajero123`     | Cajero             |
| `asesor`    | `asesor123`     | Asesor de ventas   |
| `logistica` | `logistica123`  | Jefe de logística  |
| `gerente`   | `gerente123`    | Gerente de tienda  |

### Control de acceso por módulo

`sesionGuard` protege `/tienda` y `/admin` (exige sesión). Dentro de `/admin`,
`moduloGuard` verifica que el rol tenga permitido el módulo (según `Rol.modulos`); si no,
redirige al módulo inicial del rol. El menú lateral (`admin-layout`) también se filtra por
`Rol.modulos`, así cada usuario solo ve lo suyo.

| Rol                | Módulos permitidos                                           | Módulo inicial |
| ------------------ | ------------------------------------------------------------ | -------------- |
| **Gerente**        | dashboard, pos, consulta, inventario, reportes, devoluciones | dashboard      |
| **Cajero**         | pos (solo ventas)                                            | pos            |
| **Asesor**         | consulta (solo lectura)                                      | consulta       |
| **Jefe de Logística** | inventario (entradas, salidas, conteo, alertas)           | inventario     |
| **Cliente**        | — (va a la tienda online, fuera de `/admin`)                 | tienda         |

**Consulta de productos** (`paginas/admin/consulta`) es el módulo del asesor: buscador de
solo lectura que muestra stock disponible, ubicación, precio, descripción ("para qué
sirve") y características de cada producto. No vende ni edita.

## Validaciones (Bootstrap + Reactive Forms)

Los formularios usan `ReactiveFormsModule` y muestran el error con las clases de Bootstrap.
El estado inválido se muestra tras `touched` o tras el primer envío.

| Formulario           | Reglas destacadas |
| -------------------- | ----------------- |
| Login                | usuario ≥ 3, contraseña ≥ 4; si no coinciden con `CREDENCIALES`, muestra error de acceso |
| Checkout             | nombre, DNI/RUC (`\d{8}` o `\d{11}`), teléfono (`9\d{8}`); dirección/distrito **o** tienda según la modalidad; método de pago requerido |
| Inventario (movimiento) | SKU requerido, cantidad ≥ 1 |
| Devoluciones         | comprobante con patrón `LNNN-NNNNNN`; motivo requerido |
| POS                  | validación de SKU inexistente al ingresar código manual |

## Estado y datos

Todo vive en memoria mediante señales; al cerrar sesión se limpian los carritos. La
estructura respeta una separación por capas (modelos / servicios tipo DAO en `nucleo/` /
componentes como vista-controlador), pensada para MVC. Para conectar un backend real
bastaría con reemplazar los servicios de `nucleo/` por llamadas HTTP y `autenticar()` por
una petición al API, manteniendo las mismas interfaces de `modelos.ts`.

## Comandos

```bash
npm start        # desarrollo (http://localhost:4200)
npm run build    # build de producción en dist/
```
