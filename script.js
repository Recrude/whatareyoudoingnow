// 공통 설정
const SPREADSHEET_ID = '1uGb43CbxP3Yew6g0Fs3rpjfohrdwpR7je9RGx1rrzfc';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7RWedV676CEfOXeUHj_a-4xqLoe2Z2RgxwavDmnDfj0z9ktZyL2jODWun8xB3YX34/exec';

// 댓글 전송 중 상태 관리
let isSubmitting = false;

// 현재 페이지 확인 (스프레드시트 시트명으로 사용)
function getCurrentSheetName() {
	const path = window.location.pathname;
    if (path.includes('/00-everyone/')) return '00-everyone';
	if (path.includes('/01-jaeyeon/')) return '01-jaeyeon';
	if (path.includes('/02-sion/')) return '02-sion';
	if (path.includes('/03-seungju/')) return '03-seungju';
	if (path.includes('/04-hyeonsu/')) return '04-hyeonsu';
	if (path.includes('/05-seungwan/')) return '05-seungwan';
	if (path.includes('/06-hyeonseong/')) return '06-hyeonseong';
	if (path.includes('/07-yerim/')) return '07-yerim';
	if (path.includes('/08-jiheon/')) return '08-jiheon';
	if (path.includes('/09-doyoon/')) return '09-doyoon';
	if (path.includes('/10-jaewon/')) return '10-jaewon';
	if (path.includes('/11-mariyam/')) return '11-mariyam';
	if (path.includes('/12-simga/')) return '12-simga';
	if (path.includes('/13-juchan/')) return '13-juchan';
	if (path.includes('/14-yeonwoo/')) return '14-yeonwoo';
	if (path.includes('/15-jihoo/')) return '15-jihoo';
	if (path.includes('/16-shini/')) return '16-shini';
	return 'home';
}

// 댓글 저장
async function submitComment() {
	// 이미 전송 중이면 중복 전송 방지
	if (isSubmitting) {
		return;
	}
	
	const commentInput = document.getElementById('commentInput');
	const message = commentInput.value.trim();
	
	if (!message) {
		// 조용히 플레이스홀더로 알림
		commentInput.placeholder = '댓글을 입력해주세요...';
		setTimeout(() => {
			commentInput.placeholder = '댓글을 입력하세요...';
		}, 2000);
		return;
	}
	
	// 전송 중 상태로 설정
	isSubmitting = true;
	const submitButton = document.querySelector('.submit-button');
	const originalText = submitButton.textContent;
	submitButton.textContent = '전송 중...';
	submitButton.disabled = true;
	
	const sheetName = getCurrentSheetName();
	const commentData = {
		timestamp: new Date().toISOString(),
		message: message,
		sheet: sheetName
	};
	
	try {
		// 구글 스프레드시트에 댓글 저장
		await fetch(SCRIPT_URL, {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(commentData)
		});
		
		// 입력 필드 초기화
		commentInput.value = '';
		
		// 댓글 목록 새로고침 (약간의 지연 후)
		setTimeout(() => {
			loadComments();
		}, 1000);
		
	} catch (error) {
		console.error('댓글 저장 오류:', error);
		// 조용히 플레이스홀더로 에러 표시
		commentInput.placeholder = '전송 실패. 다시 시도해주세요...';
		setTimeout(() => {
			commentInput.placeholder = '댓글을 입력하세요...';
		}, 3000);
	} finally {
		// 전송 완료 후 상태 복원
		isSubmitting = false;
		submitButton.textContent = originalText;
		submitButton.disabled = false;
	}
}

// 댓글 목록 로드
async function loadComments() {
	const commentList = document.getElementById('commentList');
	const sheetName = getCurrentSheetName();
	
	try {
		// 로딩 메시지 표시
		commentList.innerHTML = '<div class="loading-message">댓글을 불러오는 중...</div>';
		
		// 구글 스프레드시트에서 댓글 가져오기
		const response = await fetch(`${SCRIPT_URL}?sheet=${sheetName}`);
		const comments = await response.json();
		
		// 댓글 목록 렌더링 (최신순 정렬)
		if (comments && comments.length > 0) {
			commentList.innerHTML = '';
			// 최신 댓글이 위로 오도록 정렬 (timestamp 기준 내림차순)
			comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
			comments.forEach(comment => {
				addCommentToUI(comment);
			});
		} else {
			commentList.innerHTML = '<div class="loading-message">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</div>';
		}
	} catch (error) {
		console.error('댓글 로드 오류:', error);
		commentList.innerHTML = '<div class="loading-message">댓글을 불러오는 중 오류가 발생했습니다.</div>';
	}
}

// 댓글 UI에 추가
function addCommentToUI(comment) {
	const commentList = document.getElementById('commentList');
	const commentElement = document.createElement('div');
	commentElement.className = 'comment-item';
	
	const date = new Date(comment.timestamp);
	const formattedDate = date.toLocaleDateString('ko-KR', {
		year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
	});
	
	commentElement.innerHTML = `
		<div class="comment-header">
			<div class="comment-time">${formattedDate}</div>
		</div>
		<div class="comment-text">${comment.message}</div>
	`;
	
	commentList.appendChild(commentElement);
}

