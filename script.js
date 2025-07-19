// Application data structure
const appData = {
    classes: [
        { id: 1, name: "一年A班" }
    ],
    students: [
        { id: 1, name: "王小明", classId: 1 },
        { id: 2, name: "李小華", classId: 1 },
        { id: 3, name: "張天宇", classId: 1 }
    ],
    attendance: {}, // { "YYYY-MM-DD": { studentId: "P" | "A" } }
    scores: {} // { "YYYY-MM-DD": { studentId: 0-4 } }
};

// State
let currentView = 'attendance';
let currentDate = '';
let currentClassId = '';

// DOM refs (declared later)
let tabButtons, tabContents, dateSelect, classSelect;
let attendanceView, scoringView, emptyState;
let attendanceStudentsList, scoringStudentsList;
let presentCount, absentCount, totalStudents;
let resetDataBtn;

function init() {
    // Cache DOM
    tabButtons = document.querySelectorAll('.tab-btn');
    tabContents = document.querySelectorAll('.tab-content');
    dateSelect = document.getElementById('date-select');
    classSelect = document.getElementById('class-select');
    attendanceView = document.getElementById('attendance-view');
    scoringView = document.getElementById('scoring-view');
    emptyState = document.getElementById('empty-state');
    attendanceStudentsList = document.getElementById('attendance-students-list');
    scoringStudentsList = document.getElementById('scoring-students-list');
    presentCount = document.getElementById('present-count');
    absentCount = document.getElementById('absent-count');
    totalStudents = document.getElementById('total-students');
    resetDataBtn = document.getElementById('reset-data-btn');

    // Initial setup
    initializeDate();
    populateClassSelector();

    // Listeners
    setupListeners();

    // Initial render
    switchTab('attendance');
}

function initializeDate() {
    const today = new Date();
    currentDate = today.toISOString().split('T')[0];
    dateSelect.value = currentDate;
}

function populateClassSelector() {
    classSelect.innerHTML = '<option value="">請選擇班級</option>';
    appData.classes.forEach(cls => {
        const opt = document.createElement('option');
        opt.value = cls.id;
        opt.textContent = cls.name;
        classSelect.appendChild(opt);
    });
}

function setupListeners() {
    // Tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Date & class changes
    dateSelect.addEventListener('change', () => {
        currentDate = dateSelect.value;
        updateContent();
    });
    classSelect.addEventListener('change', () => {
        currentClassId = classSelect.value;
        updateContent();
    });

    // Reset
    resetDataBtn.addEventListener('click', handleReset);

    // Delegated student interactions
    attendanceStudentsList.addEventListener('click', attendanceHandler);
    scoringStudentsList.addEventListener('click', scoreHandler);
}

function switchTab(name) {
    currentView = name;
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === name));
    tabContents.forEach(ctn => ctn.classList.toggle('active', ctn.id === `${name}-view`));
    updateContent();
}

function updateContent() {
    if (!currentClassId || !currentDate) {
        showEmpty();
        return;
    }
    hideEmpty();
    if (currentView === 'attendance') renderAttendance();
    if (currentView === 'scoring') renderScoring();
    updateSummary();
}

function showEmpty() {
    emptyState.classList.remove('hidden');
    attendanceView.classList.add('hidden');
    scoringView.classList.add('hidden');
}

function hideEmpty() {
    emptyState.classList.add('hidden');
    attendanceView.classList.remove('hidden');
    scoringView.classList.remove('hidden');
}

function getStudents() {
    return appData.students.filter(s => String(s.classId) === String(currentClassId));
}

// ----------------- Attendance -----------------
function renderAttendance() {
    attendanceStudentsList.innerHTML = '';
    getStudents().forEach(stu => attendanceStudentsList.appendChild(attendanceRow(stu)));
}

function attendanceRow(stu) {
    const row = document.createElement('div');
    row.className = 'student-row';
    const status = (appData.attendance[currentDate] || {})[stu.id] || null;
    row.innerHTML = `
        <div class="student-name">${stu.name}</div>
        <div class="attendance-buttons">
            <button class="attendance-btn ${status === 'P' ? 'present' : ''}" data-student="${stu.id}" data-status="P">出席</button>
            <button class="attendance-btn ${status === 'A' ? 'absent' : ''}" data-student="${stu.id}" data-status="A">缺席</button>
        </div>`;
    return row;
}

function attendanceHandler(e) {
    const btn = e.target.closest('.attendance-btn');
    if (!btn) return;
    const id = btn.dataset.student;
    const status = btn.dataset.status;
    if (!appData.attendance[currentDate]) appData.attendance[currentDate] = {};
    const curr = appData.attendance[currentDate][id];
    if (curr === status) delete appData.attendance[currentDate][id];
    else appData.attendance[currentDate][id] = status;
    renderAttendance();
    updateSummary();
}

// ----------------- Scoring -----------------
function renderScoring() {
    scoringStudentsList.innerHTML = '';
    getStudents().forEach(stu => scoringStudentsList.appendChild(scoreRow(stu)));
}

function scoreRow(stu) {
    const row = document.createElement('div');
    row.className = 'student-row';
    const score = (appData.scores[currentDate] || {})[stu.id] || 0;
    const buttons = [0,1,2,3,4].map(s => `<button class="score-btn ${s===score? 'active':''}" data-student="${stu.id}" data-score="${s}">${s}</button>`).join('');
    row.innerHTML = `<div class="student-name">${stu.name}</div><div class="score-buttons">${buttons}</div>`;
    return row;
}

function scoreHandler(e) {
    const btn = e.target.closest('.score-btn');
    if (!btn) return;
    const id = btn.dataset.student;
    const score = Number(btn.dataset.score);
    if (!appData.scores[currentDate]) appData.scores[currentDate] = {};
    appData.scores[currentDate][id] = score;
    renderScoring();
}

// ----------------- Summary -----------------
function updateSummary() {
    const students = getStudents();
    const data = appData.attendance[currentDate] || {};
    let present = 0, absent = 0;
    students.forEach(s => {
        if (data[s.id] === 'P') present++;
        else if (data[s.id] === 'A') absent++;
    });
    presentCount.textContent = present;
    absentCount.textContent = absent;
    totalStudents.textContent = students.length;
}

// ----------------- Reset -----------------
function handleReset() {
    if (confirm('確定要重置所有資料嗎？此操作無法復原。')) {
        appData.attendance = {};
        appData.scores = {};
        updateContent();
        toast('所有資料已重置', 'success');
    }
}

function toast(msg, type='info') {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = `position:fixed;top:20px;right:20px;background:${type==='success'?'#4caf50':'#2196f3'};color:#fff;padding:12px 24px;border-radius:8px;z-index:9999;opacity:0;transform:translateX(100%);transition:all .3s ease;`;
    document.body.appendChild(el);
    requestAnimationFrame(()=>{el.style.opacity='1';el.style.transform='translateX(0)';});
    setTimeout(()=>{el.style.opacity='0';el.style.transform='translateX(100%)';setTimeout(()=>el.remove(),300);},3000);
}

// Call init immediately since script is at the end of body (DOMContentLoaded already fired)
init();