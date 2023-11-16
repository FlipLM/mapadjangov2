var mapa = L.map('mapa').setView([-15.783479, -47.913372], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mapa);


async function formatDuration(durationInMinutes) {
    var hours = Math.floor(durationInMinutes / 60);
    var minutes = durationInMinutes % 60;
    return `${hours}h ${minutes}min`;
}
async function buscarCorrida() {
    var corridaId = document.getElementById('corridaId').value.trim();

    if (corridaId !== '') {
        try {
            const response = await fetch(`/api/rides_mesclado/${corridaId}/`);
            const corrida = await response.json();

            if (corrida) {
                // Limpar map para remover rotas anteriores
                mapa.eachLayer(layer => {
                    if (layer instanceof L.Polyline) {
                        mapa.removeLayer(layer);
                    }
                });

                // Adicionar nova rota ao mapa
                var polyline = L.polyline(
                    [
                        [corrida.station_start_lat, corrida.station_start_lon],
                        [corrida.station_end_lat, corrida.station_end_lon]
                    ],
                    { color: 'red' }
                ).addTo(mapa);

                // Adicionar um Popup com informações da rota
                polyline.bindPopup(`Rota ID: ${corrida.id}`);

                // Chamar a função para carregar dados na tabela
                carregarDadosNaTabela([corrida]);
            } else {
                alert(`Corrida com ID ${corridaId} não encontrada.`);
            }
        } catch (error) {
            console.error(`Erro ao buscar corrida com ID ${corridaId}:`, error);
        }
    } else {
        alert('Por favor, informe o ID da corrida.');
    }
}

async function carregarDadosNaTabela(corridas) {
    try {
        // Substitua pela sua URL API correta
        const response = await fetch('/api/rides_mesclado/');
        const data = await response.json();

        var tabela = document.querySelector('table tbody');
        tabela.innerHTML = ''; // Limpar conteúdo existente

        for (const corrida of corridas) {
            for (const c of data) {
                if (c.id === corrida.id) {
                    var newRow = tabela.insertRow();
                    for (var key in c) {
                        var cell = newRow.insertCell();
                        // Exibindo diretamente os valores numéricos sem conversão para horas
                        if (typeof c[key] === 'number') {
                            cell.appendChild(document.createTextNode(c[key].toString()));
                        } else {
                            cell.appendChild(document.createTextNode(c[key]));
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}
