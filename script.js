document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const productName = document.getElementById('product-name');
    const productDescription = document.getElementById('product-description');
    const productPrice = document.getElementById('product-price');
    const sendButton = document.getElementById('send-button');


    document.getElementById('copy-button').addEventListener('click', function() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages.innerText) {
            navigator.clipboard.writeText(chatMessages.innerText)
                .then(() => alert('복사되었습니다!'))
                .catch(err => console.error('복사 실패:', err));
        }
    });
    

    sendButton.addEventListener('click', sendMessage);
    
    [productName, productDescription, productPrice].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    });

    function sendMessage() {
        const name = productName.value.trim();
        const description = productDescription.value.trim();
        const price = productPrice.value.trim();

        if (name && description && price) {
            const productInfo = `제품명: ${name}\n설명: ${description}\n가격: ${price}원`;
            addMessage('user', productInfo);
            fetchReview(name, description, price);
            
            productName.value = '';
            productDescription.value = '';
            productPrice.value = '';
        } else {
            alert('모든 필드를 입력해주세요.');
        }
    }

    function addMessage(sender, content) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        if (sender === 'assistant') {
            const formattedContent = formatReview(content);
            messageElement.innerHTML = formattedContent;
        } else {
            messageElement.textContent = content;
        }
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatReview(review) {
        // 마크다운을 HTML로 변환
        return marked.parse(review);
    }

    async function fetchReview(name, description, price) {
        try {
            const response = await fetch('https://port-0-math2-back-lxlts66g89582f3b.sel5.cloudtype.app/search-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    product_name: name,
                    product_description: description,
                    product_price: price
                }),
            });

            if (!response.ok) {
                throw new Error('서버 응답 오류');
            }

            const data = await response.json();
            addMessage('assistant', data.response);
        } catch (error) {
            console.error('Error:', error);
            addMessage('assistant', '죄송합니다. 리뷰를 생성하는 중 오류가 발생했습니다.');
        }
    }
});