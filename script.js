// 全局資料儲存
let appData = {
  classes: [
    {
      id: "class_1",
      name: "一年級甲班",
      createdAt: "2025-01-15",
      updatedAt: "2025-01-19"
    },
    {
      id: "class_2", 
      name: "一年級乙班",
      createdAt: "2025-01-15",
      updatedAt: "2025-01-19"
    },
    {
      id: "class_3",
      name: "二年級甲班", 
      createdAt: "2025-01-16",
      updatedAt: "2025-01-19"
    }
  ],
  students: [
    {
      id: "student_1",
      name: "王小明",
      classId: "class_1", 
      createdAt: "2025-01-15",
      updatedAt: "2025-01-19"
    },
    {
      id: "student_2",
      name: "李小華",
      classId: "class_1",
      createdAt: "2025-01-15", 
      updatedAt: "2025-01-19"
    },
    {
      id: "student_3",
      name: "張小美",
      classId: "class_1",
      createdAt: "2025-01-15",
      updatedAt: "2025-01-19"
    },
    {
      id: "student_4", 
      name: "陳小強",
      classId: "class_2",
      createdAt: "2025-01-16",
      updatedAt: "2025-01-19"
    },
    {
      id: "student_5",
      name: "劉小芳", 
      classId: "class_2",
      createdAt: "2025-01-16",
      updatedAt: "2025-01-19"
    },
    {
      id: "student_6",
      name: "黃小傑",
      classId: "class_3",
      createdAt: "2025-01-17",
      updatedAt: "2025-01-19"
    }
  ],
  attendance: [
    {
      id: "att_1",
      studentId: "student_1",
      date: "2025-01-19", 
      status: "present",
      recordedAt: "2025-01-19T08:30:00"
    },
    {
      id: "att_2",
      studentId: "student_2",
      date: "2025-01-19",
      status: "present", 
      recordedAt: "2025-01-19T08:30:00"
    },
    {
      id: "att_3", 
      studentId: "student_3",
      date: "2025-01-19",
      status: "absent",
      recordedAt: "2025-01-19T08:30:00"
    },
    {
      id: "att_4",
      studentId: "student_1",
      date: "2025-01-18",
      status: "present",
      recordedAt: "2025-01-18T08:30:00" 
    },
    {
      id: "att_5",
      studentId: "student_2", 
      date: "2025-01-18",
      status: "absent",
      recordedAt: "2025-01-18T08:30:00"
    }
  ],
  scores: [
    {
      id: "score_1",
      studentId: "student_1",
      date: "2025-01-19",
      category: "作業表現",
      score: 85,
      maxScore: 100,
      recordedAt: "2025-01-19T10:00:00"
    },
    {
      id: "score_2", 
      studentId: "student_1",
      date: "2025-01-19",
      category: "課堂參與",
      score: 90,
      maxScore: 100,
      recordedAt: "2025-01-19T11:00:00"
    },
    {
      id: "score_3",
      studentId: "student_2",
      date: "2025-01-19", 
      category: "作業表現",
      score: 78,
      maxScore: 100,
      recordedAt: "2025-01-19T10:00:00"
    },
    {
      id: "score_4",
      studentId: "student_2",
      date: "2025-01-18",
      category: "紀律表現",
      score: 92,
      maxScore: 100,
      recordedAt: "2025-01-18T14:00:00"
    }
  ],
  scoreCategories: [
    "作業表現",
    "課堂參與", 
    "紀律表現",
    "考試成績",
    "團隊合作"
  ]
};

// 工具函數
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

function getCurrentDate() {
  return formatDate(new Date());
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'success' ? 'check-circle' : 
               type === 'error' ? 'exclamation-triangle' : 
               type === 'warning' ? 'exclamation-triangle' : 'info-circle';
  
  notification.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
    setTimeout(() => {
      container.removeChild(notification);
    }, 300);
  }, 3000);
}

// 更新所有下拉選單
function updateAllDropdowns() {
  updateClassDropdowns();
  updateScoringCategories();
}

