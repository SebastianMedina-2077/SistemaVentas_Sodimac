import { Credencial, ModuloInfo, Producto, Rol } from './modelos';

// Acento, tinte de fondo e imagen por categoría.
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

// [sku, nombre, marca, precio, góndola, almacén, mínimo, categoría, ubicación, palabraImagen]
const CRUDO: [string, string, string, number, number, number, number, string, string, string][] = [
  // Herramientas Eléctricas
  ['FER-001', 'Taladro Percutor GSB 550W', 'Bosch', 189.9, 12, 30, 15, 'Herramientas Eléctricas', 'Pasillo 7-A', 'drill'],
  ['HER-045', 'Lijadora Orbital 200W', 'DeWalt', 219.0, 5, 12, 10, 'Herramientas Eléctricas', 'Pasillo 7-B', 'sander'],
  ['HER-050', 'Amoladora Angular 4.5" 820W', 'Bosch', 159.9, 8, 15, 12, 'Herramientas Eléctricas', 'Pasillo 7-A', 'angle-grinder'],
  ['HER-052', 'Sierra Circular 7¼" 1400W', 'Makita', 329.0, 4, 9, 8, 'Herramientas Eléctricas', 'Pasillo 7-C', 'circular-saw'],
  ['HER-055', 'Rotomartillo SDS 800W', 'Bosch', 289.9, 6, 10, 8, 'Herramientas Eléctricas', 'Pasillo 7-A', 'hammer-drill'],
  ['HER-058', 'Atornillador Inalámbrico 12V', 'DeWalt', 179.9, 9, 14, 10, 'Herramientas Eléctricas', 'Pasillo 7-B', 'cordless-screwdriver'],
  ['HER-061', 'Caladora 650W', 'Black+Decker', 149.9, 3, 8, 8, 'Herramientas Eléctricas', 'Pasillo 7-C', 'jigsaw'],
  ['HER-064', 'Compresor de Aire 24L 2HP', 'Truper', 549.0, 2, 5, 4, 'Herramientas Eléctricas', 'Patio C', 'air-compressor'],
  // Construcción
  ['CON-014', 'Cemento Sol Tipo I 42.5kg', 'Sol', 32.5, 80, 240, 100, 'Construcción', 'Patio B', 'cement'],
  ['CON-021', 'Fierro Corrugado 1/2" x 9m', 'Aceros Arequipa', 38.9, 60, 150, 80, 'Construcción', 'Patio A', 'rebar-steel'],
  ['CON-025', 'Ladrillo King Kong 18 huecos', 'Lark', 1.6, 500, 1500, 400, 'Construcción', 'Patio A', 'brick'],
  ['CON-028', 'Arena Gruesa saco 40kg', 'Sodimac', 9.9, 40, 120, 60, 'Construcción', 'Patio B', 'construction-sand'],
  ['CON-031', 'Yeso Cerámico 18kg', 'Interbath', 22.9, 18, 40, 25, 'Construcción', 'Pasillo 8-A', 'plaster'],
  ['CON-034', 'Drywall 1/2" 1.22x2.44m', 'Gyplac', 34.9, 22, 55, 30, 'Construcción', 'Pasillo 8-B', 'drywall'],
  ['CON-037', 'Cerámico Piso 45x45 caja', 'Celima', 45.9, 30, 70, 40, 'Construcción', 'Pasillo 8-C', 'ceramic-tile'],
  // Pinturas
  ['PIN-088', 'Pintura Látex Blanco 4L', 'American Colors', 79.9, 20, 34, 25, 'Pinturas', 'Pasillo 9-B', 'paint-bucket'],
  ['PIN-090', 'Esmalte Sintético Negro 1L', 'Vencedor', 24.5, 2, 2, 15, 'Pinturas', 'Pasillo 9-C', 'enamel-paint'],
  ['PIN-093', 'Base Imprimante Gasificante 1gal', 'CPP', 59.9, 14, 26, 18, 'Pinturas', 'Pasillo 9-B', 'primer-paint'],
  ['PIN-096', 'Thinner Acrílico 1L', 'Tekno', 15.9, 25, 40, 25, 'Pinturas', 'Pasillo 9-D', 'solvent'],
  ['PIN-099', 'Rodillo Antigota 9"', 'Toolcraft', 12.9, 30, 50, 30, 'Pinturas', 'Pasillo 9-A', 'paint-roller'],
  ['PIN-102', 'Brocha Cerda Suave 3"', 'Tumi', 8.5, 40, 60, 35, 'Pinturas', 'Pasillo 9-A', 'paintbrush'],
  // Ferretería
  ['FER-032', 'Set Destornilladores 6 pzs', 'Stanley', 45.0, 4, 4, 20, 'Ferretería', 'Pasillo 3-C', 'screwdriver-set'],
  ['FER-060', 'Caja de Herramientas 20"', 'Stanley', 65.0, 10, 18, 12, 'Ferretería', 'Pasillo 3-A', 'toolbox'],
  ['FER-063', 'Juego Llaves Mixtas 8 pzs', 'Truper', 89.9, 8, 16, 12, 'Ferretería', 'Pasillo 3-B', 'wrench-set'],
  ['FER-066', 'Martillo Uña 16oz', 'Stanley', 29.9, 15, 30, 20, 'Ferretería', 'Pasillo 3-C', 'hammer'],
  ['FER-069', 'Cinta Métrica 5m', 'Truper', 14.9, 25, 45, 30, 'Ferretería', 'Pasillo 3-D', 'tape-measure'],
  ['FER-072', 'Alicate Universal 8"', 'Bellota', 34.9, 12, 22, 15, 'Ferretería', 'Pasillo 3-B', 'pliers'],
  ['FER-075', 'Candado de Bronce 50mm', 'Forte', 19.9, 30, 50, 25, 'Ferretería', 'Pasillo 3-E', 'padlock'],
  ['FER-078', 'Nivel de Aluminio 24"', 'Stanley', 42.9, 9, 15, 12, 'Ferretería', 'Pasillo 3-A', 'spirit-level'],
  // Iluminación
  ['ILU-012', 'Foco LED 9W Luz Fría x4', 'Philips', 29.9, 50, 90, 50, 'Iluminación', 'Pasillo 5-A', 'led-bulb'],
  ['ILU-015', 'Panel LED 18W Redondo', 'Opalux', 39.9, 20, 35, 25, 'Iluminación', 'Pasillo 5-B', 'led-panel'],
  ['ILU-018', 'Reflector LED 50W', 'Josfel', 69.9, 12, 22, 15, 'Iluminación', 'Pasillo 5-C', 'floodlight'],
  ['ILU-021', 'Cinta LED 5m RGB', 'Sodimac', 34.9, 18, 30, 20, 'Iluminación', 'Pasillo 5-B', 'led-strip'],
  ['ILU-024', 'Interruptor Doble', 'Ticino', 12.9, 40, 70, 40, 'Iluminación', 'Pasillo 5-D', 'light-switch'],
  // Gasfitería
  ['GAS-033', 'Tubería PVC 1/2" x 5m', 'Pavco', 18.9, 40, 80, 40, 'Gasfitería', 'Pasillo 11-A', 'pvc-pipe'],
  ['GAS-040', 'Llave de Ducha Cromada', 'Trébol', 89.9, 4, 8, 15, 'Gasfitería', 'Pasillo 11-C', 'shower-head'],
  ['GAS-043', 'Caño Lavatorio Monomando', 'Vainsa', 129.9, 6, 12, 10, 'Gasfitería', 'Pasillo 11-B', 'faucet'],
  ['GAS-046', 'Pegamento PVC 1/4 gal', 'Oatey', 24.9, 22, 40, 25, 'Gasfitería', 'Pasillo 11-D', 'glue'],
  ['GAS-049', 'Trampa Sifón P 2"', 'Sodimac', 16.9, 26, 44, 25, 'Gasfitería', 'Pasillo 11-A', 'plumbing-trap'],
  ['GAS-052', 'Tanque para Inodoro', 'Trébol', 149.9, 5, 10, 8, 'Gasfitería', 'Pasillo 11-E', 'toilet'],
  // Seguridad
  ['SEG-007', 'Casco de Seguridad', 'Steelpro', 27.9, 25, 40, 30, 'Seguridad', 'Pasillo 2-A', 'safety-helmet'],
  ['SEG-011', 'Guantes de Nitrilo (par)', 'Truper', 12.5, 3, 3, 25, 'Seguridad', 'Pasillo 2-B', 'work-gloves'],
  ['SEG-014', 'Lentes de Seguridad', '3M', 15.9, 40, 70, 40, 'Seguridad', 'Pasillo 2-B', 'safety-glasses'],
  ['SEG-017', 'Zapato Punta de Acero', 'Steelpro', 119.9, 10, 20, 15, 'Seguridad', 'Pasillo 2-C', 'safety-boots'],
  ['SEG-020', 'Mascarilla Respiratoria', '3M', 34.9, 18, 30, 20, 'Seguridad', 'Pasillo 2-D', 'respirator-mask'],
  // Jardinería
  ['JAR-018', 'Manguera Reforzada 15m', 'Rehau', 49.9, 12, 24, 15, 'Jardinería', 'Pasillo 12-A', 'garden-hose'],
  ['JAR-021', 'Tijera Podadora 8"', 'Truper', 39.9, 15, 25, 15, 'Jardinería', 'Pasillo 12-B', 'pruning-shears'],
  ['JAR-024', 'Pala Recta con Mango', 'Bellota', 44.9, 10, 20, 12, 'Jardinería', 'Pasillo 12-C', 'shovel'],
  ['JAR-027', 'Rastrillo 14 dientes', 'Truper', 32.9, 12, 22, 12, 'Jardinería', 'Pasillo 12-C', 'rake'],
  ['JAR-030', 'Aspersor Giratorio', 'Sodimac', 22.9, 20, 34, 18, 'Jardinería', 'Pasillo 12-A', 'sprinkler'],
];

