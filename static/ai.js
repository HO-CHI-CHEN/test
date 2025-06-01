// AI助手頁面的專用JavaScript
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

// 頁面載入時初始化
window.onload = function() {
    // 初始化代碼（如果需要）
};