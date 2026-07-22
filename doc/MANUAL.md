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

## Casos de uso del sistema (CUS)

Casos de uso del documento de análisis (`document/AvanceProy2_analisis de sistemas.pdf`) y
la parte del sistema que los implementa en este prototipo.

### Actores del sistema

| Actor                  | Tipo       | Rol en el negocio |
| ---------------------- | ---------- | ----------------- |
| Cliente                | Primario   | Compra en canal físico o digital |
| Cajero / Operador POS  | Primario   | Registra ventas, cobros y devoluciones |
| Asesor de Ventas       | Primario   | Orienta al cliente y verifica stock |
| Jefe de Logística      | Primario   | Gestiona el inventario físico |
| Gerente de Tienda      | Primario   | Consulta y exporta reportes de ventas |
| Entidad Financiera     | Secundario | Valida y autoriza los pagos (incluye CMR Falabella) |

### Especificaciones

| Código | Caso de uso | Actor principal | Descripción | Dónde se implementa |
| ------ | ----------- | --------------- | ----------- | ------------------- |
| **CUS-01** | Registrar venta en POS | Cajero | Registra una venta en punto de venta físico, procesa el cobro y emite el comprobante electrónico. | `admin/pos` |
| **CUS-02** | Realizar compra en línea | Cliente | Navegar el catálogo, gestionar el carrito y completar la compra con pago electrónico y entrega a domicilio. | `tienda/catalogo` + `tienda/checkout` (modalidad envío) |
| **CUS-03** | Reservar producto (Click & Collect) | Cliente | Reservar un producto en una tienda y retirarlo presencialmente dentro de un plazo. | `tienda/checkout` (modalidad retiro en tienda) |
| **CUS-04** | Registrar devolución / cambio | Cajero | Procesa una devolución o cambio verificando condiciones y emitiendo el documento correspondiente. | `admin/devoluciones` |
| **CUS-05** | Gestionar inventario | Jefe de Logística | Registra entradas, salidas y conteos cíclicos, mantiene el stock al día y genera alertas de reposición. | `admin/inventario` |
| **CUS-06** | Generar reporte de ventas | Gerente de Tienda | Consolida los KPI de ventas, los muestra en pantalla y permite exportarlos. | `admin/reportes` + `admin/dashboard` |
| CUS-07 | Procesar pago *(subflujo)* | Entidad Financiera | Valida y autoriza el pago (efectivo, tarjeta, CMR Falabella). | Integrado en POS y checkout (método de pago) |
| CUS-08 | Emitir comprobante electrónico *(subflujo)* | Sistema | Genera el comprobante fiscal al cerrar la transacción. | Integrado en POS y checkout (comprobante) |

> **Apoyo del asesor.** La verificación de existencias y características que hace el asesor
> (actor de apoyo en CUS-01 y CUS-02) se cubre con el módulo `admin/consulta`.
>
> **Nota del prototipo.** En el análisis, CUS-04 lo ejecuta el cajero; aquí el módulo de
> devoluciones se dejó bajo el gerente para que el cajero solo opere ventas. Es una
> decisión de permisos del prototipo, ajustable en `ROLES` (`datos.ts`).

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

Instalar dependencias:

```bash
npm install     # instala lo declarado en package.json
npm ci          # alternativa: instalación limpia y reproducible desde package-lock.json
```

Angular CLI viene como dependencia del proyecto, no hace falta instalarlo aparte. Si lo
quieres global para usar `ng` directo en la terminal: `npm install -g @angular/cli`.

Levantar el servidor de desarrollo (cualquiera de estas sirve):

```bash
npm start                        # atajo de package.json (ng serve) → http://localhost:4200
npx ng serve                     # equivalente, sin CLI global
npx ng serve --open --port 4300  # abre el navegador y usa otro puerto
```

Compilar para producción:

```bash
npm run build   # genera la build optimizada en dist/
```

## Historial de cambios

### 2026-07-07 — Rebrand Sodimac, login por credenciales y acceso por rol

**Identidad visual.** Se cambió la paleta naranja por la del logo de Sodimac: azul `#0072CE`
(primario), rojo `#E30613`, amarillo `#FFD100` y negro azulado `#16202B`, con fondo `#F5F7FA`.
Afecta `styles.scss` y las plantillas. Nueva franja de marca (`.sv-franja-marca`) en el login.

**Imágenes de producto.** Los productos usan una ilustración por categoría en
`public/img/productos/*.svg` (campo `imagen` de `Producto`), lista para reemplazar por URLs
reales cuando el catálogo pase a base de datos.

**Login.** Se quitaron las tarjetas de rol; ahora el acceso es por usuario + contraseña y el
rol se deriva de las credenciales (`CREDENCIALES` y `autenticar()` en `datos.ts`). Incluye
botón de mostrar/ocultar contraseña.

**Control de acceso por rol.** Nuevo `modulo.guard.ts`: restringe cada módulo de `/admin`
según `Rol.modulos` y redirige al módulo inicial del rol si no tiene acceso. El menú lateral
también se filtra por rol (gerente ve todo; cajero solo POS; logística solo inventario;
asesor solo consulta).

**Nuevo módulo Consulta de productos.** Buscador de solo lectura para el asesor con stock,
ubicación, precio, descripción y características (campos `descripcion` y `caracteristicas` en
`Producto`, mapa `DETALLES` en `datos.ts`).

**Estilos.** Bootstrap se integra con `@use ... with` en vez de `@import`, para eliminar el
aviso de deprecación de Dart Sass.
