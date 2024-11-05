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

    const trackAndGenerateReview = (trigger) => {
        gtag('event', 'generate_review', {
            'event_category': 'engagement',
            'event_label': trigger,
            'product_name': elements.productName.value
        });
        generateReview().catch(console.error);
    };

    elements.generateButton.addEventListener('click', () => trackAndGenerateReview('button_click'));
    elements.productName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            trackAndGenerateReview('enter_key');
        }
    });
    elements.retryButton.addEventListener('click', handleRetryClick);
    elements.copyButton.addEventListener('click', handleCopyClick);
}

function handleRetryClick() {
    gtag('event', 'retry_review', {
        'event_category': 'engagement',
        'event_label': 'retry_button'
    });
    elements.inputContainer.style.display = 'block';
    elements.resultContainer.style.display = 'none';
    elements.resultContent.innerHTML = '';
}

function handleCopyClick() {
    if (generatedReview) {
        navigator.clipboard.writeText(generatedReview)
            .then(() => {
                gtag('event', 'copy_review', {
                    'event_category': 'engagement',
                    'event_label': 'success'
                });
                alert('복사되었습니다!');
            })
            .catch(err => {
                gtag('event', 'copy_review', {
                    'event_category': 'error',
                    'event_label': 'clipboard_error'
                });
                console.error('복사 실패:', err);
            });
    }
}

async function generateReview() {
    if (!elements?.productName?.value) {
        gtag('event', 'generate_error', {
            'event_category': 'error',
            'event_label': 'empty_input'
        });
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
        
        // 리뷰 생성 성공 이벤트
        gtag('event', 'generate_success', {
            'event_category': 'success',
            'event_label': 'review_generated',
            'product_name': name
        });

        displayReview(generatedReview);
        elements.productName.value = '';
        elements.inputContainer.style.display = 'none';
    } catch (error) {
        // 에러 발생 이벤트
        gtag('event', 'generate_error', {
            'event_category': 'error',
            'event_label': error.message,
            'product_name': name
        });
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
