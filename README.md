# nest-app

This is a simple nest.js rest api, using `jwt`, `TypeORM`, `Swagger`, 

## Getting started

1. Go to folder and copy `env-example` as `.env`
```
cp env-example .env
```
2. run `docker` container to start `postgres` in local machine
```
docker-compose up -d
```
3. Install dependency
```
npm install
```
4. Run seeds
```
npm run seed:run
```
5. Run app in dev mode
```
npm run start:dev

```
## Swagger
http://localhost:3000/docs

## Tests

```
npm run test
```
