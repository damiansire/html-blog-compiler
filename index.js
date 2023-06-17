//Run file compiler
const { runCompiler } = require("./src/libs/compiler");

const modo = process.argv[2]; // Obtener el tercer argumento de la línea de comandos

if (modo === "watch") {
  // Lógica para el modo 1
  console.log("Ejecutando en modo watch");
  require("./src/libs/observer");
} else {
  console.log("Ejecutando en modo default");
  runCompiler();
}
