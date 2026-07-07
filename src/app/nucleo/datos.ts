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

/**
 * Ficha técnica por SKU: para qué sirve el producto y sus características
 * principales. Se usa en la consulta de productos del asesor. Contenido de
 * referencia; luego llegará desde la base de datos.
 */
const DETALLES: Record<string, { descripcion: string; caracteristicas: string[] }> = {
  'FER-001': {
    descripcion: 'Taladro con función percutora para perforar concreto, ladrillo, madera y metal. Ideal para instalaciones y colgado de estructuras.',
    caracteristicas: ['Motor de 550 W', 'Función percutor y rotación', 'Portabrocas de 13 mm', 'Velocidad variable con reversa'],
  },
  'HER-045': {
    descripcion: 'Lijadora orbital para acabados finos en madera, masilla y pintura. Deja superficies parejas antes de barnizar o pintar.',
    caracteristicas: ['Motor de 200 W', 'Base de sujeción rápida del papel', 'Sistema de recolección de polvo', 'Empuñadura antideslizante'],
  },
  'HER-050': {
    descripcion: 'Amoladora angular para cortar y desbastar metal, concreto y cerámico. Herramienta versátil de obra y taller.',
    caracteristicas: ['Motor de 820 W', 'Disco de 4.5"', 'Protector de disco regulable', 'Bloqueo de husillo para cambio rápido'],
  },
  'CON-014': {
    descripcion: 'Cemento Portland Tipo I de uso general para concreto, morteros, tarrajeo y asentado de ladrillo.',
    caracteristicas: ['Bolsa de 42.5 kg', 'Tipo I, uso estructural general', 'Alta resistencia a compresión', 'Fraguado uniforme'],
  },
  'CON-021': {
    descripcion: 'Varilla de acero corrugado para refuerzo de columnas, vigas y losas en construcción de concreto armado.',
    caracteristicas: ['Diámetro de 1/2"', 'Longitud de 9 m', 'Grado 60 (ASTM A615)', 'Corrugado para mejor adherencia'],
  },
  'PIN-088': {
    descripcion: 'Pintura látex lavable para interiores y exteriores. Buena cobertura sobre muro tarrajeado, drywall y cielo raso.',
    caracteristicas: ['Presentación de 4 L', 'Acabado mate', 'Lavable y de secado rápido', 'Rinde hasta 40 m² por mano'],
  },
  'PIN-090': {
    descripcion: 'Esmalte sintético para proteger y dar acabado a superficies de metal y madera, con resistencia a la intemperie.',
    caracteristicas: ['Presentación de 1 L', 'Acabado brillante', 'Anticorrosivo para metal', 'Buena resistencia al desgaste'],
  },
  'FER-032': {
    descripcion: 'Juego de destornilladores de puntas planas y estrella para trabajos de armado, mantenimiento y electricidad.',
    caracteristicas: ['6 piezas', 'Puntas planas y Phillips', 'Mango ergonómico antideslizante', 'Barras magnetizadas'],
  },
  'FER-060': {
    descripcion: 'Caja organizadora para transportar y guardar herramientas y accesorios de forma ordenada.',
    caracteristicas: ['Tamaño de 20"', 'Bandeja interior removible', 'Cierre metálico reforzado', 'Asa ergonómica'],
  },
  'ILU-012': {
    descripcion: 'Pack de focos LED de luz fría para iluminación general de casa, oficina o local con bajo consumo.',
    caracteristicas: ['9 W (equivale a ~70 W)', 'Luz fría 6500 K', 'Rosca E27', 'Pack de 4 unidades'],
  },
  'GAS-033': {
    descripcion: 'Tubería de PVC para instalaciones de agua y desagüe en redes domiciliarias.',
    caracteristicas: ['Diámetro de 1/2"', 'Longitud de 5 m', 'Resistente a la presión', 'Unión por embone'],
  },
  'GAS-040': {
    descripcion: 'Llave mezcladora para ducha con acabado cromado, para instalación en baños residenciales.',
    caracteristicas: ['Acabado cromado', 'Cuerpo de metal', 'Control de temperatura', 'Incluye accesorios de fijación'],
  },
  'SEG-007': {
    descripcion: 'Casco de protección para trabajos en obra y almacén. Protege la cabeza contra impactos y caída de objetos.',
    caracteristicas: ['Certificado ANSI Z89.1', 'Arnés regulable de 4 puntos', 'Material ABS de alta resistencia', 'Ranuras para accesorios'],
  },
  'SEG-011': {
    descripcion: 'Guantes de nitrilo para manipulación segura de materiales, químicos ligeros y trabajos de precisión.',
    caracteristicas: ['Material de nitrilo', 'Buen agarre en seco y húmedo', 'Resistentes a rasgaduras', 'Venta por par'],
  },
  'JAR-018': {
    descripcion: 'Manguera reforzada para riego de jardín, lavado de patios y llenado de recipientes.',
    caracteristicas: ['Longitud de 15 m', 'Refuerzo interno anti-torceduras', 'Resistente a la presión', 'Compatible con conectores estándar'],
  },
};

export const PRODUCTOS: Producto[] = CRUDO.map(
  ([sku, nombre, marca, precio, stock, minimo, categoria, ubicacion]) => {
    const detalle = DETALLES[sku] ?? {
      descripcion: `${nombre} de la línea ${categoria}.`,
      caracteristicas: [`Marca ${marca}`, `Categoría ${categoria}`],
    };
    return {
      sku,
      nombre,
      marca,
      precio,
      stock,
      minimo,
      categoria,
      ubicacion,
      descripcion: detalle.descripcion,
      caracteristicas: detalle.caracteristicas,
      imagen: CATEGORIA_META[categoria].imagen,
      tinte: CATEGORIA_META[categoria].tinte,
      tinta: CATEGORIA_META[categoria].tinta,
      inicial: nombre.charAt(0),
    };
  },
);

export const CATEGORIAS: string[] = ['Todos', ...Array.from(new Set(PRODUCTOS.map((p) => p.categoria)))];

/** Roles disponibles en el sistema (5 actores primarios). Colores de la paleta Sodimac. */
export const ROLES: Rol[] = [
  { clave: 'cliente', nombre: 'Cliente', descripcion: 'Compra en la tienda online', destino: 'tienda', moduloInicial: null, modulos: [], color: '#0072ce', inicial: 'C' },
  { clave: 'cajero', nombre: 'Cajero / Operador POS', descripcion: 'Registra ventas en punto de venta', destino: 'admin', moduloInicial: 'pos', modulos: ['pos'], color: '#005a9e', inicial: 'J' },
  { clave: 'asesor', nombre: 'Asesor de Ventas', descripcion: 'Consulta de stock y características de productos', destino: 'admin', moduloInicial: 'consulta', modulos: ['consulta'], color: '#0091d0', inicial: 'A' },
  { clave: 'logistica', nombre: 'Jefe de Logística', descripcion: 'Gestión de inventario y almacén', destino: 'admin', moduloInicial: 'inventario', modulos: ['inventario'], color: '#e30613', inicial: 'L' },
  { clave: 'gerente', nombre: 'Gerente de Tienda', descripcion: 'Acceso total: ventas, inventario y reportes', destino: 'admin', moduloInicial: 'dashboard', modulos: ['dashboard', 'pos', 'inventario', 'reportes', 'devoluciones', 'consulta'], color: '#158a48', inicial: 'G' },
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
