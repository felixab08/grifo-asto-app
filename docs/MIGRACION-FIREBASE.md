# Plan de migración de GrifoAsto a Firebase

**Estado:** guía de planificación; no se han realizado cambios de código  
**Fecha:** 14 de octubre de 2026  
**Versión objetivo:** nueva rama basada en la aplicación Angular 21 existente

## 1. Objetivo

Crear una nueva versión de GrifoAsto que conserve los flujos operativos actuales y use Firebase como servicio de autenticación y almacenamiento, eliminando la dependencia del backend Spring Boot para dichos flujos. La migración se hará en una rama independiente para conservar la versión actual y permitir comparar, revisar y desplegar ambas.

Este documento contiene pasos de trabajo, decisiones que deben confirmarse y criterios para considerar la migración lista. **No implica que Firebase ya esté configurado ni que los datos actuales se hayan migrado.**

## 2. Arquitectura objetivo recomendada

- **Frontend:** Angular 21 actual.
- **Identidad:** Firebase Authentication. Para una operación con cuentas controladas por el negocio, empezar con correo/contraseña; habilitar proveedores adicionales solo si son necesarios.
- **Persistencia:** Cloud Firestore, con colecciones para usuarios, turnos, mediciones, entradas de combustible, cortes, instituciones, tipos de venta y ventas.
- **Acceso desde cliente:** SDK oficial de Firebase para JavaScript y servicios Angular por dominio. No poner credenciales de servicio ni secretos administrativos en el navegador.
- **Reglas:** Firestore Security Rules con acceso autenticado y permisos definidos explícitamente por usuario/rol. Los guards de Angular mejoran navegación, pero no protegen los datos.
- **Hosting:** decidir entre Firebase Hosting y el alojamiento actual. La aplicación es Angular SPA; revisar rutas de fallback, base-href y el despliegue ya existente antes de elegir.
- **Funciones de servidor:** no incluir Spring Boot en el camino normal de lectura/escritura. Si se requieren acciones privilegiadas o atómicas que no puedan asegurarse desde el cliente, evaluar Cloud Functions/Cloud Run como una excepción deliberada, o ajustar el proceso operativo.

## 3. Antes de comenzar: decisiones de negocio

> **Actualización 19 de octubre de 2026:** las respuestas y precisiones vigentes están consolidadas en la sección 9. Esa sección reemplaza las respuestas iniciales que siguen en esta sección.

Resolver y dejar por escrito estas preguntas antes de definir el esquema final:

1. ¿Los usuarios iniciarán sesión con correo, usuario, o ambos? Firebase Authentication admite correo como identificador estándar; iniciar con nombre de usuario requiere diseñar una resolución segura a correo.
    Respuesta: entonces quiero que sea con correo
2. ¿Quién crea, bloquea y restablece cuentas? ¿Se permite el alta desde la aplicación o solo por administración?
    Respuesta: solo por administrador
3. ¿Cuáles son los roles reales y qué acciones puede ejecutar cada rol? El frontend actual reconoce `ROLE_ADMIN`, pero eso no basta para establecer permisos completos.
Respuesta: los roles debe ser: ROLE_ADMIN Y ROLE_TRABAJADOR
4. ¿Se trata de un único grifo o de varias organizaciones/sedes? ¿Qué usuario puede ver datos de cada una?
Respuesta: por ahora es solo un grifo
5. ¿Qué reglas oficiales definen entrada, salida, litros/galones, redondeos, cierres, cortes y correcciones? ¿Se necesita un historial de auditoría inmutable?
Respuesta: no hay reglas por ahora y no se necesita historial de auditoria
6. ¿Se migrarán registros del backend actual? Definir periodo, volumen, datos personales, calidad y responsables de validar totales.
Respuesta: no se necesita migrar nada
7. ¿Qué nivel de operación se necesita sin conexión y desde qué dispositivos?
Respuesta: ningun nivel
8. ¿Cuál es el presupuesto y el volumen esperado de lecturas/escrituras? Firestore cobra por uso y el modelo de consultas determina el costo.
Respuesta: busco un plan gratuito, en que caso es gratuito, estuve en un plan sin costo desde hace 5 años pero solo se guardaban datos pequeños de medición, crees que si creamos un scrip que borre datos de hace 2 meses no nos cobre nada?

