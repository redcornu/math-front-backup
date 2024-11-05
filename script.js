let elements = null;
let generatedReview = '';

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    elements = {
        productName: document.querySelector('#product-name'),
        generateButton: document.querySelector('#generate-button'),
        inputContainer: document.querySelector('#input-container'),
        resultContainer: document.querySelector('#result-container'),
        resultContent: document.querySelector('#result-content'),
        retryButton: document.querySelector('#retry-button'),
        copyButton: document.querySelector('#copy-button'),
        loadingIndicator: document.querySelector('#loading-indicator')
    };

    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);

    if (missingElements.length > 0) {
        console.error('Missing elements:', missingElements);
        return;
    }

    elements.generateButton.addEventListener('click', () => generateReview().catch(console.error));
    elements.productName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateReview().catch(console.error);
        }
    });
    elements.retryButton.addEventListener('click', handleRetryClick);
    elements.copyButton.addEventListener('click', handleCopyClick);
}

function handleRetryClick() {
    elements.inputContainer.style.display = 'block';
    elements.resultContainer.style.display = 'none';
    elements.resultContent.innerHTML = '';
}

function handleCopyClick() {
    if (generatedReview) {
        navigator.clipboard.writeText(generatedReview)
            .then(() => alert('복사되었습니다!'))
            .catch(err => console.error('복사 실패:', err));
    }
}

async function generateReview() {
    if (!elements?.productName?.value) {
        alert('제품명을 입력해주세요.');
        return;
    }

    const name = elements.productName.value.trim();
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
    if (!elements?.resultContent) {
        console.error('Result content element not found');
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
