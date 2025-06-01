// 旅遊行程頁面的專用JavaScript
let chartData = JSON.parse(document.getElementById('exchangeData').innerHTML);
let exchangeRates = {
    USD: chartData[chartData.length - 1]['usd-twd'],
    JPY: chartData[chartData.length - 1]['twd-jpy'],
};

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
                            <div class="currency-highlight">約 ${usd} USD | ${jpy} JPY</div>
                            <a href="/package-detail.html?id=${pkg.id}" class="btn">查看詳情</a>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        });
}

// 圖片處理函數保持不變
function handleImageLoad(imgElement) { const container = imgElement.parentElement;
            container.querySelector('.img-placeholder').style.display = 'none';
            container.querySelector('.img-loading').style.display = 'none';
            container.querySelector('.img-error').style.display = 'none';
            imgElement.classList.add('loaded'); }
function handleImageError(imgElement, packageId) {  const container = imgElement.parentElement;
            container.querySelector('.img-placeholder').style.display = 'none';
            container.querySelector('.img-loading').style.display = 'none';
            container.querySelector('.img-error').style.display = 'block';
            
            // 存储重试信息
            imgElement.dataset.retryCount = imgElement.dataset.retryCount ? 
                parseInt(imgElement.dataset.retryCount) + 1 : 1; }
function retryImageLoad(button, packageId) { const container = button.closest('.feature-img');
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
            imgElement.dataset.retryCount = retryCount + 1; }

// 頁面載入時初始化
window.onload = function() {
    loadTravelPackages();
};