## 4. Fases y pasos

### Fase 0 — Preparación y línea base

1. Acordar nombre de rama con el equipo y crear una rama nueva desde el punto deseado de la versión vigente (por ejemplo, `codex/migracion-firebase`). No sobrescribir la rama de producción.
2. Registrar commit base, versión Angular (`21.0.0` según `package.json`), scripts disponibles, despliegue actual y configuración de API Spring Boot.
3. Inventariar cada pantalla, operación y endpoint que hoy consume Spring; asignar responsable funcional y confirmar reglas de negocio.
4. Acordar alcance de la primera entrega: autenticación, cada módulo de datos, migración histórica y alojamiento. No cambiar todos los módulos a la vez sin una estrategia para verificar datos.
5. Hacer respaldo verificable de la base de datos actual antes de cualquier migración de datos. No exportar contraseñas ni secretos.

**Entregables:** rama aislada, inventario de operaciones y aprobación del alcance.

### Fase 1 — Configurar el proyecto Firebase

1. Crear un proyecto en Firebase Console para desarrollo. Crear proyectos separados para pruebas/staging y producción antes de publicar la nueva versión.
2. Registrar una aplicación web dentro del proyecto y guardar su configuración pública de Firebase. Estos valores identifican el proyecto, pero las reglas de seguridad siguen siendo obligatorias.
3. Habilitar Cloud Firestore y Authentication. Seleccionar región de Firestore con el responsable del negocio, considerando ubicación de usuarios, latencia y que la región no se puede cambiar fácilmente después.
4. Configurar Authentication con los proveedores acordados. Definir dominios autorizados para desarrollo y producción.
5. Crear usuarios iniciales de forma controlada y decidir el procedimiento de altas, bajas, recuperación de acceso y bloqueo.
6. Configurar Firebase Local Emulator Suite para Auth y Firestore. Usar emuladores para desarrollo y pruebas de reglas; no probar reglas con datos productivos.
7. Configurar alertas de presupuesto/uso y revisar el plan de facturación requerido por los servicios elegidos antes de publicar.
8. Configurar despliegue de reglas e índices desde archivos versionados en el repositorio. No depender de reglas editadas únicamente desde la consola.

**Entregables:** proyectos Firebase por entorno, emuladores operativos y responsables de acceso definidos.

### Fase 2 — Definir identidad, permisos y seguridad

1. Mapear el perfil actual (`nombre`, `apellido`, correo, teléfono y rol) a un documento de perfil asociado al UID de Firebase Authentication. No usar identificadores numéricos secuenciales como prueba de identidad.
2. Definir las reglas de autorización por operación: lectura, creación, edición y eliminación para cada rol y ámbito (por ejemplo, sede/organización).
3. Elegir cómo asignar roles. Para una aplicación sin backend, se puede provisionar de forma administrativa un documento de permisos protegido que el usuario no pueda crear ni modificar; las reglas deben impedir que un usuario se eleve privilegios. Otra opción son custom claims, pero su asignación segura requiere una herramienta administrativa confiable que no se exponga al cliente.
4. Hacer que Firestore Security Rules validen UID, rol/ámbito, tipos, campos permitidos y referencias relevantes. No confiar en campos como `role`, `persona` o `idOrganization` enviados por el cliente.
5. Implementar recuperación/cierre de sesión y expiración según Authentication. No mantener contraseñas en documentos Firestore. Revisar el uso actual de `localStorage` y eliminar el flujo de tokens Spring; usar el estado/token administrado por Firebase SDK.
6. Definir estrategia de borrado/desactivación de usuarios y datos personales, registro de cambios y acceso de emergencia.

**Criterio de salida:** reglas probadas en emulador deniegan lecturas y escrituras anónimas, entre usuarios y entre organizaciones cuando no están autorizadas.

### Fase 3 — Diseñar el modelo de datos Firestore

