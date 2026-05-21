# FashionStore — Tienda de Ropa Full Stack
# CREADORES
    Marcos Rodriguez Portela    
    Joel José Ruiz Marcote
    Diego Jose Baquero Navarro

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
