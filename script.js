let tasks = [];
let totalPoints = 0;
let rewards = [];
let rewardItems = [];

// 添加保存数据的函数
function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('totalPoints', totalPoints.toString());
    localStorage.setItem('rewards', JSON.stringify(rewards));
    localStorage.setItem('rewardItems', JSON.stringify(rewardItems));
}

// 添加加载数据的函数
function loadData() {
    const savedTasks = localStorage.getItem('tasks');
    const savedPoints = localStorage.getItem('totalPoints');
    const savedRewards = localStorage.getItem('rewards');
    const savedRewardItems = localStorage.getItem('rewardItems');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    if (savedPoints) {
        totalPoints = parseInt(savedPoints);
    }
    if (savedRewards) {
        rewards = JSON.parse(savedRewards);
    }
    if (savedRewardItems) {
        rewardItems = JSON.parse(savedRewardItems);
    }
    
    updateTaskList();
    updateRewardList();
    updateRewardItems();
    updateTotalPoints();
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
            <div class="task-buttons">
                <button onclick="completeTask(${index})" class="complete-btn">完成</button>
                <button onclick="deleteTask(${index})" class="delete-btn">删除</button>
            </div>
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

    // 添加今日消费记录
    summaryContent += `
                </ul>
                <h3>今日兑换：</h3>
                <ul>
    `;

    const todayRewards = rewards.filter(reward => 
        new Date(reward.date).toLocaleDateString() === today
    );

    if (todayRewards.length > 0) {
        todayRewards.forEach(reward => {
            summaryContent += `
                <li>${reward.name}: 消费 ${reward.points} 分</li>
            `;
        });
    } else {
        summaryContent += '<li>今天还没有兑换奖励哦！</li>';
    }
    
    summaryContent += `
                </ul>
                <h3>当前积分：${totalPoints}</h3>
            </div>
        </div>
    `;
    
    modal.innerHTML = summaryContent;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };
}

// 添加积分消费功能
function spendPoints() {
    const rewardName = document.getElementById('rewardName').value;
    const points = parseInt(document.getElementById('spendPoints').value);

    if (!rewardName || !points) {
        alert('请输入奖励名称和积分！');
        return;
    }

    if (points > totalPoints) {
        alert('积分不足！');
        return;
    }

    const reward = {
        name: rewardName,
        points: points,
        date: new Date().toLocaleString()
    };

    rewards.push(reward);
    totalPoints -= points;

    updateRewardList();
    updateTotalPoints();
    saveData();
    clearRewardInputs();
}

// 更新奖励列表显示
function updateRewardList() {
    const rewardsDiv = document.getElementById('rewards');
    rewardsDiv.innerHTML = '';

    rewards.slice().reverse().forEach((reward, index) => {
        const rewardElement = document.createElement('div');
        rewardElement.className = 'reward-item';
        rewardElement.innerHTML = `
            <span>${reward.name} (-${reward.points}分)</span>
            <span class="date">${reward.date}</span>
        `;
        rewardsDiv.appendChild(rewardElement);
    });
}

// 清空奖励输入框
function clearRewardInputs() {
    document.getElementById('rewardName').value = '';
    document.getElementById('spendPoints').value = '';
}

// 添加奖励选项
function addRewardItem() {
    const name = document.getElementById('newRewardName').value;
    const points = parseInt(document.getElementById('newRewardPoints').value);

    if (!name || !points) {
        alert('请输入奖励名称和所需积分！');
        return;
    }

    const rewardItem = {
        name: name,
        points: points
    };

    rewardItems.push(rewardItem);
    updateRewardItems();
    saveData();
    
    // 清空输入框
    document.getElementById('newRewardName').value = '';
    document.getElementById('newRewardPoints').value = '';
}

// 更新奖励选项列表
function updateRewardItems() {
    // 更新奖励列表显示
    const rewardsList = document.getElementById('rewardsList');
    rewardsList.innerHTML = '';

    rewardItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'reward-item-list';
        itemElement.innerHTML = `
            <span>${item.name} (${item.points}分)</span>
            <button onclick="deleteRewardItem(${index})" class="delete-btn">删除</button>
        `;
        rewardsList.appendChild(itemElement);
    });

    // 更新下拉选择框
    const select = document.getElementById('rewardSelect');
    select.innerHTML = '<option value="">选择奖励</option>';
    rewardItems.forEach((item, index) => {
        select.innerHTML += `
            <option value="${index}">${item.name} (${item.points}分)</option>
        `;
    });
}

// 删除奖励选项
function deleteRewardItem(index) {
    if (confirm('确定要删除这个奖励选项吗？')) {
        rewardItems.splice(index, 1);
        updateRewardItems();
        saveData();
    }
}

// 从列表中兑换奖励
function spendPointsFromList() {
    const select = document.getElementById('rewardSelect');
    const index = select.value;

    if (index === '') {
        alert('请选择要兑换的奖励！');
        return;
    }

    const selectedReward = rewardItems[index];
    if (selectedReward.points > totalPoints) {
        alert('积分不足！');
        return;
    }

    const reward = {
        name: selectedReward.name,
        points: selectedReward.points,
        date: new Date().toLocaleString()
    };

    rewards.push(reward);
    totalPoints -= selectedReward.points;

    updateRewardList();
    updateTotalPoints();
    saveData();
    
    // 重置选择框
    select.value = '';
} 