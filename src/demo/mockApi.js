/*
 * API simulada para el MODO DEMO.
 *
 * Reemplaza el adapter de axios para que la app funcione sin el backend NestJS.
 * Los datos viven en localStorage, así que cada visitante tiene su propia copia
 * y los cambios (crear/editar/eliminar) se mantienen al recargar.
 *
 * Para volver a los datos iniciales: botón "Restablecer datos demo" en el login
 * o ejecutar `window.resetDemoData()` en la consola.
 */
import { AxiosError } from 'axios';

const STORAGE_KEY = 'central-requerimientos-demo-db-v1';
const LATENCY_MS = 150;

export const DEMO_USERS = [
  { email: 'admin@demo.cl', password: 'demo123', rol: 'Administrador' },
  { email: 'gestor@demo.cl', password: 'demo123', rol: 'Gestor' },
  { email: 'colaborador@demo.cl', password: 'demo123', rol: 'Colaborador' },
];

// ---------------------------------------------------------------------------
// Datos iniciales
// ---------------------------------------------------------------------------
const daysAgo = (d, h = 0) =>
  new Date(Date.now() - d * 86400000 - h * 3600000).toISOString();

function seed() {
  const paises = [
    { id: 1, nombre: 'Chile' },
    { id: 2, nombre: 'Perú' },
    { id: 3, nombre: 'Argentina' },
    { id: 4, nombre: 'Colombia' },
  ];

  const cuentas = [
    {
      id: 1,
      nombre: 'Grupo Andes Demo',
      email: 'contacto@andesdemo.cl',
      telefono: '+56 2 2345 6789',
      direccion: 'Av. Apoquindo 4500, Las Condes',
      paisId: 1,
      estado: true,
    },
    {
      id: 2,
      nombre: 'Cuenta Pacífico',
      email: 'info@pacifico.pe',
      telefono: '+51 1 555 0101',
      direccion: 'Av. Larco 1200, Miraflores',
      paisId: 2,
      estado: true,
    },
  ];

  const empresas = [
    {
      id: 1,
      nombre: 'Logística Andes SpA',
      razon_social: 'Logística Andes SpA',
      email: 'ti@logisticaandes.cl',
      telefono: '+56 2 2345 6000',
      direccion: 'Camino a Melipilla 9000, Maipú',
      paisId: 1,
      cuentaId: 1,
      estado: true,
    },
    {
      id: 2,
      nombre: 'Transportes Cordillera',
      razon_social: 'Transportes Cordillera Ltda.',
      email: 'soporte@cordillera.cl',
      telefono: '+56 2 2777 1200',
      direccion: 'Av. Américo Vespucio 1500, Pudahuel',
      paisId: 1,
      cuentaId: 1,
      estado: true,
    },
    {
      id: 3,
      nombre: 'Distribuidora Pacífico',
      razon_social: 'Distribuidora Pacífico SAC',
      email: 'ti@pacifico.pe',
      telefono: '+51 1 555 0202',
      direccion: 'Av. Argentina 3000, Callao',
      paisId: 2,
      cuentaId: 2,
      estado: true,
    },
  ];

  const areas = [
    { id: 1, nombre: 'Tecnología (TI)', prefijo: 'TI', descripcion: 'Soporte, sistemas e infraestructura', empresaId: 1, estado: true },
    { id: 2, nombre: 'Operaciones', prefijo: 'OPE', descripcion: 'Bodega, despacho y transporte', empresaId: 1, estado: true },
    { id: 3, nombre: 'Recursos Humanos', prefijo: 'RRHH', descripcion: 'Personas y remuneraciones', empresaId: 1, estado: true },
    { id: 4, nombre: 'Mantención de Flota', prefijo: 'MAN', descripcion: 'Mantención de camiones', empresaId: 2, estado: true },
    { id: 5, nombre: 'Soporte TI', prefijo: 'STI', descripcion: 'Mesa de ayuda', empresaId: 3, estado: true },
  ];

  const centros = [
    { id: 1, nombre: 'CD Maipú', direccion: 'Camino a Melipilla 9000', email: 'cdmaipu@logisticaandes.cl', telefono: '+56 2 2345 6001', estado: true, cuentaEmpresaId: 1, cuentaId: 1, paisId: 1 },
    { id: 2, nombre: 'CD Quilicura', direccion: 'Av. Lo Echevers 550', email: 'cdquilicura@logisticaandes.cl', telefono: '+56 2 2345 6002', estado: true, cuentaEmpresaId: 1, cuentaId: 1, paisId: 1 },
    { id: 3, nombre: 'Casa Matriz', direccion: 'Av. Apoquindo 4500', email: 'matriz@logisticaandes.cl', telefono: '+56 2 2345 6003', estado: true, cuentaEmpresaId: 1, cuentaId: 1, paisId: 1 },
    { id: 4, nombre: 'Taller Pudahuel', direccion: 'Av. Américo Vespucio 1500', email: 'taller@cordillera.cl', telefono: '+56 2 2777 1201', estado: true, cuentaEmpresaId: 2, cuentaId: 1, paisId: 1 },
    { id: 5, nombre: 'Almacén Callao', direccion: 'Av. Argentina 3000', email: 'callao@pacifico.pe', telefono: '+51 1 555 0203', estado: true, cuentaEmpresaId: 3, cuentaId: 2, paisId: 2 },
  ];

  const categorias = [
    { id: 1, nombre: 'Hardware', descripcion: 'Equipos, impresoras, periféricos', areaId: 1, estado: true },
    { id: 2, nombre: 'Software', descripcion: 'Instalación y errores de aplicaciones', areaId: 1, estado: true },
    { id: 3, nombre: 'Accesos y cuentas', descripcion: 'Usuarios, contraseñas, permisos', areaId: 1, estado: true },
    { id: 4, nombre: 'Redes', descripcion: 'Internet, WiFi, VPN', areaId: 1, estado: true },
    { id: 5, nombre: 'Despacho', descripcion: 'Problemas en despachos', areaId: 2, estado: true },
    { id: 6, nombre: 'Inventario', descripcion: 'Diferencias de stock', areaId: 2, estado: true },
    { id: 7, nombre: 'Remuneraciones', descripcion: 'Liquidaciones y bonos', areaId: 3, estado: true },
    { id: 8, nombre: 'Vacaciones', descripcion: 'Solicitudes de vacaciones', areaId: 3, estado: true },
    { id: 9, nombre: 'Mantención preventiva', descripcion: 'Pautas de mantención', areaId: 4, estado: true },
    { id: 10, nombre: 'Mesa de ayuda', descripcion: 'Soporte general', areaId: 5, estado: true },
  ];

  const estados = [
    { id: 1, nombre: 'Abierto', codigo: 'ABI', descripcion: 'Ticket abierto', color: 'background-color:#e3f2fd;', empresaId: 1, areaId: null, estado: true },
    { id: 2, nombre: 'En Progreso', codigo: 'PRO', descripcion: 'En trabajo', color: 'background-color:#fff3e0;', empresaId: 1, areaId: null, estado: true },
    { id: 3, nombre: 'Resuelto', codigo: 'RES', descripcion: 'Solución aplicada', color: 'background-color:#e8f5e9;', empresaId: 1, areaId: null, estado: true },
    { id: 4, nombre: 'Cerrado', codigo: 'CER', descripcion: 'Cerrado por el solicitante', color: 'background-color:#eeeeee;', empresaId: 1, areaId: null, estado: true },
    { id: 5, nombre: 'Cancelado', codigo: 'CAN', descripcion: 'Cancelado', color: 'background-color:#ffebee;', empresaId: 1, areaId: null, estado: true },
    { id: 6, nombre: 'Nuevo', codigo: 'NUE', descripcion: 'Recién creado', color: 'background-color:#ede7f6;', empresaId: 1, areaId: null, estado: true },
    { id: 12, nombre: 'Asignado', codigo: 'ASI', descripcion: 'Asignado a un gestor', color: 'background-color:#e0f7fa;', empresaId: 1, areaId: null, estado: true },
  ];

  const perfiles = [
    { id: 1, nombre: 'Administrador', descripcion: 'Acceso total', colaborador: false },
    { id: 2, nombre: 'Gestor', descripcion: 'Gestiona tickets del área', colaborador: true },
    { id: 3, nombre: 'Colaborador', descripcion: 'Crea y sigue sus tickets', colaborador: true },
  ];

  const usuarios = [
    {
      id: 1, nombre: 'Verónica', apellido: 'Urrutia', email: 'admin@demo.cl', password: 'demo123',
      telefono: '+56 9 1111 1111', direccion: 'La Florida, Santiago', cuentaId: 1, empresaId: 1, centroId: 3,
      areaIds: [1, 2, 3], perfilesPorArea: [{ perfilId: 1, areaId: 1 }, { perfilId: 1, areaId: 2 }, { perfilId: 1, areaId: 3 }],
      estado: true, created_at: daysAgo(120),
    },
    {
      id: 2, nombre: 'Matías', apellido: 'Rojas', email: 'gestor@demo.cl', password: 'demo123',
      telefono: '+56 9 2222 2222', direccion: 'Maipú, Santiago', cuentaId: 1, empresaId: 1, centroId: 1,
      areaIds: [1], perfilesPorArea: [{ perfilId: 2, areaId: 1 }],
      estado: true, created_at: daysAgo(90),
    },
    {
      id: 3, nombre: 'Camila', apellido: 'Soto', email: 'colaborador@demo.cl', password: 'demo123',
      telefono: '+56 9 3333 3333', direccion: 'Quilicura, Santiago', cuentaId: 1, empresaId: 1, centroId: 2,
      areaIds: [1, 2], perfilesPorArea: [{ perfilId: 3, areaId: 1 }, { perfilId: 3, areaId: 2 }],
      estado: true, created_at: daysAgo(60),
    },
    {
      id: 4, nombre: 'Diego', apellido: 'Fuentes', email: 'diego.fuentes@demo.cl', password: 'demo123',
      telefono: '+56 9 4444 4444', direccion: 'Ñuñoa, Santiago', cuentaId: 1, empresaId: 1, centroId: 1,
      areaIds: [1], perfilesPorArea: [{ perfilId: 2, areaId: 1 }],
      estado: true, created_at: daysAgo(45),
    },
    {
      id: 5, nombre: 'Fernanda', apellido: 'Muñoz', email: 'fernanda.munoz@demo.cl', password: 'demo123',
      telefono: '+56 9 5555 5555', direccion: 'Providencia, Santiago', cuentaId: 1, empresaId: 1, centroId: 3,
      areaIds: [3], perfilesPorArea: [{ perfilId: 3, areaId: 3 }],
      estado: true, created_at: daysAgo(30),
    },
  ];

  const t = (id, titulo, descripcion, areaId, categoriaId, centroId, estadoId, usuarioId, gestionador, prioridad, d) => ({
    id, titulo, descripcion, codigo: `${areas.find((a) => a.id === areaId).prefijo}-${String(id).padStart(4, '0')}`,
    areaId, categoriaId, centroId, estadoId, usuarioId, gestionador, prioridad,
    fechaCreacion: daysAgo(d, 3), fechaActualizacion: daysAgo(Math.max(d - 1, 0)),
  });

  const tickets = [
    t(1, 'Impresora de despacho no imprime etiquetas', 'La impresora Zebra del andén 3 no imprime desde ayer.', 1, 1, 1, 2, 3, 2, 'Alta', 6),
    t(2, 'Crear usuario para nuevo operario', 'Ingresa Juan Pérez el lunes, necesita acceso al WMS.', 1, 3, 2, 12, 3, 4, 'Media', 5),
    t(3, 'VPN se desconecta constantemente', 'Al trabajar remoto la VPN se cae cada 10 minutos.', 1, 4, 3, 6, 5, 2, 'Alta', 1),
    t(4, 'Error al abrir Excel con macros', 'Aparece error de seguridad al abrir planilla de inventario.', 1, 2, 2, 3, 3, 4, 'Baja', 12),
    t(5, 'Notebook muy lento', 'El equipo tarda más de 5 minutos en encender.', 1, 1, 3, 1, 1, null, 'Media', 3),
    t(6, 'Cambio de contraseña de correo', 'Olvidé mi contraseña de Outlook.', 1, 3, 1, 4, 3, 2, 'Baja', 20),
    t(7, 'Sin internet en bodega 2', 'Los handhelds no se conectan al WiFi en bodega 2.', 1, 4, 1, 2, 2, 4, 'Crítica', 2),
    t(8, 'Diferencia de stock SKU 10045', 'Sistema indica 120 unidades, conteo físico 98.', 2, 6, 2, 6, 3, null, 'Alta', 1),
    t(9, 'Despacho atrasado a cliente Norte', 'Camión no salió por falta de documentos.', 2, 5, 1, 2, 1, 1, 'Crítica', 4),
    t(10, 'Error en liquidación de octubre', 'No se pagaron las horas extra.', 3, 7, 3, 1, 5, 1, 'Media', 8),
    t(11, 'Solicitud de vacaciones diciembre', 'Solicito 10 días desde el 15 de diciembre.', 3, 8, 3, 3, 5, 1, 'Baja', 15),
    t(12, 'Instalar software de rutas', 'Instalar Routing Pro en 3 equipos de planificación.', 1, 2, 3, 6, 1, null, 'Media', 0),
  ];

  const menu1 = [
    { id: 1, nombre: 'Inicio', descripcion: 'Página principal', icon: 'home', ruta: '/', estado: true, orden: 1 },
    { id: 2, nombre: 'Requerimientos', descripcion: 'Gestión de tickets', icon: 'confirmation_number', ruta: null, estado: true, orden: 2 },
    { id: 3, nombre: 'Administración', descripcion: 'Mantenedores del sistema', icon: 'admin_panel_settings', ruta: null, estado: true, orden: 3 },
    { id: 4, nombre: 'Seguridad', descripcion: 'Menús y permisos', icon: 'security', ruta: null, estado: true, orden: 4 },
  ];

  const menu2 = [
    { id: 1, menu1Id: 2, nombre: 'Mis tickets', descripcion: 'Crear y ver mis tickets', caption: 'Requerimientos', ruta: '/tickets', icon: 'local_activity', estado: true },
    { id: 2, menu1Id: 2, nombre: 'Gestionar tickets', descripcion: 'Tickets del área', caption: 'Requerimientos', ruta: '/admintickets', icon: 'engineering', estado: true },
    { id: 3, menu1Id: 3, nombre: 'Cuentas', descripcion: 'Mantenedor', caption: 'Mantenedor', ruta: '/cuentas', icon: 'account_circle', estado: true },
    { id: 4, menu1Id: 3, nombre: 'Empresas', descripcion: 'Mantenedor', caption: 'Mantenedor', ruta: '/empresas', icon: 'domain', estado: true },
    { id: 5, menu1Id: 3, nombre: 'Áreas', descripcion: 'Mantenedor', caption: 'Mantenedor', ruta: '/areas', icon: 'badge', estado: true },
    { id: 6, menu1Id: 3, nombre: 'Usuarios', descripcion: 'Mantenedor', caption: 'Mantenedor', ruta: '/usuarios', icon: 'group', estado: true },
    { id: 7, menu1Id: 3, nombre: 'Centros', descripcion: 'Mantenedor', caption: 'Mantenedor', ruta: '/centros', icon: 'warehouse', estado: true },
    { id: 8, menu1Id: 3, nombre: 'Categorías', descripcion: 'Mantenedor', caption: 'Mantenedor', ruta: '/categorias', icon: 'category', estado: true },
    { id: 9, menu1Id: 3, nombre: 'Estados', descripcion: 'Mantenedor', caption: 'Mantenedor', ruta: '/estados', icon: 'change_circle', estado: true },
    { id: 10, menu1Id: 4, nombre: 'Menús', descripcion: 'Módulos y submenús', caption: 'Seguridad', ruta: '/menus', icon: 'menu_open', estado: true },
    { id: 11, menu1Id: 4, nombre: 'Permisos', descripcion: 'Permisos por perfil', caption: 'Seguridad', ruta: '/permisos', icon: 'lock_person', estado: true },
  ];

  // Permisos por perfil: Admin todo; Gestor sin Administración/Seguridad; Colaborador solo "Mis tickets"
  const permisos = [];
  let pid = 1;
  const permitido = {
    1: () => true,
    2: (m1, m2) => m1.id <= 2 && (!m2 || m2.menu1Id === 2),
    3: (m1, m2) => m1.id <= 2 && (!m2 || m2.id === 1),
  };
  for (const p of perfiles) {
    for (const m1 of menu1) {
      permisos.push({ id: pid++, perfilId: p.id, menu1Id: m1.id, menu2Id: null, habilitado: permitido[p.id](m1, null) });
      for (const m2 of menu2.filter((x) => x.menu1Id === m1.id)) {
        permisos.push({ id: pid++, perfilId: p.id, menu1Id: m1.id, menu2Id: m2.id, habilitado: permitido[p.id](m1, m2) });
      }
    }
  }

  return { paises, cuentas, empresas, areas, centros, categorias, estados, perfiles, usuarios, tickets, menu1, menu2, permisos };
}

