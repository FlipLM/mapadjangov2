var mapa = L.map('mapa').setView([-15.783479, -47.913372], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mapa);

var editingStation = false;

mapa.on('click', function (event) {
    var lat = event.latlng.lat;
    var lon = event.latlng.lng;

    if (!editingStation) {
        var popupContent = `
            <form id="popup-form">
                <label for="station_name">Nome da estação:</label>
                <input type="text" id="station_name" name="station_name" placeholder="Informe o nome da estação" required>

                <label for="station">Código da estação:</label>
                <input type="text" id="station" name="station" placeholder="Informe o nome da estação com seu número" required>

                <label for="station_number">Número da estação:</label>
                <input type="number" id="station_number" name="station_number" placeholder="Informe o número da estação" required>

                <input type="hidden" id="lat" name="lat" value="${lat}">
                <input type="hidden" id="lon" name="lon" value="${lon}">

                <button type="button" onclick="submitForm('${lat}', '${lon}')">Adicionar estação</button>
            </form>
        `;

        L.popup()
            .setLatLng(event.latlng)
            .setContent(popupContent)
            .openOn(mapa);
    }
});

function loadStations() {
    fetch('/api/estacoes/')
        .then(response => response.json())
        .then(data => {
            mapa.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    mapa.removeLayer(layer);
                }
            });

            for (let estacao of data) {
                var marker = L.marker([estacao.lat, estacao.lon]).addTo(mapa);
                marker.bindPopup(`<div><strong>${estacao.station_name}</strong><br><button onclick="openEditPopup(${JSON.stringify(estacao).replace(/"/g, '&quot;')})">Editar</button></div>`);

                marker.on('click', function () {
                    // Não é necessário abrir o pop-up ao clicar no marcador, pois o botão de editar já está disponível no pop-up.
                });
            }
        });
}

function openEditPopup(station) {
    var popupContent = `
        <form id="edit-popup-form">
            <label for="edit_station_name">Nome da estação:</label>
            <input type="text" id="edit_station_name" name="station_name" value="${station.station_name}" required>

            <input type="hidden" id="edit_station" name="station" value="${station.station}" readonly>

            <label for="edit_station_number">Número da estação:</label>
            <input type="number" id="edit_station_number" name="station_number" value="${station.station_number}" required>

            <input type="hidden" id="edit_lat" name="lat" value="${station.lat}">
            <input type="hidden" id="edit_lon" name="lon" value="${station.lon}">
            <input type="hidden" id="edit_id" name="id" value="${station.station}">

            <button type="button" onclick="confirmEdit()">Salvar</button>
        </form>
    `;

    L.popup()
        .setLatLng([station.lat, station.lon])
        .setContent(popupContent)
        .openOn(mapa);
}

function confirmEdit() {
    if (confirm('Deseja confirmar a edição?')) {
        submitEditForm();
    }
}

function submitEditForm() {
    var form = document.getElementById('edit-popup-form');
    var formData = new FormData(form);

    var stationId = formData.get('id');

    fetch(`/api/estacoes/${stationId}/`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
        },
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro na resposta da API');
        }
    })
    .then(data => {
        var updatedMarker = mapa.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                var markerId = layer._leaflet_id;
                if (markerId == data.id) {
                    layer.setPopupContent(`<div><strong>${data.station_name}</strong><br><button onclick="openEditPopup(${JSON.stringify(data)})">Editar</button></div>`);
                }
            }
        });
        loadStations();
        mapa.closePopup();
        editingStation = false;
        alert('Estação editada com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao enviar formulário de edição:', error);
    });
}

mapa.on('click', function (event) {
    var lat = event.latlng.lat;
    var lon = event.latlng.lng;

    if (!editingStation) {
        var popupContent = `
            <form id="popup-form">
                <label for="station_name">Nome da estação:</label>
                <input type="text" id="station_name" name="station_name" placeholder="Informe o nome da estação" required>

                <label for="station">Código da estação:</label>
                <input type="text" id="station" name="station" placeholder="Informe o nome da estação com seu número" required>

                <label for="station_number">Número da estação:</label>
                <input type="number" id="station_number" name="station_number" placeholder="Informe o número da estação" required>

                <input type="hidden" id="lat" name="lat" value="${lat}">
                <input type="hidden" id="lon" name="lon" value="${lon}">

                <button type="button" onclick="submitForm('${lat}', '${lon}')">Adicionar estação</button>
            </form>
        `;

        L.popup()
            .setLatLng(event.latlng)
            .setContent(popupContent)
            .openOn(mapa);
    }
});

function submitForm(lat, lon) {
    var form = document.getElementById('popup-form');
    var formData = new FormData(form);

    formData.append('lat', lat);
    formData.append('lon', lon);

    fetch('/api/estacoes/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro na resposta da API');
        }
    })
    .then(data => {
        L.marker([data.lat, data.lon]).addTo(mapa)
            .bindPopup(`<div><strong>${data.station_name}</strong><br><button onclick="openEditPopup(${JSON.stringify(data)})">Editar</button></div>`);

        mapa.closePopup();
        loadStations();
    })
    .catch(error => {
        console.error('Erro ao enviar formulário:', error);
    });
}