1. Diseñar y documentar colecciones y documentos antes de reescribir servicios. Entidades observadas: perfiles, turnos, mediciones por surtidor, entradas de combustible, cortes/observaciones, instituciones, tipos de venta y detalle de ventas.
2. Establecer una convención de IDs (preferir IDs de documento Firestore), fechas (timestamp), unidades y nombres de campos; preparar conversión desde las interfaces actuales (`idTurno`, `idMedida`, `fechaEntrada`, etc.).
3. Decidir entre subcolecciones y referencias. Por ejemplo, mediciones pueden consultarse por turno, pero también por fecha/persona; considerar ambos patrones de consulta y sus reglas.
4. Diseñar consultas reales de pantalla: filtros, orden, paginación por cursor, reportes anuales y límites. Firestore no ofrece paginación por número de página de forma equivalente a la API actual; migrar paginadores a cursores y definir cómo se calcula el total.
5. Crear índices compuestos necesarios y mantener sus definiciones en el repositorio.
6. Revisar consistencia: si el cierre actualiza varias entidades, usar transacciones o escrituras por lotes compatibles con Firestore. Definir qué ocurre si hay concurrencia, conexión interrumpida o reintento.
7. Definir cómo se construyen reportes anuales. Evitar descargar todos los registros al navegador; decidir agregados/materializaciones, actualización de totales y límites de costo. Si se necesita agregación privilegiada o programada, reconsiderar la restricción de “sin backend”.
8. Documentar retención, exportación, respaldo y recuperación. Verificar si el plan de respaldo requerido tiene costo adicional.

**Entregable:** esquema lógico, ejemplos de documentos, catálogo de consultas, índices y reglas asociadas.

### Fase 4 — Adaptar la arquitectura Angular

1. Confirmar compatibilidad de AngularFire/Firebase SDK con la versión Angular 21 y elegir una única estrategia de integración (SDK modular oficial, con o sin AngularFire). Fijar versiones compatibles.
2. Mantener componentes enfocados en UI. Crear una capa de servicios/repositorios por dominio (turnos, mediciones, combustible, ventas, instituciones, personal) para que los componentes no llamen directamente a Firestore.
3. Sustituir gradualmente servicios HTTP Spring por repositorios Firebase sin cambiar primero todos los formularios. Conservar interfaces de dominio donde sean útiles y crear mapeadores entre documentos Firestore y modelos de interfaz.
4. Usar `inject()` y providers de Angular para inicializar Firebase y proveer dependencias. Mantener configuración por entorno sin incluir claves privadas.
5. Para estado reactivo y carga de datos, aplicar señales (`signal`, `computed`) y los patrones Angular adecuados; gestionar estados de carga, vacío, error y reintento. No duplicar estado derivado mediante efectos.
6. Conservar formularios reactivos existentes en la migración inicial. Angular del proyecto es v21; no adoptar Signal Forms, que la skill reserva para Angular v22+ estable, sin una actualización de versión planificada.
7. Mantener rutas lazy y guards para experiencia de acceso; verificar también cada permiso mediante reglas Firestore.
8. Eliminar interceptores, modelos de respuesta y manejo de errores exclusivos de Spring solo después de migrar los consumidores y confirmar que no haya referencias pendientes.
9. Centralizar mensajes de error y traducir errores Firebase a mensajes operativos útiles, sin mostrar detalles internos o datos sensibles.

**Entregable:** un módulo vertical completo operando con Firebase y emulador, con patrón reutilizable para los demás.

### Fase 5 — Migrar módulos por incrementos

Orden sugerido, sujeto a dependencias del negocio:

1. Autenticación y perfil de usuario.
2. Personal y asignación de roles/permisos.
3. Catálogos necesarios: instituciones y tipos de venta.
4. Turnos y mediciones, incluidas reglas de cierre y cálculos de totales.
5. Entradas de combustible y cortes/observaciones.
6. Ventas institucionales.
7. Reportes y agregados.

Para cada módulo: documentar reglas → implementar repositorio → definir reglas/índices → adaptar UI → probar contra emulador → validar con usuario de negocio → comparar resultados y aprobar el incremento.

### Fase 6 — Migración de datos, si aplica

