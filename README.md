# 🎨 Sistema de Subastas en Línea — Frontend

Aplicación Web  desarrollada con React para una plataforma de subastas en línea. Permite a compradores participar en subastas, a vendedores gestionar productos y ventas, y a administradores supervisar el funcionamiento general del sistema mediante una interfaz moderna, responsiva e intuitiva.

---

# ✨ Características Principales

* ✅ Autenticación basada en JWT.
* ✅ Gestión de usuarios por roles.
* ✅ Creación y administración de productos.
* ✅ Participación en subastas en tiempo real.
* ✅ Gestión de pagos pendientes y completados.
* ✅ Sistema de notificaciones.
* ✅ Panel administrativo.
* ✅ Diseño responsive para escritorio y dispositivos móviles.
* ✅ Componentes reutilizables mediante shadcn/ui.
* ✅ Navegación protegida según permisos de usuario.

---

# 🛠️ Stack Tecnológico

| Categoría     | Tecnología         |
| ------------- | ------------------ |
| Framework     | React 18           |
| Build Tool    | Vite 5             |
| UI Framework  | shadcn/ui          |
| Estilos       | Tailwind CSS 3     |
| Íconos        | Lucide React       |
| Cliente HTTP  | Axios              |
| Routing       | React Router DOM 7 |
| Autenticación | JWT                |
| Estado Global | React Context API  |

---

# 🏗️ Arquitectura del Proyecto

```text
src/

├── api/
├── componentes/
│   ├── ui/
│   ├── subastas/
│   └── notificaciones/
├── contextos/
├── hooks/
├── paginas/
├── rutas/
├── assets/
└── main.jsx
```

---

## 📂 Descripción de Carpetas

| Carpeta     | Descripción                              |
| ----------- | ---------------------------------------- |
| api         | Cliente Axios e interceptores JWT        |
| componentes | Componentes reutilizables                |
| contextos   | Estado global mediante Context API       |
| hooks       | Custom Hooks reutilizables               |
| paginas     | Vistas principales del sistema           |
| rutas       | Configuración de navegación y protección |
| assets      | Recursos estáticos                       |

---

# 👥 Módulos por Rol

## 🛒 Comprador

| Página             | Ruta                    |
| ------------------ | ----------------------- |
| Inicio             | `/`                     |
| Detalle de Subasta | `/subasta/:id`          |
| Pagos              | `/pagos`                |
| Pagos Pendientes   | `/mis-pagos-pendientes` |
| Subastas Ganadas   | `/ganadas`              |

### Funcionalidades

* Visualizar subastas disponibles.
* Aplicar filtros y búsqueda.
* Realizar pujas.
* Consultar historial de pagos.
* Pagar subastas ganadas.

---

## 🏪 Vendedor

| Página         | Ruta              |
| -------------- | ----------------- |
| Mis Subastas   | `/mis-subastas`   |
| Crear Producto | `/crear-producto` |
| Mis Ventas     | `/mis-ventas`     |

### Funcionalidades

* Crear productos.
* Crear subastas.
* Subir imágenes.
* Gestionar ventas realizadas.

---

## 🛡️ Administrador

| Página               | Ruta     |
| -------------------- | -------- |
| Panel Administrativo | `/admin` |

### Funcionalidades

* Gestionar usuarios.
* Modificar roles.
* Cancelar subastas.

---

## 🔐 Autenticación

| Página   | Ruta        |
| -------- | ----------- |
| Login    | `/login`    |
| Registro | `/registro` |

---

# 🧩 Componentes UI Reutilizables

El proyecto utiliza componentes de **shadcn/ui** para mantener consistencia visual y reutilización de código.

| Componente | Uso Principal                |
| ---------- | ---------------------------- |
| Button     | Acciones del sistema         |
| Card       | Visualización de información |
| Input      | Formularios                  |
| Label      | Etiquetas                    |
| Badge      | Estados y roles              |
| Dialog     | Modales                      |
| Select     | Filtros y selección          |
| Tabs       | Paneles organizados          |

---

# 🔄 Custom Hooks

Los hooks encapsulan lógica reutilizable para reducir duplicación de código.

| Hook           | Función                             |
| -------------- | ----------------------------------- |
| useApi         | Consultas GET                       |
| useMutacion    | POST, PUT y PATCH                   |
| useTeclaEscape | Cierre de modales con Escape        |
| useClickFuera  | Cierre de menús al hacer clic fuera |

---



---

# 🔐 Flujo de Autenticación

```text
Usuario
    │
    ▼
Login
    │
    ▼
JWT generado
    │
    ▼
localStorage
    │
    ▼
Interceptor Axios
    │
    ▼
Authorization: Bearer Token
    │
    ▼
API Backend
```

### Proceso

1. El usuario inicia sesión.
2. El backend devuelve un JWT.
3. El token se almacena en `localStorage`.
4. Axios agrega automáticamente el token a cada petición.
5. Las rutas protegidas validan autenticación y permisos.
6. Al cerrar sesión se elimina toda la información almacenada.

---

# 🔔 Sistema de Notificaciones

La aplicación incluye un componente de notificaciones que informa al usuario sobre:

* Nuevas pujas.
* Subastas ganadas.
* Pagos pendientes.
* Confirmaciones de pago.
* Cambios importantes en el sistema.

---

# 📊 Estados de Subasta

| Estado            | Descripción                             |
| ----------------- | --------------------------------------- |
| Activa            | Recibe nuevas pujas                     |
| Pendiente de Pago | El ganador debe completar el pago       |
| Vendida           | Pago realizado correctamente            |
| Incumplida        | El pago no fue realizado a tiempo       |
| Cancelada         | Cancelada por administrador o sin pujas |

---



# 🚀 Instalación y Ejecución

## Requisitos

* Node.js 18+
* npm 9+


---