loadStations();

var mapa = L.map('mapa').setView([-15.783479, -47.913372], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mapa);

var editingStation = false;

mapa.on('click', function (event) {
    var lat = event.latlng.lat;
    var lon = event.latlng.lng;

    if (!editingStation) {
        var popupContent = `
            <form id="popup-form">
                <label for="station_name">Nome da estação:</label>
                <input type="text" id="station_name" name="station_name" placeholder="Informe o nome da estação" required>

                <label for="station">Código da estação:</label>
                <input type="text" id="station" name="station" placeholder="Informe o nome da estação com seu número" required>

                <label for="station_number">Número da estação:</label>
                <input type="number" id="station_number" name="station_number" placeholder="Informe o número da estação" required>

                <input type="hidden" id="lat" name="lat" value="${lat}">
                <input type="hidden" id="lon" name="lon" value="${lon}">

                <button type="button" onclick="submitForm('${lat}', '${lon}')">Adicionar estação</button>
            </form>
        `;

        L.popup()
            .setLatLng(event.latlng)
            .setContent(popupContent)
            .openOn(mapa);
    }
});

function loadStations() {
    fetch('/api/estacoes/')
        .then(response => response.json())
        .then(data => {
            mapa.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    mapa.removeLayer(layer);
                }
            });

            for (let estacao of data) {
                var marker = L.marker([estacao.lat, estacao.lon]).addTo(mapa);
                marker.bindPopup(`<div><strong>${estacao.station_name}</strong><br><button onclick="openEditPopup(${JSON.stringify(estacao).replace(/"/g, '&quot;')})">Editar</button></div>`);

                marker.on('click', function () {
                    // Não é necessário abrir o pop-up ao clicar no marcador, pois o botão de editar já está disponível no pop-up.
                });
            }
        });
}

function openEditPopup(station) {
    var popupContent = `
        <form id="edit-popup-form">
            <label for="edit_station_name">Nome da estação:</label>
            <input type="text" id="edit_station_name" name="station_name" value="${station.station_name}" required>

            <input type="hidden" id="edit_station" name="station" value="${station.station}" readonly>

            <label for="edit_station_number">Número da estação:</label>
            <input type="number" id="edit_station_number" name="station_number" value="${station.station_number}" required>

            <input type="hidden" id="edit_lat" name="lat" value="${station.lat}">
            <input type="hidden" id="edit_lon" name="lon" value="${station.lon}">
            <input type="hidden" id="edit_id" name="id" value="${station.station}">

            <button type="button" onclick="confirmEdit()">Salvar</button>
        </form>
    `;

    L.popup()
        .setLatLng([station.lat, station.lon])
        .setContent(popupContent)
        .openOn(mapa);
}

function confirmEdit() {
    if (confirm('Deseja confirmar a edição?')) {
        submitEditForm();
    }
}

function submitEditForm() {
    var form = document.getElementById('edit-popup-form');
    var formData = new FormData(form);

    var stationId = formData.get('id');

    fetch(`/api/estacoes/${stationId}/`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
        },
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro na resposta da API');
        }
    })
    .then(data => {
        var updatedMarker = mapa.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                var markerId = layer._leaflet_id;
                if (markerId == data.id) {
                    layer.setPopupContent(`<div><strong>${data.station_name}</strong><br><button onclick="openEditPopup(${JSON.stringify(data)})">Editar</button></div>`);
                }
            }
        });
        loadStations();
        mapa.closePopup();
        editingStation = false;
        alert('Estação editada com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao enviar formulário de edição:', error);
    });
}

mapa.on('click', function (event) {
    var lat = event.latlng.lat;
    var lon = event.latlng.lng;

    if (!editingStation) {
        var popupContent = `
            <form id="popup-form">
                <label for="station_name">Nome da estação:</label>
                <input type="text" id="station_name" name="station_name" placeholder="Informe o nome da estação" required>

                <label for="station">Código da estação:</label>
                <input type="text" id="station" name="station" placeholder="Informe o nome da estação com seu número" required>

                <label for="station_number">Número da estação:</label>
                <input type="number" id="station_number" name="station_number" placeholder="Informe o número da estação" required>

                <input type="hidden" id="lat" name="lat" value="${lat}">
                <input type="hidden" id="lon" name="lon" value="${lon}">

                <button type="button" onclick="submitForm('${lat}', '${lon}')">Adicionar estação</button>
            </form>
        `;

        L.popup()
            .setLatLng(event.latlng)
            .setContent(popupContent)
            .openOn(mapa);
    }
});

function submitForm(lat, lon) {
    var form = document.getElementById('popup-form');
    var formData = new FormData(form);

    formData.append('lat', lat);
    formData.append('lon', lon);

    fetch('/api/estacoes/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro na resposta da API');
        }
    })
    .then(data => {
        L.marker([data.lat, data.lon]).addTo(mapa)
            .bindPopup(`<div><strong>${data.station_name}</strong><br><button onclick="openEditPopup(${JSON.stringify(data)})">Editar</button></div>`);

        mapa.closePopup();
        loadStations();
    })
    .catch(error => {
        console.error('Erro ao enviar formulário:', error);
    });
}

loadStations();