// ---------------------------------------------------------------------------
// Persistencia
// ---------------------------------------------------------------------------
let db = null;

function load() {
  if (db) return db;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    db = raw ? JSON.parse(raw) : seed();
  } catch (e) {
    db = seed();
  }
  return db;
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    /* almacenamiento no disponible: se mantiene en memoria */
  }
}

export function resetDemoData() {
  db = seed();
  save();
}

if (typeof window !== 'undefined') {
  window.resetDemoData = resetDemoData;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const now = () => new Date().toISOString();
const num = (v) => (v === null || v === undefined || v === '' ? v : Number(v));
const nextId = (rows) => rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
const byId = (table, id) => load()[table].find((r) => r.id === num(id));
const clone = (o) => JSON.parse(JSON.stringify(o));

function publicUser(u) {
  if (!u) return null;
  // eslint-disable-next-line no-unused-vars
  const { password, ...rest } = u;
  return rest;
}

function makeToken(user) {
  const enc = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  return `${enc({ alg: 'none', typ: 'JWT' })}.${enc({ sub: user.id, email: user.email, exp, demo: true })}.demo`;
}

// Expande relaciones (xxxId -> xxx) igual que haría el backend con TypeORM
function expand(table, row) {
  if (!row) return row;
  const r = clone(row);
  switch (table) {
    case 'cuentas':
      r.pais = byId('paises', r.paisId) || null;
      break;
    case 'empresas':
      r.pais = byId('paises', r.paisId) || null;
      r.cuenta = byId('cuentas', r.cuentaId) || null;
      break;
    case 'areas':
      r.empresa = byId('empresas', r.empresaId) || null;
      break;
    case 'centros':
      r.pais = byId('paises', r.paisId) || null;
      r.cuentaEmpresa = byId('empresas', r.cuentaEmpresaId) || null;
      r.cuenta = byId('cuentas', r.cuentaId) || null;
      break;
    case 'categorias':
      r.area = byId('areas', r.areaId) || null;
      break;
    case 'estados':
      r.empresa = byId('empresas', r.empresaId) || null;
      r.area = byId('areas', r.areaId) || null;
      break;
    case 'usuarios': {
      const u = publicUser(r);
      u.cuenta = byId('cuentas', u.cuentaId) || null;
      u.empresa = byId('empresas', u.empresaId) || null;
      u.centro = byId('centros', u.centroId) || null;
      u.areas = (u.areaIds || []).map((id) => byId('areas', id)).filter(Boolean);
      return u;
    }
    case 'tickets':
      r.area = byId('areas', r.areaId) || null;
      r.categoria = byId('categorias', r.categoriaId) || null;
      r.centro = byId('centros', r.centroId) || null;
      r.estado = byId('estados', r.estadoId) || null;
      r.usuario = publicUser(byId('usuarios', r.usuarioId));
      r.usuariosGestion = publicUser(byId('usuarios', r.gestionador));
      r.created_at = r.fechaCreacion;
      r.updated_at = r.fechaActualizacion;
      break;
    default:
      break;
  }
  return r;
}

const list = (table, filter = () => true) =>
  load()[table].filter(filter).map((r) => expand(table, r));

function ticketStats(tickets) {
  const pendientes = tickets.filter((t) => [1, 6, 12].includes(t.estadoId)).length;
  const enProceso = tickets.filter((t) => t.estadoId === 2).length;
  const resueltos = tickets.filter((t) => [3, 4].includes(t.estadoId)).length;
  return {
    total: tickets.length,
    pendientes,
    enProceso,
    resueltos,
    porcentajeSatisfaccion: 92,
    tiempoPromedio: '18h',
  };
}

const sortDesc = (rows) => rows.sort((a, b) => b.id - a.id);

// Tabla genérica por recurso de la URL
const RESOURCE_TABLE = {
  cuenta: 'cuentas',
  empresa: 'empresas',
  empresas: 'empresas',
  area: 'areas',
  areas: 'areas',
  centro: 'centros',
  categoria: 'categorias',
  estados: 'estados',
  usuario: 'usuarios',
  users: 'usuarios',
  ticket: 'tickets',
  pais: 'paises',
  perfil: 'perfiles',
  'menu-nivel1': 'menu1',
  'menu-nivel2': 'menu2',
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Rutas especiales
// ---------------------------------------------------------------------------
function login(body) {
  const d = load();
  const email = String(body?.email || '').trim().toLowerCase();
  const user = d.usuarios.find((u) => u.email.toLowerCase() === email);
  if (!user || user.password !== body?.password) {
    throw new HttpError(401, 'Correo o contraseña incorrectos');
  }
  if (user.estado === false) throw new HttpError(401, 'Usuario deshabilitado');
  const token = makeToken(user);
  return {
    token,
    access_token: token,
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    cuentaId: user.cuentaId,
    empresaId: body?.empresaId ?? user.empresaId,
    areaId: user.areaIds?.[0] ?? null,
    perfilesPorArea: user.perfilesPorArea,
  };
}

function permisosArbol(perfilId, soloHabilitados) {
  const d = load();
  const perms = d.permisos.filter((p) => p.perfilId === num(perfilId));
  const m1s = [...d.menu1].sort((a, b) => (a.orden || a.id) - (b.orden || b.id));
  const out = [];
  for (const m1 of m1s) {
    const p1 = perms.find((p) => p.menu1Id === m1.id && !p.menu2Id);
    if (soloHabilitados && (!m1.estado || !p1?.habilitado)) continue;
    const nivel2 = d.menu2
      .filter((m2) => m2.menu1Id === m1.id)
      .map((m2) => {
        const p2 = perms.find((p) => p.menu2Id === m2.id);
        return { ...m2, idPermiso: p2?.id, habilitado: !!p2?.habilitado };
      })
      .filter((m2) => !soloHabilitados || (m2.estado && m2.habilitado));
    out.push({
      ...m1,
      icono: m1.icon,
      active: true,
      idPermiso: p1?.id,
      habilitado: !!p1?.habilitado,
      nivel2,
    });
  }
  return out;
}

function ensurePermisos(kind, item) {
  // Al crear un menú, se crea su permiso (habilitado solo para Administrador)
  const d = load();
  for (const p of d.perfiles) {
    d.permisos.push({
      id: nextId(d.permisos),
      perfilId: p.id,
      menu1Id: kind === 'menu1' ? item.id : item.menu1Id,
      menu2Id: kind === 'menu2' ? item.id : null,
      habilitado: p.id === 1,
    });
  }
}

function handle(method, path, body, query) {
  const d = load();
  const seg = path.split('/').filter(Boolean);
  const [res, a, b, c, e] = seg;
  const M = method.toUpperCase();

  // ----- AUTH -----
  if (res === 'auth') {
    if (M === 'POST' && (!a || a === 'login' || a === 'login-empresa')) return login(body);
    if (M === 'POST' && a === 'register') {
      if (d.usuarios.some((u) => u.email.toLowerCase() === String(body.email).toLowerCase())) {
        throw new HttpError(400, 'El correo ya está registrado');
      }
      const u = {
        id: nextId(d.usuarios), nombre: body.nombre, apellido: body.apellido, email: body.email,
        password: body.password, cuentaId: 1, empresaId: 1, centroId: null, areaIds: [1],
        perfilesPorArea: [{ perfilId: 3, areaId: 1 }], estado: true, created_at: now(),
      };
      d.usuarios.push(u);
      save();
      return login({ email: u.email, password: u.password });
    }
    if (M === 'GET' && a === 'check-status') return { token: makeToken(d.usuarios[0]) };
    if (M === 'GET' && a === 'private') return { ok: true };
  }

  // ----- PERFIL -----
  if (res === 'perfil' && M === 'GET') {
    if (a === 'colaborador') return clone(d.perfiles.filter((p) => p.colaborador));
    if (a) return clone(byId('perfiles', a));
    return clone(d.perfiles);
  }

  // ----- PERMISOS -----
  if (res === 'permisos') {
    if (M === 'GET' && a === 'perfilactivo') return permisosArbol(b, true);
    if (M === 'GET' && a === 'perfil') return permisosArbol(b, false);
    if (M === 'PATCH' && a) {
      const p = d.permisos.find((x) => x.id === num(a));
      if (!p) throw new HttpError(404, 'Permiso no encontrado');
      p.habilitado = !!body.habilitado;
      // deshabilitar un módulo deshabilita sus submenús
      if (!p.menu2Id && !p.habilitado) {
        d.permisos
          .filter((x) => x.perfilId === p.perfilId && x.menu1Id === p.menu1Id && x.menu2Id)
          .forEach((x) => (x.habilitado = false));
      }
      save();
      return p;
    }
    if (M === 'GET') return clone(d.permisos);
  }

  // ----- MENÚS -----
  if (res === 'menu-nivel2' && M === 'GET' && a === 'bymenu1') {
    return clone(d.menu2.filter((m) => m.menu1Id === num(b)));
  }

  // ----- EMPRESA -----
  if (res === 'empresa' && M === 'GET' && a === 'cuenta') {
    return list('empresas', (x) => x.cuentaId === num(b));
  }

  // ----- AREA -----
  if (res === 'area' && M === 'GET') {
    if (a === 'empresa') return list('areas', (x) => x.empresaId === num(b));
    if (a === 'usuario') {
      const u = byId('usuarios', b);
      return list('areas', (x) => (u?.areaIds || []).includes(x.id));
    }
  }

  // ----- CENTRO -----
  if (res === 'centro' && M === 'GET') {
    if (a === 'empresa') return list('centros', (x) => x.cuentaEmpresaId === num(b));
    if (a === 'cuenta') return list('centros', (x) => x.cuentaId === num(b));
  }

  // ----- CATEGORIA -----
  if (res === 'categoria' && M === 'GET' && a === 'area') {
    return list('categorias', (x) => x.areaId === num(b));
  }

  // ----- ESTADOS -----
  if (res === 'estados' && M === 'GET' && a === 'empresa') {
    return list('estados', (x) => x.estado !== false && (!c || !x.areaId || x.areaId === num(e)));
  }

  // ----- USUARIO -----
  if (res === 'usuario') {
    if (M === 'GET' && a === 'area') {
      return list('usuarios', (u) => (u.areaIds || []).includes(num(b)));
    }
    if (M === 'GET' && a === 'no-in-area') {
      return list('usuarios', (u) => !(u.areaIds || []).includes(num(b)) && (!c || u.empresaId === num(c)));
    }
    if (a && b === 'perfil-en-area' && M === 'GET') {
      const u = byId('usuarios', a);
      const pa = u?.perfilesPorArea?.find((x) => x.areaId === num(c));
      return pa ? pa.perfilId : 3;
    }
    if (a && b === 'estadisticas' && M === 'GET') {
      const u = byId('usuarios', a);
      const mine = d.tickets.filter((t) => t.usuarioId === num(a));
      const st = ticketStats(mine);
      return {
        totalTickets: st.total,
        ticketsPendientes: st.pendientes + st.enProceso,
        ticketsResueltos: st.resueltos,
        diasActivo: u?.created_at ? Math.ceil((Date.now() - new Date(u.created_at)) / 86400000) : 1,
      };
    }
    if (a && b === 'areas') {
      const u = byId('usuarios', a);
      if (!u) throw new HttpError(404, 'Usuario no encontrado');
      const ids = (body?.areaIds || []).map(Number);
      if (M === 'POST') u.areaIds = [...new Set([...(u.areaIds || []), ...ids])];
      if (M === 'DELETE') u.areaIds = (u.areaIds || []).filter((x) => !ids.includes(x));
      save();
      return { estado: 'OK', data: publicUser(u) };
    }
    if (a && b === 'perfil-area') {
      const u = byId('usuarios', a);
      if (!u) throw new HttpError(404, 'Usuario no encontrado');
      if (M === 'POST') {
        u.perfilesPorArea = (u.perfilesPorArea || []).filter((x) => x.areaId !== num(body.areaId));
        u.perfilesPorArea.push({ perfilId: num(body.perfilId), areaId: num(body.areaId) });
      }
      if (M === 'DELETE') u.perfilesPorArea = (u.perfilesPorArea || []).filter((x) => x.areaId !== num(c));
      save();
      return { estado: 'OK' };
    }
    if (a && b === 'cambiar-perfil-area' && M === 'PATCH') {
      const u = byId('usuarios', a);
      const pa = u?.perfilesPorArea?.find((x) => x.areaId === num(body.areaId));
      if (pa) pa.perfilId = num(body.perfilId);
      save();
      return { estado: 'OK' };
    }
  }

  // ----- TICKET -----
  if (res === 'ticket' && M === 'GET') {
    if (a === 'estadisticas') return ticketStats(d.tickets);
    if (a === 'area' && b === 'estadisticas') return ticketStats(d.tickets.filter((t) => t.areaId === num(c)));
    if (a === 'area' && b === 'categorias' && c === 'dashboard') {
      const ts = d.tickets.filter((t) => t.areaId === num(e));
      const counts = {};
      ts.forEach((t) => {
        const nombre = byId('categorias', t.categoriaId)?.nombre || 'Sin categoría';
        counts[nombre] = (counts[nombre] || 0) + 1;
      });
      return Object.entries(counts).map(([categoriaNombre, count]) => ({ categoriaNombre, count }));
    }
    if (a === 'area') return sortDesc(list('tickets', (t) => t.areaId === num(b)));
    if (a === 'usuario') {
      const rows = sortDesc(list('tickets', (t) => t.usuarioId === num(b)));
      if (c === 'recientes') {
        const lim = Number(query.get('limit') || 3);
        return rows.sort((x, y) => new Date(y.fechaActualizacion) - new Date(x.fechaActualizacion)).slice(0, lim);
      }
      return rows;
    }
  }

  // ----- CRUD GENÉRICO -----
  const table = RESOURCE_TABLE[res];
  if (!table) throw new HttpError(404, `Ruta no disponible en modo demo: ${M} /${seg.join('/')}`);
  const rows = d[table];

  if (M === 'GET') {
    if (!a) return table === 'tickets' ? sortDesc(list(table)) : list(table);
    const row = byId(table, a);
    if (!row) throw new HttpError(404, 'Registro no encontrado');
    return expand(table, row);
  }

  if (M === 'POST' && !a) {
    const item = { ...body, id: nextId(rows) };
    if (item.estado === undefined || item.estado === null) item.estado = true;
    Object.keys(item).forEach((k) => {
      if (/Id$/.test(k) && item[k] !== null && item[k] !== '' && !Array.isArray(item[k])) item[k] = num(item[k]);
    });
    if (table === 'tickets') {
      item.estadoId = item.estadoId || 6;
      item.prioridad = item.prioridad || 'Media';
      item.gestionador = item.gestionador ?? null;
      item.fechaCreacion = now();
      item.fechaActualizacion = now();
      const pref = byId('areas', item.areaId)?.prefijo || 'TK';
      item.codigo = item.codigo || `${pref}-${String(item.id).padStart(4, '0')}`;
    }
    if (table === 'usuarios') {
      if (rows.some((u) => u.email?.toLowerCase() === String(item.email || '').toLowerCase())) {
        throw new HttpError(400, 'El correo ya está registrado');
      }
      item.areaIds = (item.areaIds || []).map(Number).filter(Boolean);
      item.perfilesPorArea = (item.perfilesPorArea || []).flatMap((p) =>
        (p.areaIds || [p.areaId]).filter(Boolean).map((areaId) => ({ perfilId: num(p.perfilId), areaId: num(areaId) })),
      );
      item.password = item.password || 'demo123';
      item.created_at = now();
    }
    rows.push(item);
    if (table === 'menu1' || table === 'menu2') ensurePermisos(table, item);
    save();
    return expand(table, item);
  }

  if ((M === 'PATCH' || M === 'PUT') && a) {
    const row = byId(table, a);
    if (!row) throw new HttpError(404, 'Registro no encontrado');
    const payload = { ...body };
    delete payload.id;
    Object.keys(payload).forEach((k) => {
      if (/Id$/.test(k) && payload[k] !== null && payload[k] !== '' && !Array.isArray(payload[k])) payload[k] = num(payload[k]);
      // ignorar relaciones expandidas que vengan en el payload
      if (payload[k] && typeof payload[k] === 'object' && !Array.isArray(payload[k])) delete payload[k];
    });
    if (table === 'tickets') {
      if (payload.gestionador !== undefined) payload.gestionador = num(payload.gestionador);
      payload.fechaActualizacion = now();
    }
    if (table === 'usuarios') {
      if (!payload.password) delete payload.password;
      delete payload.areas;
    }
    Object.assign(row, payload);
    save();
    return expand(table, row);
  }

  if (M === 'DELETE' && a) {
    const idx = rows.findIndex((r) => r.id === num(a));
    if (idx === -1) throw new HttpError(404, 'Registro no encontrado');
    const [removed] = rows.splice(idx, 1);
    if (table === 'menu1') {
      d.menu2 = d.menu2.filter((m) => m.menu1Id !== removed.id);
      d.permisos = d.permisos.filter((p) => p.menu1Id !== removed.id);
    }
    if (table === 'menu2') d.permisos = d.permisos.filter((p) => p.menu2Id !== removed.id);
    save();
    return { estado: 'OK', id: removed.id };
  }

  throw new HttpError(404, `Ruta no disponible en modo demo: ${M} /${seg.join('/')}`);
}

// ---------------------------------------------------------------------------
// Adapter de axios
// ---------------------------------------------------------------------------
export function mockAdapter(config) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const url = new URL(config.url || '/', 'http://demo.local/');
      let body = config.data;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (err) {
          /* cuerpo no JSON */
        }
      }
      const method = (config.method || 'get').toUpperCase();
      const response = (status, data) => ({
        data,
        status,
        statusText: status < 300 ? 'OK' : 'Error',
        headers: { 'content-type': 'application/json' },
        config,
        request: {},
      });
      try {
        const data = handle(method, url.pathname, body || {}, url.searchParams);
        resolve(response(method === 'POST' ? 201 : 200, data));
      } catch (err) {
        const status = err.status || 500;
        const res = response(status, { statusCode: status, message: err.message });
        // eslint-disable-next-line no-console
        if (status === 500) console.error('[demo api]', err);
        reject(new AxiosError(err.message, String(status), config, {}, res));
      }
    }, LATENCY_MS);
  });
}