// 更新班級下拉選單
function updateClassDropdowns() {
  const dropdowns = [
    'student-class-filter',
    'attendance-class-select', 
    'scoring-class-select'
  ];
  
  dropdowns.forEach(dropdownId => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      const currentValue = dropdown.value;
      const defaultOption = dropdown.querySelector('option[value=""]').textContent;
      
      dropdown.innerHTML = `<option value="">${defaultOption}</option>`;
      appData.classes.forEach(classData => {
        dropdown.innerHTML += `<option value="${classData.id}">${classData.name}</option>`;
      });
      
      // 恢復之前選擇的值
      if (currentValue) {
        dropdown.value = currentValue;
      }
    }
  });
}

// 更新評分項目下拉選單
function updateScoringCategories() {
  const categorySelect = document.getElementById('scoring-category');
  if (categorySelect) {
    const currentValue = categorySelect.value;
    categorySelect.innerHTML = '<option value="">評分項目</option>';
    appData.scoreCategories.forEach(category => {
      categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
    });
    
    if (currentValue) {
      categorySelect.value = currentValue;
    }
  }
}

// 模態框功能
function showModal(content) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = content;
  modal.classList.add('show');
}

function hideModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('show');
}

function showConfirmDialog(title, message, onConfirm) {
  const content = `
    <div class="confirm-dialog">
      <i class="fas fa-exclamation-triangle icon"></i>
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="confirm-actions">
        <button class="btn btn--secondary" onclick="hideModal()">取消</button>
        <button class="btn btn--primary" onclick="handleConfirm()">確認</button>
      </div>
    </div>
  `;
  showModal(content);
  window.currentConfirmAction = onConfirm;
}

function handleConfirm() {
  if (window.currentConfirmAction) {
    window.currentConfirmAction();
    window.currentConfirmAction = null;
  }
  hideModal();
}

// 導航功能
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-page');
      
      // 更新導航狀態
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // 切換頁面
      pages.forEach(page => page.classList.remove('active'));
      document.getElementById(targetPage).classList.add('active');
      
      // 載入頁面資料
      loadPageData(targetPage);
    });
  });
  
  // 模態框關閉
  document.querySelector('.close').addEventListener('click', hideModal);
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
      hideModal();
    }
  });
}

// 載入頁面資料
function loadPageData(pageName) {
  switch(pageName) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'classes':
      loadClasses();
      break;
    case 'students':
      loadStudents();
      break;
    case 'attendance':
      loadAttendance();
      break;
    case 'scoring':
      loadScoring();
      break;
    case 'reports':
      loadReports();
      break;
  }
}

// 首頁統計
function loadDashboard() {
  const totalClasses = appData.classes.length;
  const totalStudents = appData.students.length;
  
  // 計算今日出席率
  const today = getCurrentDate();
  const todayAttendance = appData.attendance.filter(att => att.date === today);
  const presentToday = todayAttendance.filter(att => att.status === 'present').length;
  const totalToday = todayAttendance.length;
  const todayRate = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;
  
  // 計算平均分數
  const allScores = appData.scores.map(s => s.score);
  const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
  
  document.getElementById('total-classes').textContent = totalClasses;
  document.getElementById('total-students').textContent = totalStudents;
  document.getElementById('today-attendance').textContent = `${todayRate}%`;
  document.getElementById('avg-score').textContent = avgScore;
}

