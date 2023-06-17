const chokidar = require("chokidar");
const { runCompiler } = require("./compiler");

// Directorio o archivos que deseas observar
const directorioObservado = "../blog";

// Configuración de Chokidar
const opciones = {
  persistent: true, // Mantener la observación activa después del primer evento
};

// Crear el observador
const watcher = chokidar.watch(directorioObservado, opciones);

// Evento: cambio detectado en un archivo
watcher.on("change", (rutaArchivo) => {
  console.log(`Se ha detectado un cambio en el archivo: ${rutaArchivo}`);
  console.log("Generando nuevo blog");
  runCompiler();
});

// Evento: error en el observador
watcher.on("error", (error) => {
  console.error(`Error en el observador: ${error}`);
});

// Evento: observación inicial completa
watcher.on("ready", () => {
  console.log("Observación inicial completa. Esperando cambios...");
});
