
        function updateDateTime() {
            const now = new Date();
            const dateStr = now.toLocaleDateString('zh-TW', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            });
            
            const timeStr = now.toLocaleTimeString('zh-TW');
            
            document.getElementById('current-date').textContent = dateStr;
            document.getElementById('current-time').textContent = timeStr;
        }
        updateDateTime();
        setInterval(updateDateTime, 1000);
        function loadTravelPackages() {
            fetch('/api/packages')
                .then(response => response.json())
                .then(packages => {
                    const container = document.getElementById('packages-container');
                    container.innerHTML = '';
                    
                    packages.forEach(pkg => {
                        const usd = (pkg.price / exchangeRates.USD).toFixed(2);
                        const jpy = (pkg.price / exchangeRates.JPY).toFixed(2);
                        
                        const card = `
                            <div class="feature-card">
                                <div class="feature-img">
                                    <img src="https://source.unsplash.com/random/600x400/?${pkg.name.replace(' ', ',')}" alt="${pkg.name}">
                                </div>
                                <div class="feature-content">
                                    <h3>${pkg.name}</h3>
                                    <p>${pkg.days}天深度體驗，專業導遊帶隊，包含特色美食與景點門票</p>
                                    <div class="price">NT$ ${pkg.price.toLocaleString()} 起</div>
                                    <div class="currency-highlight">約 ${usd} USD | ${jpy} JPY</div>
                                    <a href="#" class="btn">查看詳情</a>
                                </div>
                            </div>
                        `;
                        container.innerHTML += card;
                    });
                });
        }
        function generateRandomDeal() {
            fetch('/api/random-deal')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('random-deal').textContent = data.deal;
                });
        }
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
                    document.getElementById('usd-trend').innerHTML = 
                        `<i class="fas fa-arrow-${Math.random() > 0.5 ? 'up' : 'down'}"></i> ${(Math.random() * 0.2).toFixed(2)}%`;
                    document.getElementById('jpy-trend').innerHTML = 
                        `<i class="fas fa-arrow-${Math.random() > 0.5 ? 'up' : 'down'}"></i> ${(Math.random() * 0.2).toFixed(2)}%`;
                    
                    loadTravelPackages();
                });
        }
        updateExchangeRates();
        setInterval(updateExchangeRates, 30000); 
        function convertCurrency() {
            const amount = parseFloat(document.getElementById('amount').value);
            const fromCurrency = document.getElementById('from-currency').value;
            const toCurrency = document.getElementById('to-currency').value;
            
            if (isNaN(amount)) {
                alert("請輸入有效的金額");
                return;
            }
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
        convertCurrency();
        function createExchangeChart() {

            const dates = [];
            const usdRates = [];
            const jpyRates = [];
            
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
        
        // AI聊天功能
        function sendMessage() {
            const userInput = document.getElementById('user-input').value.trim();
            if (!userInput) return;
            
            const chatContainer = document.getElementById('chat-container');
            
            // 添加用户消息
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.textContent = userInput;
            chatContainer.appendChild(userMessage);
            
            // 清空输入框
            document.getElementById('user-input').value = '';
            
            // 滚动到底部
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // 显示加载指示器
            const loading = document.createElement('div');
            loading.className = 'message bot-message';
            loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gemini AI思考中...';
            chatContainer.appendChild(loading);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // 发送到Flask后端
            fetch('/api/ai-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userInput })
            })
            .then(response => response.json())
            .then(data => {
                // 移除加载指示器
                chatContainer.removeChild(loading);
                
                // 添加AI回复
                const botMessage = document.createElement('div');
                botMessage.className = 'message bot-message';
                botMessage.innerHTML = `<i class="fas fa-robot"></i> ${data.response}`;
                chatContainer.appendChild(botMessage);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            })
            .catch(error => {
                console.error('Error:', error);
                // 移除加载指示器
                chatContainer.removeChild(loading);
                
                // 显示错误消息
                const errorMessage = document.createElement('div');
                errorMessage.className = 'message bot-message';
                errorMessage.textContent = '抱歉，暫時無法連接到AI服務。請稍後再試。';
                chatContainer.appendChild(errorMessage);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });
        }
        // 存储套餐数据供JS使用
        let travelPackages = [];

        // 加载旅游行程（增强图片加载错误处理）
        function loadTravelPackages() {
            fetch('/api/packages')
                .then(response => response.json())
                .then(packages => {
                    travelPackages = packages; // 存储到全局变量
                    const container = document.getElementById('packages-container');
                    container.innerHTML = '';
                    
                    packages.forEach(pkg => {
                        const usd = (pkg.price / exchangeRates.USD).toFixed(2);
                        const jpy = (pkg.price / exchangeRates.JPY).toFixed(2);
                        
                        const card = `
                            <div class="feature-card">
                                <div class="feature-img">
                                    <div class="img-placeholder"></div>
                                    <div class="img-loading"><i class="fas fa-spinner fa-spin"></i> 加載圖片中...</div>
                                    <div class="img-error">
                                        <i class="fas fa-exclamation-triangle"></i> 圖片加載失敗
                                        <button class="retry-btn" onclick="retryImageLoad(this, ${pkg.id})">重試</button>
                                    </div>
                                    <img src="${pkg.image}" alt="${pkg.name}" 
                                        data-package-id="${pkg.id}"
                                        onload="handleImageLoad(this)"
                                        onerror="handleImageError(this, ${pkg.id})">
                                </div>
                                <div class="feature-content">
                                    <h3>${pkg.name}</h3>
                                    <p>${pkg.days}天深度體驗，專業導遊帶隊，包含特色美食與景點門票</p>
                                    <div class="price">NT$ ${pkg.price.toLocaleString()} 起</div>
                                    <div class="currency-highlight">约 ${usd} USD | ${jpy} JPY</div>
                                    <a href="#" class="btn">查看詳情</a>
                                </div>
                            </div>
                        `;
                        container.innerHTML += card;
                    });
                });
        }

        // 图片加载成功处理
        function handleImageLoad(imgElement) {
            const container = imgElement.parentElement;
            container.querySelector('.img-placeholder').style.display = 'none';
            container.querySelector('.img-loading').style.display = 'none';
            container.querySelector('.img-error').style.display = 'none';
            imgElement.classList.add('loaded');
        }

        // 图片加载错误处理
        function handleImageError(imgElement, packageId) {
            const container = imgElement.parentElement;
            container.querySelector('.img-placeholder').style.display = 'none';
            container.querySelector('.img-loading').style.display = 'none';
            container.querySelector('.img-error').style.display = 'block';
            
            // 存储重试信息
            imgElement.dataset.retryCount = imgElement.dataset.retryCount ? 
                parseInt(imgElement.dataset.retryCount) + 1 : 1;
        }

        // 重试加载图片
        function retryImageLoad(button, packageId) {
            const container = button.closest('.feature-img');
            const imgElement = container.querySelector('img');
            const retryCount = parseInt(imgElement.dataset.retryCount || 0);
            
            // 隐藏错误信息，显示加载中
            container.querySelector('.img-error').style.display = 'none';
            container.querySelector('.img-placeholder').style.display = 'block';
            container.querySelector('.img-loading').style.display = 'block';
            
            // 获取当前套餐
            const currentPackage = travelPackages.find(pkg => pkg.id === packageId);
            
            if (currentPackage) {
                // 尝试重新加载图片（添加时间戳避免缓存）
                imgElement.src = currentPackage.image + '?t=' + new Date().getTime();
            }
            
            // 更新重试次数
            imgElement.dataset.retryCount = retryCount + 1;
        }

        // 初始化
        window.onload = function() {
            updateDateTime();
            generateRandomDeal();
            createExchangeChart();
            loadTravelPackages();
            updateExchangeRates();
        };