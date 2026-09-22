# 💬 Chat Multisala - Cliente Web

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![PrimeReact](https://img.shields.io/badge/PrimeReact-blue?style=for-the-badge)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

Bienvenido al repositorio del **Cliente Web del Chat Multisala**, una aplicación de mensajería en tiempo real diseñada para permitir la comunicación fluida entre múltiples usuarios en diferentes salas de chat simultáneamente.

---

## 📖 Acerca del Proyecto

Este proyecto es la interfaz de usuario (Frontend) de una aplicación de chat. Permite a los usuarios conectarse a un servidor de WebSockets, unirse a diferentes salas de chat, enviar y recibir mensajes en tiempo real y gestionar su conexión.

El objetivo principal es ofrecer una experiencia de usuario rápida, reactiva y moderna, utilizando componentes pre-diseñados de alta calidad y un manejo eficiente del estado y las conexiones de red.

---

## 🏗️ Arquitectura del Sistema

El proyecto está diseñado bajo una arquitectura **Cliente-Servidor** y basada en **Eventos** para el tiempo real:

- **Frontend Componentizado**: Construido con **React**, promoviendo la reutilización de componentes y una gestión predecible del ciclo de vida de la UI.
- **Comunicación Bidireccional (WebSockets)**: Utiliza **Socket.IO** para mantener una conexión persistente y de baja latencia con el backend, permitiendo la emisión y escucha de eventos (mensajes, notificaciones de conexión/desconexión).
- **Enrutamiento del lado del cliente**: Utiliza `react-router-dom` para la navegación en una Single Page Application (SPA), garantizando transiciones de vista rápidas sin recargas de página completas.
- **Diseño Responsivo e Híbrido**: Emplea una combinación de **Bootstrap** y **PrimeFlex** para un sistema de grillas robusto y utilidades CSS que aseguran la compatibilidad en dispositivos móviles, tablets y escritorios, adornado con los componentes UI de **PrimeReact**.

---

## ⚙️ Tecnologías y Dependencias

Este proyecto se apoya en las siguientes tecnologías principales:

### Dependencias Principales (`dependencies`):
- **[React](https://reactjs.org/)** (`^19.1.0`): Librería base para la construcción de interfaces de usuario.
- **[TypeScript](https://www.typescriptlang.org/)**: Superconjunto de JavaScript que añade tipado estático al proyecto, mejorando la robustez y experiencia de desarrollo.
- **[Socket.io-client](https://socket.io/)**: Librería fundamental para la conexión WebSocket con el servidor backend.
- **[PrimeReact](https://primereact.org/)** / **[PrimeFlex](https://primeflex.org/)** / **[PrimeIcons](https://primereact.org/icons/)**: Ecosistema completo de componentes de interfaz de usuario, sistema de utilidades CSS e íconos.
- **[Bootstrap](https://getbootstrap.com/)**: Framework CSS utilizado complementariamente para maquetación y estilos rápidos.
- **[React Router DOM](https://reactrouter.com/)**: Manejo de rutas y navegación.

### Dependencias de Desarrollo (`devDependencies`):
- **@testing-library**: Herramientas para la creación de tests unitarios y de integración para los componentes.
- **Tipados (`@types/*`)**: Definiciones de tipos para integraciones seguras con TypeScript (Node, React, Jest, UUID).

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para descargar, configurar y ejecutar el proyecto en tu entorno local.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd ChatMultisala
```

### 2. Instalar dependencias

Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego, ejecuta:

```bash
npm install
```

### 3. Configuración de Variables de Entorno

El proyecto requiere apuntar a un servidor Backend válido. En la raíz del proyecto, asegúrate de configurar el archivo `.env` (puedes basarte en un `.env.example` si existiese).

**Ejemplo de archivo `.env`:**

```env
# URL del servidor backend de Socket.IO
REACT_APP_SERVER_URL=http://10.40.0.112:3001
```
*Nota: Si estás corriendo el backend localmente en otro puerto o dirección, ajusta este valor.*

### 4. Ejecución en Modo Desarrollo

```bash
npm start
```
Esto abrirá la aplicación en `http://localhost:3000` en tu navegador predeterminado. La página se recargará automáticamente si haces cambios en el código.

### 5. Construcción para Producción

Para compilar la aplicación para un entorno de producción, ejecuta:

```bash
npm run build
```
Esto generará los archivos estáticos optimizados y minificados en la carpeta `build/`, listos para ser servidos por un servidor web (Nginx, Apache, Vercel, Netlify, etc.).

---

## 📂 Estructura del Proyecto

```text
ChatMultisala/
│
├── public/                 # Archivos públicos y estáticos (index.html, favicon, etc.)
├── src/                    # Código fuente principal de la aplicación
│   ├── components/         # Componentes React reutilizables (Botones, Modales, etc.)
│   ├── pages/              # Componentes de vistas o páginas principales (Login, Chat, etc.)
│   ├── services/           # Lógica de conexión con la API y WebSockets
│   ├── utils/              # Funciones auxiliares y utilidades
│   ├── App.tsx             # Componente raíz
│   └── index.tsx           # Punto de entrada de React
│
├── .env                    # Variables de entorno locales
├── .gitignore              # Archivos ignorados por Git
├── package.json            # Dependencias y scripts del proyecto
├── tsconfig.json           # Configuración del compilador TypeScript
└── README.md               # Documentación del proyecto (Este archivo)
```
*(Nota: La estructura de `src/` es referencial basada en buenas prácticas aplicables a este stack de tecnologías).*

---

## 🔐 Seguridad, Credenciales y Configuración

- **Manejo de Variables Sensibles**: Las URLs de los servidores, claves de API o configuraciones específicas del entorno nunca deben ser 'hardcodeadas' en el código fuente. Se gestionan a través del archivo `.env` utilizando el prefijo `REACT_APP_` exigido por Create React App.
- **Protección del Archivo `.env`**: El archivo `.env` contiene información de infraestructura (como la IP del servidor de sockets `10.40.0.112:3001`) y debe estar siempre incluido en el `.gitignore` para evitar filtraciones al repositorio público.
- **Seguridad en Comunicación (WebSockets)**: En entornos de producción, es obligatorio configurar el servidor backend para que soporte y exija conexiones seguras mediante `wss://` y `https://`, asegurando el encriptado en tránsito de todos los mensajes del chat.
- **Autenticación (Implementación futura/backend)**: El frontend está preparado para enviar tokens de sesión (como JWT) a través de los *headers* o de la carga útil (*payload*) en el momento del `handshake` (apretón de manos) de Socket.IO, delegando la validación estricta de identidad y accesos a salas al servidor.

---