// Ficha técnica por SKU (consulta del asesor).
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
  ([sku, nombre, marca, precio, gondola, almacen, minimo, categoria, ubicacion, palabra], i) => {
    const detalle = DETALLES[sku] ?? {
      descripcion: `${nombre} de la marca ${marca}, de nuestra línea de ${categoria.toLowerCase()}. Producto disponible en tienda para tus proyectos.`,
      caracteristicas: [`Marca ${marca}`, `Categoría ${categoria}`, 'Garantía de tienda Sodimac'],
    };
    return {
      sku,
      nombre,
      marca,
      precio,
      stock: gondola + almacen,
      stockGondola: gondola,
      stockAlmacen: almacen,
      minimo,
      categoria,
      ubicacion,
      descripcion: detalle.descripcion,
      caracteristicas: detalle.caracteristicas,
      // Imagen de internet (referencial por categoría); si falla, cae a la ilustración local.
      imagen: `https://loremflickr.com/400/300/${palabra},tool?lock=${i + 1}`,
      imagenLocal: CATEGORIA_META[categoria].imagen,
      tinte: CATEGORIA_META[categoria].tinte,
      tinta: CATEGORIA_META[categoria].tinta,
      inicial: nombre.charAt(0),
    };
  },
);

export const CATEGORIAS: string[] = ['Todos', ...Array.from(new Set(PRODUCTOS.map((p) => p.categoria)))];

