// 匯率分析頁面的專用JavaScript
let exchangeRates = {
    USD: 31.45,
    JPY: 0.2178
};

function updateExchangeRates() {
    fetch('/api/exchange-rates')
        .then(response => response.json())
        .then(data => {
            exchangeRates.USD = data.USD;
            exchangeRates.JPY = data.JPY;
            
            document.getElementById('usd-rate').textContent = data.USD.toFixed(2);
            document.getElementById('jpy-rate').textContent = (data.JPY * 100).toFixed(2);
        });
}

function convertCurrency() {
      const amount = parseFloat(document.getElementById('amount').value);
            const fromCurrency = document.getElementById('from-currency').value;
            const toCurrency = document.getElementById('to-currency').value;
            
            if (isNaN(amount)) {
                alert("請輸入有效的金額");
                return;
            }
            
            // 转换为台币
            let result;
            if (fromCurrency === 'TWD') {
                if (toCurrency === 'USD') {
                    result = amount / exchangeRates.USD;
                } else if (toCurrency === 'JPY') {
                    result = amount / exchangeRates.JPY;
                } else {
                    result = amount;
                }
            } else if (fromCurrency === 'USD') {
                const twdAmount = amount * exchangeRates.USD;
                if (toCurrency === 'TWD') {
                    result = twdAmount;
                } else if (toCurrency === 'JPY') {
                    result = twdAmount / exchangeRates.JPY;
                } else {
                    result = amount;
                }
            } else if (fromCurrency === 'JPY') {
                const twdAmount = amount * exchangeRates.JPY;
                if (toCurrency === 'TWD') {
                    result = twdAmount;
                } else if (toCurrency === 'USD') {
                    result = twdAmount / exchangeRates.USD;
                } else {
                    result = amount;
                }
            }
            
            document.getElementById('conversion-result').innerHTML = `
                ${amount} ${fromCurrency} = <span class="currency-highlight">${result.toFixed(2)} ${toCurrency}</span>
            `;
}

function createExchangeChart() {
     // 模拟30天的汇率数据
            dates = [];
            usdRates = [];
            jpyRates = [];
            
            const today = new Date();
            let currentRateUSD = 31.5;
            let currentRateJPY = 0.218;

                  
            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                dates.push(date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }));
                
                // 随机波动
                const usdChange = (Math.random() - 0.5) * 0.2;
                const jpyChange = (Math.random() - 0.5) * 0.002;
                
                currentRateUSD += usdChange;
                currentRateJPY += jpyChange;
                
                usdRates.push(currentRateUSD);
                jpyRates.push(currentRateJPY * 100); // 转换为100日圆
            }
            
        
            
            // 创建图表
            const trace1 = {
                x: dates,
                y: usdRates,
                name: '美金/台幣',
                mode: 'lines+markers',
                line: {color: '#3498db', width: 3},
                marker: {size: 6}
            };
            
            const trace2 = {
                x: dates,
                y: jpyRates,
                name: '日圓(100)/台幣',
                mode: 'lines+markers',
                yaxis: 'y2',
                line: {color: '#e74c3c', width: 3},
                marker: {size: 6}
            };
            
            const layout = {
                title: '美金與日圓兌換台幣匯率走勢 (30天)',
                xaxis: {title: '日期'},
                yaxis: {
                    title: '美金/台幣',
                    titlefont: {color: '#3498db'},
                    tickfont: {color: '#3498db'}
                },
                yaxis2: {
                    title: '日圓(100)/台幣',
                    titlefont: {color: '#e74c3c'},
                    tickfont: {color: '#e74c3c'},
                    overlaying: 'y',
                    side: 'right'
                },
                legend: {x: 0, y: 1.2},
                hovermode: 'closest'
            };
            
            Plotly.newPlot('exchange-chart', [trace1, trace2], layout);
}

// 頁面載入時初始化
window.onload = function() {
    updateExchangeRates();
    createExchangeChart();
};







