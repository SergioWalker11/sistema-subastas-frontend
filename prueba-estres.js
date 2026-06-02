// ============================================================================
// PRUEBA DE ESTRÉS GENERAL — Sistema de Subastas en Línea
// ============================================================================
// Herramienta: k6 (Grafana k6)
// Objetivo: Evaluar el comportamiento del backend bajo carga general simultánea
// Backend: http://localhost:5221
//
// EJECUCIÓN:
//   k6 run prueba-estres.js
//
// REQUISITOS:
//   - Backend corriendo en puerto 5221
//   - Datos semilla cargados (SembradorDatos.cs)
//
// USUARIOS DE PRUEBA (del sembrador de datos):
//   - admin@gmail.com / 123456 (rol: administrador)
//   - vendedor@gmail.com / 123456 (rol: vendedor)
//   - comprador@gmail.com / 123456 (rol: comprador)
// ============================================================================

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ─── Configuración ───────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:5221/api';

// Métricas personalizadas
const tasaErrores = new Rate('tasa_errores');
const tiempoPujas = new Trend('tiempo_pujas');
const tiempoPagos = new Trend('tiempo_pagos');
const tiempoListas = new Trend('tiempo_listas');

// ─── Escenarios de Carga ─────────────────────────────────────────────────────
// Ramp-up progresivo: sube la carga gradualmente hasta el punto de estrés

export const options = {
  scenarios: {
    // Escenario 1: Carga General (todos los usuarios)
    carga_general: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },   // Calentamiento: 10 VUs
        { duration: '1m', target: 30 },    // Carga normal: 30 VUs
        { duration: '1m', target: 50 },    // Carga alta: 50 VUs
        { duration: '1m', target: 100 },   // Estrés: 100 VUs
        { duration: '30s', target: 150 },  // Estrés máximo: 150 VUs
        { duration: '30s', target: 0 },    // Enfriamiento: bajar a 0
      ],
      gracefulRampDown: '10s',
    },
  },

  // Umbrales de rendimiento (PASS/FAIL)
  thresholds: {
    http_req_duration: ['p(95)<3000'],        // 95% de requests < 3 segundos
    http_req_failed: ['rate<0.30'],           // Menos del 30% de errores
    tasa_errores: ['rate<0.30'],              // Tasa de errores personalizada
    tiempo_pujas: ['p(95)<5000'],             // Pujas: 95% < 5 segundos
    tiempo_pagos: ['p(95)<5000'],             // Pagos: 95% < 5 segundos
    tiempo_listas: ['p(95)<2000'],            // Listados: 95% < 2 segundos
  },
};

// ─── Funciones de Autenticación ──────────────────────────────────────────────

function login(correo, password) {
  const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    correo: correo,
    password: password,
  }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'POST /auth/login' },
  });

  const exito = check(res, {
    'login exitoso': (r) => r.status === 200,
    'token recibido': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.exito === true && body.datos && body.datos.token;
      } catch { return false; }
    },
  });

  tasaErrores.add(!exito);

  if (exito) {
    const body = JSON.parse(res.body);
    return {
      token: body.datos.token,
      usuarioId: body.datos.usuarioId,
      nombre: body.datos.nombre,
      rol: body.datos.rol,
    };
  }
  return null;
}

function authHeaders(token) {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
}

// ─── Operaciones del Sistema ─────────────────────────────────────────────────

function listarSubastas() {
  const res = http.get(`${BASE_URL}/subastas`, {
    tags: { name: 'GET /subastas' },
  });
  const exito = check(res, {
    'listar subastas OK': (r) => r.status === 200,
  });
  tiempoListas.add(res.timings.duration);
  tasaErrores.add(!exito);
  return res;
}

function verDetalleSubasta(id) {
  const res = http.get(`${BASE_URL}/subastas/${id}`, {
    tags: { name: 'GET /subastas/:id' },
  });
  const exito = check(res, {
    'detalle subasta OK': (r) => r.status === 200,
  });
  tasaErrores.add(!exito);
  return res;
}

function obtenerCategorias() {
  const res = http.get(`${BASE_URL}/productos/categorias`, {
    tags: { name: 'GET /productos/categorias' },
  });
  const exito = check(res, {
    'categorias OK': (r) => r.status === 200,
  });
  tasaErrores.add(!exito);
  return res;
}

function obtenerNotificaciones(token, usuarioId) {
  const res = http.get(`${BASE_URL}/notificaciones/usuario/${usuarioId}`,
    authHeaders(token)
  );
  const exito = check(res, {
    'notificaciones OK': (r) => r.status === 200,
  });
  tasaErrores.add(!exito);
  return res;
}

function contarNoLeidas(token, usuarioId) {
  const res = http.get(`${BASE_URL}/notificaciones/usuario/${usuarioId}/no-leidas`,
    authHeaders(token)
  );
  const exito = check(res, {
    'conteo no leidas OK': (r) => r.status === 200,
  });
  tasaErrores.add(!exito);
  return res;
}

function obtenerPerfil(token, usuarioId) {
  const res = http.get(`${BASE_URL}/usuarios/${usuarioId}`,
    authHeaders(token)
  );
  const exito = check(res, {
    'perfil OK': (r) => r.status === 200,
  });
  tasaErrores.add(!exito);
  return res;
}

function obtenerPagos(token, usuarioId) {
  const res = http.get(`${BASE_URL}/pagos/usuario/${usuarioId}`,
    authHeaders(token)
  );
  const exito = check(res, {
    'pagos OK': (r) => r.status === 200,
  });
  tasaErrores.add(!exito);
  return res;
}

