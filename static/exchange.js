// 匯率分析頁面的專用JavaScript
let chartData = JSON.parse(document.getElementById('exchangeData').innerHTML);


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
                    result = amount / chartData[chartData.length - 1]['usd-twd'];
                } else if (toCurrency === 'JPY') {
                    result = amount / chartData[chartData.length - 1]['twd-jpy'];
                } else {
                    result = amount;
                }
            } else if (fromCurrency === 'USD') {
                const twdAmount = amount * chartData[chartData.length - 1]['usd-twd'];
                if (toCurrency === 'TWD') {
                    result = twdAmount;
                } else if (toCurrency === 'JPY') {
                    result = twdAmount / chartData[chartData.length - 1]['twd-jpy'];
                } else {
                    result = amount;
                }
            } else if (fromCurrency === 'JPY') {
                const twdAmount = amount * chartData[chartData.length - 1]['twd-jpy'];
                if (toCurrency === 'TWD') {
                    result = twdAmount;
                } else if (toCurrency === 'USD') {
                    result = twdAmount / chartData[chartData.length - 1]['usd-twd'];
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
            
              for (let i = 0; i < chartData.length; i++) {
                dates.push(chartData[i]['date']);
                usdRates.push(chartData[i]['usd-twd']);
               
                jpyRates.push(chartData[i]['twd-jpy']);
            }
         
            
            
         
      
            


            
            // 创建图表
            trace1 = {
                x: dates,
                y: usdRates,
                name: '美金/台幣',
                mode: 'lines+markers',
                line: {color: '#3498db', width: 3},
                marker: {size: 6}
            };
            
            trace2 = {
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







