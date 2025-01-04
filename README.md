# QueykSearch

**POR AHORA SOLO ESTÁN CASOS DE USO DE TT, ADEMÁS DE QUE FALTAN LAS AUTENTICACIONES. PARA VER QUE SE ESTÉN SUBIENDO LOS PDF'S USA LA VERSION DE MARIN, AHI SE VERÁN LISTADOS LOS PDF PARA DESCARGARLOS**

**QueykSearch** es una aplicación backend desarrollada en **Node.js** y **TypeScript** que gestiona **Trabajos de Titulación (TT)**. Implementa una arquitectura hexagonal con vertical slicing para garantizar una estructura modular, mantenible y escalable. La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los TT, integrándose con servicios externos como **Google Cloud Storage** para el manejo de archivos y **Auth0** para la autenticación y autorización.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Prerequisitos](#prerequisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [API Endpoints](#api-endpoints)
  - [Crear un TT](#crear-un-tt-post-apiv1tts)
  - [Listar TTs](#listar-tts-get-apiv1tts)
  - [Obtener un TT por ID](#obtener-un-tt-por-id-get-apiv1ttsttid)
  - [Actualizar un TT](#actualizar-un-tt-put-apiv1ttsttid)
  - [Eliminar un TT](#eliminar-un-tt-delete-apiv1ttsttid)
- [Pruebas](#pruebas)
  - [Usando Postman](#usando-postman)
  - [Usando curl](#usando-curl)
- [Buenas Prácticas y Recomendaciones](#buenas-prácticas-y-recomendaciones)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Características

- **CRUD Completo**: Crear, leer, actualizar y eliminar Trabajos de Titulación.
- **Subida de Archivos**: Integración con Google Cloud Storage para gestionar documentos asociados a los TT.
- **Autenticación y Autorización**: Protección de rutas utilizando Auth0.
- **Filtros y Paginación**: Listado de TT con opciones de filtrado y paginación.
- **Validaciones**: Validación de datos entrantes utilizando Joi.
- **Arquitectura Hexagonal**: Estructura modular para facilitar el mantenimiento y escalabilidad.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **TypeScript**: Superset de JavaScript con tipado estático.
- **Express.js**: Framework web para Node.js.
- **MongoDB**: Base de datos NoSQL para almacenar los TT.
- **Mongoose**: ODM para MongoDB.
- **Google Cloud Storage**: Servicio de almacenamiento para documentos.
- **Auth0**: Plataforma de autenticación y autorización.
- **Joi**: Biblioteca para validación de datos.
- **dotenv**: Gestión de variables de entorno.
- **ts-node-dev**: Herramienta para desarrollo con TypeScript.

## Estructura del Proyecto

El proyecto sigue una **arquitectura hexagonal** con **vertical slicing**, lo que significa que cada módulo (en este caso, `tt`) está completamente encapsulado, manejando su propia lógica de dominio, aplicación e infraestructura.

```
queyksearch/
├── package.json
├── tsconfig.json
├── node_modules/
├── src/
│   ├── app/
│   │   ├── server.ts
│   │   └── routes.ts
│   ├── index.ts
│   ├── modules/
│   │   └── tt/
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   │   └── TTEntity.ts
│   │       │   └── TTRepositoryPort.ts
│   │       ├── application/
│   │       │   └── useCases/
│   │       │       ├── CreateTTUseCase.ts
│   │       │       ├── ListTTUseCase.ts
│   │       │       ├── GetTTByIdUseCase.ts
│   │       │       ├── UpdateTTUseCase.ts
│   │       │       └── DeleteTTUseCase.ts
│   │       └── infrastructure/
│   │           ├── controllers/
│   │           │   └── TTController.ts
│   │           ├── dtos/
│   │           │   ├── CreateTTDTO.ts
│   │           │   ├── ListTTDTO.ts
│   │           │   ├── GetTTByIdDTO.ts
│   │           │   ├── UpdateTTDTO.ts
│   │           │   └── DeleteTTDTO.ts
│   │           ├── repositories/
│   │           │   └── MongoTTRepository.ts
│   │           ├── services/
│   │           │   └── GoogleCloudStorageService.ts
│   │           ├── validators/
│   │           │   ├── CreateTTValidator.ts
│   │           │   └── UpdateTTValidator.ts
│   │           └── index.ts
│   └── shared/
│       ├── db/
│       │   └── MongoClient.ts
│       └── types/
│           └── DeepPartial.ts
└── ...
```

## Prerequisitos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes en tu máquina:

- **Node.js** (v14 o superior)
- **npm** (v6 o superior)
- **MongoDB**: Puedes usar una instancia local o un servicio como MongoDB Atlas.
- **Cuenta en Google Cloud**: Para utilizar Google Cloud Storage.
- **Cuenta en Auth0**: Para manejar la autenticación y autorización.

## Instalación

1. **Clonar el Repositorio**

   ```bash
   git clone https://github.com/tu-usuario/queyksearch.git
   cd queyksearch
   ```

2. **Instalar Dependencias**

   ```bash
   npm install
   ```

## Configuración

1. **Crear el Archivo `.env`**

   En la raíz del proyecto, crea un archivo `.env` y añade las siguientes variables de entorno:

   ```ini
   PORT=4000
   MONGO_URL=mongodb+srv://<usuario>:<password>@<cluster>/QueykSearch
   GCLOUD_KEYFILE=path/to/your/keyfile.json
   GCLOUD_BUCKET=trabajosterminales
   AUTH0_DOMAIN=<your-auth0-domain>
   AUTH0_AUDIENCE=<your-auth0-audience>
   OPEN_AI_KEY=sk-...
   ```

   **Descripción de Variables:**

   - `PORT`: Puerto en el que correrá el servidor.
   - `MONGO_URL`: URI de conexión a MongoDB.
   - `GCLOUD_KEYFILE`: Ruta al archivo de clave de servicio de Google Cloud.
   - `GCLOUD_BUCKET`: Nombre del bucket en Google Cloud Storage.
   - `AUTH0_DOMAIN`: Dominio de tu cuenta de Auth0.
   - `AUTH0_AUDIENCE`: Audience configurado en Auth0 para tu API.
   - `OPEN_AI_KEY`: Clave de API para servicios de OpenAI (si aplica).

2. **Configurar Google Cloud Storage**

   - Crea un bucket en Google Cloud Storage con el nombre especificado en `GCLOUD_BUCKET`.
   - Descarga el archivo de clave de servicio (`keyfile.json`) y coloca la ruta en `GCLOUD_KEYFILE`.

3. **Configurar Auth0**

   - Crea una API en Auth0 y obtén el `DOMAIN` y `AUDIENCE`.
   - Configura las reglas y roles necesarios según tus necesidades.

## Ejecutar el Proyecto

1. **Compilar y Ejecutar el Servidor en Modo Desarrollo**

   ```bash
   npx ts-node-dev src/index.ts
   ```

   Deberías ver en la consola:

   ```
   Conexión exitosa a MongoDB
   Servidor corriendo en http://localhost:4000
   ```

2. **Compilar para Producción**

   Para compilar el proyecto para producción, puedes usar el siguiente comando:

   ```bash
   npm run build
   ```

   Y luego ejecutar el servidor compilado:

   ```bash
   npm start
   ```

## API Endpoints

### 1. Crear un TT

**Endpoint:** `POST /api/v1/tts`

**Descripción:** Crea un nuevo Trabajo de Titulación.

**Headers:**

- `Authorization: Bearer <token>` (si está protegido)

**Body:** `form-data`

| Campo                          | Tipo | Requerido | Descripción                   |
| ------------------------------ | ---- | --------- | ----------------------------- |
| `file`                         | File | Opcional  | Archivo PDF del TT.           |
| `titulo`                       | Text | Sí        | Título del TT.                |
| `autores[0].nombreCompleto`    | Text | Sí        | Nombre completo del autor.    |
| `autores[0].orcid`             | Text | Opcional  | ORCID del autor.              |
| `palabrasClave[0]`             | Text | Sí        | Palabra clave 1.              |
| `palabrasClave[1]`             | Text | Opcional  | Palabra clave 2.              |
| `unidadAcademica`              | Text | Sí        | Unidad académica.             |
| `directores[0].nombreCompleto` | Text | Sí        | Nombre completo del director. |
| `directores[0].orcid`          | Text | Opcional  | ORCID del director.           |
| `grado`                        | Text | Sí        | Grado académico.              |
| `resumen`                      | Text | Sí        | Resumen del TT.               |

**Ejemplo con curl:**

```bash
curl -X POST http://localhost:4000/api/v1/tts \
  -H "Authorization: Bearer <token>" \
  -F "file=@/ruta/al/archivo.pdf" \
  -F "titulo=Análisis de Algoritmos en IA" \
  -F "autores[0].nombreCompleto=Juan Pérez" \
  -F "autores[0].orcid=0000-0002-1234-5678" \
  -F "palabrasClave[0]=IA" \
  -F "palabrasClave[1]=Algoritmos" \
  -F "unidadAcademica=ESCOM" \
  -F "directores[0].nombreCompleto=Dr. García" \
  -F "grado=Licenciatura" \
  -F "resumen=Resumen del trabajo terminal..."
```

**Respuesta Esperada:**

```json
{
  "message": "TT creado con éxito",
  "data": {
    "_id": "60d5f9b2c2a1e8b3d4f5g6h7",
    "titulo": "Análisis de Algoritmos en IA",
    "autores": [
      {
        "nombreCompleto": "Juan Pérez",
        "orcid": "0000-0002-1234-5678"
      }
    ],
    "palabrasClave": ["IA", "Algoritmos"],
    "unidadAcademica": "ESCOM",
    "directores": [
      {
        "nombreCompleto": "Dr. García",
        "orcid": ""
      }
    ],
    "grado": "Licenciatura",
    "resumen": "Resumen del trabajo terminal...",
    "documentoUrl": "https://storage.googleapis.com/trabajosterminales/1625132800000-document.pdf",
    "fechaPublicacion": "2023-07-01T00:00:00.000Z"
  }
}
```

### 2. Listar TTs

**Endpoint:** `GET /api/v1/tts`

**Descripción:** Obtiene una lista de TTs con opciones de filtrado y paginación.

**Headers:**

- `Authorization: Bearer <token>` (si está protegido)

**Parámetros de Query (Opcionales):**

| Parámetro         | Tipo   | Descripción                                         |
| ----------------- | ------ | --------------------------------------------------- |
| `titulo`          | string | Filtrar por título (búsqueda insensible).           |
| `autor`           | string | Filtrar por nombre del autor (búsqueda insensible). |
| `unidadAcademica` | string | Filtrar por unidad académica.                       |
| `grado`           | string | Filtrar por grado académico.                        |
| `palabrasClave`   | array  | Filtrar por palabras clave.                         |
| `anoPublicacion`  | number | Filtrar por año de publicación.                     |
| `limit`           | number | Número de resultados por página (default: 10).      |
| `page`            | number | Número de página (default: 1).                      |

**Ejemplo con Postman:**

1. **Método:** `GET`
2. **URL:** `http://localhost:4000/api/v1/tts`
3. **Parámetros de Query:**
   - `titulo`: `Algoritmos`
   - `autor`: `Juan`
   - `limit`: `5`
   - `page`: `1`

**Ejemplo con curl:**

```bash
curl -X GET "http://localhost:4000/api/v1/tts?titulo=Algoritmos&autor=Juan&limit=5&page=1" \
  -H "Authorization: Bearer <token>"
```

**Respuesta Esperada:**

```json
{
  "message": "Lista de TTs obtenida con éxito",
  "data": {
    "total": 2,
    "page": 1,
    "limit": 5,
    "data": [
      {
        "_id": "60d5f9b2c2a1e8b3d4f5g6h7",
        "titulo": "Análisis de Algoritmos en IA",
        "autores": [
          {
            "nombreCompleto": "Juan Pérez",
            "orcid": "0000-0002-1234-5678"
          }
        ],
        "palabrasClave": ["IA", "Algoritmos"],
        "unidadAcademica": "ESCOM",
        "directores": [
          {
            "nombreCompleto": "Dr. García",
            "orcid": ""
          }
        ],
        "grado": "Licenciatura",
        "resumen": "Resumen del trabajo terminal...",
        "documentoUrl": "https://storage.googleapis.com/trabajosterminales/1625132800000-document.pdf",
        "fechaPublicacion": "2023-07-01T00:00:00.000Z"
      }
      // ... otros TTs
    ]
  }
}
```

### 3. Obtener un TT por ID

**Endpoint:** `GET /api/v1/tts/:ttId`

**Descripción:** Obtiene un TT específico por su ID.

**Headers:**

- `Authorization: Bearer <token>` (si está protegido)

**Parámetros de Ruta:**

| Parámetro | Tipo   | Descripción          |
| --------- | ------ | -------------------- |
| `ttId`    | string | ID del TT a obtener. |

**Ejemplo con Postman:**

1. **Método:** `GET`
2. **URL:** `http://localhost:4000/api/v1/tts/60d5f9b2c2a1e8b3d4f5g6h7`

**Ejemplo con curl:**

```bash
curl -X GET "http://localhost:4000/api/v1/tts/60d5f9b2c2a1e8b3d4f5g6h7" \
  -H "Authorization: Bearer <token>"
```

**Respuesta Esperada:**

```json
{
  "message": "TT obtenido con éxito",
  "data": {
    "_id": "60d5f9b2c2a1e8b3d4f5g6h7",
    "titulo": "Análisis de Algoritmos en IA",
    "autores": [
      {
        "nombreCompleto": "Juan Pérez",
        "orcid": "0000-0002-1234-5678"
      }
    ],
    "palabrasClave": ["IA", "Algoritmos"],
    "unidadAcademica": "ESCOM",
    "directores": [
      {
        "nombreCompleto": "Dr. García",
        "orcid": ""
      }
    ],
    "grado": "Licenciatura",
    "resumen": "Resumen del trabajo terminal...",
    "documentoUrl": "https://storage.googleapis.com/trabajosterminales/1625132800000-document.pdf",
    "fechaPublicacion": "2023-07-01T00:00:00.000Z"
  }
}
```

### 4. Actualizar un TT

**Endpoint:** `PUT /api/v1/tts/:ttId`

**Descripción:** Actualiza un TT existente.

**Headers:**

- `Authorization: Bearer <token>` (si está protegido)
- `Content-Type: application/json`

**Parámetros de Ruta:**

| Parámetro | Tipo   | Descripción             |
| --------- | ------ | ----------------------- |
| `ttId`    | string | ID del TT a actualizar. |

**Body:** `raw` - `JSON`

| Campo             | Tipo   | Requerido | Descripción                      |
| ----------------- | ------ | --------- | -------------------------------- |
| `titulo`          | string | Opcional  | Nuevo título del TT.             |
| `autores`         | array  | Opcional  | Lista actualizada de autores.    |
| `palabrasClave`   | array  | Opcional  | Nuevas palabras clave.           |
| `unidadAcademica` | string | Opcional  | Nueva unidad académica.          |
| `directores`      | array  | Opcional  | Lista actualizada de directores. |
| `grado`           | string | Opcional  | Nuevo grado académico.           |
| `resumen`         | string | Opcional  | Nuevo resumen del TT.            |

**Ejemplo con curl:**

```bash
curl -X PUT "http://localhost:4000/api/v1/tts/60d5f9b2c2a1e8b3d4f5g6h7" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
        "titulo": "Análisis Mejorado de Algoritmos en IA",
        "palabrasClave": ["IA", "Algoritmos", "Optimización"]
      }'
```

**Respuesta Esperada:**

```json
{
  "message": "TT actualizado con éxito",
  "data": {
    "_id": "60d5f9b2c2a1e8b3d4f5g6h7",
    "titulo": "Análisis Mejorado de Algoritmos en IA",
    "autores": [
      {
        "nombreCompleto": "Juan Pérez",
        "orcid": "0000-0002-1234-5678"
      }
    ],
    "palabrasClave": ["IA", "Algoritmos", "Optimización"],
    "unidadAcademica": "ESCOM",
    "directores": [
      {
        "nombreCompleto": "Dr. García",
        "orcid": ""
      }
    ],
    "grado": "Licenciatura",
    "resumen": "Resumen del trabajo terminal...",
    "documentoUrl": "https://storage.googleapis.com/trabajosterminales/1625132800000-document.pdf",
    "fechaPublicacion": "2023-07-01T00:00:00.000Z"
  }
}
```

### 5. Eliminar un TT

**Endpoint:** `DELETE /api/v1/tts/:ttId`

**Descripción:** Elimina un TT específico.

**Headers:**

- `Authorization: Bearer <token>` (si está protegido)

**Parámetros de Ruta:**

| Parámetro | Tipo   | Descripción           |
| --------- | ------ | --------------------- |
| `ttId`    | string | ID del TT a eliminar. |

**Ejemplo con curl:**

```bash
curl -X DELETE "http://localhost:4000/api/v1/tts/60d5f9b2c2a1e8b3d4f5g6h7" \
  -H "Authorization: Bearer <token>"
```

**Respuesta Esperada:**

```json
{
  "message": "TT eliminado con éxito"
}
```

## Pruebas

### Usando Postman

1. **Descargar Postman:** Si aún no lo tienes, descarga e instala [Postman](https://www.postman.com/downloads/).

2. **Importar Colección (Opcional):** Puedes crear una colección para organizar los endpoints de la API.

3. **Configurar Variables de Entorno:** Configura variables para la URL base (`http://localhost:4000/api/v1`) y el token de autenticación.

4. **Crear y Ejecutar Solicitudes:** Utiliza los endpoints descritos anteriormente para interactuar con la API.

### Usando curl

A continuación se presentan ejemplos de cómo interactuar con la API usando `curl`. Asegúrate de reemplazar `<token>` y otros parámetros según corresponda.

1. **Crear un TT:**

   ```bash
   curl -X POST http://localhost:4000/api/v1/tts \
     -H "Authorization: Bearer <token>" \
     -F "file=@/ruta/al/archivo.pdf" \
     -F "titulo=Análisis de Algoritmos en IA" \
     -F "autores[0].nombreCompleto=Juan Pérez" \
     -F "autores[0].orcid=0000-0002-1234-5678" \
     -F "palabrasClave[0]=IA" \
     -F "palabrasClave[1]=Algoritmos" \
     -F "unidadAcademica=ESCOM" \
     -F "directores[0].nombreCompleto=Dr. García" \
     -F "grado=Licenciatura" \
     -F "resumen=Resumen del trabajo terminal..."
   ```

2. **Listar TTs:**

   ```bash
   curl -X GET "http://localhost:4000/api/v1/tts?titulo=Algoritmos&autor=Juan&limit=5&page=1" \
     -H "Authorization: Bearer <token>"
   ```

3. **Obtener un TT por ID:**

   ```bash
   curl -X GET "http://localhost:4000/api/v1/tts/60d5f9b2c2a1e8b3d4f5g6h7" \
     -H "Authorization: Bearer <token>"
   ```

4. **Actualizar un TT:**

   ```bash
   curl -X PUT "http://localhost:4000/api/v1/tts/60d5f9b2c2a1e8b3d4f5g6h7" \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
           "titulo": "Análisis Mejorado de Algoritmos en IA",
           "palabrasClave": ["IA", "Algoritmos", "Optimización"]
         }'
   ```

5. **Eliminar un TT:**

   ```bash
   curl -X DELETE "http://localhost:4000/api/v1/tts/60d5f9b2c2a1e8b3d4f5g6h7" \
     -H "Authorization: Bearer <token>"
   ```

## Buenas Prácticas y Recomendaciones

- **Validación de Datos:** Utiliza bibliotecas como **Joi** para validar los datos entrantes y garantizar la integridad de la información.
- **Manejo de Errores:** Implementa un manejador de errores centralizado para capturar y responder adecuadamente ante fallos.
- **Autenticación y Autorización:** Protege las rutas sensibles utilizando **Auth0** o cualquier otro sistema de autenticación robusto.
- **Logs Estructurados:** Considera usar herramientas como **Winston** para manejar logs de manera eficiente.
- **Pruebas Automatizadas:** Implementa pruebas unitarias y de integración para asegurar el correcto funcionamiento de la aplicación.
- **Documentación:** Mantén la documentación actualizada utilizando herramientas como **Swagger** para facilitar la comprensión y uso de la API.

## Contribuciones

<!--
¡Las contribuciones son bienvenidas! Si deseas mejorar QueykSearch, sigue estos pasos:

1. **Fork** el repositorio.
2. **Crea una rama** para tu feature (`git checkout -b feature/nombre-feature`).
3. **Haz tus cambios** y **commitea** (`git commit -m 'Añadir nueva feature'`).
4. **Push** a la rama (`git push origin feature/nombre-feature`).
5. **Abre un Pull Request** para que revisemos tus cambios.
 -->

Ya eres colaborador, puedes contribuir de preferencia en otra rama :v
