// Função para buscar e destacar uma estação no mapa
function buscar_estacao() {
    // Requisição da entrada do usuário
    var numeroEstacao = prompt('Digite o número da estação:');

    // Fazer solicitação à API para obter a lista de estações
    fetch('/api/estacoes/')
        .then(response => response.json())
        .then(estacoes => {
            // Encontrar a estação com base no número
            var estacao = estacoes.find(e => e.station_number === parseInt(numeroEstacao));

            if (estacao) {
                // Destacar a estação no mapa com zoom animado
                mapa.setView([estacao.lat, estacao.lon], 17, { animate: true });

                // Adiar a abertura do popup para garantir que ocorra após o zoom
                setTimeout(function () {
                    // Adicionar marcador da estação com popup configurado para não fechar automaticamente
                    var marker = L.marker([estacao.lat, estacao.lon]).addTo(mapa)
                        .bindPopup(`<strong>${estacao.station_name}</strong><br>Número: ${estacao.station_number}`, { autoClose: false })
                        .openPopup();  // Abrir o popup imediatamente após adicionar o marcador
                }, 500);  // Ajuste o tempo conforme necessário
            } else {
                alert('Estação não encontrada.');
            }

            // Carregar novamente as estações no mapa
            loadStations();
        })
        .catch(error => {
            console.error('Erro ao buscar estações:', error);
            alert('Erro ao buscar estações. Verifique o console para obter detalhes.');
        });
}

// Configuração do evento de clique para o botão
document.getElementById('buscarEstacaoBtn').addEventListener('click', buscar_estacao);