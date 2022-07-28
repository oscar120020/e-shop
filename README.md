# Next.js Teslo Shop

Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```


## Configurar las variables de entorno

Renombrar el archivo __.env.template__ a __.env__


* MongoDB URL local:

```
mongodb://localhost:27019/entriesdb
```

* Instalar dependencias y arrancar Next;

```
yarn add & yarn dev
```