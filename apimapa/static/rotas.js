var mapa = L.map('mapa').setView([-15.783479, -47.913372], 13);
var rotaLayer; // Adiciona uma variável para armazenar a camada da rota

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mapa);

async function buscarCorrida() {
    var corridaId = document.getElementById('corridaId').value.trim();

            if (corridaId !== '') {
                try {
                    const response = await fetch(`/api/rides_mesclado/${corridaId}/`);
                    const corrida = await response.json();

                    if (corrida) {
                        // Limpar map para remover rotas, pings e controles antigos
                        mapa.eachLayer(layer => {
                            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                                mapa.removeLayer(layer);
                            }
                        });

                        // Se o controle de rota existir, remova-o
                        if (rotaLayer) {
                            mapa.removeControl(rotaLayer);
                        }

                        // Adicionar nova rota ao mapa usando o serviço de roteamento
                        rotaLayer = L.Routing.control({
                            waypoints: [
                                L.latLng(corrida.station_start_lat, corrida.station_start_lon),
                                L.latLng(corrida.station_end_lat, corrida.station_end_lon)
                            ],
                            routeWhileDragging: false,
                            draggableWaypoints: false,
                            show: false,
                            addWaypoints: false,


                        }).addTo(mapa);


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
                // Ajustar o mapa para conter a rota
                var bounds = polyline.getBounds();
                mapa.setView(bounds.getCenter(), mapa.getBoundsZoom(bounds));


async function carregarDadosNaTabela(corridas) {
    try {
        // Substitua pela sua URL API correta
        const response = await fetch('/api/rides_mesclado/');
        const data = await response.json();

        var tabela = document.querySelector('#tabela tbody');
        tabela.innerHTML = ''; // Limpar todas as linhas existentes

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

// Função para limpar a camada de rota quando necessário
function limparRota() {
    if (rotaLayer) {
        mapa.removeControl(rotaLayer);
    }
}