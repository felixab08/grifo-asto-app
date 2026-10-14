# PRD — GrifoAsto

**Estado:** borrador inicial basado en el código disponible  
**Fecha:** 14 de octubre de 2026  
**Producto:** aplicación web de gestión de operaciones para Grifo Asto

## 1. Resumen

GrifoAsto es una aplicación web para registrar y consultar operaciones de una estación de servicio. Su interfaz permite gestionar turnos y atenciones del personal, mediciones de surtidores, entradas de combustible, cortes, personal e instituciones con sus ventas. También presenta reportes de ventas por año. La aplicación Angular consume una API externa; la persistencia y las reglas definitivas de negocio dependen de ese servicio.

Este documento describe la capacidad observable en el frontend y propone una base de producto para ordenar su evolución. Los requisitos marcados como **propuesta** deben validarse con las personas responsables del negocio.

## 2. Problema y oportunidad

La operación de un grifo requiere registrar información diaria de ventas, lecturas de surtidores, abastecimiento y turnos del personal, además de controlar ventas institucionales. Si esos datos se mantienen en procesos separados, cuesta reconstruir el cierre de una atención, revisar diferencias y consultar tendencias. GrifoAsto reúne esos flujos en una interfaz operativa conectada a un servicio central.

**Oportunidad propuesta:** reducir errores y tiempo de registro, y facilitar la consulta de cierres y ventas con información consistente y trazable.

## 3. Usuarios y necesidades

Los perfiles siguientes se infieren de las pantallas; validar nombres, permisos y responsabilidades con el negocio:

- **Administrador:** inicia sesión, gestiona personal y catálogos operativos, y supervisa la actividad. El frontend distingue el rol `ROLE_ADMIN`.
- **Operador o responsable de turno:** registra aperturas/cierres de atención y lecturas de surtidores, y consulta turnos asociados a una persona.
- **Responsable de abastecimiento:** registra y revisa entradas de combustible.
- **Responsable de ventas institucionales:** mantiene instituciones y tipos de venta, y registra ventas con datos de vale, conductor, placa, área, combustible y fecha.
- **Responsable de gestión:** registra cortes y revisa reportes anuales.

## 4. Objetivos del producto

1. Centralizar los registros operativos principales del grifo en una aplicación web.
2. Permitir consultar, paginar y mantener registros de operación desde las pantallas del módulo `grifo`.
3. Proteger el acceso mediante autenticación y aplicar controles de rol donde corresponda.
4. Facilitar el seguimiento de ventas y turnos mediante reportes.

### Fuera de alcance conocido

- Backend, base de datos y definición contractual de la API.
- Integración con surtidores físicos, medios de pago, SUNAT u otros sistemas externos.
- Aplicaciones móviles nativas y operación sin conexión.
- Nómina, contabilidad completa o gestión de inventario distinta de los registros de entradas visibles.

## 5. Alcance funcional observado

### Acceso y sesión

- Inicio de sesión con usuario o correo y contraseña.
- Comprobación de sesión mediante token y endpoint de estado.
- Cierre de sesión y restricción de rutas de autenticación según estado.
- Detección del rol administrador en el cliente.

### Turnos y atención

- Listado de atenciones/turnos, con consulta paginada por persona.
- Registro de atención por tipo e identificador de turno.
- Edición de lecturas y consulta de totales calculados para los turnos.
- Registro y consulta de cortes, con fecha, montos por restar/sumar y descripción u observaciones.

### Mediciones de surtidores

- Captura de lecturas de entrada y salida para surtidores y tipos de combustible mostrados en la interfaz (petróleo, premium y regular).
- Listado paginado, edición y eliminación de mediciones.

### Abastecimiento

- Registro, edición, consulta paginada y eliminación de entradas de combustible.
- La interfaz solicita tipo de combustible, cantidad en galones y fecha de entrada.

### Personal

- Listado y alta de personal con nombre, apellido, teléfono y correo.
- El formulario de alta contempla credenciales de usuario y contraseña.

### Instituciones y ventas institucionales

- Listado y mantenimiento de instituciones (incluye nombre, estado y RUC).
- Mantenimiento de tipos de venta y precios por combustible.
- Registro y consulta de ventas institucionales; campos visibles incluyen número de vale, conductor, placa, área, cantidades por combustible y fecha de venta.

### Reportes

- Consulta de reporte de turnos/ventas por año y visualización gráfica de series mensuales recibidas desde la API.

## 6. Requisitos de producto propuestos

Estos requisitos expresan el resultado esperado para validar, no garantizan que el comportamiento ya esté implementado.

