# Galactic Warriors API ⚔️🌌

Una API serverless que fusiona personajes de Pokémon y Star Wars para crear **Guerreros Galácticos** únicos. Este proyecto demuestra una arquitectura limpia con TypeScript, AWS Lambda y DynamoDB.

## 🚀 ¿Qué hace esta API?

La API te permite:

- **Fusionar** personajes aleatorios de Pokémon y Star Wars
- **Almacenar** tus propios guerreros personalizados
- **Consultar** el historial de todos los guerreros creados

### Ejemplo de Guerrero Galáctico

```json
{
  "id": "25-1",
  "name": "Pikachu Luke",
  "powerLevel": 83,
  "origin": "pokemon",
  "height": 1.06,
  "weight": 68.5,
  "abilities": ["static", "Force-sensitive"],
  "species": "Electric-Humanoid",
  "description": "no description",
  "createdBy": "no creator"
}
```

## 🏗️ Arquitectura

El proyecto sigue **Clean Architecture** con estos bounded contexts:

```
src/
├── fusionados/     # Crear guerreros fusionados
├── almacenar/      # Guardar guerreros personalizados
├── historial/      # Consultar historial
└── shared/         # Infraestructura compartida
```

### Tecnologías Usadas

- **Framework**: Serverless Framework
- **Runtime**: Node.js 20.x con TypeScript
- **Base de datos**: AWS DynamoDB
- **APIs externas**: PokeAPI + SWAPI (Star Wars API)
- **Dependency Injection**: Inversify
- **Logging**: AWS Lambda Powertools

## 📋 Endpoints Disponibles

### 1. Crear Guerrero Fusionado

```http
GET /fusionados
```

Fusiona un Pokémon aleatorio con un personaje de Star Wars aleatorio.

### 2. Almacenar Guerrero Personalizado

```http
POST /almacenar
Content-Type: application/json

{
  "name": "Mi Guerrero",
  "powerLevel": 100,
  "origin": "custom",
  "height": 1.8,
  "weight": 75,
  "abilities": ["super-strength"],
  "species": "human",
  "description": "Un guerrero personalizado",
  "createdBy": "usuario"
}
```

### 3. Consultar Historial

```http
GET /historial?limit=10
```

Retorna el historial de guerreros creados, ordenados cronológicamente.

## 🛠️ Instalación y Uso

### Prerrequisitos

- Node.js 20.x
- AWS CLI configurado
- Serverless Framework

### Configuración

1. **Clona el repositorio**

   ```bash
   git clone <repo>
   cd reto-stefanini
   ```

2. **Instala dependencias**

   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales de AWS
   ```

### Comandos Disponibles

```bash
# Desarrollo local
npm run dev              # Servidor local con serverless offline

# Despliegue
npm run deploy           # Despliega a AWS (stage dev)
npm run deploy:prod      # Despliega a producción
npm run remove           # Elimina recursos de AWS

# Pruebas
npm test                 # Ejecuta pruebas BDD
npm run test:coverage    # Pruebas con reporte de coverage
npm run test:watch       # Pruebas en modo watch
npm run coverage:open    # Abre reporte HTML de coverage

# Calidad de código
npm run build            # Compila TypeScript
npm run lint             # Verifica código con ESLint
npm run lint:fix         # Corrige errores de linting
```

## 🧪 Pruebas

El proyecto incluye **pruebas BDD** escritas en español usando **Jest + Cucumber**:

```
test/features/
├── fusionados/     # Pruebas de fusión de personajes
├── almacenar/      # Pruebas de almacenamiento
└── historial/      # Pruebas de consulta de historial
```

### Estructura de Pruebas

Cada bounded context tiene:

- **`.feature`** - Escenarios en español (Given/When/Then)
- **`input/`** - Datos de entrada para las pruebas
- **`output/`** - Respuestas esperadas
- **`steps/`** - Implementación de los pasos

### Coverage Actual

```
File            | % Stmts | % Branch | % Funcs | % Lines
----------------|---------|----------|---------|--------
All files       |   86.36 |       65 |     100 |   86.36
fusionLogic.js  |   86.36 |       65 |     100 |   86.36
```

## 📁 Archivos de Prueba HTTP

Usa los archivos `.http` para probar los endpoints:

```
requests/
├── fusionados-request.http    # Pruebas de fusión
├── almacenar-request.http     # Pruebas de almacenamiento
└── historial-request.http     # Pruebas de historial
```

## 🔧 Configuración de DynamoDB

### Desarrollo Local

```bash
npm run dev  # Usa DynamoDB local automáticamente
```

### AWS

La tabla se crea automáticamente en el despliegue:

- **Nombre**: `galactic-warriors-{stage}`
- **Partition Key**: `id`
- **Tipo**: Single Table Design

## 🎯 Características Técnicas

### Clean Architecture

- **Domain**: Entidades y repositorios (interfaces)
- **Application**: Casos de uso y DTOs
- **Infrastructure**: Implementaciones (DynamoDB, APIs externas)

### Dependency Injection

```typescript
// Ejemplo de configuración
container
  .bind<PokemonRepository>(TYPES.PokemonRepository)
  .to(HttpPokemonRepository);
```

### Logging Estructurado

```typescript
logger.info("Creating galactic warrior", {
  pokemon: pokemon.name,
  starWars: character.name,
});
```

### Manejo de Errores

- Validación de entrada
- Manejo de errores de APIs externas
- Logs detallados con contexto

## 🌟 Mejores Prácticas Implementadas

✅ **Arquitectura limpia** separando responsabilidades  
✅ **Inyección de dependencias** para testing  
✅ **Logging estructurado** para observabilidad  
✅ **Pruebas BDD** en español para claridad  
✅ **TypeScript estricto** para type safety  
✅ **ESLint** para calidad de código  
✅ **Single Table Design** para DynamoDB eficiente

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para detalles.

---

**¡Que la Fuerza acompañe a tus Pokémon!** ⚡🔮