// 班級管理
function loadClasses() {
  const grid = document.getElementById('classes-grid');
  grid.innerHTML = '';
  
  if (appData.classes.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-chalkboard"></i>
        <h3>尚未建立班級</h3>
        <p>點擊「新增班級」按鈕開始建立您的第一個班級</p>
      </div>
    `;
    return;
  }
  
  appData.classes.forEach(classData => {
    const studentCount = appData.students.filter(s => s.classId === classData.id).length;
    const card = document.createElement('div');
    card.className = 'class-card';
    card.innerHTML = `
      <h3>${classData.name}</h3>
      <div class="class-info">
        <p><i class="fas fa-users"></i> 學生人數：${studentCount} 人</p>
        <p><i class="fas fa-calendar"></i> 建立日期：${classData.createdAt}</p>
        <p><i class="fas fa-edit"></i> 最後更新：${classData.updatedAt}</p>
      </div>
      <div class="class-actions">
        <button class="btn btn--sm btn--secondary" onclick="editClass('${classData.id}')">
          <i class="fas fa-edit"></i> 編輯
        </button>
        <button class="btn btn--sm btn--outline" onclick="deleteClass('${classData.id}')">
          <i class="fas fa-trash"></i> 刪除
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function showAddClassForm() {
  const content = `
    <h3>新增班級</h3>
    <form id="add-class-form">
      <div class="form-group">
        <label class="form-label">班級名稱</label>
        <input type="text" class="form-control" id="class-name" required placeholder="請輸入班級名稱">
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--secondary" onclick="hideModal()">取消</button>
        <button type="submit" class="btn btn--primary">確認新增</button>
      </div>
    </form>
  `;
  showModal(content);
  
  document.getElementById('add-class-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('class-name').value.trim();
    if (name) {
      const newClass = {
        id: generateId('class'),
        name: name,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate()
      };
      appData.classes.push(newClass);
      loadClasses();
      updateAllDropdowns(); // 更新所有下拉選單
      hideModal();
      showNotification('班級新增成功！', 'success');
    }
  });
}

function editClass(classId) {
  const classData = appData.classes.find(c => c.id === classId);
  if (!classData) return;
  
  const content = `
    <h3>編輯班級</h3>
    <form id="edit-class-form">
      <div class="form-group">
        <label class="form-label">班級名稱</label>
        <input type="text" class="form-control" id="edit-class-name" required value="${classData.name}">
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--secondary" onclick="hideModal()">取消</button>
        <button type="submit" class="btn btn--primary">確認修改</button>
      </div>
    </form>
  `;
  showModal(content);
  
  document.getElementById('edit-class-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('edit-class-name').value.trim();
    if (name) {
      classData.name = name;
      classData.updatedAt = getCurrentDate();
      loadClasses();
      updateAllDropdowns(); // 更新所有下拉選單
      hideModal();
      showNotification('班級修改成功！', 'success');
    }
  });
}

function deleteClass(classId) {
  const classData = appData.classes.find(c => c.id === classId);
  const studentCount = appData.students.filter(s => s.classId === classId).length;
  
  if (studentCount > 0) {
    showNotification('無法刪除：該班級還有學生，請先轉移學生至其他班級', 'error');
    return;
  }
  
  showConfirmDialog(
    '確認刪除班級',
    `您確定要刪除「${classData.name}」嗎？此操作無法復原。`,
    () => {
      appData.classes = appData.classes.filter(c => c.id !== classId);
      loadClasses();
      updateAllDropdowns(); // 更新所有下拉選單
      showNotification('班級刪除成功！', 'success');
    }
  );
}

// 學生管理
function loadStudents() {
  // 載入班級選項
  updateClassDropdowns();
  
  // 載入學生表格
  updateStudentsTable();
  
  // 班級過濾
  const classFilter = document.getElementById('student-class-filter');
  classFilter.removeEventListener('change', updateStudentsTable); // 移除舊監聽器
  classFilter.addEventListener('change', updateStudentsTable);
}

