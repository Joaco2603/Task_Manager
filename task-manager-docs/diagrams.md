# Diagramas del Sistema
**Task Manager - Aplicación de Gestión de Tareas**

---

## 1. Diagrama de Casos de Uso

```mermaid
graph TD
    User((Usuario))
    
    subgraph "Sistema Task Manager"
        CU01[Crear Nueva Tarea]
        CU02[Visualizar Lista de Tareas]
        CU03[Marcar Tarea como Completada]
        CU04[Marcar Tarea como Pendiente]
        CU05[Editar Tarea Existente]
        CU06[Eliminar Tarea]
        CU07[Filtrar Tareas por Estado]
        CU08[Buscar Tareas]
        CU09[Categorizar Tareas]
        CU10[Gestionar Perfil de Usuario]
    end
    
    User --> CU01
    User --> CU02
    User --> CU03
    User --> CU04
    User --> CU05
    User --> CU06
    User --> CU07
    User --> CU08
    User --> CU09
    User --> CU10
    
    CU05 -.-> CU09
    CU02 --> CU07
    CU02 --> CU08
```

---

## 2. Diagrama de Clases del Dominio

```mermaid
classDiagram
    class User {
        -userId: string
        -email: string
        -name: string
        -createdAt: Date
        -preferences: UserPreferences
        +login()
        +logout()
        +updateProfile()
        +getPreferences()
    }
    
    class Task {
        -taskId: string
        -title: string
        -description: string
        -status: TaskStatus
        -priority: Priority
        -dueDate: Date
        -createdAt: Date
        -updatedAt: Date
        -completedAt: Date
        +create()
        +update()
        +delete()
        +markAsCompleted()
        +markAsPending()
        +addCategory()
    }
    
    class Category {
        -categoryId: string
        -name: string
        -color: string
        -createdAt: Date
        +create()
        +update()
        +delete()
    }
    
    class TaskCategory {
        -taskId: string
        -categoryId: string
        -assignedAt: Date
    }
    
    class UserPreferences {
        -theme: string
        -language: string
        -notifications: boolean
        -dateFormat: string
    }
    
    class TaskStatus {
        <<enumeration>>
        PENDING
        COMPLETED
        ARCHIVED
    }
    
    class Priority {
        <<enumeration>>
        HIGH
        MEDIUM
        LOW
    }
    
    User ||--o{ Task : owns
    User ||--|| UserPreferences : has
    Task }o--o{ Category : categorized
    Task ||--o{ TaskCategory : through
    Category ||--o{ TaskCategory : through
    Task ||--|| TaskStatus : has
    Task ||--|| Priority : has
```

---

## 3. Diagrama de Arquitectura de Sistema Frontend-Only

```mermaid
graph TB
    subgraph "Cliente (Navegador)"
        subgraph "Frontend Application"
            HTML[HTML Structure<br/>index.html]
            CSS[CSS Styles<br/>styles.css + responsive.css]
            JS[JavaScript Modules<br/>app.js + taskManager.js<br/>+ storage.js + utils.js]
        end
        
        subgraph "Browser APIs"
            LocalStorage[localStorage API<br/>Persistencia de datos]
            DOM[DOM API<br/>Manipulación UI]
            Events[Events API<br/>Interacciones usuario]
        end
        
        subgraph "PWA Features"
            ServiceWorker[Service Worker<br/>Cache offline]
            Manifest[Web App Manifest<br/>Instalación PWA]
        end
    end
    
    subgraph "Datos Locales"
        TaskData[Tareas del Usuario<br/>JSON en localStorage]
        Settings[Configuraciones<br/>Preferencias usuario]
    end
    
    HTML --> DOM
    CSS --> DOM
    JS --> DOM
    JS --> Events
    JS --> LocalStorage
    
    LocalStorage --> TaskData
    LocalStorage --> Settings
    
    ServiceWorker --> HTML
    ServiceWorker --> CSS
    ServiceWorker --> JS
    
    Manifest --> ServiceWorker
```

---

## 4. Diagrama de Flujo - Gestión de Estados de Tarea

```mermaid
stateDiagram-v2
    [*] --> Pendiente : Crear Nueva Tarea
    
    Pendiente --> Completada : Marcar como Completada
    Completada --> Pendiente : Reactivar Tarea
    
    Pendiente --> Editando : Editar Tarea
    Editando --> Pendiente : Guardar Cambios
    Editando --> Pendiente : Cancelar
    
    Completada --> Editando : Editar Tarea Completada
    Editando --> Completada : Guardar (mantiene estado)
    
    Pendiente --> Eliminada : Eliminar Tarea
    Completada --> Eliminada : Eliminar Tarea
    Eliminada --> [*]
    
    Pendiente --> Archivada : Archivar (opcional)
    Completada --> Archivada : Archivar Automático
    Archivada --> Pendiente : Restaurar
    Archivada --> Eliminada : Eliminar Definitivo
```