| ID | Requisito | Prioridad |
|---|---|---|
| R1 | Una persona autenticada puede acceder a los módulos permitidos y una sesión inválida se cierra de forma segura. | Alta |
| R2 | El personal autorizado puede registrar y consultar una atención con sus lecturas y totales asociados. | Alta |
| R3 | El sistema valida los campos requeridos y los valores numéricos antes de enviar un registro. | Alta |
| R4 | El usuario puede consultar registros paginados y reconocer claramente estados vacíos, carga y error. | Alta |
| R5 | Las operaciones de edición y eliminación requieren identificar claramente el registro afectado; las eliminaciones solicitan confirmación. | Alta |
| R6 | El usuario puede registrar entradas de combustible con tipo, cantidad y fecha, y revisar el historial. | Alta |
| R7 | El usuario autorizado puede mantener instituciones, tipos de venta y ventas vinculadas a ellas. | Media |
| R8 | El usuario puede consultar reportes anuales con periodo y unidades claramente identificados. | Media |
| R9 | La interfaz se adapta a pantallas de escritorio y móviles y puede operarse con teclado y lector de pantalla. | Media |

## 7. Flujos principales

1. **Registrar actividad de turno:** iniciar sesión → abrir listado de atenciones → elegir tipo y turno → ingresar lecturas → guardar → revisar la atención y sus totales.
2. **Registrar abastecimiento:** abrir entradas → crear registro → seleccionar combustible, cantidad y fecha → guardar → revisar el historial.
3. **Registrar venta institucional:** abrir instituciones → elegir institución/tipo de venta → completar vale y datos de vehículo/conductor, cantidades y fecha → guardar → consultar ventas.
4. **Supervisar operación:** iniciar sesión con permisos → consultar turnos, cortes o reporte anual → seleccionar periodo y revisar resultados.

## 8. Criterios de aceptación propuestos

- Las rutas de login y del módulo operativo se comportan según el estado de sesión y el usuario puede cerrar sesión.
- Los formularios identifican campos obligatorios, muestran errores comprensibles y no envían datos inválidos.
- Después de guardar, el usuario recibe confirmación y puede encontrar el registro en la consulta correspondiente.
- La paginación conserva filtros relevantes y comunica el total o la ausencia de resultados.
- Las vistas de reporte muestran el año solicitado, etiquetas de periodo y datos devueltos por el servicio.
- Las operaciones restringidas no se habilitan a usuarios sin el rol requerido; el servidor sigue siendo la autoridad final de autorización.

## 9. Indicadores de éxito propuestos

No se identifican métricas de uso o metas en el repositorio. Establecer una línea base y objetivos con el negocio para:

- proporción de turnos y entradas registrados digitalmente;
- tiempo medio para completar un cierre de atención;
- tasa de registros rechazados o corregidos por errores de captura;
- disponibilidad y tasa de error de las operaciones críticas;
- frecuencia de consulta de reportes y ventas institucionales.

## 10. Requisitos no funcionales y dependencias

- **Plataforma observada:** frontend Angular 21, TypeScript, RxJS y API HTTP externa.
- **Despliegue:** el proyecto incluye configuración Docker/Nginx; validar el proceso real de publicación y sus entornos.
- **Seguridad:** el cliente almacena token y datos de usuario en `localStorage`. Definir con el backend expiración, renovación, controles de acceso y manejo de datos personales. La autorización debe verificarse en servidor.
- **Disponibilidad:** los flujos operativos dependen de conectividad con la API; no se observa soporte offline.
- **Privacidad:** personal, credenciales y datos de ventas requieren acceso restringido y tratamiento conforme a políticas del negocio.
- **Accesibilidad y rendimiento:** fijar objetivos verificables de accesibilidad, tiempos de respuesta y compatibilidad con navegadores después de validar la audiencia y dispositivos.

## 11. Supuestos, preguntas y riesgos

- El backend es la fuente de verdad para usuarios, turnos, mediciones, ventas y reportes.
- Los nombres de roles y permisos finales no están especificados por completo en el frontend.
- No se conoce la fórmula oficial de totales, conciliación de efectivo ni reglas para cortes; deben documentarse antes de usarse como criterios contables.
- Confirmar si “entrada/salida” representa lectura acumulada del medidor y cómo se manejan reinicios, correcciones y auditoría.
- Confirmar monedas, unidades, zonas horarias, periodos de cierre y reglas de validación del RUC.
- El frontend apunta a una API desplegada en Railway; confirmar entornos, SLA y estrategia de respaldo del servicio.
- No se encontraron objetivos comerciales, métricas base, entrevistas, ni especificación de producto previa.

## 12. Referencias de implementación

- Rutas principales: `src/app/app.routes.ts`, `src/app/oil-store/oil-store.routes.ts` y `src/app/auth/auth.routes.ts`.
- Autenticación: `src/app/auth/services/auth.service.ts`.
- Servicios de dominio: `src/app/oil-store/service/`.
- Interfaces y modelos: `src/app/oil-store/model/`.
- Configuración de URL de API: `src/environments/environment.ts` y `src/environments/environment.development.ts`.