// 카운트다운 타이머 함수
function startCountdown() {
	// 2025년 12월 1일 오전 10시 (한국 시간) - 테스트용으로 1년 후로 설정
	const targetDate = new Date('2025-12-01T10:00:00+09:00');
	
	function updateTimer() {
		const now = new Date();
		const timeLeft = targetDate - now;
		
		if (timeLeft > 0) {
			const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
			const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
			
			const timerDisplay = document.getElementById('timerDisplay');
			if (timerDisplay) {
				timerDisplay.textContent = 
					`${days.toString().padStart(2, '0')}일 ` +
					`${hours.toString().padStart(2, '0')}시간 ` +
					`${minutes.toString().padStart(2, '0')}분 ` +
					`${seconds.toString().padStart(2, '0')}초`;
			}
		} else {
			// 시간이 지났을 때
			const timerDisplay = document.getElementById('timerDisplay');
			const timerLabel = document.querySelector('.timer-label');
			if (timerDisplay) {
				timerDisplay.textContent = '00일 00시간 00분 00초';
			}
			if (timerLabel) {
				timerLabel.textContent = '졸업전시가 시작되었습니다!';
			}
		}
	}
	
	// 기존 인터벌 정리
	if (window.countdownInterval) {
		clearInterval(window.countdownInterval);
	}
	
	// 즉시 실행하고 1초마다 업데이트
	updateTimer();
	window.countdownInterval = setInterval(updateTimer, 1000);
}

// 활성 버튼 설정
function setActiveButton(folderName) {
	// 모든 버튼에서 active 클래스 제거
	document.querySelectorAll('.student-button').forEach(btn => {
		btn.classList.remove('active');
	});
	
	// 해당 폴더의 버튼에 active 클래스 추가
	const activeButton = document.querySelector(`[onclick*="${folderName}"]`);
	if (activeButton) {
		activeButton.classList.add('active');
	}
}

// 활성 버튼 업데이트 (각 페이지에서 오버라이드)
function updateActiveButton() {
	// 기본 구현 - 각 페이지에서 오버라이드해야 함
}

// 타이머 모드 관련 변수
let isGeneralTimerMode = false;
let generalTimerInterval = null;
let generalTimerSeconds = 0;

// 타이머 모드 전환
function toggleTimerMode() {
	const timerLabel = document.getElementById('timerLabel');
	const timerToggle = document.getElementById('timerToggle');
	const timerButtons = document.getElementById('timerButtons');
	
	if (isGeneralTimerMode) {
		// 졸업전시 타이머 모드로 전환
		isGeneralTimerMode = false;
		timerLabel.textContent = '졸업전시까지...';
		timerToggle.textContent = 'T';
		timerButtons.style.display = 'none';
		
		// 일반 타이머 정리
		if (generalTimerInterval) {
			clearInterval(generalTimerInterval);
		}
		
		// 졸업전시 타이머 재시작
		startCountdown();
	} else {
		// 일반 타이머 모드로 전환
		isGeneralTimerMode = true;
		timerLabel.textContent = '발표 끝날 때까지...';
		timerToggle.textContent = 'G';
		timerButtons.style.display = 'flex';
		
		// 졸업전시 타이머 정리
		if (window.countdownInterval) {
			clearInterval(window.countdownInterval);
		}
		
		// 일반 타이머 표시 초기화
		const timerDisplay = document.getElementById('timerDisplay');
		timerDisplay.textContent = '00분 00초';
		timerDisplay.style.backgroundColor = 'white';
		timerDisplay.style.color = 'black';
	}
}

// 일반 타이머 시작
function selectTimer(minutes) {
	// 기존 타이머 정리
	if (generalTimerInterval) {
		clearInterval(generalTimerInterval);
	}
	
	generalTimerSeconds = minutes * 60;
	
	// UI 업데이트
	updateTimerDisplay();
	
	// 1초마다 업데이트
	generalTimerInterval = setInterval(() => {
		generalTimerSeconds--;
		updateTimerDisplay();
		
		// 타이머 종료
		if (generalTimerSeconds <= 0) {
			clearInterval(generalTimerInterval);
			showTimerExpired();
		}
	}, 1000);
}

// 타이머 표시 업데이트
function updateTimerDisplay() {
	const timerDisplay = document.getElementById('timerDisplay');
	if (timerDisplay && isGeneralTimerMode) {
		const minutes = Math.floor(generalTimerSeconds / 60);
		const seconds = generalTimerSeconds % 60;
		timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}분 ${seconds.toString().padStart(2, '0')}초`;
	}
}

// 타이머 만료 표시
function showTimerExpired() {
	const timerDisplay = document.getElementById('timerDisplay');
	if (timerDisplay) {
		timerDisplay.textContent = '00분 00초';
		timerDisplay.style.backgroundColor = '#ff0000';
		timerDisplay.style.color = '#ffffff';
	}
}

// 공통 초기화 함수
function initializeCommon() {
	// 카운트다운 타이머 시작
	startCountdown();
	
	// 댓글 로드
	loadComments();
	
	// 엔터키로 댓글 제출 (중복 등록 방지)
	const commentInput = document.getElementById('commentInput');
	if (commentInput && !commentInput.hasAttribute('data-listener-added')) {
		commentInput.setAttribute('data-listener-added', 'true');
		commentInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter' && !isSubmitting) {
				submitComment();
			}
		});
	}
}
