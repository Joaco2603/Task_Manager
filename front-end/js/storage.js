// storage.js - Manejo de localStorage para Task Manager
class StorageManager {
    constructor() {
        this.storageKey = 'taskManager_tasks';
        this.settingsKey = 'taskManager_settings';
    }
    getTasks() {
        try {
            const tasks = localStorage.getItem(this.storageKey);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            return [];
        }
    }
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Error al guardar tareas:', error);
            return false;
        }
    }
    getSettings() {
        try {
            const settings = localStorage.getItem(this.settingsKey);
            return settings ? JSON.parse(settings) : {
                theme: 'light',
                sortBy: 'created',
                showCompleted: true
            };
        } catch (error) {
            console.error('Error al cargar configuración:', error);
            return {};
        }
    }
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            return false;
        }
    }
    exportData() {
        return {
            tasks: this.getTasks(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    }
    importData(data) {
        try {
            if (data.tasks) this.saveTasks(data.tasks);
            if (data.settings) this.saveSettings(data.settings);
            return true;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }
}
