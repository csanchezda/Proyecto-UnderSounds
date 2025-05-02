# 🎧 UnderSounds API

**UnderSounds** es una plataforma musical completa que permite a usuarios explorar, comprar, subir y gestionar contenido musical como canciones y álbumes. Esta aplicación integra autenticación con Firebase, gestión de pagos con PayPal, y una arquitectura moderna basada en Angular, FastAPI y PostgreSQL.

---

## 🚀 Tecnologías utilizadas

| Herramienta        | Descripción                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **Angular**        | Frontend con componentes, servicios y guards. |
| **FastAPI**        | Backend con tipado estricto, validación y OpenAPI Docs.  |
| **PostgreSQL**     | Base de datos relacional robusta y escalable.                               |
| **Firebase Auth**  | Autenticación OAuth2 (Google, GitHub, X).                                   |
| **PayPal API**     | Pagos simulados mediante integración con PayPal Sandbox.                    |
| **Docker**         | Contenerización del backend y base de datos para despliegues consistentes.  |

---

## 🔐 Autenticación y Seguridad

- Login con correo y contraseña o mediante proveedores externos (OAuth2).
- Verificación y autorización de usuarios con JWT (Firebase).
- Middleware en FastAPI para validar tokens y asegurar rutas.
- Guards en Angular para proteger rutas sensibles del frontend.

---

## 🧠 Funcionalidades principales

- 🎵 Gestión de **canciones** (crear, actualizar, eliminar, subir audio).
- 💿 Gestión de **álbumes** (crear con canciones, editar, eliminar).
- 🛒 **Carrito de compras** y sistema de **órdenes**.
- ✍️ **Reseñas** y valoraciones de productos musicales.
- 📈 Ordenamiento y filtrado de artistas por nombre, seguidores o vistas.
- 🧾 Sincronización de contraseñas entre **Firebase** y **PostgreSQL**.
- 🧩 Subida de archivos, imágenes y audio.
- 💸 Simulación de pagos con PayPal desde el frontend.

---

## 🧪 Estructura del Backend (FastAPI)

```bash
├── app/
│   ├── controllers/     # Endpoints agrupados por entidad
│   ├── models/          # Lógica de negocio (User, Song, Album...)
│   ├── dap/             # Desarrolo de obtección de datos
│   ├── schemas/         # DTOs para entrada/salida de datos
│   ├── factories/       # DAOFactory para PostgreSQL
│   ├── middlewares/     # Middleware de autenticación Firebase
│   └── utils/           # Utilidades como verificación de tokens
```

---

## 📦 Base de datos

- Diseñada en **PostgreSQL**
- Incluye triggers y funciones para:
  - Verificar que solo artistas puedan subir contenido.
  - Guardar versiones anteriores de canciones y álbumes.
  - Restaurar estados anteriores desde historial.
  - Actualizar automáticamente el número de seguidores.

---

## 📄 Documentación de la API

- Documentación OpenAPI generada automáticamente en `/docs`.

## 👤 Autores

Proyecto desarrollado en el marco de una entrega universitaria.  
Colaboradores: Alberto Simón Fernández de la Mela, Carmen Sánchez Julián, Cristina Vaquerizo Jiménez, Pablo Márquez Hernández y Lucas González Salcedo


---

¡Disfruta explorando, subiendo y compartiendo música con UnderSounds! 🎶
