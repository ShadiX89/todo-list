const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const clearAllButton = document.getElementById("clearAll");
const toggleThemeButton = document.getElementById("toggleTheme");
const taskList = document.getElementById("taskList");

window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadTheme();
});

addButton.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }
  const taskObj = { text: taskText, done: false };
  addTask(taskObj);
  saveTask(taskObj);
  taskInput.value = "";
});

clearAllButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    localStorage.removeItem("tasks");
    taskList.innerHTML = "";
  }
});

toggleThemeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}

function addTask(taskObj) {
  const li = document.createElement("li");
  if (taskObj.done) li.classList.add("done");

  // Text span for editing
  const span = document.createElement("span");
  span.textContent = taskObj.text;
  span.style.flexGrow = 1;

  // Toggle done
  span.addEventListener("click", () => {
    li.classList.toggle("done");
    taskObj.done = li.classList.contains("done");
    updateTask(taskObj);
  });

  // Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    const newText = prompt("Edit your task:", taskObj.text);
    if (newText) {
      taskObj.text = newText.trim();
      span.textContent = taskObj.text;
      updateTask(taskObj);
    }
  });

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    li.remove();
    deleteTask(taskObj);
  });

  li.appendChild(span);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
  taskList.appendChild(li);
}

function saveTask(taskObj) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskObj);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTask);
}

function updateTask(updatedTask) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.map(task =>
    task.text === updatedTask.text || (task.done && task.text === updatedTask.text)
      ? updatedTask
      : task
  );
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function deleteTask(taskObj) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filtered = tasks.filter(task => task.text !== taskObj.text);
  localStorage.setItem("tasks", JSON.stringify(filtered));
}
