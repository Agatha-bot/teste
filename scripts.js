let cryptoPrices = {};

// Função para buscar cotações
async function fetchCryptoPrices() {
    const ratesContent = document.getElementById('ratesContent');
    const cryptos = ['bitcoin', 'ethereum', 'binancecoin'];
    const fiats = ['brl', 'usd'];

    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.join(',')}&vs_currencies=${fiats.join(',')}`
        );
        const data = await response.json();
        cryptoPrices = data; // Armazena as cotações para cálculo

        ratesContent.innerHTML = ''; // Limpa conteúdo anterior

        cryptos.forEach((crypto) => {
            const name = crypto === 'bitcoin' ? 'Bitcoin' : 
                         crypto === 'ethereum' ? 'Ethereum' : 'BNB';
            ratesContent.innerHTML += `
                <div class="bg-blue-100 p-3 rounded">
                    <strong>${name}</strong>
                    <p>BRL: R$ ${data[crypto].brl.toLocaleString()}</p>
                    <p>USD: $ ${data[crypto].usd.toLocaleString()}</p>
                </div>
            `;
        });
    } catch (error) {
        ratesContent.innerHTML = 'Erro ao buscar cotações.';
    }
}

// Evento para buscar cotações
document.getElementById('fetchRatesButton').addEventListener('click', fetchCryptoPrices);

// Função para calcular e exibir o gráfico
function calculatePortfolio() {
    const btcAmount = parseFloat(document.getElementById('btcAmount').value) || 0;
    const ethAmount = parseFloat(document.getElementById('ethAmount').value) || 0;
    const bnbAmount = parseFloat(document.getElementById('bnbAmount').value) || 0;
    const brlAmount = parseFloat(document.getElementById('brlAmount').value) || 0;
    const usdAmount = parseFloat(document.getElementById('usdAmount').value) || 0;

    // Converte ativos cripto para BRL
    const btcValue = btcAmount * (cryptoPrices.bitcoin?.brl || 0);
    const ethValue = ethAmount * (cryptoPrices.ethereum?.brl || 0);
    const bnbValue = bnbAmount * (cryptoPrices.binancecoin?.brl || 0);
    const totalPortfolio = btcValue + ethValue + bnbValue + brlAmount + usdAmount;

    const ctx = document.getElementById('portfolioChart').getContext('2d');
    if (window.portfolioChart instanceof Chart) {
        window.portfolioChart.destroy();
    }

    window.portfolioChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Bitcoin', 'Ethereum', 'BNB', 'Real', 'Dólar'],
            datasets: [{
                data: [btcValue, ethValue, bnbValue, brlAmount, usdAmount],
                backgroundColor: ['#FFD700', '#87CEFA', '#32CD32', '#FF69B4', '#4682B4']
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Distribuição do Portfólio (Total: R$ ${totalPortfolio.toFixed(2)})`
                }
            }
        }
    });
}

// Evento para calcular portfólio
document.getElementById('calculateButton').addEventListener('click', calculatePortfolio);
