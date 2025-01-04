#!/usr/bin/env bash

# Inicializa un proyecto Node + TS
npm init -y
npm install typescript ts-node-dev @types/node @types/express express mongoose multer @google-cloud/storage dotenv @types/multer @types/express-serve-static-core @types/mongoose

# Genera tsconfig
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --lib es2020

# Crea la estructura de carpetas
mkdir -p src/app
mkdir -p src/modules/tt/domain/entities
mkdir -p src/modules/tt/domain
mkdir -p src/modules/tt/application/useCases
mkdir -p src/modules/tt/infrastructure/controllers
mkdir -p src/modules/tt/infrastructure/repositories
mkdir -p src/modules/tt/infrastructure/services
mkdir -p src/modules/tt/infrastructure/dtos
mkdir -p src/shared/db

# Crea archivos vacíos
touch src/app/server.ts
touch src/app/routes.ts
touch src/index.ts

touch src/modules/tt/domain/entities/TTEntity.ts
touch src/modules/tt/domain/TTRepositoryPort.ts
touch src/modules/tt/application/useCases/CreateTTUseCase.ts
touch src/modules/tt/infrastructure/controllers/TTController.ts
touch src/modules/tt/infrastructure/repositories/MongoTTRepository.ts
touch src/modules/tt/infrastructure/services/GoogleCloudStorageService.ts
touch src/modules/tt/infrastructure/dtos/CreateTTDTO.ts
touch src/modules/tt/infrastructure/index.ts

touch src/shared/db/MongoClient.ts

echo "Proyecto y estructura de carpetas creados con éxito."
