#!/bin/sh

# 1. Ajustar permisos del volumen montado (se ejecuta como root)
chown -R spring:spring /app/uploads

# 2. Cambiar al usuario 'spring' y ejecutar el jar usando /bin/sh
exec su -s /bin/sh spring -c "java -jar app.jar"