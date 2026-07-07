# Sistema de Ventas Sodimac

Maquetado **frontend** (solo interfaz) del Sistema de Ventas Omnicanal de Sodimac Perú,
construido con **Angular 22** (standalone components + signals) y **Bootstrap 5** con
validaciones de formularios. Cubre los casos de uso definidos en el análisis del sistema:
POS, tienda online, Click & Collect, inventario, reportes y devoluciones.

> Es un prototipo de referencia: los datos son de ejemplo (mock en memoria), no hay backend
> ni persistencia. El objetivo es validar la experiencia y la navegación entre módulos.

## Requisitos

- Node.js 20+ (probado con 24)
- npm 10+

## Puesta en marcha

```bash
npm install
npm start          # equivale a: ng serve
```

Abrir `http://localhost:4200/`. La app arranca en `/login`; elige un rol, ingresa cualquier
usuario/contraseña que cumpla las validaciones y accede al módulo correspondiente.

## Scripts

```bash
npm start      # servidor de desarrollo
npm run build  # build de producción en dist/
```

## Módulos y casos de uso

| Ruta                       | Módulo               | Caso de uso |
| -------------------------- | -------------------- | ----------- |
| `/login`                   | Acceso por rol       | Autenticación (REQ-15) |
| `/tienda/catalogo`         | Catálogo online      | CUS-02 |
| `/tienda/checkout`         | Checkout / entrega   | CUS-02 / CUS-03 |
| `/admin/pos`               | Punto de venta       | CUS-01 |
| `/admin/inventario`        | Gestión de inventario| CUS-05 |
| `/admin/reportes`          | Reportes de ventas   | CUS-06 |
| `/admin/devoluciones`      | Devoluciones/cambios | CUS-04 |
| `/admin/dashboard`         | Indicadores          | CUS-06 |

La documentación técnica está en [`doc/`](doc/MANUAL.md).
