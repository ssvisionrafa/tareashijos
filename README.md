# KidCoins - Tareas y Paga

Aplicación web para gestionar tareas domésticas y recompensas de los hijos.

## URLs

- **Producción (Firebase Hosting):** https://tareashijos-77042.web.app
- **Producción (Netlify):** https://tareashijos.netlify.app
- **Repositorio:** https://github.com/ssvisionrafa/tareashijos

## Funcionalidades

- Dashboard para niños con tareas diarias y semanales.
- Dashboard para padres con aprobación de tareas y gestión de pagos.
- Sincronización en tiempo real entre dispositivos mediante Firebase Firestore.
- Generación de tareas con IA (requiere clave de Gemini).
- Diseño responsive para móvil, tablet y escritorio.

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena con los valores de tu proyecto Firebase:

```bash
cp .env.example .env.local
```

## Despliegue

El despliegue se realiza automáticamente mediante GitHub Actions a Firebase Hosting cada vez que se hace `push` a la rama `main`.