1. Definir si la nueva versión parte vacía o importa históricos; no asumir que la migración de datos está incluida.
2. Exportar desde Spring/base de datos con respaldo y autorización. No copiar usuarios/contraseñas directamente a Firestore; migrar cuentas con el flujo soportado por Firebase Authentication o forzar restablecimiento seguro.
3. Crear un proceso de importación administrativo y repetible, con mapeo explícito de IDs y referencias. No ejecutar importaciones desde una sesión normal del navegador.
4. Ejecutar primero en proyecto de staging; registrar filas aceptadas/rechazadas y conservar trazabilidad de errores sin registrar datos personales innecesarios.
5. Conciliar conteos, periodos, relaciones, unidades y totales de ventas/turnos contra la fuente. Obtener aprobación del responsable funcional.
6. Planificar corte, congelamiento o sincronización final y plan de reversa. Evitar escrituras concurrentes en ambos sistemas sin una estrategia explícita.

### Fase 7 — Validación y preparación de lanzamiento

1. Revisar cada flujo de extremo a extremo con perfiles reales de permisos y datos representativos.
2. Probar reglas Firebase con casos permitidos y denegados en Emulator Suite.
3. Probar concurrencia, cortes/reintentos, duplicados, errores de red, formularios inválidos, paginación y zona horaria.
4. Comparar los cálculos del sistema nuevo con ejemplos aprobados del sistema actual.
5. Revisar accesibilidad, diseño adaptable, rendimiento en dispositivos de operación y consumo/costo estimado de consultas.
6. Verificar recuperación de cuenta, desactivación, respaldo/restauración y monitoreo de errores.
7. Desplegar a staging y obtener aceptación de operación antes de promover a producción.
8. Definir reversa: conservar disponible la versión Spring durante el periodo acordado, conservar respaldos y establecer cómo se volverá a ella si falla el corte.

## 5. Buenas prácticas Angular a aplicar

La skill `angular-developer` indica analizar primero la versión, usar CLI para scaffold, seguir el estilo Angular y hacer `ng build` al terminar cambios de código. Para esta migración:

- La base actual es Angular 21. Mantener la estrategia actual de formularios reactivos durante la migración; Signal Forms se recomienda en la skill para Angular 22+ estable.
- Usar Angular CLI al crear servicios, rutas o componentes para respetar la estructura y convenciones del proyecto.
- Usar DI (`inject()` o providers), servicios por dominio y componentes con responsabilidades claras.
- Usar Signals para estado local/derivado y evitar efectos como mecanismo de sincronización rutinaria.
- Mantener rutas lazy y usar guards solo como control de experiencia; Security Rules son la frontera real de datos.
- En cada entrega de implementación, ejecutar `ng build` y corregir errores antes de considerar la rama lista. Añadir pruebas de reglas e integración como parte del plan de migración.
- Consultar las referencias de la skill para DI, Signals, formularios, rutas, configuración por entorno y pruebas antes de implementar cada área.

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Reglas Firestore demasiado abiertas o rol manipulable desde el cliente | Denegar por defecto; pruebas de reglas en emulador; revisión independiente antes de desplegar. |
| Acceso administrativo difícil sin backend | Acordar proceso de aprovisionamiento seguro y documentado; nunca incluir Admin SDK ni service account en Angular. |
| Consultas/reporte no compatibles con Firestore o costos altos | Diseñar desde consultas reales, estimar lecturas y materializar agregados cuando proceda. |
| Paginación o totales distintos a Spring | Rediseñar UI con cursores y definir explícitamente semántica del total. |
| Pérdida o duplicación durante importación/cambio | Respaldo, importación repetible, conciliación y corte con reversa. |
| Offline/caché expone datos o permite escrituras conflictivas | Decidir explícitamente si habilitar persistencia local; revisar dispositivo compartido, limpieza y conflictos. |
| Dependencia fuerte de Firebase y dificultad de cambio futuro | Mantener repositorios y modelos de dominio desacoplados del SDK. |
| Fechas, unidades o cálculos ambiguos | Validación con responsables del negocio y casos de referencia antes de migrar cálculos. |

## 7. Lista de verificación para iniciar implementación

- [ ] Alcance, rama base y nombre de rama confirmados.
- [ ] Proyecto Firebase de desarrollo creado y accesos del equipo definidos.
- [ ] Authentication y método de alta/login definidos.
- [ ] Roles y matriz de permisos aprobados.
- [ ] Decisión sobre Firestore, región y presupuesto aprobada.
- [ ] Esquema, consultas, paginación, índices y reglas diseñados.
- [ ] Decisión sobre importación de históricos, respaldo y reversa documentada.
- [ ] Entorno Emulator Suite definido.
- [ ] Hosting y variables/configuración por entorno definidos.
- [ ] Criterios de aceptación por módulo y responsable de validación definidos.

