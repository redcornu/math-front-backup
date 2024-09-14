document.addEventListener('DOMContentLoaded', () => {
    const productName = document.getElementById('product-name');
    const productDescription = document.getElementById('product-description');
    const productPrice = document.getElementById('product-price');
    const generateButton = document.getElementById('generate-button');

    const inputContainer = document.getElementById('input-container');
    const resultContainer = document.getElementById('result-container');
    const resultContent = document.getElementById('result-content');
    const retryButton = document.getElementById('retry-button');
    const copyButton = document.getElementById('copy-button');
    const loadingIndicator = document.getElementById('loading-indicator'); // 로딩 인디케이터 요소

    let generatedReview = '';

    generateButton.addEventListener('click', generateReview);

    [productName, productDescription, productPrice].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generateReview();
            }
        });
    });

    retryButton.addEventListener('click', () => {
        // 리뷰 다시 작성하기 버튼 클릭 시 동작
        resultContainer.style.display = 'none';
        resultContent.innerHTML = '';
        generatedReview = '';
        inputContainer.style.display = 'flex';
    });

    copyButton.addEventListener('click', () => {
        // 리뷰 복사 버튼 클릭 시 동작
        if (generatedReview) {
            navigator.clipboard.writeText(generatedReview)
                .then(() => alert('복사되었습니다!'))
                .catch(err => console.error('복사 실패:', err));
        }
    });

    async function generateReview() {
        const name = productName.value.trim();
        const description = productDescription.value.trim();
        const price = productPrice.value.trim();

        if (name && description && price) {
            // 로딩 인디케이터 표시
            loadingIndicator.style.display = 'block';
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
                generatedReview = data.response;
                displayReview(generatedReview);

                // 입력 필드 초기화 및 입력 컨테이너 숨기기
                productName.value = '';
                productDescription.value = '';
                productPrice.value = '';
                inputContainer.style.display = 'none';
            } catch (error) {
                console.error('Error:', error);
                alert('죄송합니다. 리뷰를 생성하는 중 오류가 발생했습니다.');
            } finally {
                // 로딩 인디케이터 숨기기
                loadingIndicator.style.display = 'none';
            }
        } else {
            alert('모든 필드를 입력해주세요.');
        }
    }

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

        resultContent.appendChild(assistantContainer);

        resultContainer.style.display = 'flex';
    }
});
