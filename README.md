# Ejecutar Proyecto React + Vite

## Requisitos Previos
- Node.js instalado en tu sistema
- npm (Node Package Manager)

## Pasos de Instalación

### 1. Clonar el Repositorio
Si el proyecto está en un repositorio remoto:
```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
El servidor se ejecutará por defecto en `http://localhost:5173`

### 4. Configuración de ESLint (Opcional)
El proyecto ya incluye una configuración básica de ESLint. Para ejecutar el linter:
```bash
npm run lint
```

### 5. Plugins Disponibles
El proyecto puede utilizar uno de estos plugins oficiales:

- **@vitejs/plugin-react**: Utiliza Babel para Fast Refresh
- **@vitejs/plugin-react-swc**: Utiliza SWC para Fast Refresh

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción
- `npm run lint`: Ejecuta el linter

## Solución de Problemas Comunes

### Puerto Ocupado
Si el puerto 5173 está en uso, Vite utilizará automáticamente otro puerto disponible.

### Errores de Dependencias
Verifica que todas las dependencias necesarias estén listadas en `package.json`.

## Estructura del Proyecto
```
proyecto/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Tecnologías Utilizadas
- React 18
- Vite
- ESLint
