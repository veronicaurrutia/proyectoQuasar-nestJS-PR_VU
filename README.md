# Central de Requerimientos

Sistema de mesa de ayuda / gestión de tickets multiempresa hecho con **Vue 3 + Quasar 2 + Pinia** (frontend) y pensado para un backend **NestJS + TypeORM + PostgreSQL**.

Permite:

- Iniciar sesión por empresa y elegir el área de trabajo.
- Crear, editar y eliminar tickets (prioridad, categoría, centro).
- Gestionar los tickets del área: cambiar estado y asignar gestor.
- Mantenedores: cuentas, empresas, áreas, usuarios, centros, categorías y estados.
- Menú dinámico por perfil (Administrador, Gestor, Colaborador) y administrador de permisos.
- Perfil de usuario con estadísticas.

## Modo demo (sin backend)

Por defecto la app se compila en **modo demo**: una API simulada (`src/demo/mockApi.js`) reemplaza al backend y guarda los datos en el `localStorage` del navegador. Así cualquiera puede probarla desde un link, sin servidor ni base de datos. Cada visitante tiene su propia copia de los datos y los cambios se mantienen al recargar.

| Rol | Correo | Contraseña | Qué ve |
| --- | --- | --- | --- |
| Administrador | `admin@demo.cl` | `demo123` | Todo: tickets, mantenedores, menús y permisos |
| Gestor | `gestor@demo.cl` | `demo123` | Mis tickets y gestión de tickets del área |
| Colaborador | `colaborador@demo.cl` | `demo123` | Solo sus tickets |

En el login hay botones para autocompletar cada usuario y un botón **Restablecer datos demo** para volver a los datos iniciales.

### Recorrido sugerido para probar

1. Entra como **Colaborador**, elige el área *Tecnología (TI)* y crea un ticket en **Requerimientos → Mis tickets**.
2. Cierra sesión y entra como **Administrador**: en **Requerimientos → Gestionar tickets** cambia el estado del ticket y asígnale un gestor.
3. En **Seguridad → Permisos**, elige el perfil *Gestor* y habilita/deshabilita módulos. Vuelve a entrar como Gestor para ver el menú actualizado.
4. Revisa los mantenedores en **Administración** (crear/editar/eliminar).

## Correr en local

```bash
npm install
npm run dev      # http://localhost:9000
npm run build    # genera dist/spa
```

## Deploy en Vercel

El proyecto ya trae `vercel.json` (build `npm run build`, salida `dist/spa`, router en modo hash, así que no requiere rewrites).

1. Sube el proyecto a un repositorio de GitHub.
2. En Vercel: **Add New → Project**, importa el repo y deja la configuración que detecta desde `vercel.json`.
3. **Deploy**. No necesita variables de entorno para el modo demo.

O con la CLI: `npx vercel` (preview) y `npx vercel --prod`.

## Conectar al backend real

Para usar el backend NestJS en vez de la API simulada, define estas variables al compilar (en Vercel: *Settings → Environment Variables*):

```
DEMO_MODE=false
API_URL=https://tu-backend.com
```

> El archivo `.env` contiene credenciales de base de datos y está excluido en `.gitignore`: no lo subas al repositorio.