---

## 5. Diagrama de Secuencia - Crear Nueva Tarea

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API Gateway
    participant TS as Task Service
    participant DB as Database
    participant C as Cache
    
    U->>+F: Llenar formulario nueva tarea
    F->>+F: Validar datos localmente
    F->>+A: POST /api/tasks
    Note over A: Verificar autenticación JWT
    A->>+TS: Crear nueva tarea
    TS->>+DB: INSERT nueva tarea
    DB-->>-TS: Confirmación ID generado
    TS->>+C: Invalidar cache usuario
    C-->>-TS: Cache actualizado
    TS-->>-A: Respuesta exitosa + tarea creada
    A-->>-F: Status 201 + datos tarea
    F->>+F: Actualizar estado local
    F-->>-U: Mostrar confirmación + nueva tarea en lista
```

---

## 6. Diagrama de Componentes Frontend

```mermaid
graph TD
    subgraph "Aplicación Frontend"
        HTML[index.html<br/>Estructura base]
        
        subgraph "CSS Modules"
            BaseCSS[styles.css<br/>Estilos base]
            ResponsiveCSS[responsive.css<br/>Media queries]
            ThemeCSS[themes.css<br/>Temas opcionales]
        end
        
        subgraph "JavaScript Modules"
            App[app.js<br/>Controlador principal]
            TaskManager[taskManager.js<br/>Gestión de tareas]
            Storage[storage.js<br/>localStorage Manager]
            Utils[utils.js<br/>Funciones utilitarias]
        end
        
        subgraph "Browser Storage"
            LocalStorage[localStorage<br/>tasks + settings]
            SessionStorage[sessionStorage<br/>estado temporal]
        end
        
        subgraph "Web APIs"
            DOMApi[DOM API<br/>Manipulación elementos]
            EventApi[Events API<br/>Manejo interacciones]
            StorageApi[Storage API<br/>Persistencia datos]
        end
    end
    
    HTML --> BaseCSS
    HTML --> ResponsiveCSS
    HTML --> App
    
    App --> TaskManager
    App --> Utils
    TaskManager --> Storage
    
    Storage --> StorageApi
    StorageApi --> LocalStorage
    StorageApi --> SessionStorage
    
    App --> DOMApi
    App --> EventApi
    
    Utils --> DOMApi
```

---

## 7. Modelo de Datos LocalStorage

```mermaid
erDiagram
    TASKS {
        string id PK
        string title
        string description
        enum status
        enum priority
        string dueDate
        string createdAt
        string updatedAt
        string completedAt
    }
    
    SETTINGS {
        string theme
        string language
        boolean notifications
        string dateFormat
        string sortBy
        boolean showCompleted
    }
    
    APP_STATE {
        string currentFilter
        string searchTerm
        array tasks
        object settings
        string version
        string lastSync
    }
    
    TASKS ||--o{ APP_STATE : contains
    SETTINGS ||--|| APP_STATE : includes
```

## 8. Diagrama de Flujo - Operaciones con LocalStorage

```mermaid
flowchart TD
    Start([Iniciar Aplicación]) --> LoadData{localStorage disponible?}
    
    LoadData -->|Sí| GetTasks[Obtener tareas de localStorage]
    LoadData -->|No| ShowError[Mostrar error: Storage no disponible]
    
    GetTasks --> ParseData{Datos válidos?}
    ParseData -->|Sí| InitApp[Inicializar aplicación]
    ParseData -->|No| ResetData[Crear estructura inicial]
    
    ResetData --> InitApp
    InitApp --> UserAction{Acción del usuario}
    
    UserAction -->|Crear| CreateTask[Crear nueva tarea]
    UserAction -->|Editar| UpdateTask[Actualizar tarea]
    UserAction -->|Eliminar| DeleteTask[Eliminar tarea]
    UserAction -->|Filtrar| FilterTasks[Aplicar filtros]
    
    CreateTask --> ValidateInput{Input válido?}
    ValidateInput -->|Sí| SaveToStorage[Guardar en localStorage]
    ValidateInput -->|No| ShowValidationError[Mostrar error validación]
    
    UpdateTask --> SaveToStorage
    DeleteTask --> SaveToStorage
    FilterTasks --> UpdateView[Actualizar vista]
    
    SaveToStorage --> CheckStorage{Storage exitoso?}
    CheckStorage -->|Sí| UpdateView
    CheckStorage -->|No| ShowSaveError[Mostrar error al guardar]
    
    ShowValidationError --> UserAction
    ShowSaveError --> UserAction
    ShowError --> End([Fin])
    UpdateView --> UserAction
```

---

*Documento versión 1.0 - Septiembre 2025*
