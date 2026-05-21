# FashionStore — Tienda de Ropa Full Stack

**Proyecto Final FP Dual | Angular 21 + Spring Boot**

Aplicación web full stack para la gestión de una tienda de ropa.  
Permite administrar **categorías** y **productos**, con relación 1:M entre ambos.

---

## Tecnologías

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Frontend   | Angular 21 (Standalone, Signals, Formularios Reactivos, Observables) |
| Backend    | Java 17 + Spring Boot 3.3 + Spring Data JPA |
| Base datos | H2 en memoria                       |
| Build      | Maven (backend) · npm (frontend)    |

---

## Estructura del proyecto

```
tienda-ropa/
├── backend/                        → Spring Boot
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/tiendaropa/
│       │   ├── TiendaRopaApplication.java
│       │   ├── entity/             → Categoria, Producto
│       │   ├── repository/         → CategoriaRepository, ProductoRepository
│       │   ├── dto/                → CategoriaDTO, ProductoDTO
│       │   ├── service/            → CategoriaService, ProductoService
│       │   └── controller/         → CategoriaController, ProductoController
│       └── resources/
│           ├── application.properties
│           └── data.sql            → Datos de ejemplo
└── frontend/                       → Angular 21
    ├── package.json
    ├── angular.json
    └── src/app/
        ├── app.config.ts
        ├── app.routes.ts
        ├── models/                 → categoria.model.ts, producto.model.ts
        ├── services/               → categoria.service.ts, producto.service.ts
        └── components/             → navbar, categoria-list/detail/form, producto-list/detail/form
```

---

## Arranque del Backend

```bash
cd backend
./mvnw spring-boot:run
```

- API REST disponible en: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:tiendaropadb`
  - Usuario: `sa` | Contraseña: *(vacía)*

---

## Arranque del Frontend

```bash
cd frontend
npm install
npx ng serve
```

- App disponible en: `http://localhost:4200`

---

## Endpoints API REST

### Categorías

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/categorias` | Listar todas las categorías |
| GET | `/api/categorias/{id}` | Detalle de una categoría |
| POST | `/api/categorias` | Crear nueva categoría |
| PUT | `/api/categorias/{id}` | Actualizar categoría |
| DELETE | `/api/categorias/{id}` | Eliminar categoría |
| **GET** | **`/api/categorias/{id}/productos`** | **Productos de una categoría (relación 1:M)** |

### Productos

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/{id}` | Detalle de un producto |
| POST | `/api/productos` | Crear nuevo producto |
| PUT | `/api/productos/{id}` | Actualizar producto |
| DELETE | `/api/productos/{id}` | Eliminar producto |

---

## Modelo de datos

**Relación 1:M → Categoría tiene muchos Productos**

```
categoria (id, nombre, descripcion)
    └── producto (id, nombre, descripcion, precio, talla, stock, imagen_url, categoria_id)
```

---

## Funcionalidades implementadas

- ✅ Listado de categorías con colores y emojis dinámicos
- ✅ Detalle de categoría mostrando sus productos (relación 1:M)
- ✅ Formulario para crear categoría con validaciones
- ✅ Listado de productos con buscador en tiempo real
- ✅ Detalle de producto
- ✅ Formulario para crear producto con selector de categoría
- ✅ Eliminar categorías y productos
- ✅ Datos de ejemplo cargados automáticamente (data.sql)
- ✅ Validaciones en frontend (Formularios Reactivos) y backend (Jakarta Validation)
- ✅ Signals de Angular para estado reactivo
- ✅ Componentes Standalone (sin módulos)
- ✅ Servicios con HttpClient y Observables

---

## Problemas encontrados y soluciones

- **CORS:** Configurado con `@CrossOrigin(origins = "http://localhost:4200")` en los controladores.
- **Referencias circulares JPA:** Resuelto con `@JsonIgnoreProperties({"productos", "hibernateLazyInitializer"})` en la entidad Producto.
- **Signals en Angular 21:** Se usaron `signal()` y `computed()` para el estado reactivo en todos los componentes.
- **Lazy loading JPA:** Configurado `FetchType.LAZY` en la relación `@ManyToOne` para optimizar las consultas.