## 8. Referencias del repositorio

- Angular y scripts: `package.json`.
- Rutas: `src/app/app.routes.ts`, `src/app/auth/auth.routes.ts`, `src/app/oil-store/oil-store.routes.ts`.
- Autenticación actual: `src/app/auth/services/auth.service.ts`.
- Servicios HTTP actuales: `src/app/oil-store/service/` y `src/app/auth/services/`.
- Modelos actuales: `src/app/oil-store/model/` y `src/app/auth/interfaces/`.
- URL Spring configurada: `src/environments/environment.ts` y `src/environments/environment.development.ts`.
- Guía Angular del proyecto: `.agents/skills/angular-developer/SKILL.md`.

## 9. Respuestas confirmadas y decisión de costos (19 de octubre de 2026)

### Decisiones confirmadas

- Inicio de sesión con correo electrónico.
- Solo el administrador dará de alta, bloqueará o restablecerá cuentas; no habrá registro público.
- Roles iniciales: `ROLE_ADMIN` y `ROLE_TRABAJADOR`. Falta definir permisos concretos de cada rol por acción antes de escribir las reglas Firestore.
- Un solo grifo en esta versión.
- No hay reglas de negocio oficiales para cálculos, cierres o correcciones y no se necesita historial de auditoría. No inventar reglas contables durante la migración.
- No se migrarán datos del sistema Spring Boot; la versión Firebase comienza sin históricos importados.
- No se necesita operar sin conexión.
- Se busca operar sin costo y el volumen previsto aún no se ha medido.

### ¿Firebase puede ser gratuito? ¿Conviene borrar datos de más de dos meses?

Cloud Firestore Standard tiene actualmente cuota sin costo de **1 GiB almacenado, 50.000 lecturas al día, 20.000 escrituras al día, 20.000 eliminaciones al día y 10 GiB de transferencia saliente al mes**, para una base de datos gratuita por proyecto. Authentication con correo y contraseña está entre las opciones sin costo. Las cuotas y condiciones pueden cambiar.

En el plan Spark, superar cuotas puede hacer que el producto deje de aceptar operaciones hasta el siguiente ciclo; no implica simplemente cobrar el exceso. Por eso es posible mantenerse sin costo si el proyecto permanece en Spark, usa funciones compatibles y no rebasa límites. Debe verificarse en la consola el plan real del proyecto.

Borrar datos cada dos meses no garantiza un costo de cero ni es necesario para evitar cobros si se respetan los límites. Las eliminaciones también consumen cuota diaria (20.000 gratuitas). La función TTL de Firestore no tiene cuota gratuita y requiere habilitar facturación. Las tareas programadas con Cloud Functions/Cloud Scheduler también pueden requerir Blaze. Para mantener Spark, no asumir que habrá un borrado automático administrado sin costo; definir retención y una operación administrativa compatible, sin exponer permisos elevados en Angular.

Con pocas mediciones pequeñas y consultas moderadas, mantenerse dentro de la cuota es plausible, pero el tamaño pequeño no determina el costo por sí solo: cuentan lecturas por listados, escrituras, eliminaciones, índices y transferencia. Limitar resultados/paginar, evitar descargas innecesarias y observar el uso real antes de decidir retención.

### Pendientes para implementación

- Definir la matriz de permisos de ambos roles por colección y operación.
- Establecer por un proceso controlado el primer usuario administrador y el aprovisionamiento de los demás. No permitir que alguien se asigne el rol desde el cliente.
- Elegir región Firestore y alojamiento de la SPA.
- Acordar retención futura de datos nuevos; no migrar históricos no define cuánto guardar los datos que se creen con la nueva versión.

### Fuentes oficiales

- [Planes de precios de Firebase](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans): Spark, Blaze y qué ocurre al superar cuotas.
- [Precios de Cloud Firestore](https://firebase.google.com/docs/firestore/pricing): cuota gratuita, facturación de lecturas/escrituras/eliminaciones y funciones sin cuota.
- [Eliminación masiva de datos de Firestore](https://firebase.google.com/docs/firestore/manage-data/bulk-delete): borrado masivo y facturación.
