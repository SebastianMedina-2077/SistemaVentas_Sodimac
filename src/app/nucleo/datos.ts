import { Credencial, Producto, Rol } from './modelos';

/**
 * Metadatos por categoría: color de acento (paleta Sodimac), tinte de fondo
 * e imagen ilustrativa. Las imágenes viven en public/img/productos y luego
 * se reemplazarán por las que provengan de la base de datos.
 */
const CATEGORIA_META: Record<string, { tinte: string; tinta: string; imagen: string }> = {
  'Herramientas Eléctricas': { tinte: '#eaf3fb', tinta: '#0072ce', imagen: 'img/productos/herramientas-electricas.svg' },
  'Construcción': { tinte: '#f1f4f7', tinta: '#5b6770', imagen: 'img/productos/construccion.svg' },
  'Pinturas': { tinte: '#fdecec', tinta: '#e30613', imagen: 'img/productos/pinturas.svg' },
  'Ferretería': { tinte: '#fff7db', tinta: '#b58a00', imagen: 'img/productos/ferreteria.svg' },
  'Iluminación': { tinte: '#fff7db', tinta: '#e0a400', imagen: 'img/productos/iluminacion.svg' },
  'Gasfitería': { tinte: '#e9f5fb', tinta: '#0091d0', imagen: 'img/productos/gasfiteria.svg' },
  'Seguridad': { tinte: '#fdecec', tinta: '#e30613', imagen: 'img/productos/seguridad.svg' },
  'Jardinería': { tinte: '#e9f6ee', tinta: '#158a48', imagen: 'img/productos/jardineria.svg' },
};

// [sku, nombre, marca, precio, stock, minimo, categoria, ubicacion]
const CRUDO: [string, string, string, number, number, number, string, string][] = [
  ['FER-001', 'Taladro Percutor GSB 550W', 'Bosch', 189.9, 42, 15, 'Herramientas Eléctricas', 'Pasillo 7-A'],
  ['HER-045', 'Lijadora Orbital 200W', 'DeWalt', 219.0, 17, 10, 'Herramientas Eléctricas', 'Pasillo 7-B'],
  ['HER-050', 'Amoladora Angular 4.5" 820W', 'Bosch', 159.9, 23, 12, 'Herramientas Eléctricas', 'Pasillo 7-A'],
  ['CON-014', 'Cemento Sol Tipo I 42.5kg', 'Sol', 32.5, 320, 100, 'Construcción', 'Patio B'],
  ['CON-021', 'Fierro Corrugado 1/2" x 9m', 'Aceros Arequipa', 38.9, 210, 80, 'Construcción', 'Patio A'],
  ['PIN-088', 'Pintura Látex Blanco 4L', 'American Colors', 79.9, 54, 25, 'Pinturas', 'Pasillo 9-B'],
  ['PIN-090', 'Esmalte Sintético Negro 1L', 'Vencedor', 24.5, 4, 15, 'Pinturas', 'Pasillo 9-C'],
  ['FER-032', 'Set Destornilladores 6 pzs', 'Stanley', 45.0, 8, 20, 'Ferretería', 'Pasillo 3-C'],
  ['FER-060', 'Caja de Herramientas 20"', 'Stanley', 65.0, 28, 12, 'Ferretería', 'Pasillo 3-A'],
  ['ILU-012', 'Foco LED 9W Luz Fría x4', 'Philips', 29.9, 140, 50, 'Iluminación', 'Pasillo 5-A'],
  ['GAS-033', 'Tubería PVC 1/2" x 5m', 'Pavco', 18.9, 96, 40, 'Gasfitería', 'Pasillo 11-A'],
  ['GAS-040', 'Llave de Ducha Cromada', 'Trébol', 89.9, 12, 15, 'Gasfitería', 'Pasillo 11-C'],
  ['SEG-007', 'Casco de Seguridad', 'Steelpro', 27.9, 60, 30, 'Seguridad', 'Pasillo 2-A'],
  ['SEG-011', 'Guantes de Nitrilo (par)', 'Truper', 12.5, 5, 25, 'Seguridad', 'Pasillo 2-B'],
  ['JAR-018', 'Manguera Reforzada 15m', 'Rehau', 49.9, 34, 15, 'Jardinería', 'Pasillo 12-A'],
];

export const PRODUCTOS: Producto[] = CRUDO.map(
  ([sku, nombre, marca, precio, stock, minimo, categoria, ubicacion]) => ({
    sku,
    nombre,
    marca,
    precio,
    stock,
    minimo,
    categoria,
    ubicacion,
    imagen: CATEGORIA_META[categoria].imagen,
    tinte: CATEGORIA_META[categoria].tinte,
    tinta: CATEGORIA_META[categoria].tinta,
    inicial: nombre.charAt(0),
  }),
);

export const CATEGORIAS: string[] = ['Todos', ...Array.from(new Set(PRODUCTOS.map((p) => p.categoria)))];

/** Roles disponibles en el sistema (5 actores primarios). Colores de la paleta Sodimac. */
export const ROLES: Rol[] = [
  { clave: 'cliente', nombre: 'Cliente', descripcion: 'Compra en la tienda online', destino: 'tienda', moduloInicial: null, color: '#0072ce', inicial: 'C' },
  { clave: 'cajero', nombre: 'Cajero / Operador POS', descripcion: 'Registra ventas en punto de venta', destino: 'admin', moduloInicial: 'pos', color: '#005a9e', inicial: 'J' },
  { clave: 'asesor', nombre: 'Asesor de Ventas', descripcion: 'Ventas asistidas y consulta de stock', destino: 'admin', moduloInicial: 'pos', color: '#0091d0', inicial: 'A' },
  { clave: 'logistica', nombre: 'Jefe de Logística', descripcion: 'Gestión de inventario y almacén', destino: 'admin', moduloInicial: 'inventario', color: '#e30613', inicial: 'L' },
  { clave: 'gerente', nombre: 'Gerente de Tienda', descripcion: 'Dashboard y reportes de ventas', destino: 'admin', moduloInicial: 'dashboard', color: '#158a48', inicial: 'G' },
];

/**
 * Credenciales de acceso por rol. El login valida usuario + contraseña
 * contra esta tabla y deriva el rol automáticamente (sin selección manual).
 * Mockup en memoria: luego se validará contra el backend.
 */
export const CREDENCIALES: Credencial[] = [
  { usuario: 'cliente', clave: 'cliente123', rol: 'cliente' },
  { usuario: 'cajero', clave: 'cajero123', rol: 'cajero' },
  { usuario: 'asesor', clave: 'asesor123', rol: 'asesor' },
  { usuario: 'logistica', clave: 'logistica123', rol: 'logistica' },
  { usuario: 'gerente', clave: 'gerente123', rol: 'gerente' },
];

/** Busca el rol correspondiente a un usuario y clave; null si no coincide. */
export function autenticar(usuario: string, clave: string): Rol | null {
  const u = usuario.trim().toLowerCase();
  const cred = CREDENCIALES.find((c) => c.usuario === u && c.clave === clave);
  if (!cred) return null;
  return ROLES.find((r) => r.clave === cred.rol) ?? null;
}

/** Métodos de pago aceptados (POS y checkout). */
export const METODOS_PAGO = ['Efectivo', 'Tarjeta', 'CMR Falabella', 'Yape / Plin'];
