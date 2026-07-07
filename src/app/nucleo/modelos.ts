// Modelos de dominio: Producto, Pedido, Inventario, Rol, etc.

export type Canal = 'tienda' | 'admin';

export interface Rol {
  clave: string;
  nombre: string;
  descripcion: string;
  destino: 'tienda' | 'admin';
  moduloInicial: ModuloAdmin | null;
  modulos: ModuloAdmin[]; // módulos del panel a los que tiene acceso
  color: string;
  inicial: string;
}

export type ModuloAdmin = 'dashboard' | 'pos' | 'inventario' | 'reportes' | 'devoluciones' | 'consulta';

export interface Producto {
  sku: string;
  nombre: string;
  marca: string;
  precio: number;
  stock: number;
  minimo: number;
  categoria: string;
  ubicacion: string;
  descripcion: string;
  caracteristicas: string[];
  imagen: string; // ruta local; luego vendrá de la BD
  tinte: string; // fondo de la miniatura
  tinta: string; // color de acento de la categoría
  inicial: string;
}

// El login deriva el rol a partir de usuario + clave.
export interface Credencial {
  usuario: string;
  clave: string;
  rol: string;
}

// Línea de carrito o ticket (DetallePedido).
export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

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
  color: string;
  fondo: string;
  punto: string;
}