function obtenerSubastasVendedor(token, usuarioId) {
  const res = http.get(`${BASE_URL}/subastas/vendedor/${usuarioId}`,
    authHeaders(token)
  );
  const exito = check(res, {
    'subastas vendedor OK': (r) => r.status === 200,
  });
  tasaErrores.add(!exito);
  return res;
}

function obtenerSubastasGanadas(token, usuarioId) {
  const res = http.get(`${BASE_URL}/subastas/ganadas/${usuarioId}`,
    authHeaders(token)
  );
  const exito = check(res, {
    'subastas ganadas OK': (r) => r.status === 200,
  });
  tasaErrores.add(!exito);
  return res;
}

function registrarPuja(token, subastaId, monto, usuarioId) {
  const res = http.post(`${BASE_URL}/pujas`, JSON.stringify({
    subastaId: subastaId,
    usuarioId: usuarioId,
    monto: monto,
  }), {
    ...authHeaders(token),
    tags: { name: 'POST /pujas' },
  });

  const exito = check(res, {
    'puja registrada o validada': (r) => r.status === 200 || r.status === 400,
  });
  tiempoPujas.add(res.timings.duration);
  tasaErrores.add(res.status >= 500);
  return res;
}

function obtenerProductos() {
  const res = http.get(`${BASE_URL}/productos`, {
    tags: { name: 'GET /productos' },
  });
  const exito = check(res, {
    'productos OK': (r) => r.status === 200,
  });
  tasaErrores.add(!exito);
  return res;
}

// ─── Función Principal del VU ────────────────────────────────────────────────

export default function () {
  // Cada VU elige aleatoriamente un rol para simular tráfico real
  const roles = ['comprador', 'vendedor', 'admin'];
  const rolElegido = roles[Math.floor(Math.random() * roles.length)];

  let correo, password;
  switch (rolElegido) {
    case 'admin':
      correo = 'admin@gmail.com';
      password = '123456';
      break;
    case 'vendedor':
      correo = 'vendedor@gmail.com';
      password = '123456';
      break;
    default:
      correo = 'comprador@gmail.com';
      password = '123456';
  }

  // ── Paso 1: Login ──
  group('1. Autenticación', () => {
    const user = login(correo, password);
    if (!user) {
      sleep(1);
      return;
    }

    sleep(Math.random() * 1 + 0.5); // Pausa aleatoria 0.5-1.5s

    // ── Paso 2: Navegación general ──
    group('2. Navegación', () => {
      listarSubastas();
      sleep(Math.random() * 1 + 0.5);

      obtenerCategorias();
      sleep(Math.random() * 0.5 + 0.3);

      obtenerProductos();
      sleep(Math.random() * 0.5 + 0.3);
    });

    // ── Paso 3: Ver detalle de subasta (ID aleatorio 1-10) ──
    group('3. Detalle Subasta', () => {
      const subastaId = Math.floor(Math.random() * 10) + 1;
      verDetalleSubasta(subastaId);
      sleep(Math.random() * 1 + 0.5);
    });

    // ── Paso 4: Operaciones por rol ──
    group('4. Operaciones por Rol', () => {
      if (rolElegido === 'comprador') {
        // Comprador: ve notificaciones, intenta pujar, ve ganadas y pagos
        obtenerNotificaciones(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.2);

        contarNoLeidas(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.2);

        // Intentar puja con monto aleatorio (puede fallar por validaciones, es esperado)
        const subastaId = Math.floor(Math.random() * 10) + 1;
        const montoPuja = Math.floor(Math.random() * 500) + 100;
        registrarPuja(user.token, subastaId, montoPuja, user.usuarioId);
        sleep(Math.random() * 1 + 0.5);

        obtenerSubastasGanadas(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.2);

        obtenerPagos(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.2);

      } else if (rolElegido === 'vendedor') {
        // Vendedor: ve sus subastas, notificaciones, perfil
        obtenerSubastasVendedor(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.3);

        obtenerNotificaciones(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.2);

        obtenerPerfil(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.2);

      } else {
        // Admin: ve notificaciones, perfil, subastas ganadas
        obtenerNotificaciones(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.2);

        obtenerPerfil(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.2);

        obtenerSubastasGanadas(user.token, user.usuarioId);
        sleep(Math.random() * 0.5 + 0.2);
      }
    });
  });

  // Pausa entre iteraciones (simula tiempo de lectura del usuario)
  sleep(Math.random() * 2 + 1);
}

// ─── Hooks de Ciclo de Vida ──────────────────────────────────────────────────

export function setup() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  PRUEBA DE ESTRÉS GENERAL — Sistema de Subastas en Línea');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Backend: ' + BASE_URL);
  console.log('  Duración total estimada: ~4 minutos');
  console.log('  Carga máxima: 150 usuarios virtuales simultáneos');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  // Verificar que el backend está disponible
  const res = http.get(`${BASE_URL}/subastas`, { tags: { name: 'SETUP /subastas' } });
  if (res.status !== 200) {
    console.log('  ⚠ ADVERTENCIA: Backend no responde en ' + BASE_URL);
    console.log('  ⚠ Status: ' + res.status);
    console.log('  ⚠ Asegúrate de que el backend esté corriendo antes de ejecutar.');
  } else {
    console.log('  ✓ Backend conectado exitosamente');
  }
  console.log('');
  return { inicio: new Date().toISOString() };
}

export function teardown(data) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  PRUEBA COMPLETADA');
  console.log('  Inicio: ' + data.inicio);
  console.log('  Fin: ' + new Date().toISOString());
  console.log('═══════════════════════════════════════════════════════════');
}

// ─── Reporte HTML (comando separado) ─────────────────────────────────────────
// Después de ejecutar, genera el reporte:
//   k6 run --out json=resultado.json prueba-estres.js
//
// O con resumen en consola (por defecto):
//   k6 run prueba-estres.js
