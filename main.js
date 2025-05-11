let TODOS = [];

const todoInput = document.getElementById("todo-input");
const todoButton = document.getElementById("todo-button");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const btnActive = document.getElementById("btn-active");
const btnAll = document.getElementById("btn-all");
const btnCompleted = document.getElementById("btn-complete");
const btnClear = document.getElementById("btn-clear");

const API_URL = "https://681ddc25c1c291fa6631f229.mockapi.io/todosList";

async function getTodos() {
  const response = await fetch(API_URL);
  const todos = await response.json();
  
  console.log(todos);
  if (todos) {
    TODOS = todos;
  }
  return TODOS
}

async function romoveTodos(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    TODOS = TODOS.filter((todo) => todo.id !== id);
    setTodos(TODOS);
  }
}

function setTodos(todos) {
  TODOS = todos;
  sessionStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodo(todo) {
  const todoItem = document.createElement("li");

  todoItem.setAttribute("data-id", todo.id);

  todoItem.classList.add(
    "flex",
    "items-center",
    "px-6",
    "py-4",
    "hover:bg-gray-50",
    "group",
    "transition-colors",
    "duration-150"
  );

  todoItem.innerHTML = `
      <input type="checkbox" ${
        todo.completed ? "checked" : ""
      } class="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500">
      <div class="ml-3 flex-1 text-gray-800" contenteditable="true">${todo.content}</div>
      <button class="text-gray-400 hover:text-red-500 transition-colors duration-200">
        <i class="fas fa-trash"></i>
      </button>
    `;

  todoList.appendChild(todoItem);
}

function renderTodoList(todos) {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    renderTodo(todo);
  });

  const activeTodos = todos.filter((todo) => !todo.completed);

  todoCount.innerHTML = `${activeTodos.length} items left`;
}

async function addTodo() {
  if (todoInput.value === "") return;

  const todo = {
    id: TODOS.length + 1,
    content: todoInput.value,
    completed: false,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify(todo),
  });

  if (response.ok) {
  TODOS.push(todo);

  setTodos(TODOS);
  renderTodoList(TODOS);
  todoInput.value = "";
  }
}

async function updateTodo(id, newTodo) {  
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {"content-type": "application/json"},
    body: JSON.stringify(newTodo),
  });

  if (response.ok) {
    TODOS = TODOS.map((todo) => {
      if (todo.id === id) {
        return newTodo;
      }
      return todo;
    });
  }
}

todoInput.addEventListener("keyup", (e) => {
  if (e.target.value === "") {
    todoButton.setAttribute("disabled", "true");
  } else {
    todoButton.removeAttribute("disabled");
  }
});

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

todoButton.addEventListener("click", () => {
  addTodo();
});

todoList.addEventListener("click", (e) => {
  if (e.target.tagName === "I") {
    const todoId = e.target.parentElement.parentElement.getAttribute("data-id");

    TODOS = TODOS.filter((todo) => todo.id !== Number(todoId));

    romoveTodos(todoId);
    renderTodoList(TODOS);
  }
});

todoList.addEventListener("change", async (e) => {
  if (e.target.tagName === "INPUT") {
    const todoId = e.target.parentElement.getAttribute("data-id");

    await updateTodo(todoId, {
      completed: e.target.checked,
      content: e.target.nextElementSibling.innerText,
    });

    renderTodoList(TODOS);
  }
});

btnActive.addEventListener("click", () => {
  const activeTodos = TODOS.filter((todo) => !todo.completed);
  renderTodoList(activeTodos);
  todoCount.innerHTML = `${activeTodos.length} items left`;
  btnActive.classList.add("bg-purple-500", "text-white");
  btnAll.classList.remove("bg-purple-500", "text-white");
  btnCompleted.classList.remove("bg-purple-500", "text-white");
});

btnCompleted.addEventListener("click", () => {
  const activeTodos = TODOS.filter((todo) => todo.completed);
  renderTodoList(activeTodos);
  todoCount.innerHTML = `${activeTodos.length} items left`;
  btnCompleted.classList.add("bg-purple-500", "text-white");
  btnAll.classList.remove("bg-purple-500", "text-white");
  btnActive.classList.remove("bg-purple-500", "text-white");
});

btnAll.addEventListener("click", () => {
  const activeTodos = TODOS.filter((todo) => todo);
  renderTodoList(activeTodos);
  todoCount.innerHTML = `${activeTodos.length} items left`;
  btnAll.classList.add("bg-purple-500", "text-white");
  btnCompleted.classList.remove("bg-purple-500", "text-white");
  btnActive.classList.remove("bg-purple-500", "text-white");
});

btnClear.addEventListener("click", () => {
  const completedTodos = TODOS.filter((todo) => todo.completed);
  completedTodos.forEach((todo) => {
    romoveTodos(todo.id);
  });
  renderTodoList(TODOS);
});

getTodos().then((todos) => {
renderTodoList(TODOS);
});