function updateStudentsTable() {
  const tableBody = document.querySelector('#students-table tbody');
  const selectedClassId = document.getElementById('student-class-filter').value;
  
  let filteredStudents = appData.students;
  if (selectedClassId) {
    filteredStudents = appData.students.filter(s => s.classId === selectedClassId);
  }
  
  tableBody.innerHTML = '';
  
  if (filteredStudents.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <i class="fas fa-user-graduate"></i>
            <h3>尚無學生資料</h3>
            <p>點擊「新增學生」按鈕開始新增學生</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  filteredStudents.forEach(student => {
    const classData = appData.classes.find(c => c.id === student.classId);
    const lastAttendance = appData.attendance
      .filter(att => att.studentId === student.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    const currentMonth = getCurrentDate().substr(0, 7); // YYYY-MM
    const monthlyScores = appData.scores.filter(s => 
      s.studentId === student.id && s.date.startsWith(currentMonth)
    );
    const totalScore = monthlyScores.reduce((sum, s) => sum + s.score, 0);
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${classData ? classData.name : '未分班'}</td>
      <td>${lastAttendance ? lastAttendance.date : '無記錄'}</td>
      <td>${totalScore}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn--sm btn--secondary" onclick="editStudent('${student.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn--sm btn--outline" onclick="transferStudent('${student.id}')">
            <i class="fas fa-exchange-alt"></i>
          </button>
          <button class="btn btn--sm btn--outline" onclick="deleteStudent('${student.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function showAddStudentForm() {
  const content = `
    <h3>新增學生</h3>
    <form id="add-student-form">
      <div class="form-group">
        <label class="form-label">學生姓名</label>
        <input type="text" class="form-control" id="student-name" required placeholder="請輸入學生姓名">
      </div>
      <div class="form-group">
        <label class="form-label">所屬班級</label>
        <select class="form-control" id="student-class" required>
          <option value="">請選擇班級</option>
          ${appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--secondary" onclick="hideModal()">取消</button>
        <button type="submit" class="btn btn--primary">確認新增</button>
      </div>
    </form>
  `;
  showModal(content);
  
  document.getElementById('add-student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('student-name').value.trim();
    const classId = document.getElementById('student-class').value;
    
    if (name && classId) {
      const newStudent = {
        id: generateId('student'),
        name: name,
        classId: classId,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate()
      };
      appData.students.push(newStudent);
      updateStudentsTable();
      hideModal();
      showNotification('學生新增成功！', 'success');
    }
  });
}

function editStudent(studentId) {
  const student = appData.students.find(s => s.id === studentId);
  if (!student) return;
  
  const content = `
    <h3>編輯學生</h3>
    <form id="edit-student-form">
      <div class="form-group">
        <label class="form-label">學生姓名</label>
        <input type="text" class="form-control" id="edit-student-name" required value="${student.name}">
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--secondary" onclick="hideModal()">取消</button>
        <button type="submit" class="btn btn--primary">確認修改</button>
      </div>
    </form>
  `;
  showModal(content);
  
  document.getElementById('edit-student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('edit-student-name').value.trim();
    if (name) {
      student.name = name;
      student.updatedAt = getCurrentDate();
      updateStudentsTable();
      hideModal();
      showNotification('學生資料修改成功！', 'success');
    }
  });
}

function transferStudent(studentId) {
  const student = appData.students.find(s => s.id === studentId);
  if (!student) return;
  
  const currentClass = appData.classes.find(c => c.id === student.classId);
  const otherClasses = appData.classes.filter(c => c.id !== student.classId);
  
  const content = `
    <h3>轉班學生</h3>
    <p>學生：<strong>${student.name}</strong></p>
    <p>目前班級：<strong>${currentClass ? currentClass.name : '未分班'}</strong></p>
    <form id="transfer-student-form">
      <div class="form-group">
        <label class="form-label">轉至班級</label>
        <select class="form-control" id="transfer-class" required>
          <option value="">請選擇目標班級</option>
          ${otherClasses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--secondary" onclick="hideModal()">取消</button>
        <button type="submit" class="btn btn--primary">確認轉班</button>
      </div>
    </form>
  `;
  showModal(content);
  
  document.getElementById('transfer-student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newClassId = document.getElementById('transfer-class').value;
    if (newClassId) {
      student.classId = newClassId;
      student.updatedAt = getCurrentDate();
      updateStudentsTable();
      hideModal();
      showNotification('學生轉班成功！', 'success');
    }
  });
}

function deleteStudent(studentId) {
  const student = appData.students.find(s => s.id === studentId);
  
  showConfirmDialog(
    '確認刪除學生',
    `您確定要刪除學生「${student.name}」嗎？此操作將同時刪除該學生的所有出席記錄和分數記錄。`,
    () => {
      // 刪除學生及相關記錄
      appData.students = appData.students.filter(s => s.id !== studentId);
      appData.attendance = appData.attendance.filter(att => att.studentId !== studentId);
      appData.scores = appData.scores.filter(score => score.studentId !== studentId);
      updateStudentsTable();
      showNotification('學生刪除成功！', 'success');
    }
  );
}

// 點名管理
function loadAttendance() {
  // 載入班級選項
  updateClassDropdowns();
  
  // 設定預設日期為今天
  document.getElementById('attendance-date').value = getCurrentDate();
  
  // 移除舊事件監聽器並添加新的
  const classSelect = document.getElementById('attendance-class-select');
  const dateInput = document.getElementById('attendance-date');
  
  classSelect.removeEventListener('change', updateAttendanceList);
  dateInput.removeEventListener('change', updateAttendanceList);
  
  classSelect.addEventListener('change', updateAttendanceList);
  dateInput.addEventListener('change', updateAttendanceList);
  
  // 初始加載
  updateAttendanceList();
}

function updateAttendanceList() {
  const classId = document.getElementById('attendance-class-select').value;
  const date = document.getElementById('attendance-date').value;
  const listContainer = document.getElementById('attendance-list');
  
  if (!classId || !date) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-check"></i>
        <h3>請選擇班級和日期</h3>
        <p>選擇班級和日期後開始點名</p>
      </div>
    `;
    return;
  }
  
  const classStudents = appData.students.filter(s => s.classId === classId);
  
  if (classStudents.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-user-graduate"></i>
        <h3>該班級尚無學生</h3>
        <p>請先新增學生至該班級</p>
      </div>
    `;
    return;
  }
  
  listContainer.innerHTML = '';
  
  classStudents.forEach(student => {
    const existingAttendance = appData.attendance.find(att => 
      att.studentId === student.id && att.date === date
    );
    
    const attendanceItem = document.createElement('div');
    attendanceItem.className = 'attendance-item';
    attendanceItem.innerHTML = `
      <span class="student-name">${student.name}</span>
      <div class="attendance-buttons">
        <button class="attendance-btn present ${existingAttendance?.status === 'present' ? 'active' : ''}" 
                data-student="${student.id}" data-status="present">
          <i class="fas fa-check"></i> 出席
        </button>
        <button class="attendance-btn absent ${existingAttendance?.status === 'absent' ? 'active' : ''}" 
                data-student="${student.id}" data-status="absent">
          <i class="fas fa-times"></i> 缺席
        </button>
      </div>
    `;
    listContainer.appendChild(attendanceItem);
  });
  
  // 添加點擊事件
  document.querySelectorAll('.attendance-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = btn.getAttribute('data-student');
      const status = btn.getAttribute('data-status');
      const parentButtons = btn.parentElement.querySelectorAll('.attendance-btn');
      
      // 更新按鈕狀態
      parentButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // 儲存到暫存
      btn.parentElement.setAttribute('data-attendance', JSON.stringify({
        studentId: studentId,
        status: status
      }));
    });
  });
}

