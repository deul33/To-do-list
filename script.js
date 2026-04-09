// DOM 요소 선택
const input = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('habit-list');
const countDisplay = document.getElementById('count');
const fireIcon = document.getElementById('fire-icon');

// 로컬 스토리지에서 데이터 불러오기 (없으면 빈 배열/0)
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let streak = parseInt(localStorage.getItem('streak')) || 0;

// 앱 시작 시 화면 그리기
function init() {
    renderHabits();
    updateStreakUI();
}

// 1. 습관 추가 기능
function addHabit() {
    const text = input.value.trim();
    if (text === '') return;

    const newHabit = {
        id: Date.now(),
        text: text,
        completed: false
    };

    // 기존: habits.push(newHabit); -> 맨 뒤에 추가
    // 변경: unshift를 사용해 맨 앞에 추가!
    habits.unshift(newHabit); 

    saveData();
    renderHabits();
    
    input.value = '';
    input.focus(); // 추가 후 바로 다음 습관을 적을 수 있게 포커스 유지
}

// 2. 습관 완료 토글 및 스트릭 계산
function toggleHabit(id) {
    habits = habits.map(habit => {
        if (habit.id === id) {
            const isBecomingDone = !habit.completed;
            
            // 스트릭 업데이트 로직
            if (isBecomingDone) {
                streak++;
            } else {
                streak = Math.max(0, streak - 1);
            }
            
            return { ...habit, completed: isBecomingDone };
        }
        return habit;
    });

    saveData();
    renderHabits();
    updateStreakUI();
}

// 3. 습관 삭제
function deleteHabit(id, event) {
    event.stopPropagation(); // 클릭 이벤트가 부모(li)로 퍼지는 것 방지
    habits = habits.filter(habit => habit.id !== id);
    saveData();
    renderHabits();
}

// 4. 화면 렌더링
function renderHabits() {
    list.innerHTML = '';
    habits.forEach(habit => {
        const li = document.createElement('li');
        li.onclick = () => toggleHabit(habit.id);

        li.innerHTML = `
            <span class="habit-text ${habit.completed ? 'completed' : ''}">
                ${habit.text}
            </span>
            <button class="delete-btn">삭제</button>
        `;

        // 삭제 버튼에 이벤트 리스너 별도 등록
        li.querySelector('.delete-btn').onclick = (e) => deleteHabit(habit.id, e);
        
        list.appendChild(li);
    });
}

// 5. 스트릭 UI 업데이트
function updateStreakUI() {
    countDisplay.innerText = streak;
    if (streak > 0) {
        fireIcon.classList.add('active');
    } else {
        fireIcon.classList.remove('active');
    }
}

// 6. 데이터 저장
function saveData() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('streak', streak.toString());
}

// 이벤트 연결
addBtn.addEventListener('click', addHabit);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
});

// 실행
init();