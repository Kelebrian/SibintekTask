'use strict';

const addtask = document.getElementById('addtask');
const deletetask = document.getElementById('deletetask');
const deleteall = document.getElementById('deleteall');
const taskblock = document.getElementById('taskblock');
const tasklist = document.getElementById('tasklist');
const helper = document.getElementById('helper');
const footer =  document.getElementById('footer');

/** Количество задач. */
var taskcount = 0;

/** Количество пустых строк. */
var emptyrows = 0;

//Хранит ьаксимальный номер задачи.
//При удалении всех задач, сбрасывается в 0.
localStorage['maxTaskId'] = 0;

window.onload = (event) => {
    fetch('/DB/GetTasks', {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .then(response => {
            taskcount = response.length;
            for (let i = 0; i < response.length; i++) {
                let tr = document.createElement('tr');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let input1 = document.createElement('input');
                let input2 = document.createElement('input');

                input1.checked = response[i].Complete;
                if (input1.checked) input2.classList.add('cross-task');
                input1.type = 'checkbox';

                input2.value = response[i].Description;
                input2.classList.add('task');
                td1.classList.add('checks');
                td2.classList.add('left-border');
                tr.classList.add('row');
                td1.appendChild(input1);
                td2.appendChild(input2);
                tr.appendChild(td1);
                tr.appendChild(td2);

                tasklist.insertBefore(tr, helper);
                //дополнительное свойство, хранящее id задачи
                tr.taskId = response[i].TaskId;
                //свойство, показывающее, что запись уже не новая
                tr.newly = false;

                addInputListeners(input2);
                addCheckedListener(input1);
            }
            if (response.length < 6) {
                for (let i = 0; i < 6 - response.length; i++) {
                    setEmptyRow();
                    emptyrows++;
                }
            }
            footer.innerHTML = taskcount + ' task(s) remaining';
        });

    fetch('/DB/GetMaxId', {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .then(response => {
            localStorage['maxTaskId'] = response;
            console.log(response);
        })
        .catch(() => {
            localStorage['maxTaskId'] = 0;
        });
};

function setEmptyRow() {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let input = document.createElement('input');
    td1.classList.add('checks');
    td2.classList.add('left-border');
    tr.classList.add('row');
    td2.appendChild(input);
    input.classList.add('task');
    tr.classList.add('emptyrow');
    input.disabled = true;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tasklist.insertBefore(tr, document.getElementById('helper'));
}

/** Хранит выбранную задачу */
var selected;

taskblock.onclick = (event) => {
    let target = event.target;
    if ((target.tagName != 'TD') || (target != target.parentNode.lastChild)) return;
    highlight(target.parentNode);
    deletetask.disabled = false;
};

/** Подсветка выбранной задачи. */
function highlight(node) {
    if (selected) {
        selected.classList.remove('highlight');
    }
    selected = node;
    selected.classList.add('highlight');
}

addtask.onclick = (event) => {
    let empty = document.getElementsByClassName('emptyrow');
    emptyrows = empty.length;
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let input = document.createElement('input');
    input.placeholder = 'Введите задачу';
    td2.appendChild(input);
    tr.appendChild(td1);
    tr.appendChild(td2);
    if (empty.length != 0) {
        tasklist.insertBefore(tr, empty[0]);
        empty[0].remove();
    }
    else tasklist.insertBefore(tr, helper);
    input.focus();
    td1.classList.add('checks');
    td2.classList.add('left-border');
    tr.classList.add('row');
    input.classList.add('task');
    tr.newly = true;
    addInputListeners(input);

};

deletetask.addEventListener('click', (event) => {
    if (confirm('Вы действительно хотите удалить эту задачу?')) {
        tasklist.removeChild(selected);
        deletetask.disabled = true;
        fetch('/DB/DeleteTask?taskId=' + selected.taskId, {
            method: 'GET'
        });
        taskcount--;
        if (taskcount < 6) {
            for (let i = 0; i < (6 - taskcount - emptyrows); i++) 
            setEmptyRow();
        }
        footer.innerHTML = taskcount + ' task(s) remaining';
    }
});

deleteall.addEventListener('click', (event) => {
    if (confirm('Вы действительно хотите удалить все задачи?')) {
        tasklist.innerHTML = '<tr><th class="checks"></th>' +
            '<th class="left-border table-header">I want to...</th>' +
            '</tr><tr id="helper"><th class="checks"></th>' +
            '<th class="left-border"><input /> </th></tr>';
        fetch('/DB/DeleteAll', {
            method: 'GET'
        });
        localStorage['maxTaskId'] = 0;
        taskcount = 0;
        footer.innerHTML = taskcount + ' task(s) remaining';
        for (let i = 0; i < 6; i++) setEmptyRow();
    }
});

/**
 * Посылает запрос на добавление задачи в БД.
 */
function insertTask(taskId, task) {
    fetch('/DB/CreateTask?taskId=' + taskId + '&task=' + task, {
        method: 'GET'
    });
}

/**
 * Посылает запрос на редактирование описания задачи в БД.
 */
function updateTask(taskId, task) {
    fetch('/DB/UpdateTaskDescription?taskId=' + taskId + '&task=' + task, {
        method: 'GET'
    });
}


/**
 * Добавляет новую задачу в список или редактирует существующую.
 * @param {*} event - событие
 */
function setTask(event) {
    let target = event.target;
    let td = target.parentNode;
    let parent = td.parentNode;
    if (target.value == '' && parent.newly) {
        parent.remove();
        if (taskcount < 6) setEmptyRow();
        return;
    }
    if (target.value == '' && !parent.newly) {
        target.value = localStorage['description'];
        return;
    }
    if (parent.newly) {
        parent.taskId = ++localStorage['maxTaskId'];
        taskcount++;
        parent.newly = false;//tr
        let check = document.createElement('input');
        check.type = 'checkbox';
        addCheckedListener(check);
        parent.firstChild.appendChild(check);
        footer.innerHTML = taskcount + ' task(s) remaining';
        insertTask(parent.taskId, target.value);
    }
    else {
        updateTask(parent.taskId, target.value);
    }
}

/**
 * Добавляет обработчики на создаваемую задачу.
 * @param {*} parent Родительский элемент
 */
function addInputListeners(input) {
    input.addEventListener('blur', (event) => {
        event.target.classList.remove('task-focus');
        setTask(event);
    });

    input.addEventListener('keydown', (event) => {
        if (event.keyCode == 13) {
            event.target.blur();
            setTask(event);
        }
    });

    input.addEventListener('focus', (event) => {
        localStorage['description'] = event.target.value;
        event.target.classList.add('task-focus');
    });
}

/**
 * Добавляет обработчик на checkbox.
 * @param {*} check 
 */
function addCheckedListener(check) {
    check.addEventListener('click', (event) => {
        let target = event.target.parentNode.parentNode;
        fetch('/DB/UpdateTaskStatus?taskId=' + target.taskId
            + "&complete=" + event.target.checked, {
                method: 'GET'
            });
        target.lastChild.lastChild.classList.toggle('cross-task');
    });
}