function markAllAttendance(status) {
  const buttons = document.querySelectorAll(`.attendance-btn.${status}`);
  buttons.forEach(btn => btn.click());
}

function saveAttendance() {
  const date = document.getElementById('attendance-date').value;
  const classId = document.getElementById('attendance-class-select').value;
  
  if (!classId || !date) {
    showNotification('請選擇班級和日期', 'error');
    return;
  }
  
  const attendanceData = [];
  document.querySelectorAll('.attendance-buttons').forEach(buttonGroup => {
    const data = buttonGroup.getAttribute('data-attendance');
    if (data) {
      attendanceData.push(JSON.parse(data));
    }
  });
  
  if (attendanceData.length === 0) {
    showNotification('請至少為一位學生標記出席狀態', 'warning');
    return;
  }
  
  // 刪除當日該班級的現有記錄
  appData.attendance = appData.attendance.filter(att => 
    !(att.date === date && appData.students.find(s => s.id === att.studentId && s.classId === classId))
  );
  
  // 新增新記錄
  attendanceData.forEach(data => {
    appData.attendance.push({
      id: generateId('att'),
      studentId: data.studentId,
      date: date,
      status: data.status,
      recordedAt: new Date().toISOString()
    });
  });
  
  showNotification(`成功儲存 ${attendanceData.length} 位學生的出席記錄`, 'success');
  updateAttendanceList();
}

// 評分管理
function loadScoring() {
  // 載入班級選項和評分項目
  updateClassDropdowns();
  updateScoringCategories();
  
  // 設定預設日期
  document.getElementById('scoring-date').value = getCurrentDate();
  
  // 移除舊事件監聽器並添加新的
  const classSelect = document.getElementById('scoring-class-select');
  const dateInput = document.getElementById('scoring-date');
  const categorySelect = document.getElementById('scoring-category');
  
  classSelect.removeEventListener('change', updateScoringList);
  dateInput.removeEventListener('change', updateScoringList);
  categorySelect.removeEventListener('change', updateScoringList);
  
  classSelect.addEventListener('change', updateScoringList);
  dateInput.addEventListener('change', updateScoringList);
  categorySelect.addEventListener('change', updateScoringList);
  
  // 初始加載
  updateScoringList();
}

