const STORAGE_KEY = "todos";

const form = document.getElementById("new-todo-form");
const input = document.getElementById("new-todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const todoCount = document.getElementById("todo-count");

/** @type {{ id: number, text: string, done: boolean }[]} */
let todos = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }
  todos.push({ id: Date.now(), text: trimmed, done: false });
  save();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((item) => item.id === id);
  if (todo) {
    todo.done = !todo.done;
    save();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((item) => item.id !== id);
  save();
  render();
}

function render() {
  list.innerHTML = "";
  emptyState.hidden = todos.length > 0;
  const activeCount = todos.filter((todo) => !todo.done).length;
  todoCount.textContent = `${activeCount} active ${activeCount === 1 ? "todo" : "todos"}`;

  for (const todo of todos) {
    const li = document.createElement("li");
    li.className = todo.done ? "done" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = todo.text;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.type = "button";
    remove.textContent = "✕";
    remove.setAttribute("aria-label", "Delete todo");
    remove.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, remove);
    list.append(li);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(input.value);
  input.value = "";
  input.focus();
});

render();
