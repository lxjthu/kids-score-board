let tasks = [];
let totalPoints = 0;

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
        completedCount: 0  // 新增：完成次数计数
    };

    tasks.push(task);
    updateTaskList();
    clearInputs();
}

function completeTask(index) {
    // 修改：移除完成状态检查，改为增加完成次数
    tasks[index].completedCount++;
    totalPoints += tasks[index].points;
    updateTaskList();
    updateTotalPoints();
}

function deleteTask(index) {
    // 修改：删除任务时扣除所有已完成次数的积分
    totalPoints -= tasks[index].points * tasks[index].completedCount;
    tasks.splice(index, 1);
    updateTaskList();
    updateTotalPoints();
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