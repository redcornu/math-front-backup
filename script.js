let elements = null;

document.addEventListener('DOMContentLoaded', function() {
    elements = {
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

    if (elements.generateButton) {
        elements.generateButton.addEventListener('click', handleGenerateClick);
    }
    
    if (elements.productName) {
        elements.productName.addEventListener('keypress', handleKeyPress);
    }
    
    if (elements.retryButton) {
        elements.retryButton.addEventListener('click', handleRetryClick);
    }
    
    if (elements.copyButton) {
        elements.copyButton.addEventListener('click', handleCopyClick);
    }
});

let generatedReview = '';

function handleGenerateClick() {
    generateReview().catch(console.error);
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        generateReview().catch(console.error);
    }
}

function handleRetryClick() {
    if (elements) {
        elements.inputContainer.style.display = 'block';
        elements.resultContainer.style.display = 'none';
        elements.resultContent.innerHTML = '';
    }
}

function handleCopyClick() {
    if (generatedReview) {
        navigator.clipboard.writeText(generatedReview)
            .then(() => alert('복사되었습니다!'))
            .catch(err => console.error('복사 실패:', err));
    }
}

async function generateReview() {
    if (!elements || !elements.productName) {
        console.error('Required elements not initialized');
        return;
    }

    const name = elements.productName.value.trim();
    if (!name) {
        alert('제품명을 입력해주세요.');
        return;
    }

    elements.loadingIndicator.style.display = 'block';

    try {
        const response = await fetch('https://port-0-math2-back-lxlts66g89582f3b.sel5.cloudtype.app/search-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_name: name }),
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
}

function displayReview(reviewText) {
    if (!elements || !elements.resultContent) {
        console.error('Required elements not initialized');
        return;
    }

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

    elements.resultContent.innerHTML = '';
    elements.resultContent.appendChild(assistantContainer);
    elements.resultContainer.style.display = 'flex';
}
