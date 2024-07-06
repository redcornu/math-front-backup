// 메시지를 서버로 보내고 응답을 처리하는 비동기 함수
async function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim(); // 입력값의 앞뒤 공백 제거
  if (!message) return; // 메시지가 비어있으면 함수 종료
  appendMessage(`You: ${message}`); // 사용자 메시지를 채팅창에 추가
  input.value = ''; // 입력 필드 초기화

  try {
    // 서버에 POST 요청 보내기
    const response = await fetch('https://port-0-test-back-lxlts66g89582f3b.sel5.cloudtype.app/solve-equation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ equation: message }),
      credentials: 'include' // 쿠키 포함
    });
    if (response.ok) {
      const data = await response.json(); // 응답을 JSON으로 파싱
      appendMessage(`수학 선생님: ${formatResponse(data.response)}`); // 응답을 채팅창에 추가
    } else {
      appendMessage('수학 선생님: 에러가 발생했습니다.'); // 오류 메시지 표시
    }
  } catch (error) {
    console.error('Error:', error); // 콘솔에 오류 로깅
    appendMessage('수학 선생님: 에러가 발생했습니다.'); // 오류 메시지 표시
  }
}

// 서버 응답을 HTML에 적합한 형식으로 변환하는 함수
function formatResponse(response) {
  if (typeof response === 'object') {
    response = JSON.stringify(response, null, 2); // 객체를 사람이 읽을 수 있는 형식으로 변환
  }
  // 특수 문자 및 줄바꿈 처리
  return response.replace(/\n/g, '<br>').replace(/\\\[/g, '[').replace(/\\\]/g, ']').replace(/\\\(/g, '(').replace(/\\\)/g, ')');
}

// 메시지를 채팅창에 추가하는 함수
function appendMessage(message) {
  const chatbox = document.getElementById('chatbox');
  const messageElement = document.createElement('div');
  messageElement.innerHTML = message; // innerHTML을 사용하여 HTML 태그를 렌더링합니다.
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// DOM이 로드된 후 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');

  // 엔터 키 입력 이벤트 리스너
  messageInput.addEventListener('keydown', async (event) => {
    if (!event.isComposing && event.key === 'Enter') {
      event.preventDefault(); // 기본 엔터 키 동작 방지
      await sendMessage(); // 메시지 전송 함수 호출
    }
  });

  // 전송 버튼 클릭 이벤트 리스너
  sendButton.addEventListener('click', sendMessage);
});

//테스트