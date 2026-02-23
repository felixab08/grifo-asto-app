# Grifo Docker

```bash
# 1. Detiene el contenedor
docker stop grifo_angular_app

# 2. elimina uno contenedor
docker rm grifo_angular_app

# 3. elimina imagen
docker rmi grifo_angular_app:1.0.0

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
