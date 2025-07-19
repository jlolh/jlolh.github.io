// 學校點名與計分系統 JavaScript

class SchoolAttendanceSystem {
    constructor() {
        // 初始化數據
        this.data = {
            "classes": [
                {
                    "id": 1,
                    "name": "小學一年甲班",
                    "students": [
                        {
                            "id": 1,
                            "name": "張小明",
                            "attendance": [
                                {"date": "2025-07-19", "present": true, "score": 3},
                                {"date": "2025-07-18", "present": true, "score": 4},
                                {"date": "2025-07-17", "present": false, "score": 0}
                            ]
                        },
                        {
                            "id": 2,
                            "name": "李小華",
                            "attendance": [
                                {"date": "2025-07-19", "present": true, "score": 4},
                                {"date": "2025-07-18", "present": true, "score": 3},
                                {"date": "2025-07-17", "present": true, "score": 4}
                            ]
                        },
                        {
                            "id": 3,
                            "name": "王小美",
                            "attendance": [
                                {"date": "2025-07-19", "present": false, "score": 0},
                                {"date": "2025-07-18", "present": true, "score": 2},
                                {"date": "2025-07-17", "present": true, "score": 3}
                            ]
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "小學一年乙班",
                    "students": [
                        {
                            "id": 4,
                            "name": "陳小強",
                            "attendance": [
                                {"date": "2025-07-19", "present": true, "score": 4},
                                {"date": "2025-07-18", "present": true, "score": 3}
                            ]
                        },
                        {
                            "id": 5,
                            "name": "林小芳",
                            "attendance": [
                                {"date": "2025-07-19", "present": true, "score": 2},
                                {"date": "2025-07-18", "present": false, "score": 0}
                            ]
                        }
                    ]
                }
            ],
            "currentDate": "2025-07-19",
            "systemSettings": {
                "maxScore": 4,
                "minScore": 0,
                "scoreLabel": "日常表現"
            }
        };

        this.currentView = 'dashboard';
        this.currentClassId = null;
        this.currentStudentId = null;
        this.currentEditId = null;
        this.todayAttendance = {};

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentDate();
        this.renderDashboard();
        this.populateSelects();
    }

    setupEventListeners() {
        // 導航按鈕
        document.getElementById('reportBtn').addEventListener('click', () => this.showReportView());
        document.getElementById('manageBtn').addEventListener('click', () => this.showManagementView());
        document.getElementById('backToMain').addEventListener('click', () => this.showDashboardView());
        document.getElementById('backToMainFromReport').addEventListener('click', () => this.showDashboardView());
        document.getElementById('backToMainFromManage').addEventListener('click', () => this.showDashboardView());

        // 班級管理
        document.getElementById('addClassBtn').addEventListener('click', () => this.showAddClassModal());
        document.getElementById('confirmAddClass').addEventListener('click', () => this.addNewClass());

        // 出席操作
        document.getElementById('markAllPresent').addEventListener('click', () => this.markAllAttendance(true));
        document.getElementById('markAllAbsent').addEventListener('click', () => this.markAllAttendance(false));
        document.getElementById('saveAttendance').addEventListener('click', () => this.saveAttendanceData());

        // 管理標籤
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // 學生班級選擇
        document.getElementById('studentClassSelect').addEventListener('change', (e) => {
            this.renderStudentManagement(e.target.value);
        });

        // 報表篩選
        document.getElementById('monthSelect').addEventListener('change', () => this.renderReports());
        document.getElementById('classFilter').addEventListener('change', () => this.renderReports());

        // 模態框
        this.setupModalListeners();

        // 確認模態框
        document.getElementById('confirmAction').addEventListener('click', () => this.executeConfirmedAction());

        // 編輯班級
        document.getElementById('confirmEditClass').addEventListener('click', () => this.updateClass());

        // 學生管理
        document.getElementById('confirmAddStudent').addEventListener('click', () => this.addNewStudent());
        document.getElementById('confirmEditStudent').addEventListener('click', () => this.updateStudent());
    }

    setupModalListeners() {
        // 模態框關閉按鈕
        document.querySelectorAll('.modal-close, .btn[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal') || e.target.closest('[data-modal]')?.getAttribute('data-modal');
                if (modalId) {
                    this.hideModal(modalId);
                }
            });
        });

        // 點擊外部關閉模態框
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    updateCurrentDate() {
        const today = new Date();
        const dateString = today.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        document.getElementById('currentDate').textContent = dateString;
    }

    // 視圖切換
    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
        this.currentView = viewId;
    }

    showDashboardView() {
        this.showView('dashboardView');
        this.renderDashboard();
    }

    showClassDetailView(classId) {
        this.currentClassId = classId;
        this.showView('classDetailView');
        this.renderClassDetail(classId);
    }

    showReportView() {
        this.showView('reportView');
        this.renderReports();
    }

    showManagementView() {
        this.showView('managementView');
        this.renderClassManagement();
        this.populateSelects();
        // 確保學生管理標籤顯示初始內容
        this.renderStudentManagement('');
    }

    // 渲染主頁面
    renderDashboard() {
        const classesList = document.getElementById('classesList');
        classesList.innerHTML = '';

        this.data.classes.forEach(classObj => {
            const studentCount = classObj.students.length;
            const todayAttendance = this.getTodayAttendanceCount(classObj.id);
            
            const classCard = document.createElement('div');
            classCard.className = 'class-card';
            classCard.innerHTML = `
                <h3>${classObj.name}</h3>
                <div class="class-stats">
                    <div class="stat-item">
                        <span class="stat-value">${studentCount}</span>
                        <span class="stat-label">學生人數</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${todayAttendance.present}</span>
                        <span class="stat-label">今日出席</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${todayAttendance.absent}</span>
                        <span class="stat-label">今日缺席</span>
                    </div>
                </div>
                <div class="class-actions">
                    <button class="btn btn--primary btn--full-width">進入班級</button>
                </div>
            `;

            classCard.addEventListener('click', () => this.showClassDetailView(classObj.id));
            classesList.appendChild(classCard);
        });
    }

    // 渲染班級詳情
    renderClassDetail(classId) {
        const classObj = this.data.classes.find(c => c.id === classId);
        if (!classObj) return;

        document.getElementById('classTitle').textContent = classObj.name;
        
        const studentsList = document.getElementById('studentsList');
        studentsList.innerHTML = '';

        // 初始化今日出席數據
        if (!this.todayAttendance[classId]) {
            this.todayAttendance[classId] = {};
        }

        classObj.students.forEach(student => {
            const todayRecord = student.attendance.find(a => a.date === this.data.currentDate);
            const currentPresent = this.todayAttendance[classId][student.id]?.present ?? todayRecord?.present ?? true;
            const currentScore = this.todayAttendance[classId][student.id]?.score ?? todayRecord?.score ?? 0;

            // 更新緩存
            this.todayAttendance[classId][student.id] = {
                present: currentPresent,
                score: currentScore
            };

            const studentItem = document.createElement('div');
            studentItem.className = 'student-item';
            studentItem.innerHTML = `
                <div class="student-header">
                    <h4 class="student-name">${student.name}</h4>
                </div>
                <div class="student-controls">
                    <div class="attendance-section">
                        <div class="section-label">出席狀況</div>
                        <div class="attendance-buttons">
                            <button class="attendance-btn ${currentPresent ? 'present' : ''}" 
                                    data-student="${student.id}" data-action="present">出席</button>
                            <button class="attendance-btn ${!currentPresent ? 'absent' : ''}" 
                                    data-student="${student.id}" data-action="absent">缺席</button>
                        </div>
                    </div>
                    <div class="score-section">
                        <div class="section-label">日常表現 (0-4分)</div>
                        <div class="score-input">
                            ${[0,1,2,3,4].map(score => 
                                `<button class="score-btn ${currentScore === score ? 'active' : ''}" 
                                         data-student="${student.id}" data-score="${score}">${score}</button>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;

            // 添加事件監聽器
            const attendanceBtns = studentItem.querySelectorAll('.attendance-btn');
            attendanceBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const studentId = parseInt(e.target.dataset.student);
                    const isPresent = e.target.dataset.action === 'present';
                    this.updateAttendance(classId, studentId, isPresent);
                    this.refreshStudentItem(studentItem, student, classId);
                });
            });

            const scoreBtns = studentItem.querySelectorAll('.score-btn');
            scoreBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const studentId = parseInt(e.target.dataset.student);
                    const score = parseInt(e.target.dataset.score);
                    this.updateScore(classId, studentId, score);
                    this.refreshStudentItem(studentItem, student, classId);
                });
            });

            studentsList.appendChild(studentItem);
        });
    }

    refreshStudentItem(studentItem, student, classId) {
        const attendance = this.todayAttendance[classId][student.id];
        
        // 更新出席按鈕
        const attendanceBtns = studentItem.querySelectorAll('.attendance-btn');
        attendanceBtns.forEach(btn => {
            btn.classList.remove('present', 'absent');
            if (btn.dataset.action === 'present' && attendance.present) {
                btn.classList.add('present');
            } else if (btn.dataset.action === 'absent' && !attendance.present) {
                btn.classList.add('absent');
            }
        });

        // 更新分數按鈕
        const scoreBtns = studentItem.querySelectorAll('.score-btn');
        scoreBtns.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.score) === attendance.score) {
                btn.classList.add('active');
            }
        });
    }

    updateAttendance(classId, studentId, isPresent) {
        if (!this.todayAttendance[classId]) {
            this.todayAttendance[classId] = {};
        }
        if (!this.todayAttendance[classId][studentId]) {
            this.todayAttendance[classId][studentId] = { present: true, score: 0 };
        }
        this.todayAttendance[classId][studentId].present = isPresent;
        
        // 如果缺席，分數設為0
        if (!isPresent) {
            this.todayAttendance[classId][studentId].score = 0;
        }
    }

    updateScore(classId, studentId, score) {
        if (!this.todayAttendance[classId]) {
            this.todayAttendance[classId] = {};
        }
        if (!this.todayAttendance[classId][studentId]) {
            this.todayAttendance[classId][studentId] = { present: true, score: 0 };
        }
        this.todayAttendance[classId][studentId].score = score;
    }

    markAllAttendance(isPresent) {
        if (!this.currentClassId) return;
        
        const classObj = this.data.classes.find(c => c.id === this.currentClassId);
        if (!classObj) return;

        classObj.students.forEach(student => {
            this.updateAttendance(this.currentClassId, student.id, isPresent);
        });

        this.renderClassDetail(this.currentClassId);
    }

    saveAttendanceData() {
        if (!this.currentClassId || !this.todayAttendance[this.currentClassId]) {
            this.showMessage('沒有要儲存的資料', 'error');
            return;
        }

        const classObj = this.data.classes.find(c => c.id === this.currentClassId);
        if (!classObj) return;

        // 更新學生資料
        classObj.students.forEach(student => {
            const todayData = this.todayAttendance[this.currentClassId][student.id];
            if (todayData) {
                // 移除今日既有記錄
                student.attendance = student.attendance.filter(a => a.date !== this.data.currentDate);
                // 添加新記錄
                student.attendance.push({
                    date: this.data.currentDate,
                    present: todayData.present,
                    score: todayData.score
                });
            }
        });

        // 清除緩存
        delete this.todayAttendance[this.currentClassId];

        this.showMessage('出席記錄已成功儲存！', 'success');
        this.renderClassDetail(this.currentClassId);
    }

    // 計算今日出席情況
    getTodayAttendanceCount(classId) {
        const classObj = this.data.classes.find(c => c.id === classId);
        if (!classObj) return { present: 0, absent: 0 };

        let present = 0, absent = 0;

        classObj.students.forEach(student => {
            const todayRecord = student.attendance.find(a => a.date === this.data.currentDate);
            const cachedRecord = this.todayAttendance[classId]?.[student.id];
            
            const isPresent = cachedRecord ? cachedRecord.present : (todayRecord ? todayRecord.present : true);
            
            if (isPresent) {
                present++;
            } else {
                absent++;
            }
        });

        return { present, absent };
    }

    // 渲染報表
    renderReports() {
        const selectedMonth = document.getElementById('monthSelect').value;
        const selectedClass = document.getElementById('classFilter').value;
        const reportContent = document.getElementById('reportContent');
        
        let classesToShow = this.data.classes;
        if (selectedClass) {
            classesToShow = this.data.classes.filter(c => c.id.toString() === selectedClass);
        }

        reportContent.innerHTML = '';

        classesToShow.forEach(classObj => {
            const reportClass = document.createElement('div');
            reportClass.className = 'report-class';

            const monthlyStats = this.calculateMonthlyStats(classObj, selectedMonth);

            reportClass.innerHTML = `
                <div class="report-class-header">
                    <h3 class="report-class-title">${classObj.name} - ${selectedMonth}</h3>
                </div>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>學生姓名</th>
                            <th>出席天數</th>
                            <th>缺席天數</th>
                            <th>出席率</th>
                            <th>總分</th>
                            <th>平均分</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${monthlyStats.map(stat => `
                            <tr>
                                <td>${stat.name}</td>
                                <td>${stat.presentDays}</td>
                                <td>${stat.absentDays}</td>
                                <td><span class="attendance-percentage ${this.getAttendanceClass(stat.attendanceRate)}">${stat.attendanceRate}%</span></td>
                                <td>${stat.totalScore}</td>
                                <td>${stat.avgScore}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            reportContent.appendChild(reportClass);
        });
    }

    calculateMonthlyStats(classObj, month) {
        return classObj.students.map(student => {
            const monthAttendance = student.attendance.filter(a => a.date.startsWith(month));
            const presentDays = monthAttendance.filter(a => a.present).length;
            const absentDays = monthAttendance.filter(a => !a.present).length;
            const totalDays = monthAttendance.length;
            const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
            const totalScore = monthAttendance.reduce((sum, a) => sum + a.score, 0);
            const avgScore = totalDays > 0 ? (totalScore / totalDays).toFixed(1) : '0.0';

            return {
                name: student.name,
                presentDays,
                absentDays,
                attendanceRate,
                totalScore,
                avgScore
            };
        });
    }

    getAttendanceClass(rate) {
        if (rate >= 90) return 'high';
        if (rate >= 70) return 'medium';
        return 'low';
    }

    // 班級管理
    renderClassManagement() {
        const list = document.getElementById('classManagementList');
        list.innerHTML = '';

        this.data.classes.forEach(classObj => {
            const item = document.createElement('div');
            item.className = 'management-item';
            item.innerHTML = `
                <div class="management-item-info">
                    <h4 class="management-item-name">${classObj.name}</h4>
                    <div class="management-item-meta">${classObj.students.length} 位學生</div>
                </div>
                <div class="management-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.editClass(${classObj.id})">編輯</button>
                    <button class="btn btn--sm btn--outline" onclick="app.confirmDeleteClass(${classObj.id})">刪除</button>
                </div>
            `;
            list.appendChild(item);
        });
    }

    renderStudentManagement(classId) {
        const list = document.getElementById('studentManagementList');
        if (!classId) {
            list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--color-text-secondary);">請選擇班級以管理學生</div>';
            return;
        }

        const classObj = this.data.classes.find(c => c.id.toString() === classId);
        if (!classObj) {
            list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--color-text-secondary);">找不到指定班級</div>';
            return;
        }

        list.innerHTML = '';

        // 添加班級標題和新增學生按鈕
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;';
        headerDiv.innerHTML = `
            <h4 style="margin: 0;">${classObj.name} 學生管理</h4>
            <button class="btn btn--primary btn--sm" onclick="app.showAddStudentModal(${classId})">新增學生</button>
        `;
        list.appendChild(headerDiv);

        // 添加學生列表
        if (classObj.students.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'text-align: center; padding: 20px; color: var(--color-text-secondary); background: var(--color-surface); border-radius: var(--radius-base); border: 1px solid var(--color-card-border);';
            emptyDiv.textContent = '此班級尚無學生';
            list.appendChild(emptyDiv);
        } else {
            classObj.students.forEach(student => {
                const item = document.createElement('div');
                item.className = 'management-item';
                item.innerHTML = `
                    <div class="management-item-info">
                        <h4 class="management-item-name">${student.name}</h4>
                        <div class="management-item-meta">學號: ${student.id} | 出席記錄: ${student.attendance.length} 天</div>
                    </div>
                    <div class="management-actions">
                        <button class="btn btn--sm btn--outline" onclick="app.editStudent(${student.id})">編輯</button>
                        <button class="btn btn--sm btn--outline" onclick="app.confirmDeleteStudent(${student.id})">刪除</button>
                    </div>
                `;
                list.appendChild(item);
            });
        }
    }

    // 標籤切換
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}ManagementTab`).classList.add('active');

        if (tabName === 'students') {
            // 重置學生班級選擇器並顯示初始狀態
            const studentClassSelect = document.getElementById('studentClassSelect');
            studentClassSelect.selectedIndex = 0;
            this.renderStudentManagement('');
        }
    }

    // 填充選項
    populateSelects() {
        const classFilter = document.getElementById('classFilter');
        const studentClassSelect = document.getElementById('studentClassSelect');
        const moveStudentClass = document.getElementById('moveStudentClass');

        // 清空現有選項
        [classFilter, studentClassSelect, moveStudentClass].forEach(select => {
            if (select) {
                const firstOption = select.querySelector('option');
                select.innerHTML = '';
                if (firstOption) {
                    select.appendChild(firstOption);
                }
            }
        });

        // 添加班級選項
        this.data.classes.forEach(classObj => {
            [classFilter, studentClassSelect, moveStudentClass].forEach(select => {
                if (select) {
                    const option = document.createElement('option');
                    option.value = classObj.id;
                    option.textContent = classObj.name;
                    select.appendChild(option);
                }
            });
        });
    }

    // 模態框操作
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        // 清空表單
        const modal = document.getElementById(modalId);
        const inputs = modal.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'text') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            }
        });
    }

    showAddClassModal() {
        this.showModal('addClassModal');
    }

    addNewClass() {
        const name = document.getElementById('newClassName').value.trim();
        if (!name) {
            this.showMessage('請輸入班級名稱', 'error');
            return;
        }

        const newId = Math.max(...this.data.classes.map(c => c.id)) + 1;
        this.data.classes.push({
            id: newId,
            name: name,
            students: []
        });

        this.hideModal('addClassModal');
        this.showMessage('班級新增成功！', 'success');
        this.renderDashboard();
        this.populateSelects();
        
        if (this.currentView === 'managementView') {
            this.renderClassManagement();
        }
    }

    editClass(id) {
        const classObj = this.data.classes.find(c => c.id === id);
        if (!classObj) return;

        this.currentEditId = id;
        document.getElementById('editClassName').value = classObj.name;
        this.showModal('editClassModal');
    }

    updateClass() {
        const name = document.getElementById('editClassName').value.trim();
        if (!name) {
            this.showMessage('請輸入班級名稱', 'error');
            return;
        }

        const classObj = this.data.classes.find(c => c.id === this.currentEditId);
        if (classObj) {
            classObj.name = name;
            this.hideModal('editClassModal');
            this.showMessage('班級更新成功！', 'success');
            this.renderDashboard();
            this.populateSelects();
            
            if (this.currentView === 'managementView') {
                this.renderClassManagement();
            }
        }
    }

    confirmDeleteClass(id) {
        const classObj = this.data.classes.find(c => c.id === id);
        if (!classObj) return;

        this.currentEditId = id;
        document.getElementById('confirmTitle').textContent = '刪除班級';
        document.getElementById('confirmMessage').textContent = `確定要刪除班級「${classObj.name}」嗎？此操作無法復原。`;
        this.pendingAction = 'deleteClass';
        this.showModal('confirmModal');
    }

    deleteClass() {
        this.data.classes = this.data.classes.filter(c => c.id !== this.currentEditId);
        this.hideModal('confirmModal');
        this.showMessage('班級刪除成功！', 'success');
        this.renderDashboard();
        this.populateSelects();
        
        if (this.currentView === 'managementView') {
            this.renderClassManagement();
        }
    }

    // 學生管理
    showAddStudentModal(classId) {
        this.currentClassId = classId;
        this.showModal('addStudentModal');
    }

    addNewStudent() {
        const name = document.getElementById('newStudentName').value.trim();
        if (!name) {
            this.showMessage('請輸入學生姓名', 'error');
            return;
        }

        const classObj = this.data.classes.find(c => c.id === this.currentClassId);
        if (!classObj) return;

        const newId = Math.max(...this.data.classes.flatMap(c => c.students.map(s => s.id))) + 1;
        classObj.students.push({
            id: newId,
            name: name,
            attendance: []
        });

        this.hideModal('addStudentModal');
        this.showMessage('學生新增成功！', 'success');
        this.renderStudentManagement(this.currentClassId.toString());
        this.renderDashboard();
    }

    editStudent(id) {
        const student = this.findStudentById(id);
        if (!student.student) return;

        this.currentEditId = id;
        document.getElementById('editStudentName').value = student.student.name;
        
        // 填充轉移班級選項
        const moveSelect = document.getElementById('moveStudentClass');
        moveSelect.innerHTML = '<option value="">保持目前班級</option>';
        this.data.classes.forEach(classObj => {
            if (classObj.id !== student.classObj.id) {
                const option = document.createElement('option');
                option.value = classObj.id;
                option.textContent = classObj.name;
                moveSelect.appendChild(option);
            }
        });

        this.showModal('editStudentModal');
    }

    updateStudent() {
        const name = document.getElementById('editStudentName').value.trim();
        const moveToClassId = document.getElementById('moveStudentClass').value;
        
        if (!name) {
            this.showMessage('請輸入學生姓名', 'error');
            return;
        }

        const studentData = this.findStudentById(this.currentEditId);
        if (!studentData.student) return;

        // 更新姓名
        studentData.student.name = name;

        // 移動班級
        if (moveToClassId) {
            const targetClass = this.data.classes.find(c => c.id.toString() === moveToClassId);
            if (targetClass) {
                // 從原班級移除
                studentData.classObj.students = studentData.classObj.students.filter(s => s.id !== this.currentEditId);
                // 添加到新班級
                targetClass.students.push(studentData.student);
            }
        }

        this.hideModal('editStudentModal');
        this.showMessage('學生資料更新成功！', 'success');
        this.renderStudentManagement(document.getElementById('studentClassSelect').value);
        this.renderDashboard();
    }

    confirmDeleteStudent(id) {
        const studentData = this.findStudentById(id);
        if (!studentData.student) return;

        this.currentEditId = id;
        document.getElementById('confirmTitle').textContent = '刪除學生';
        document.getElementById('confirmMessage').textContent = `確定要刪除學生「${studentData.student.name}」嗎？此操作無法復原。`;
        this.pendingAction = 'deleteStudent';
        this.showModal('confirmModal');
    }

    deleteStudent() {
        const studentData = this.findStudentById(this.currentEditId);
        if (!studentData.student) return;

        studentData.classObj.students = studentData.classObj.students.filter(s => s.id !== this.currentEditId);
        this.hideModal('confirmModal');
        this.showMessage('學生刪除成功！', 'success');
        this.renderStudentManagement(document.getElementById('studentClassSelect').value);
        this.renderDashboard();
    }

    findStudentById(id) {
        for (const classObj of this.data.classes) {
            const student = classObj.students.find(s => s.id === id);
            if (student) {
                return { student, classObj };
            }
        }
        return { student: null, classObj: null };
    }

    executeConfirmedAction() {
        switch (this.pendingAction) {
            case 'deleteClass':
                this.deleteClass();
                break;
            case 'deleteStudent':
                this.deleteStudent();
                break;
        }
        this.pendingAction = null;
    }

    showMessage(text, type) {
        // 移除現有訊息
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;

        const container = document.querySelector('.container');
        container.insertBefore(message, container.firstChild);

        // 3秒後自動移除
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }
}

// 初始化應用程式
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SchoolAttendanceSystem();
});