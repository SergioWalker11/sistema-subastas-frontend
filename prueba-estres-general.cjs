const autocannon = require('autocannon');
const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:5221';

function verificarBackend() {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}/api/subastas`, { timeout: 3000 }, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

const opcionesPrueba = {
  url: `${BASE_URL}/api/subastas`,
  connections: 100,
  duration: 60,
  pipelining: 1,
  timeout: 10,
  headers: { 'Content-Type': 'application/json' },
  requests: [
    { method: 'GET', path: '/api/subastas' },
    { method: 'GET', path: '/api/productos' },
    { method: 'GET', path: '/api/productos/categorias' },
  ],
};

async function ejecutarPrueba() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  PRUEBA DE ESTRÉS — Sistema de Subastas en Línea');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Backend: ${BASE_URL}`);
  console.log(`  Duración: ${opcionesPrueba.duration} segundos`);
  console.log(`  Conexiones concurrentes: ${opcionesPrueba.connections}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  const backendVivo = await verificarBackend();
  if (!backendVivo) {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  ERROR: El backend NO está corriendo en ' + BASE_URL + '       ║');
    console.log('║  Enciéndelo con el botón "http" de Visual Studio y        ║');
    console.log('║  espera a que diga "Now listening on http://localhost:5221"║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    process.exit(1);
  }
  console.log('✓ Backend detectado. Iniciando carga...\n');

  const inicio = new Date();

  const instance = autocannon(opcionesPrueba, (err, results) => {
    if (err) { console.error('Error:', err); process.exit(1); }

    const duracionTotal = (new Date() - inicio) / 1000;
    const errorRate = results.requests.total > 0 ? ((results.errors / results.requests.total) * 100).toFixed(2) : 0;

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  RESULTADOS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  Duración: ${duracionTotal.toFixed(1)}s`);
    console.log(`  Requests totales: ${(results.requests.total || 0).toLocaleString()}`);
    console.log(`  Req/s (promedio): ${(results.requests.average || 0).toFixed(1)}`);
    console.log(`  Req/s (pico): ${(results.requests.max || 0).toFixed(1)}`);
    console.log(`  Éxitos (2xx): ${(results['2xx'] || 0).toLocaleString()}`);
    console.log(`  Errores: ${(results.errors || 0).toLocaleString()} (${errorRate}%)`);
    console.log(`  Timeouts: ${(results.timeouts || 0).toLocaleString()}`);
    if (results.latency) {
      console.log(`  Latencia avg: ${results.latency.average.toFixed(1)} ms`);
      console.log(`  Latencia p50: ${results.latency.p50.toFixed(1)} ms`);
      console.log(`  Latencia p90: ${(results.latency.p90 || 0).toFixed(1)} ms`);
      console.log(`  Latencia p99: ${(results.latency.p99 || 0).toFixed(1)} ms`);
      console.log(`  Latencia max: ${results.latency.max.toFixed(1)} ms`);
    }
    console.log('═══════════════════════════════════════════════════════════\n');

    fs.writeFileSync('resultado-estres.json', JSON.stringify({
      fecha: inicio.toISOString(), duracion: duracionTotal,
      config: { conexiones: opcionesPrueba.connections, duracion: opcionesPrueba.duration },
      resultados: results, analisis: { tasaError: parseFloat(errorRate), reqPorSegundo: results.requests.average || 0 }
    }, null, 2));
    console.log('Resultados guardados en: resultado-estres.json');
  });

  autocannon.track(instance, { renderProgressBar: true });

  process.on('SIGINT', () => { instance.stop(); process.exit(0); });
}

ejecutarPrueba();
