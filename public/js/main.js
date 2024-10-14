// Obtener los dispositivos disponibles y mostrarlos en la tabla
async function obtenerDispositivos() {
    const response = await fetch('/dispositivos');
    const dispositivos = await response.json();

    const tbody = document.querySelector('#tablaInventario tbody');
    tbody.innerHTML = ''; // Limpiar tabla

    dispositivos.forEach(dispositivo => {
        const fila = `
            <tr>
              <td>${dispositivo.Id}</td>
              <td>${dispositivo.Nombre}</td>
              <td>${dispositivo.Marca}</td>
              <td>${dispositivo.Modelo}</td>
              <td>$${dispositivo.Precio.toFixed(2)}</td>
              <td>${dispositivo.Estado}</td>
              <td><button class="btn btn-success" onclick="venderDispositivo(${dispositivo.Id})">Marcar como vendido</button></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', fila);
    });
}

// Función para marcar un dispositivo como vendido
async function venderDispositivo(id) {
    const response = await fetch('/vender', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });

    if (response.ok) {
        obtenerDispositivos();
    } else {
        alert('Error al vender el dispositivo');
    }
}

// Inicializar la tabla al cargar la página
document.addEventListener('DOMContentLoaded', obtenerDispositivos);