function updateScoringList() {
  const classId = document.getElementById('scoring-class-select').value;
  const date = document.getElementById('scoring-date').value;
  const category = document.getElementById('scoring-category').value;
  const listContainer = document.getElementById('scoring-list');
  
  if (!classId || !date || !category) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-star"></i>
        <h3>請選擇班級、日期和評分項目</h3>
        <p>選擇完整資訊後開始評分</p>
      </div>
    `;
    return;
  }
  
  const classStudents = appData.students.filter(s => s.classId === classId);
  
  if (classStudents.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-user-graduate"></i>
        <h3>該班級尚無學生</h3>
        <p>請先新增學生至該班級</p>
      </div>
    `;
    return;
  }
  
  listContainer.innerHTML = '';
  
  classStudents.forEach(student => {
    const existingScore = appData.scores.find(score => 
      score.studentId === student.id && 
      score.date === date && 
      score.category === category
    );
    
    const scoringItem = document.createElement('div');
    scoringItem.className = 'scoring-item';
    scoringItem.innerHTML = `
      <span class="student-name">${student.name}</span>
      <div class="score-input-container">
        <input type="number" class="score-input" min="0" max="100" 
               value="${existingScore ? existingScore.score : ''}"
               data-student="${student.id}" placeholder="分數">
        <span style="margin-left: 8px; color: var(--color-text-secondary);">/ 100</span>
      </div>
    `;
    listContainer.appendChild(scoringItem);
  });
}

function saveScores() {
  const classId = document.getElementById('scoring-class-select').value;
  const date = document.getElementById('scoring-date').value;
  const category = document.getElementById('scoring-category').value;
  
  if (!classId || !date || !category) {
    showNotification('請選擇班級、日期和評分項目', 'error');
    return;
  }
  
  const scoreInputs = document.querySelectorAll('.score-input');
  const scoresToSave = [];
  
  scoreInputs.forEach(input => {
    const score = parseInt(input.value);
    const studentId = input.getAttribute('data-student');
    
    if (!isNaN(score) && score >= 0 && score <= 100) {
      scoresToSave.push({ studentId, score });
    }
  });
  
  if (scoresToSave.length === 0) {
    showNotification('請至少輸入一個有效分數 (0-100)', 'warning');
    return;
  }
  
  // 刪除現有記錄
  appData.scores = appData.scores.filter(s => 
    !(s.date === date && s.category === category && 
      scoresToSave.some(score => score.studentId === s.studentId))
  );
  
  // 新增新記錄
  scoresToSave.forEach(data => {
    appData.scores.push({
      id: generateId('score'),
      studentId: data.studentId,
      date: date,
      category: category,
      score: data.score,
      maxScore: 100,
      recordedAt: new Date().toISOString()
    });
  });
  
  showNotification(`成功儲存 ${scoresToSave.length} 位學生的評分記錄`, 'success');
  updateScoringList();
}

// 月度報表
function loadReports() {
  // 載入年月選項
  const yearSelect = document.getElementById('report-year');
  const monthSelect = document.getElementById('report-month');
  
  const currentYear = new Date().getFullYear();
  yearSelect.innerHTML = '';
  for (let year = currentYear - 2; year <= currentYear + 1; year++) {
    yearSelect.innerHTML += `<option value="${year}">${year}年</option>`;
  }
  yearSelect.value = currentYear;
  
  monthSelect.innerHTML = '';
  for (let month = 1; month <= 12; month++) {
    monthSelect.innerHTML += `<option value="${month.toString().padStart(2, '0')}">${month}月</option>`;
  }
  monthSelect.value = (new Date().getMonth() + 1).toString().padStart(2, '0');
}

