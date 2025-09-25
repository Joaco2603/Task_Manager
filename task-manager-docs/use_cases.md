# Casos de Uso del Sistema
**Task Manager - Aplicación de Gestión de Tareas**

---

## 1. Resumen de Casos de Uso

| ID | Nombre del Caso de Uso | Actores Principales | Descripción Breve |
|---|---|---|---|
| CU-01 | Crear Nueva Tarea | Usuario | El usuario crea una nueva tarea con título, descripción y metadatos |
| CU-02 | Visualizar Lista de Tareas | Usuario | El usuario ve todas sus tareas organizadas en una lista |
| CU-03 | Marcar Tarea como Completada | Usuario | El usuario cambia el estado de una tarea a completada |
| CU-04 | Marcar Tarea como Pendiente | Usuario | El usuario cambia el estado de una tarea a pendiente |
| CU-05 | Editar Tarea Existente | Usuario | El usuario modifica los detalles de una tarea existente |
| CU-06 | Eliminar Tarea | Usuario | El usuario elimina una tarea de su lista |
| CU-07 | Filtrar Tareas por Estado | Usuario | El usuario filtra la vista para mostrar solo tareas completadas o pendientes |
| CU-08 | Buscar Tareas | Usuario | El usuario busca tareas específicas por texto |
| CU-09 | Categorizar Tareas | Usuario | El usuario asigna categorías/etiquetas a sus tareas |
| CU-10 | Gestionar Perfil de Usuario | Usuario | El usuario actualiza su información personal y preferencias |

---

## 2. Especificación Detallada de Casos de Uso

### CU-01: Crear Nueva Tarea

**Actores**: Usuario

**Precondiciones**: 
- El usuario debe estar autenticado en el sistema
- La interfaz de creación debe estar disponible

**Flujo Principal**:
1. El usuario accede a la opción "Nueva Tarea"
2. El sistema presenta el formulario de creación
3. El usuario ingresa el título de la tarea (obligatorio)
4. El usuario ingresa la descripción (opcional)
5. El usuario selecciona la prioridad (Alta/Media/Baja)
6. El usuario establece fecha límite (opcional)
7. El usuario confirma la creación
8. El sistema valida los datos ingresados
9. El sistema almacena la nueva tarea
10. El sistema confirma la creación exitosa

**Flujos Alternativos**:
- **FA-01**: Si el título está vacío, el sistema muestra error y solicita completar el campo
- **FA-02**: Si hay error en la conexión, el sistema guarda en caché local y sincroniza después

**Postcondiciones**:
- La nueva tarea se almacena en la base de datos
- La tarea aparece en la lista principal con estado "Pendiente"
- Se actualiza el contador de tareas totales

---

### CU-02: Visualizar Lista de Tareas

**Actores**: Usuario

**Precondiciones**: 
- El usuario debe estar autenticado
- Debe existir conexión con la base de datos

**Flujo Principal**:
1. El usuario accede a la vista principal
2. El sistema consulta todas las tareas del usuario
3. El sistema organiza las tareas por fecha de creación (más recientes primero)
4. El sistema presenta la lista con información básica de cada tarea
5. Para cada tarea se muestra: título, estado, prioridad, fecha límite
6. El usuario puede interactuar con elementos individuales

**Flujos Alternativos**:
- **FA-01**: Si no hay tareas, se muestra mensaje de "Sin tareas creadas"
- **FA-02**: Si hay error de conexión, se muestran tareas en caché local

**Postcondiciones**:
- La lista refleja el estado actual de todas las tareas
- Los elementos son interactivos para futuras acciones

---

### CU-03: Marcar Tarea como Completada

**Actores**: Usuario

**Precondiciones**: 
- La tarea debe existir y estar en estado "Pendiente"
- El usuario debe tener permisos sobre la tarea

**Flujo Principal**:
1. El usuario identifica la tarea a completar
2. El usuario hace clic en el checkbox o botón de "Completar"
3. El sistema actualiza el estado a "Completada"
4. El sistema registra timestamp de completación
5. El sistema actualiza la visualización (cambio de color, tachado, etc.)
6. El sistema confirma la acción con feedback visual

**Flujos Alternativos**:
- **FA-01**: Si hay error de conexión, el cambio se guarda localmente y sincroniza después
- **FA-02**: El usuario puede deshacer la acción en los siguientes 5 segundos

**Postcondiciones**:
- El estado de la tarea cambia a "Completada" en base de datos
- Se registra la fecha y hora de completación
- La tarea se muestra visualmente como completada

---

### CU-04: Marcar Tarea como Pendiente

**Actores**: Usuario

**Precondiciones**: 
- La tarea debe existir y estar en estado "Completada"
- El usuario debe tener permisos sobre la tarea

**Flujo Principal**:
1. El usuario identifica la tarea completada a reactivar
2. El usuario hace clic en el checkbox para desmarcar o botón de "Reactivar"
3. El sistema actualiza el estado a "Pendiente"
4. El sistema elimina el timestamp de completación
5. El sistema actualiza la visualización 
6. El sistema confirma la acción con feedback visual

**Flujos Alternativos**:
- **FA-01**: Si hay error de conexión, el cambio se guarda localmente
- **FA-02**: Se solicita confirmación si la tarea fue completada hace más de 7 días

**Postcondiciones**:
- El estado de la tarea cambia a "Pendiente" en base de datos
- Se elimina la fecha de completación
- La tarea se muestra visualmente como pendiente

