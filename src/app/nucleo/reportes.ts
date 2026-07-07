/**
 * Datos mock de indicadores para el Dashboard y el módulo de Reportes (CUS-06).
 * En producción provendrían de la consolidación de ventas en base de datos.
 */

export interface BarraCategoria { etiqueta: string; monto: number; color: string; }
export interface BarraTurno { etiqueta: string; monto: number; }
export interface TopProducto { nombre: string; sku: string; unidades: number; monto: number; }
export interface MesVenta { mes: string; pct: number; }
export interface FilaReporte { categoria: string; unidades: number; monto: number; participacion: string; }

export const VENTAS_POR_CATEGORIA: BarraCategoria[] = [
  { etiqueta: 'Construcción', monto: 15650, color: '#005a9e' },
  { etiqueta: 'Herramientas Eléctricas', monto: 12240, color: '#0072ce' },
  { etiqueta: 'Pinturas', monto: 7980, color: '#0091d0' },
  { etiqueta: 'Ferretería', monto: 5420, color: '#5aa9e6' },
  { etiqueta: 'Iluminación', monto: 3810, color: '#a9cfeb' },
  { etiqueta: 'Otros', monto: 3820, color: '#d9e2ec' },
];

export const VENTAS_POR_TURNO: BarraTurno[] = [
  { etiqueta: 'Mañana (08–13h)', monto: 18200 },
  { etiqueta: 'Tarde (13–19h)', monto: 21540 },
  { etiqueta: 'Noche (19–22h)', monto: 9180 },
];

export const TOP_PRODUCTOS: TopProducto[] = [
  { nombre: 'Cemento Sol Tipo I 42.5kg', sku: 'CON-014', unidades: 482, monto: 15665 },
  { nombre: 'Fierro Corrugado 1/2"', sku: 'CON-021', unidades: 356, monto: 13849 },
  { nombre: 'Taladro Percutor GSB', sku: 'FER-001', unidades: 54, monto: 10254 },
  { nombre: 'Pintura Látex Blanco 4L', sku: 'PIN-088', unidades: 98, monto: 7830 },
  { nombre: 'Foco LED 9W x4', sku: 'ILU-012', unidades: 210, monto: 6279 },
];

export const VENTAS_MENSUALES: MesVenta[] = [
  { mes: 'Ene', pct: 38 }, { mes: 'Feb', pct: 42 }, { mes: 'Mar', pct: 55 },
  { mes: 'Abr', pct: 48 }, { mes: 'May', pct: 61 }, { mes: 'Jun', pct: 72 },
  { mes: 'Jul', pct: 68 }, { mes: 'Ago', pct: 65 }, { mes: 'Set', pct: 78 },
  { mes: 'Oct', pct: 84 }, { mes: 'Nov', pct: 91 }, { mes: 'Dic', pct: 100 },
];

export const DETALLE_CATEGORIAS: FilaReporte[] = [
  { categoria: 'Construcción', unidades: 838, monto: 29499, participacion: '34%' },
  { categoria: 'Herramientas Eléctricas', unidades: 312, monto: 24180, participacion: '22%' },
  { categoria: 'Pinturas', unidades: 421, monto: 18760, participacion: '17%' },
  { categoria: 'Ferretería', unidades: 276, monto: 12340, participacion: '11%' },
  { categoria: 'Iluminación', unidades: 390, monto: 9870, participacion: '9%' },
  { categoria: 'Gasfitería / Otros', unidades: 184, monto: 7690, participacion: '7%' },
];
