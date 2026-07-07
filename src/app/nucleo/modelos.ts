/**
 * Modelos de dominio del Sistema de Ventas Sodimac.
 * Reflejan las entidades del documento de análisis (Producto, Pedido,
 * DetallePedido, Categoría, Inventario, etc.).
 */

export type Canal = 'tienda' | 'admin';

/** Roles/actores del sistema (CUS: Cliente, Cajero, Asesor, Logística, Gerente). */
export interface Rol {
  clave: string;
  nombre: string;
  descripcion: string;
  destino: 'tienda' | 'admin';
  moduloInicial: ModuloAdmin | null;
  /** Módulos del panel a los que el rol tiene acceso. */
  modulos: ModuloAdmin[];
  color: string;
  inicial: string;
}

export type ModuloAdmin = 'dashboard' | 'pos' | 'inventario' | 'reportes' | 'devoluciones' | 'consulta';

/** Producto del catálogo (entidad Producto: SKU, nombre, precio, stock, ubicación). */
export interface Producto {
  sku: string;
  nombre: string;
  marca: string;
  precio: number;
  stock: number;
  minimo: number;
  categoria: string;
  ubicacion: string;
  descripcion: string; // para qué sirve el producto
  caracteristicas: string[]; // ficha técnica resumida
  imagen: string; // ruta de la imagen del producto (luego vendrá de la BD)
  tinte: string; // color de fondo de la miniatura
  tinta: string; // color de acento de la categoría
  inicial: string;
}

/**
 * Credencial de acceso: asocia un usuario y clave a un rol.
 * El login resuelve el rol a partir de estas credenciales (sin tarjetas de rol).
 * Mockup en memoria; luego se validará contra el backend.
 */
export interface Credencial {
  usuario: string;
  clave: string;
  rol: string; // clave del Rol asociado
}

/** Línea de un carrito o ticket (entidad DetallePedido). */
export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

/** Totales calculados con IGV 18 %. */
export interface Totales {
  subtotal: number;
  igv: number;
  total: number;
  unidades: number;
}

export type EstadoStock = 'ok' | 'bajo' | 'critico';

export interface EstadoStockInfo {
  estado: EstadoStock;
  etiqueta: string;
  color: string; // texto
  fondo: string;
  punto: string;
}
