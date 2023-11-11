// Función para abrir la base de datos
export function abrirBaseDeDatos(nombre, version) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(nombre, version);
  
      request.onerror = (event) => reject(new Error('Error al abrir la base de datos.'));
      request.onsuccess = (event) => resolve(event.target.result);
    });
  }
  
  // Función para cargar clientes en la lista
  export function cargarClientes(db, listadoClientes) {
    const transaction = db.transaction(["cliente"], "readonly");
    const objectStore = transaction.objectStore("cliente");
    const cursor = objectStore.openCursor();
  
    cursor.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const { nombre, telefono, empresa, id } = cursor.value;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <p class="text-sm leading-5 font-medium text-gray-900">${nombre}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <p class="text-sm leading-5 text-gray-900">${telefono}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <p class="text-sm leading-5 text-gray-900">${empresa}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
            <a href="#" data-id="${id}" class="text-red-600 hover:text-red-900 eliminar-cliente">Eliminar</a>
          </td>
        `;
  
        listadoClientes.appendChild(row);
        cursor.continue();
      }
    };
  
    // Agregar escuchas para eliminar clientes
    listadoClientes.addEventListener("click", (e) => {
      if (e.target.classList.contains("eliminar-cliente")) {
        const clienteId = e.target.getAttribute("data-id");
        eliminarCliente(db, clienteId, listadoClientes);
      }
    });
  }
  
  // Función para eliminar un cliente
  export function eliminarCliente(db, clienteId, listadoClientes) {
    const transaction = db.transaction(["cliente"], "readwrite");
    const objectStore = transaction.objectStore("cliente");
  
    objectStore.delete(parseInt(clienteId)).onsuccess = () => {
      console.log("Cliente eliminado de IndexedDB");
      // Vuelve a cargar la tabla para reflejar el cambio
      listadoClientes.innerHTML = "";
      cargarClientes(db, listadoClientes);
    };
  }
  