/** Metadatos visuales (tinte, acento, ilustración) de una categoría. */
export function metaCategoria(categoria: string) {
  return CATEGORIA_META[categoria] ?? CATEGORIA_META['Ferretería'];
}

// Catálogo de módulos del panel, agrupados para la navegación lateral.
export const MODULOS: ModuloInfo[] = [
  { clave: 'dashboard', nombre: 'Dashboard', icono: 'bi-grid-1x2', grupo: 'General' },
  { clave: 'pos', nombre: 'Punto de venta', icono: 'bi-upc-scan', grupo: 'Ventas' },
  { clave: 'cotizaciones', nombre: 'Cotizaciones', icono: 'bi-file-earmark-text', grupo: 'Ventas' },
  { clave: 'reservas', nombre: 'Reservas C&C', icono: 'bi-bookmark-check', grupo: 'Ventas' },
  { clave: 'devoluciones', nombre: 'Devoluciones', icono: 'bi-arrow-return-left', grupo: 'Ventas' },
  { clave: 'cierre', nombre: 'Cierre de caja', icono: 'bi-cash-stack', grupo: 'Ventas' },
  { clave: 'consulta', nombre: 'Consulta de productos', icono: 'bi-search', grupo: 'Catálogo' },
  { clave: 'inventario', nombre: 'Inventario', icono: 'bi-box-seam', grupo: 'Inventario' },
  { clave: 'reposicion', nombre: 'Reposición', icono: 'bi-truck', grupo: 'Inventario' },
  { clave: 'recepcion', nombre: 'Recepción', icono: 'bi-box-arrow-in-down', grupo: 'Inventario' },
  { clave: 'productos', nombre: 'Gestión de productos', icono: 'bi-pencil-square', grupo: 'Gestión' },
  { clave: 'reportes', nombre: 'Reportes', icono: 'bi-bar-chart', grupo: 'Gestión' },
  { clave: 'clientes', nombre: 'Clientes', icono: 'bi-people', grupo: 'Gestión' },
];

