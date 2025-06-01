$("#rbutton").on("click", function () {
    const wheel = $("#wheel");
    const pages = [
        "http://127.0.0.1:5001/tours",
        "http://127.0.0.1:5001/tours",
        "http://127.0.0.1:5001/",
        "http://127.0.0.1:5001/exchange",
        "http://127.0.0.1:5001/ai",
        "http://127.0.0.1:5001/rpg"
    ];

    const segmentCount = pages.length;
    const segmentAngle = 360 / segmentCount;
    const selectedIndex = Math.floor(Math.random() * segmentCount);

    // 目標角度，轉到對應區塊中間（順時針旋轉）
    // CSS rotate 是順時針，計算時就用正角度
    const targetAngle = 360 * 5 + (selectedIndex * segmentAngle + segmentAngle / 2);

    // 先取消 transition，重置轉盤位置
    wheel.css('transition', 'none');
    wheel.css('transform', 'rotate(0deg)');

    // 強制瀏覽器重繪
    wheel[0].offsetHeight;

    // 播放熊衝出特效
    playBearBurstEffect();

    // 加上 transition，開始旋轉動畫
    wheel.css('transition', 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)');
    wheel.css('transform', `rotate(${targetAngle}deg)`);

    // 4.2 秒後跳轉頁面（比 transition 時間多一點保險）
    setTimeout(() => {
        window.location.href = pages[selectedIndex];
    }, 4200);
});

// 熊衝出特效函數
function playBearBurstEffect() {
    const bear = $('#burstingBear');
    bear.css({
        'display': 'block',
        'opacity': '1',
        'transform': 'translate(-50%, -50%) scale(0.1)'
    });
    
    // 強制重繪
    bear[0].offsetHeight;
    
    // 開始動畫
    setTimeout(() => {
        bear.css({
            'transform': 'translate(-50%, -50%) scale(2)',
            'opacity': '0'
        });
    }, 10);
    
    // 動畫結束後隱藏
    setTimeout(() => {
        bear.css('display', 'none');
    }, 510);
}