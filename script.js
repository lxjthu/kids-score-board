let tasks = [];
let totalPoints = 0;

// 添加保存数据的函数
function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('totalPoints', totalPoints.toString());
}

// 添加加载数据的函数
function loadData() {
    const savedTasks = localStorage.getItem('tasks');
    const savedPoints = localStorage.getItem('totalPoints');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    if (savedPoints) {
        totalPoints = parseInt(savedPoints);
    }
}

// 修改 addTask 函数
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const taskPoints = parseInt(document.getElementById('taskPoints').value);

    if (!taskName || !taskPoints) {
        alert('请输入任务名称和积分！');
        return;
    }

    const task = {
        name: taskName,
        points: taskPoints,
        completedCount: 0
    };

    tasks.push(task);
    updateTaskList();
    clearInputs();
    saveData();  // 添加保存
}

// 修改 completeTask 函数
function completeTask(index) {
    tasks[index].completedCount++;
    totalPoints += tasks[index].points;
    updateTaskList();
    updateTotalPoints();
    saveData();  // 添加保存
}

// 修改 deleteTask 函数
function deleteTask(index) {
    totalPoints -= tasks[index].points * tasks[index].completedCount;
    tasks.splice(index, 1);
    updateTaskList();
    updateTotalPoints();
    saveData();  // 添加保存
}

function updateTaskList() {
    const tasksDiv = document.getElementById('tasks');
    tasksDiv.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <span>${task.name} (${task.points}分) - 已完成${task.completedCount}次</span>
            <button onclick="completeTask(${index})" class="complete-btn">完成</button>
            <button onclick="deleteTask(${index})" class="delete-btn">删除</button>
        `;
        tasksDiv.appendChild(taskElement);
    });
}

function updateTotalPoints() {
    document.getElementById('totalPoints').textContent = totalPoints;
}

function clearInputs() {
    document.getElementById('taskName').value = '';
    document.getElementById('taskPoints').value = '';
}

// 页面加载时读取数据
window.onload = function() {
    loadData();
    updateTaskList();
    updateTotalPoints();
};

// 添加重置积分功能
function resetPoints() {
    if (confirm('确定要清零所有积分吗？')) {
        tasks.forEach(task => {
            task.completedCount = 0;
        });
        totalPoints = 0;
        updateTaskList();
        updateTotalPoints();
        saveData();
    }
}

// 添加今日总结功能
function showDailySummary() {
    // 创建弹窗
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const today = new Date().toLocaleDateString();
    let summaryContent = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>今日任务总结 (${today})</h2>
            <div class="summary-list">
                <h3>完成的任务：</h3>
                <ul>
    `;
    
    // 生成任务总结
    let hasCompletedTasks = false;
    tasks.forEach(task => {
        if (task.completedCount > 0) {
            hasCompletedTasks = true;
            summaryContent += `
                <li>${task.name}: 完成 ${task.completedCount} 次，获得 ${task.points * task.completedCount} 分</li>
            `;
        }
    });
    
    if (!hasCompletedTasks) {
        summaryContent += '<li>今天还没有完成任何任务哦！</li>';
    }
    
    summaryContent += `
                </ul>
                <h3>总积分：${totalPoints}</h3>
            </div>
        </div>
    `;
    
    modal.innerHTML = summaryContent;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // 点击弹窗外部关闭
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };
} 