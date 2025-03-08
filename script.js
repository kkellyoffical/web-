// 从本地存储加载待办事项
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 更新统计信息
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = todos.filter(todo => !todo.completed).length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// 渲染待办事项列表
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.setAttribute('data-index', index);
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
            <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <span class="todo-date">${todo.date}</span>
            <span class="todo-priority ${todo.priority.toLowerCase()}">${todo.priority}</span>
            <span class="todo-category">${todo.category}</span>
            <button onclick="deleteTodo(${index})"><i class="fas fa-trash"></i></button>
        `;
        todoList.appendChild(li);
    });

    localStorage.setItem('todos', JSON.stringify(todos));
    updateStats();

    // 初始化拖拽排序
    new Sortable(todoList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function(evt) {
            const item = todos[evt.oldIndex];
            todos.splice(evt.oldIndex, 1);
            todos.splice(evt.newIndex, 0, item);
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    });
}

// 添加新的待办事项
function addTodo(event) {
    event.preventDefault();

    const todoText = document.getElementById('todoText').value;
    const todoDate = document.getElementById('todoDate').value;
    const todoPriority = document.getElementById('todoPriority').value;
    const todoCategory = document.getElementById('todoCategory').value;

    if (todoText.trim() !== '') {
        todos.push({
            text: todoText,
            completed: false,
            date: todoDate,
            priority: todoPriority,
            category: todoCategory
        });

        document.getElementById('todoText').value = '';
        renderTodos();
    }
}

// 切换待办事项状态
function toggleTodo(index) {
    const prevState = todos[index].completed;
    todos[index].completed = !prevState;
    
    // 如果任务从未完成变为完成，触发烟花动画
    if (!prevState && todos[index].completed) {
        const todoElement = document.querySelector(`[data-index="${index}"]`);
        const rect = todoElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        new FireworkAnimation().show(x, y);
    }
    
    renderTodos();
}

// 切换主题
function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeToggle').innerHTML = `<i class="fas fa-${isDark ? 'moon' : 'sun'}"></i>`;
}

// 面板切换
function switchTab(tabName) {
    const panels = document.querySelectorAll('.panel');
    const tabs = document.querySelectorAll('.tab-btn');
    
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`.${tabName}-panel`).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// 删除待办事项
function deleteTodo(index) {
    const todoElement = document.querySelector(`[data-index="${index}"]`);
    todoElement.classList.add('deleting');
    setTimeout(() => {
        todos.splice(index, 1);
        renderTodos();
    }, 300);
}

// 过滤待办事项
function filterTodos() {
    const filterText = document.getElementById('filterText').value.toLowerCase();
    const filterPriority = document.getElementById('filterPriority').value;
    const filterCategory = document.getElementById('filterCategory').value;
    const filterStatus = document.getElementById('filterStatus').value;

    const filteredTodos = todos.filter(todo => {
        // 改进文本匹配逻辑，使用正则表达式并转义特殊字符
        const searchText = filterText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const matchesText = new RegExp(searchText, 'i').test(todo.text);
        
        const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
        const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'completed' && todo.completed) ||
            (filterStatus === 'pending' && !todo.completed);

        return matchesText && matchesPriority && matchesCategory && matchesStatus;
    });

    renderFilteredTodos(filteredTodos);
}

// 渲染过滤后的待办事项
function renderFilteredTodos(filteredTodos) {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    filteredTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todos.indexOf(todo)})">
            <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <span class="todo-date">${todo.date}</span>
            <span class="todo-priority ${todo.priority.toLowerCase()}">${todo.priority}</span>
            <span class="todo-category">${todo.category}</span>
            <button onclick="deleteTodo(${todos.indexOf(todo)})"><i class="fas fa-trash"></i></button>
        `;
        todoList.appendChild(li);
    });
}

// 初始化日期选择器和动画
document.addEventListener('DOMContentLoaded', function() {
    flatpickr('#todoDate', {
        dateFormat: 'Y-m-d',
        defaultDate: 'today'
    });

    // 初始化动画效果
    TodoAnimations.init();
    
    // 初始渲染
    renderTodos();
});