---

### CU-05: Editar Tarea Existente

**Actores**: Usuario

**Precondiciones**: 
- La tarea debe existir en el sistema
- El usuario debe tener permisos de edición

**Flujo Principal**:
1. El usuario selecciona una tarea para editar
2. El sistema presenta el formulario de edición con datos actuales
3. El usuario modifica los campos deseados (título, descripción, prioridad, fecha)
4. El usuario confirma los cambios
5. El sistema valida los nuevos datos
6. El sistema actualiza la tarea en base de datos
7. El sistema confirma la actualización exitosa

**Flujos Alternativos**:
- **FA-01**: Si el título queda vacío, se muestra error de validación
- **FA-02**: El usuario puede cancelar la edición sin guardar cambios
- **FA-03**: Se mantiene histórico de cambios para auditoría

**Postcondiciones**:
- Los datos de la tarea se actualizan en base de datos
- La vista se actualiza con la información nueva
- Se registra timestamp de última modificación

---

### CU-06: Eliminar Tarea

**Actores**: Usuario

**Precondiciones**: 
- La tarea debe existir en el sistema
- El usuario debe tener permisos de eliminación

**Flujo Principal**:
1. El usuario selecciona una tarea para eliminar
2. El sistema solicita confirmación de eliminación
3. El usuario confirma la acción
4. El sistema elimina la tarea de la base de datos
5. El sistema actualiza la vista removiendo la tarea
6. El sistema confirma la eliminación

**Flujos Alternativos**:
- **FA-01**: El usuario puede cancelar la eliminación
- **FA-02**: Se ofrece opción de "Papelera" para recuperación temporal (30 días)
- **FA-03**: Si es tarea importante, se requiere doble confirmación

**Postcondiciones**:
- La tarea se elimina permanentemente o se mueve a papelera
- La lista se actualiza sin mostrar la tarea eliminada
- Se actualiza el contador de tareas totales

---

### CU-07: Filtrar Tareas por Estado

**Actores**: Usuario

**Precondiciones**: 
- Deben existir tareas en el sistema
- La interfaz de filtrado debe estar disponible

**Flujo Principal**:
1. El usuario accede a las opciones de filtrado
2. El usuario selecciona el filtro deseado (Todas/Pendientes/Completadas)
3. El sistema aplica el filtro seleccionado
4. El sistema actualiza la lista mostrando solo tareas que coinciden
5. Se actualiza el indicador visual del filtro activo

**Flujos Alternativos**:
- **FA-01**: Si no hay tareas que coincidan con el filtro, se muestra mensaje informativo
- **FA-02**: El usuario puede limpiar filtros para mostrar todas las tareas

**Postcondiciones**:
- Solo se muestran tareas que coinciden con el filtro
- El filtro activo queda guardado en la sesión del usuario

---

### CU-08: Buscar Tareas

**Actores**: Usuario

**Precondiciones**: 
- Deben existir tareas en el sistema
- La función de búsqueda debe estar disponible

**Flujo Principal**:
1. El usuario ingresa texto en el campo de búsqueda
2. El sistema busca coincidencias en títulos y descripciones en tiempo real
3. El sistema muestra resultados que contienen el texto buscado
4. El usuario puede seleccionar una tarea de los resultados

**Flujos Alternativos**:
- **FA-01**: Si no hay coincidencias, se muestra mensaje "Sin resultados"
- **FA-02**: Se puede buscar por etiquetas o categorías
- **FA-03**: La búsqueda distingue entre mayúsculas y minúsculas

**Postcondiciones**:
- Se muestran solo las tareas que coinciden con la búsqueda
- El término de búsqueda se mantiene hasta que el usuario lo borre

---

### CU-09: Categorizar Tareas

**Actores**: Usuario

**Precondiciones**: 
- La tarea debe existir
- Deben estar definidas categorías en el sistema

**Flujo Principal**:
1. El usuario accede a la opción de categorizar una tarea
2. El sistema muestra las categorías disponibles
3. El usuario selecciona una o más categorías
4. El sistema asocia las categorías con la tarea
5. El sistema actualiza la visualización con códigos de color

**Flujos Alternativos**:
- **FA-01**: El usuario puede crear nuevas categorías
- **FA-02**: Se pueden asignar múltiples categorías a una tarea
- **FA-03**: El usuario puede remover categorías existentes

**Postcondiciones**:
- Las categorías se asocian con la tarea en base de datos
- La tarea se muestra con los colores correspondientes
- Se puede filtrar por categorías en el futuro

---

### CU-10: Gestionar Perfil de Usuario

**Actores**: Usuario

**Precondiciones**: 
- El usuario debe estar autenticado
- Debe existir perfil de usuario en el sistema

**Flujo Principal**:
1. El usuario accede a configuración de perfil
2. El sistema muestra información actual del perfil
3. El usuario modifica los campos deseados (nombre, email, preferencias)
4. El usuario guarda los cambios
5. El sistema valida y actualiza la información
6. El sistema confirma la actualización

**Flujos Alternativos**:
- **FA-01**: Se requiere confirmación para cambio de email
- **FA-02**: El usuario puede cambiar preferencias de notificaciones
- **FA-03**: Se valida formato de email y otros campos obligatorios

**Postcondiciones**:
- La información del perfil se actualiza en base de datos
- Las preferencias se aplican a la experiencia de usuario
- Se registra audit trail de cambios importantes

---

*Documento versión 1.0 - Septiembre 2025*
