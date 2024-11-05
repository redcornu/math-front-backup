document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        productName: document.getElementById('product-name'),
        generateButton: document.getElementById('generate-button'),
        inputContainer: document.getElementById('input-container'),
        resultContainer: document.getElementById('result-container'),
        resultContent: document.getElementById('result-content'),
        retryButton: document.getElementById('retry-button'),
        copyButton: document.getElementById('copy-button'),
        loadingIndicator: document.getElementById('loading-indicator')
    };

    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Element ${key} not found`);
            return;
        }
    }

    let generatedReview = '';

    const generateReview = async () => {
        const name = elements.productName.value.trim();

        if (name) {
            elements.loadingIndicator.style.display = 'block';
            try {
                const response = await fetch('https://port-0-math2-back-lxlts66g89582f3b.sel5.cloudtype.app/search-product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        product_name: name
                    }),
                });

                if (!response.ok) {
                    throw new Error('서버 응답 오류');
                }

                const data = await response.json();
                generatedReview = data.response;
                displayReview(generatedReview);

                elements.productName.value = '';
                elements.inputContainer.style.display = 'none';
            } catch (error) {
                console.error('Error:', error);
                alert('죄송합니다. 리뷰를 생성하는 중 오류가 발생했습니다.');
            } finally {
                elements.loadingIndicator.style.display = 'none';
            }
        } else {
            alert('제품명을 입력해주세요.');
        }
    };

    elements.generateButton.addEventListener('click', generateReview);
    elements.productName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateReview();
        }
    });

    elements.retryButton.addEventListener('click', () => {
        elements.resultContainer.style.display = 'none';
        elements.resultContent.innerHTML = '';
    });

    elements.copyButton.addEventListener('click', () => {
        if (generatedReview) {
            navigator.clipboard.writeText(generatedReview)
                .then(() => alert('복사되었습니다!'))
                .catch(err => console.error('복사 실패:', err));
        }
    });

    function displayReview(reviewText) {
        const formattedContent = marked.parse(reviewText);

        const assistantContainer = document.createElement('div');
        assistantContainer.classList.add('assistant-container');

        const profileImage = document.createElement('img');
        profileImage.src = 'https://i.ibb.co/wSmC884/0-2-2.jpg';
        profileImage.alt = 'Assistant Profile Image';
        profileImage.classList.add('profile-image');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = formattedContent;

        assistantContainer.appendChild(profileImage);
        assistantContainer.appendChild(messageContent);

        resultContent.innerHTML = '';
        resultContent.appendChild(assistantContainer);

        resultContainer.style.display = 'flex';
    }
});
