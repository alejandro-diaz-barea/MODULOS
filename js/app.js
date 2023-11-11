// Importar funciones de database.js
import { abrirBaseDeDatos, cargarClientes } from './database.js';

document.addEventListener("DOMContentLoaded", () => {
  // Selector
  const listadoClientes = document.querySelector("#listado-clientes");

  // Abrir base de datos y cargar clientes
  abrirBaseDeDatos("CRM", 1)
    .then((db) => cargarClientes(db, listadoClientes))
    .catch((error) => console.error(error));
});