// Roles del sistema; cada uno define a qué módulos del panel accede.
export const ROLES: Rol[] = [
  { clave: 'cliente', nombre: 'Cliente', descripcion: 'Compra en la tienda online', destino: 'tienda', moduloInicial: null, modulos: [], color: '#0072ce', inicial: 'C' },
  { clave: 'cajero', nombre: 'Cajero / Operador POS', descripcion: 'Ventas, devoluciones y cierre de caja', destino: 'admin', moduloInicial: 'pos', modulos: ['pos', 'devoluciones', 'cierre', 'consulta'], color: '#005a9e', inicial: 'J' },
  { clave: 'asesor', nombre: 'Asesor de Ventas', descripcion: 'Consulta, cotizaciones y reservas Click & Collect', destino: 'admin', moduloInicial: 'consulta', modulos: ['consulta', 'cotizaciones', 'reservas'], color: '#0091d0', inicial: 'A' },
  { clave: 'logistica', nombre: 'Jefe de Logística', descripcion: 'Inventario, reposición y recepción de mercadería', destino: 'admin', moduloInicial: 'inventario', modulos: ['inventario', 'reposicion', 'recepcion'], color: '#e30613', inicial: 'L' },
  { clave: 'gerente', nombre: 'Gerente de Tienda', descripcion: 'Acceso total a todos los módulos', destino: 'admin', moduloInicial: 'dashboard', modulos: ['dashboard', 'pos', 'cotizaciones', 'reservas', 'devoluciones', 'cierre', 'consulta', 'inventario', 'reposicion', 'recepcion', 'productos', 'reportes', 'clientes'], color: '#158a48', inicial: 'G' },
];

// Credenciales de demo; en producción se validarían contra el backend.
export const CREDENCIALES: Credencial[] = [
  { usuario: 'cliente', clave: 'cliente123', rol: 'cliente' },
  { usuario: 'cajero', clave: 'cajero123', rol: 'cajero' },
  { usuario: 'asesor', clave: 'asesor123', rol: 'asesor' },
  { usuario: 'logistica', clave: 'logistica123', rol: 'logistica' },
  { usuario: 'gerente', clave: 'gerente123', rol: 'gerente' },
];

export function autenticar(usuario: string, clave: string): Rol | null {
  const u = usuario.trim().toLowerCase();
  const cred = CREDENCIALES.find((c) => c.usuario === u && c.clave === clave);
  if (!cred) return null;
  return ROLES.find((r) => r.clave === cred.rol) ?? null;
}

export const METODOS_PAGO = ['Efectivo', 'Tarjeta', 'CMR Falabella', 'Yape / Plin'];
