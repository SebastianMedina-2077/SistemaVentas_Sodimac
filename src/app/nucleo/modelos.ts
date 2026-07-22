export type Canal = 'tienda' | 'admin';

export interface Rol {
  clave: string;
  nombre: string;
  descripcion: string;
  destino: 'tienda' | 'admin';
  moduloInicial: ModuloAdmin | null;
  modulos: ModuloAdmin[];
  color: string;
  inicial: string;
}

export type ModuloAdmin =
  | 'dashboard'
  | 'pos'
  | 'cotizaciones'
  | 'reservas'
  | 'devoluciones'
  | 'cierre'
  | 'consulta'
  | 'inventario'
  | 'reposicion'
  | 'recepcion'
  | 'reportes'
  | 'clientes'
  | 'productos';

/** Metadatos de un módulo del panel para armar la navegación. */
export interface ModuloInfo {
  clave: ModuloAdmin;
  nombre: string;
  icono: string;
  grupo: string;
}

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
  imagen: string; // URL de internet
  imagenLocal: string; // ilustración de respaldo si la URL falla
  stockGondola: number; // unidades en sala de ventas (góndola)
  stockAlmacen: number; // unidades en almacén
  tinte: string; // fondo de la miniatura
  tinta: string; // acento de la categoría
  inicial: string;
}

export interface Credencial {
  usuario: string;
  clave: string;
  rol: string;
}

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
