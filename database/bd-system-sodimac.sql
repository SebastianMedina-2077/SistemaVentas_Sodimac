-- ============================================================================
--  Sistema de Ventas Sodimac Perú — Base de datos
--  Motor: MySQL 8.x  ·  Codificación: utf8mb4
--
--  El modelo refleja las entidades del documento de análisis:
--  Producto, Categoría, Inventario, Movimiento, Pedido/Orden, DetallePedido,
--  Cliente, Comprobante de Pago y Devolución; más Rol, Módulo y Usuario para
--  el control de acceso del sistema.
--
--  Uso:
--    mysql -u root -p < bd-system-sodimac.sql
-- ============================================================================

DROP DATABASE IF EXISTS `bd-system-sodimac`;
CREATE DATABASE `bd-system-sodimac`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `bd-system-sodimac`;

-- ----------------------------------------------------------------------------
-- 1. Catálogo: categoría y producto
-- ----------------------------------------------------------------------------

CREATE TABLE categoria (
  id_categoria  INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(80)  NOT NULL,
  departamento  VARCHAR(80)  NOT NULL,
  subcategoria  VARCHAR(80)  NULL,
  UNIQUE KEY uq_categoria_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE producto (
  sku           VARCHAR(20)  PRIMARY KEY,
  nombre        VARCHAR(150) NOT NULL,
  marca         VARCHAR(80)  NOT NULL,
  id_categoria  INT          NOT NULL,
  precio        DECIMAL(10,2) NOT NULL,
  descripcion   TEXT         NULL,
  ubicacion     VARCHAR(60)  NULL,
  -- Imagen: se recomienda guardar la ruta/URL (imagen_url). La columna
  -- imagen_blob queda disponible por si se decide almacenar el binario.
  imagen_url    VARCHAR(255) NULL,
  imagen_blob   LONGBLOB     NULL,
  activo        TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_producto_categoria
    FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
) ENGINE=InnoDB;

CREATE TABLE caracteristica_producto (
  id_caracteristica INT AUTO_INCREMENT PRIMARY KEY,
  sku               VARCHAR(20)  NOT NULL,
  descripcion       VARCHAR(150) NOT NULL,
  orden             TINYINT      NOT NULL DEFAULT 1,
  CONSTRAINT fk_caracteristica_producto
    FOREIGN KEY (sku) REFERENCES producto (sku) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 2. Tiendas e inventario (stock por tienda y SKU)
-- ----------------------------------------------------------------------------

CREATE TABLE tienda (
  id_tienda  INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(80) NOT NULL,
  direccion  VARCHAR(150) NULL,
  ciudad     VARCHAR(60)  NULL
) ENGINE=InnoDB;

CREATE TABLE inventario (
  id_tienda          INT NOT NULL,
  sku                VARCHAR(20) NOT NULL,
  -- Sodimac maneja el stock en sala de ventas (góndola) y en almacén.
  stock_gondola      INT NOT NULL DEFAULT 0,
  stock_almacen      INT NOT NULL DEFAULT 0,
  cantidad_reservada INT NOT NULL DEFAULT 0,
  stock_minimo       INT NOT NULL DEFAULT 0,
  -- Total físico = góndola + almacén.
  stock_total        INT AS (stock_gondola + stock_almacen) STORED,
  -- Disponible = total menos reservado.
  disponible         INT AS (stock_gondola + stock_almacen - cantidad_reservada) STORED,
  PRIMARY KEY (id_tienda, sku),
  CONSTRAINT fk_inventario_tienda   FOREIGN KEY (id_tienda) REFERENCES tienda (id_tienda),
  CONSTRAINT fk_inventario_producto FOREIGN KEY (sku)       REFERENCES producto (sku)
) ENGINE=InnoDB;

CREATE TABLE movimiento_inventario (
  id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
  id_tienda     INT NOT NULL,
  sku           VARCHAR(20) NOT NULL,
  tipo          ENUM('entrada','salida','conteo') NOT NULL,
  cantidad      INT NOT NULL,
  motivo        VARCHAR(150) NULL,
  fecha         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario    INT NULL,
  CONSTRAINT fk_mov_tienda   FOREIGN KEY (id_tienda) REFERENCES tienda (id_tienda),
  CONSTRAINT fk_mov_producto FOREIGN KEY (sku)       REFERENCES producto (sku)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 3. Acceso: rol, módulo, permisos y usuario
-- ----------------------------------------------------------------------------

CREATE TABLE rol (
  id_rol         INT AUTO_INCREMENT PRIMARY KEY,
  clave          VARCHAR(30) NOT NULL,
  nombre         VARCHAR(60) NOT NULL,
  descripcion    VARCHAR(150) NULL,
  destino        ENUM('tienda','admin') NOT NULL,
  modulo_inicial VARCHAR(30) NULL,
  UNIQUE KEY uq_rol_clave (clave)
) ENGINE=InnoDB;

CREATE TABLE modulo (
  id_modulo INT AUTO_INCREMENT PRIMARY KEY,
  clave     VARCHAR(30) NOT NULL,
  nombre    VARCHAR(60) NOT NULL,
  icono     VARCHAR(40) NULL,
  UNIQUE KEY uq_modulo_clave (clave)
) ENGINE=InnoDB;

CREATE TABLE rol_modulo (
  id_rol    INT NOT NULL,
  id_modulo INT NOT NULL,
  PRIMARY KEY (id_rol, id_modulo),
  CONSTRAINT fk_rolmod_rol    FOREIGN KEY (id_rol)    REFERENCES rol (id_rol)       ON DELETE CASCADE,
  CONSTRAINT fk_rolmod_modulo FOREIGN KEY (id_modulo) REFERENCES modulo (id_modulo) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  usuario    VARCHAR(40) NOT NULL,
  -- Guarda el hash de la contraseña, nunca el texto plano.
  clave_hash VARCHAR(255) NOT NULL,
  nombre     VARCHAR(100) NULL,
  id_rol     INT NOT NULL,
  activo     TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uq_usuario (usuario),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol (id_rol)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 4. Clientes
-- ----------------------------------------------------------------------------

CREATE TABLE cliente (
  id_cliente  INT AUTO_INCREMENT PRIMARY KEY,
  tipo_doc    ENUM('DNI','RUC') NOT NULL DEFAULT 'DNI',
  num_doc     VARCHAR(15) NOT NULL,
  nombre      VARCHAR(120) NOT NULL,
  direccion   VARCHAR(150) NULL,
  distrito    VARCHAR(60)  NULL,
  telefono    VARCHAR(15)  NULL,
  correo      VARCHAR(120) NULL,
  tarjeta_cmr VARCHAR(20)  NULL,
  UNIQUE KEY uq_cliente_doc (num_doc)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 5. Ventas: pedido, detalle, comprobante y devolución
-- ----------------------------------------------------------------------------

CREATE TABLE pedido (
  id_pedido     INT AUTO_INCREMENT PRIMARY KEY,
  numero_orden  VARCHAR(20) NOT NULL,
  fecha         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  canal         ENUM('pos','online') NOT NULL,
  modalidad     ENUM('inmediata','envio','retiro') NOT NULL DEFAULT 'inmediata',
  estado        ENUM('registrado','pagado','entregado','anulado') NOT NULL DEFAULT 'registrado',
  id_cliente    INT NULL,
  id_usuario    INT NULL,
  id_tienda     INT NOT NULL,
  subtotal      DECIMAL(10,2) NOT NULL DEFAULT 0,
  igv           DECIMAL(10,2) NOT NULL DEFAULT 0,
  total         DECIMAL(10,2) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_pedido_orden (numero_orden),
  CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente),
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
  CONSTRAINT fk_pedido_tienda  FOREIGN KEY (id_tienda)  REFERENCES tienda (id_tienda)
) ENGINE=InnoDB;

CREATE TABLE detalle_pedido (
  id_detalle       INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido        INT NOT NULL,
  sku              VARCHAR(20) NOT NULL,
  cantidad         INT NOT NULL,
  precio_unitario  DECIMAL(10,2) NOT NULL,
  subtotal         DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_detalle_pedido   FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido) ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto FOREIGN KEY (sku)       REFERENCES producto (sku)
) ENGINE=InnoDB;

CREATE TABLE comprobante (
  id_comprobante INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido      INT NOT NULL,
  tipo           ENUM('boleta','factura') NOT NULL,
  serie          VARCHAR(8) NOT NULL,
  numero         VARCHAR(12) NOT NULL,
  fecha          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  monto          DECIMAL(10,2) NOT NULL,
  metodo_pago    ENUM('Efectivo','Tarjeta','CMR Falabella','Yape / Plin') NOT NULL,
  ruc_receptor   VARCHAR(11) NULL,
  UNIQUE KEY uq_comprobante (serie, numero),
  CONSTRAINT fk_comprobante_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido)
) ENGINE=InnoDB;

CREATE TABLE devolucion (
  id_devolucion  INT AUTO_INCREMENT PRIMARY KEY,
  numero         VARCHAR(20) NOT NULL,
  id_pedido      INT NOT NULL,
  fecha          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  motivo         VARCHAR(150) NULL,
  tipo           ENUM('reembolso','cambio') NOT NULL,
  estado         ENUM('solicitada','aprobada','rechazada') NOT NULL DEFAULT 'solicitada',
  monto_devolver DECIMAL(10,2) NOT NULL DEFAULT 0,
  id_usuario     INT NULL,
  UNIQUE KEY uq_devolucion (numero),
  CONSTRAINT fk_devolucion_pedido  FOREIGN KEY (id_pedido)  REFERENCES pedido (id_pedido),
  CONSTRAINT fk_devolucion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

-- ============================================================================
--  DATOS DE CARGA INICIAL (seed)
-- ============================================================================

-- Categorías --------------------------------------------------------------
INSERT INTO categoria (id_categoria, nombre, departamento, subcategoria) VALUES
  (1, 'Herramientas Eléctricas', 'Herramientas',                'Eléctricas'),
  (2, 'Construcción',            'Construcción',                'Materiales'),
  (3, 'Pinturas',                'Pinturas y Acabados',         'Interior/Exterior'),
  (4, 'Ferretería',              'Ferretería',                  'Manuales'),
  (5, 'Iluminación',             'Electricidad e Iluminación',  'LED'),
  (6, 'Gasfitería',              'Gasfitería',                  'Agua y Desagüe'),
  (7, 'Seguridad',               'Seguridad Industrial',        'EPP'),
  (8, 'Jardinería',              'Jardín y Exteriores',         'Riego');

-- Tienda ------------------------------------------------------------------
INSERT INTO tienda (id_tienda, nombre, direccion, ciudad) VALUES
  (1, 'Homecenter Lima Norte', 'Av. Alfredo Mendiola 3698', 'Lima');

-- Roles -------------------------------------------------------------------
INSERT INTO rol (id_rol, clave, nombre, descripcion, destino, modulo_inicial) VALUES
  (1, 'cliente',   'Cliente',                'Compra en la tienda online',                  'tienda', NULL),
  (2, 'cajero',    'Cajero / Operador POS',  'Registra ventas en punto de venta',           'admin',  'pos'),
  (3, 'asesor',    'Asesor de Ventas',       'Consulta de stock y características',          'admin',  'consulta'),
  (4, 'logistica', 'Jefe de Logística',      'Gestión de inventario y almacén',             'admin',  'inventario'),
  (5, 'gerente',   'Gerente de Tienda',      'Acceso total: ventas, inventario y reportes', 'admin',  'dashboard');

-- Módulos -----------------------------------------------------------------
INSERT INTO modulo (id_modulo, clave, nombre, icono) VALUES
  (1,  'dashboard',    'Dashboard general',       'bi-grid-1x2'),
  (2,  'pos',          'Punto de venta',          'bi-upc-scan'),
  (3,  'cotizaciones', 'Cotizaciones',            'bi-file-earmark-text'),
  (4,  'reservas',     'Reservas Click & Collect','bi-bookmark-check'),
  (5,  'devoluciones', 'Devoluciones y cambios',  'bi-arrow-return-left'),
  (6,  'cierre',       'Cierre de caja',          'bi-cash-stack'),
  (7,  'consulta',     'Consulta de productos',   'bi-search'),
  (8,  'inventario',   'Gestión de inventario',   'bi-box-seam'),
  (9,  'reposicion',   'Reposición',              'bi-truck'),
  (10, 'recepcion',    'Recepción de mercadería', 'bi-box-arrow-in-down'),
  (11, 'reportes',     'Reportes de ventas',      'bi-bar-chart'),
  (12, 'clientes',     'Clientes',                'bi-people'),
  (13, 'productos',    'Gestión de productos',    'bi-pencil-square');

-- Permisos rol → módulo ---------------------------------------------------
INSERT INTO rol_modulo (id_rol, id_modulo) VALUES
  (2, 2), (2, 5), (2, 6), (2, 7),                        -- cajero: pos, devoluciones, cierre, consulta
  (3, 7), (3, 3), (3, 4),                                -- asesor: consulta, cotizaciones, reservas
  (4, 8), (4, 9), (4, 10),                               -- logística: inventario, reposición, recepción
  (5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6),        -- gerente: todos
  (5, 7), (5, 8), (5, 9), (5, 10), (5, 11), (5, 12), (5, 13);

-- Usuarios (contraseñas con hash SHA-256; demo: usuario + "123") -----------
INSERT INTO usuario (usuario, clave_hash, nombre, id_rol) VALUES
  ('cliente',   SHA2('cliente123',   256), 'Cliente Demo',            1),
  ('cajero',    SHA2('cajero123',    256), 'Cajero de Tienda',        2),
  ('asesor',    SHA2('asesor123',    256), 'Asesor de Ventas',        3),
  ('logistica', SHA2('logistica123', 256), 'Jefe de Logística',       4),
  ('gerente',   SHA2('gerente123',   256), 'Gerente de Tienda',       5);

-- Productos (50) ----------------------------------------------------------
INSERT INTO producto (sku, nombre, marca, id_categoria, precio, ubicacion, imagen_url) VALUES
  ('FER-001', 'Taladro Percutor GSB 550W',   'Bosch',           1, 189.90, 'Pasillo 7-A', 'img/productos/herramientas-electricas.svg'),
  ('HER-045', 'Lijadora Orbital 200W',        'DeWalt',          1, 219.00, 'Pasillo 7-B', 'img/productos/herramientas-electricas.svg'),
  ('HER-050', 'Amoladora Angular 4.5" 820W',  'Bosch',           1, 159.90, 'Pasillo 7-A', 'img/productos/herramientas-electricas.svg'),
  ('HER-052', 'Sierra Circular 7¼" 1400W',    'Makita',          1, 329.00, 'Pasillo 7-C', 'img/productos/herramientas-electricas.svg'),
  ('HER-055', 'Rotomartillo SDS 800W',        'Bosch',           1, 289.90, 'Pasillo 7-A', 'img/productos/herramientas-electricas.svg'),
  ('HER-058', 'Atornillador Inalámbrico 12V', 'DeWalt',          1, 179.90, 'Pasillo 7-B', 'img/productos/herramientas-electricas.svg'),
  ('HER-061', 'Caladora 650W',                'Black+Decker',    1, 149.90, 'Pasillo 7-C', 'img/productos/herramientas-electricas.svg'),
  ('HER-064', 'Compresor de Aire 24L 2HP',    'Truper',          1, 549.00, 'Patio C',     'img/productos/herramientas-electricas.svg'),
  ('CON-014', 'Cemento Sol Tipo I 42.5kg',    'Sol',             2,  32.50, 'Patio B',     'img/productos/construccion.svg'),
  ('CON-021', 'Fierro Corrugado 1/2" x 9m',   'Aceros Arequipa', 2,  38.90, 'Patio A',     'img/productos/construccion.svg'),
  ('CON-025', 'Ladrillo King Kong 18 huecos', 'Lark',            2,   1.60, 'Patio A',     'img/productos/construccion.svg'),
  ('CON-028', 'Arena Gruesa saco 40kg',       'Sodimac',         2,   9.90, 'Patio B',     'img/productos/construccion.svg'),
  ('CON-031', 'Yeso Cerámico 18kg',           'Interbath',       2,  22.90, 'Pasillo 8-A', 'img/productos/construccion.svg'),
  ('CON-034', 'Drywall 1/2" 1.22x2.44m',      'Gyplac',          2,  34.90, 'Pasillo 8-B', 'img/productos/construccion.svg'),
  ('CON-037', 'Cerámico Piso 45x45 caja',     'Celima',          2,  45.90, 'Pasillo 8-C', 'img/productos/construccion.svg'),
  ('PIN-088', 'Pintura Látex Blanco 4L',      'American Colors', 3,  79.90, 'Pasillo 9-B', 'img/productos/pinturas.svg'),
  ('PIN-090', 'Esmalte Sintético Negro 1L',   'Vencedor',        3,  24.50, 'Pasillo 9-C', 'img/productos/pinturas.svg'),
  ('PIN-093', 'Base Imprimante Gasif. 1gal',  'CPP',             3,  59.90, 'Pasillo 9-B', 'img/productos/pinturas.svg'),
  ('PIN-096', 'Thinner Acrílico 1L',          'Tekno',           3,  15.90, 'Pasillo 9-D', 'img/productos/pinturas.svg'),
  ('PIN-099', 'Rodillo Antigota 9"',          'Toolcraft',       3,  12.90, 'Pasillo 9-A', 'img/productos/pinturas.svg'),
  ('PIN-102', 'Brocha Cerda Suave 3"',        'Tumi',            3,   8.50, 'Pasillo 9-A', 'img/productos/pinturas.svg'),
  ('FER-032', 'Set Destornilladores 6 pzs',   'Stanley',         4,  45.00, 'Pasillo 3-C', 'img/productos/ferreteria.svg'),
  ('FER-060', 'Caja de Herramientas 20"',     'Stanley',         4,  65.00, 'Pasillo 3-A', 'img/productos/ferreteria.svg'),
  ('FER-063', 'Juego Llaves Mixtas 8 pzs',    'Truper',          4,  89.90, 'Pasillo 3-B', 'img/productos/ferreteria.svg'),
  ('FER-066', 'Martillo Uña 16oz',            'Stanley',         4,  29.90, 'Pasillo 3-C', 'img/productos/ferreteria.svg'),
  ('FER-069', 'Cinta Métrica 5m',             'Truper',          4,  14.90, 'Pasillo 3-D', 'img/productos/ferreteria.svg'),
  ('FER-072', 'Alicate Universal 8"',         'Bellota',         4,  34.90, 'Pasillo 3-B', 'img/productos/ferreteria.svg'),
  ('FER-075', 'Candado de Bronce 50mm',       'Forte',           4,  19.90, 'Pasillo 3-E', 'img/productos/ferreteria.svg'),
  ('FER-078', 'Nivel de Aluminio 24"',        'Stanley',         4,  42.90, 'Pasillo 3-A', 'img/productos/ferreteria.svg'),
  ('ILU-012', 'Foco LED 9W Luz Fría x4',      'Philips',         5,  29.90, 'Pasillo 5-A', 'img/productos/iluminacion.svg'),
  ('ILU-015', 'Panel LED 18W Redondo',        'Opalux',          5,  39.90, 'Pasillo 5-B', 'img/productos/iluminacion.svg'),
  ('ILU-018', 'Reflector LED 50W',            'Josfel',          5,  69.90, 'Pasillo 5-C', 'img/productos/iluminacion.svg'),
  ('ILU-021', 'Cinta LED 5m RGB',             'Sodimac',         5,  34.90, 'Pasillo 5-B', 'img/productos/iluminacion.svg'),
  ('ILU-024', 'Interruptor Doble',            'Ticino',          5,  12.90, 'Pasillo 5-D', 'img/productos/iluminacion.svg'),
  ('GAS-033', 'Tubería PVC 1/2" x 5m',        'Pavco',           6,  18.90, 'Pasillo 11-A','img/productos/gasfiteria.svg'),
  ('GAS-040', 'Llave de Ducha Cromada',       'Trébol',          6,  89.90, 'Pasillo 11-C','img/productos/gasfiteria.svg'),
  ('GAS-043', 'Caño Lavatorio Monomando',     'Vainsa',          6, 129.90, 'Pasillo 11-B','img/productos/gasfiteria.svg'),
  ('GAS-046', 'Pegamento PVC 1/4 gal',        'Oatey',           6,  24.90, 'Pasillo 11-D','img/productos/gasfiteria.svg'),
  ('GAS-049', 'Trampa Sifón P 2"',            'Sodimac',         6,  16.90, 'Pasillo 11-A','img/productos/gasfiteria.svg'),
  ('GAS-052', 'Tanque para Inodoro',          'Trébol',          6, 149.90, 'Pasillo 11-E','img/productos/gasfiteria.svg'),
  ('SEG-007', 'Casco de Seguridad',           'Steelpro',        7,  27.90, 'Pasillo 2-A', 'img/productos/seguridad.svg'),
  ('SEG-011', 'Guantes de Nitrilo (par)',     'Truper',          7,  12.50, 'Pasillo 2-B', 'img/productos/seguridad.svg'),
  ('SEG-014', 'Lentes de Seguridad',          '3M',              7,  15.90, 'Pasillo 2-B', 'img/productos/seguridad.svg'),
  ('SEG-017', 'Zapato Punta de Acero',        'Steelpro',        7, 119.90, 'Pasillo 2-C', 'img/productos/seguridad.svg'),
  ('SEG-020', 'Mascarilla Respiratoria',      '3M',              7,  34.90, 'Pasillo 2-D', 'img/productos/seguridad.svg'),
  ('JAR-018', 'Manguera Reforzada 15m',       'Rehau',           8,  49.90, 'Pasillo 12-A','img/productos/jardineria.svg'),
  ('JAR-021', 'Tijera Podadora 8"',           'Truper',          8,  39.90, 'Pasillo 12-B','img/productos/jardineria.svg'),
  ('JAR-024', 'Pala Recta con Mango',         'Bellota',         8,  44.90, 'Pasillo 12-C','img/productos/jardineria.svg'),
  ('JAR-027', 'Rastrillo 14 dientes',         'Truper',          8,  32.90, 'Pasillo 12-C','img/productos/jardineria.svg'),
  ('JAR-030', 'Aspersor Giratorio',           'Sodimac',         8,  22.90, 'Pasillo 12-A','img/productos/jardineria.svg');

-- Características por producto ---------------------------------------------
INSERT INTO caracteristica_producto (sku, descripcion, orden) VALUES
  ('FER-001','Motor de 550 W',1),('FER-001','Función percutor y rotación',2),('FER-001','Portabrocas de 13 mm',3),('FER-001','Velocidad variable con reversa',4),
  ('HER-045','Motor de 200 W',1),('HER-045','Base de sujeción rápida del papel',2),('HER-045','Sistema de recolección de polvo',3),('HER-045','Empuñadura antideslizante',4),
  ('HER-050','Motor de 820 W',1),('HER-050','Disco de 4.5"',2),('HER-050','Protector de disco regulable',3),('HER-050','Bloqueo de husillo para cambio rápido',4),
  ('CON-014','Bolsa de 42.5 kg',1),('CON-014','Tipo I, uso estructural general',2),('CON-014','Alta resistencia a compresión',3),('CON-014','Fraguado uniforme',4),
  ('CON-021','Diámetro de 1/2"',1),('CON-021','Longitud de 9 m',2),('CON-021','Grado 60 (ASTM A615)',3),('CON-021','Corrugado para mejor adherencia',4),
  ('PIN-088','Presentación de 4 L',1),('PIN-088','Acabado mate',2),('PIN-088','Lavable y de secado rápido',3),('PIN-088','Rinde hasta 40 m² por mano',4),
  ('PIN-090','Presentación de 1 L',1),('PIN-090','Acabado brillante',2),('PIN-090','Anticorrosivo para metal',3),('PIN-090','Buena resistencia al desgaste',4),
  ('FER-032','6 piezas',1),('FER-032','Puntas planas y Phillips',2),('FER-032','Mango ergonómico antideslizante',3),('FER-032','Barras magnetizadas',4),
  ('FER-060','Tamaño de 20"',1),('FER-060','Bandeja interior removible',2),('FER-060','Cierre metálico reforzado',3),('FER-060','Asa ergonómica',4),
  ('ILU-012','9 W (equivale a ~70 W)',1),('ILU-012','Luz fría 6500 K',2),('ILU-012','Rosca E27',3),('ILU-012','Pack de 4 unidades',4),
  ('GAS-033','Diámetro de 1/2"',1),('GAS-033','Longitud de 5 m',2),('GAS-033','Resistente a la presión',3),('GAS-033','Unión por embone',4),
  ('GAS-040','Acabado cromado',1),('GAS-040','Cuerpo de metal',2),('GAS-040','Control de temperatura',3),('GAS-040','Incluye accesorios de fijación',4),
  ('SEG-007','Certificado ANSI Z89.1',1),('SEG-007','Arnés regulable de 4 puntos',2),('SEG-007','Material ABS de alta resistencia',3),('SEG-007','Ranuras para accesorios',4),
  ('SEG-011','Material de nitrilo',1),('SEG-011','Buen agarre en seco y húmedo',2),('SEG-011','Resistentes a rasgaduras',3),('SEG-011','Venta por par',4),
  ('JAR-018','Longitud de 15 m',1),('JAR-018','Refuerzo interno anti-torceduras',2),('JAR-018','Resistente a la presión',3),('JAR-018','Compatible con conectores estándar',4);

-- Inventario inicial (góndola, almacén y mínimo por producto en la tienda 1)
INSERT INTO inventario (id_tienda, sku, stock_gondola, stock_almacen, stock_minimo) VALUES
  (1,'FER-001', 12, 30, 15), (1,'HER-045', 5, 12, 10), (1,'HER-050', 8, 15, 12),
  (1,'HER-052', 4, 9, 8),    (1,'HER-055', 6, 10, 8),  (1,'HER-058', 9, 14, 10),
  (1,'HER-061', 3, 8, 8),    (1,'HER-064', 2, 5, 4),
  (1,'CON-014', 80, 240, 100), (1,'CON-021', 60, 150, 80), (1,'CON-025', 500, 1500, 400),
  (1,'CON-028', 40, 120, 60),  (1,'CON-031', 18, 40, 25),  (1,'CON-034', 22, 55, 30),
  (1,'CON-037', 30, 70, 40),
  (1,'PIN-088', 20, 34, 25), (1,'PIN-090', 2, 2, 15),  (1,'PIN-093', 14, 26, 18),
  (1,'PIN-096', 25, 40, 25), (1,'PIN-099', 30, 50, 30), (1,'PIN-102', 40, 60, 35),
  (1,'FER-032', 4, 4, 20),   (1,'FER-060', 10, 18, 12), (1,'FER-063', 8, 16, 12),
  (1,'FER-066', 15, 30, 20), (1,'FER-069', 25, 45, 30), (1,'FER-072', 12, 22, 15),
  (1,'FER-075', 30, 50, 25), (1,'FER-078', 9, 15, 12),
  (1,'ILU-012', 50, 90, 50), (1,'ILU-015', 20, 35, 25), (1,'ILU-018', 12, 22, 15),
  (1,'ILU-021', 18, 30, 20), (1,'ILU-024', 40, 70, 40),
  (1,'GAS-033', 40, 80, 40), (1,'GAS-040', 4, 8, 15),   (1,'GAS-043', 6, 12, 10),
  (1,'GAS-046', 22, 40, 25), (1,'GAS-049', 26, 44, 25), (1,'GAS-052', 5, 10, 8),
  (1,'SEG-007', 25, 40, 30), (1,'SEG-011', 3, 3, 25),   (1,'SEG-014', 40, 70, 40),
  (1,'SEG-017', 10, 20, 15), (1,'SEG-020', 18, 30, 20),
  (1,'JAR-018', 12, 24, 15), (1,'JAR-021', 15, 25, 15), (1,'JAR-024', 10, 20, 12),
  (1,'JAR-027', 12, 22, 12), (1,'JAR-030', 20, 34, 18);

-- ============================================================================
--  Vistas de apoyo
-- ============================================================================

-- Productos por debajo del mínimo (alerta de reposición) -------------------
CREATE OR REPLACE VIEW v_alertas_stock AS
SELECT p.sku, p.nombre, c.nombre AS categoria,
       i.stock_gondola, i.stock_almacen, i.stock_total, i.stock_minimo, t.nombre AS tienda
FROM inventario i
JOIN producto  p ON p.sku = i.sku
JOIN categoria c ON c.id_categoria = p.id_categoria
JOIN tienda    t ON t.id_tienda = i.id_tienda
WHERE i.stock_total <= i.stock_minimo;

-- Catálogo con stock disponible -------------------------------------------
CREATE OR REPLACE VIEW v_catalogo AS
SELECT p.sku, p.nombre, p.marca, c.nombre AS categoria, p.precio,
       p.ubicacion, p.imagen_url,
       i.stock_gondola, i.stock_almacen, i.disponible
FROM producto p
JOIN categoria c ON c.id_categoria = p.id_categoria
LEFT JOIN inventario i ON i.sku = p.sku AND i.id_tienda = 1
WHERE p.activo = 1;
