# Grifo Docker

```bash
# 1. Detiene el contenedor
docker stop angular-app-1

# 2. elimina uno contenedor
docker rm angular-app-1

# 3. elimina imagen
docker rmi grifo-asto-app-angular-app

# 4. reconstruya las imágenes antes de iniciar los servicios
docker-compose up -d
```

# Ver la red del backend
```bash
# 1. Detiene el contenedor
docker network ls
```

## configuracion para incluir en la red
networks:
  grifo-asto_grifo-asto-net:
    external: true
