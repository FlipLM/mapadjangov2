// rotas.js

var mapa = L.map('mapa').setView([-15.783479, -47.913372], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mapa);

function buscarCorrida() {
    var corridaId = document.getElementById('corridaId').value;

    if (corridaId.trim() !== '') {
        fetch(`/api/rides_mesclado/${corridaId}/`)
            .then(response => response.json())
            .then(corrida => {
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
                    carregarDadosNaTabela();
                } else {
                    alert(`Corrida com ID ${corridaId} não encontrada.`);
                }
            })
            .catch(error => {
                console.error(`Erro ao buscar corrida com ID ${corridaId}:`, error);
            });
    } else {
        alert('Por favor, informe o ID da corrida.');
    }
}

function carregarDadosNaTabela() {
    fetch('/api/rides_mesclado/')  // Substitua pela sua URL API correta
        .then(response => response.json())
        .then(data => {
            var tabela = document.querySelector('table tbody');
            tabela.innerHTML = ''; // Limpar conteúdo existente

            data.forEach(corrida => {
                var newRow = tabela.insertRow();
                for (var key in corrida) {
                    var cell = newRow.insertCell();
                    cell.appendChild(document.createTextNode(corrida[key]));
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
        });
}

// Chame a função ao carregar a página para preencher a tabela
carregarDadosNaTabela();