function generateReport() {
  const year = document.getElementById('report-year').value;
  const month = document.getElementById('report-month').value;
  const yearMonth = `${year}-${month}`;
  
  // 計算報表資料
  const reportData = [];
  let totalAttendance = 0;
  let totalAbsent = 0;
  let totalScores = [];
  
  appData.students.forEach(student => {
    const classData = appData.classes.find(c => c.id === student.classId);
    
    // 出席統計
    const monthAttendance = appData.attendance.filter(att => 
      att.studentId === student.id && att.date.startsWith(yearMonth)
    );
    const presentDays = monthAttendance.filter(att => att.status === 'present').length;
    const absentDays = monthAttendance.filter(att => att.status === 'absent').length;
    const attendanceRate = monthAttendance.length > 0 ? 
      Math.round((presentDays / monthAttendance.length) * 100) : 0;
    
    /// 計分畫面
const scoreList = $('scoringList');
scoreList.innerHTML = '';
students.forEach(s => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = s.name;
  li.appendChild(span);

  // 分數按鈕 0~4，只能擇一高亮
  for (let i = 0; i <= 4; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'scoreBtn';
    if ((appData.scores[date]?.[s.id] ?? '') === i) btn.classList.add('active');
    btn.onclick = () => {
      appData.scores[date] = appData.scores[date] || {};
      appData.scores[date][s.id] = i;
      renderView();
    };
    li.appendChild(btn);
  }

  // 刪除按鈕
  const delBtn = document.createElement('button');
  delBtn.textContent = '✖';
  delBtn.title = '刪除學生';
  delBtn.style.background = 'gray';
  delBtn.style.color = 'white';
  delBtn.style.marginLeft = '10px';
  delBtn.onclick = () => {
    if (confirm(`確定要刪除「${s.name}」嗎？`)) {
      appData.students = appData.students.filter(st => st.id !== s.id);
      Object.keys(appData.attendance).forEach(d => delete appData.attendance[d][s.id]);
      Object.keys(appData.scores).forEach(d => delete appData.scores[d][s.id]);
      renderView();
    }
  };
  li.appendChild(delBtn);

  scoreList.appendChild(li);
});

  
  // 更新摘要
  const summaryContainer = document.getElementById('report-summary');
  const overallAvgScore = totalScores.length > 0 ? 
    Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length) : 0;
  const overallAttendanceRate = (totalAttendance + totalAbsent) > 0 ? 
    Math.round((totalAttendance / (totalAttendance + totalAbsent)) * 100) : 0;
  
  summaryContainer.innerHTML = `
    <div class="summary-card">
      <h4>${reportData.length}</h4>
      <p>總學生數</p>
    </div>
    <div class="summary-card">
      <h4>${overallAttendanceRate}%</h4>
      <p>整體出席率</p>
    </div>
    <div class="summary-card">
      <h4>${overallAvgScore}</h4>
      <p>平均分數</p>
    </div>
    <div class="summary-card">
      <h4>${totalAttendance}</h4>
      <p>總出席人次</p>
    </div>
  `;
  
  // 更新表格
  const tableBody = document.querySelector('#report-table tbody');
  tableBody.innerHTML = '';
  
  if (reportData.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <i class="fas fa-chart-bar"></i>
            <h3>無資料</h3>
            <p>所選月份無任何記錄</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  reportData.forEach(data => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.studentName}</td>
      <td>${data.className}</td>
      <td>${data.presentDays}</td>
      <td>${data.absentDays}</td>
      <td>${data.attendanceRate}%</td>
      <td>${data.avgScore}</td>
      <td>${data.totalScore}</td>
    `;
    tableBody.appendChild(row);
  });
  
  // 儲存報表資料以供匯出
  window.currentReportData = reportData;
}

function exportReport() {
  if (!window.currentReportData) {
    showNotification('請先生成報表', 'warning');
    return;
  }
  
  const year = document.getElementById('report-year').value;
  const month = document.getElementById('report-month').value;
  
  // 建立 CSV 內容
  const headers = ['學生姓名', '班級', '出席天數', '缺席天數', '出席率', '平均分數', '總分'];
  const csvContent = [
    headers.join(','),
    ...window.currentReportData.map(data => [
      data.studentName,
      data.className,
      data.presentDays,
      data.absentDays,
      `${data.attendanceRate}%`,
      data.avgScore,
      data.totalScore
    ].join(','))
  ].join('\n');
  
  // 下載檔案
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `月度報表_${year}年${month}月.csv`;
  link.click();
  
  showNotification('報表匯出成功！', 'success');
}

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  loadDashboard();
  
  // 事件監聽器
  document.getElementById('add-class-btn').addEventListener('click', showAddClassForm);
  document.getElementById('add-student-btn').addEventListener('click', showAddStudentForm);
  document.getElementById('mark-all-present').addEventListener('click', () => markAllAttendance('present'));
  document.getElementById('mark-all-absent').addEventListener('click', () => markAllAttendance('absent'));
  document.getElementById('save-attendance').addEventListener('click', saveAttendance);
  document.getElementById('save-scores').addEventListener('click', saveScores);
  document.getElementById('generate-report').addEventListener('click', generateReport);
  document.getElementById('export-report').addEventListener('click', exportReport);
});