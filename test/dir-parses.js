const { expect } = require("chai");
const { obtenerNombresArchivosYCarpetas } = require("./ruta-del-archivo");

describe("Pruebas de obtenerNombresArchivosYCarpetas", () => {
  it("debe retornar un array con la información de los elementos", () => {
    const rutaProyecto = "/ruta/al/proyecto";
    const elementos = obtenerNombresArchivosYCarpetas(rutaProyecto);

    // Realiza las aserciones correspondientes
    expect(elementos).to.be.an("array");
    expect(elementos).to.have.lengthOf(3); // Ajusta el número según tu caso de prueba
    expect(elementos[0].nombre).to.equal("archivo.txt"); // Ajusta según los elementos esperados
    // ...

    // Agrega más aserciones según tus necesidades de prueba
  });
});
