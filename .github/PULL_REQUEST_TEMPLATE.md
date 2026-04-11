## 📋 Descripción de los Cambios
> Describa brevemente qué hace este PR y qué historia de Jira resuelve (ej: SUG-2).

## ✅ Definition of Done (DoD)
*Por favor, marca con una `x` los puntos completados antes de solicitar revisión.*

### 1. Desarrollo e Integración
- [ ] El código sigue los estándares de **Clean Code** y las convenciones de Java/JavaScript.
- [ ] Integrado en la rama principal (`main`) sin conflictos.
- [ ] Cero "hardcoded values"; se usan **variables de entorno** para URLs y credenciales.
- [ ] Cumple con todos los **Criterios de Aceptación** de Jira.

### 2. Calidad y Pruebas
- [ ] Endpoints probados en **Postman** (flujos 200 OK y errores 4xx/5xx).
- [ ] Interfaz en React **responsiva** (probado en móvil y escritorio).
- [ ] Sin errores críticos en consola de navegador ni excepciones en logs de Spring.

### 3. Revisión y Seguridad
- [ ] **Peer Review:** Listo para que un compañero revise el código.
- [ ] Endpoints protegidos con filtro de **JWT**.
- [ ] Datos sensibles (como la **clave**) NO se exponen en las respuestas JSON.

### 4. Documentación
- [ ] `README.md` actualizado con nuevas variables de entorno.
- [ ] Cambios en base de datos (SQL/JPA) documentados.
