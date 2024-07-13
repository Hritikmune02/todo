const input = document.querySelector("input"); // Selects the input element
const addButton = document.querySelector(".add-button"); // Selects the add button
const todosHtml = document.querySelector(".todos"); // Selects the <ul> element to display todos
const emptyImage = document.querySelector(".empty-image"); // Selects the empty image placeholder
let todosJson = JSON.parse(localStorage.getItem("todos")) || []; // Retrieves todos from localStorage or initializes an empty array
const deleteAllButton = document.querySelector(".delete-all"); // Selects the delete all button
const filters = document.querySelectorAll(".filter"); // Selects all filter buttons
let filter = ''; // Variable to store the current filter status

// Function to generate HTML for each todo item
function getTodoHtml(todo, index) {
  // If there's a filter and the todo status doesn't match, return an empty string
  if (filter && filter != todo.status) {
    return '';
  }
  // Determines if the checkbox should be checked based on todo status
  let checked = todo.status == "completed" ? "checked" : "";
  // Generates HTML for a single todo item
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

// Function to display todos
function showTodos() {
  // If there are no todos, display empty message and hide todos list
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    // Otherwise, display todos and hide empty message
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

// Function to add a new todo
function addTodo(todo)  {
  input.value = ""; // Clear input field
  todosJson.unshift({ name: todo, status: "pending" }); // Add new todo to beginning of todos array
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Save todos to localStorage
  showTodos(); // Update todos display
}

// Event listener for Enter key press in input field to add todo
input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

// Event listener for clicking add button to add todo
addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

// Function to update todo status (completed or pending)
function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked"); // Apply checked style
    todosJson[todo.id].status = "completed"; // Update todo status in array
  } else {
    todoName.classList.remove("checked"); // Remove checked style
    todosJson[todo.id].status = "pending"; // Update todo status in array
  }
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Save todos to localStorage
}

// Function to remove a todo
function remove(todo) {
  const index = todo.dataset.index; // Get index of todo to remove
  todosJson.splice(index, 1); // Remove todo from array
  showTodos(); // Update todos display
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Save todos to localStorage
}

// Event listeners for filter buttons
filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active'); // Remove active class if already active
      filter = ''; // Clear filter
    } else {
      filters.forEach(tag => tag.classList.remove('active')); // Remove active class from all filters
      el.classList.add('active'); // Add active class to clicked filter
      filter = e.target.dataset.filter; // Set filter based on data attribute
    }
    showTodos(); // Update todos display based on filter
  });
});

// Event listener for delete all button
deleteAllButton.addEventListener("click", () => {
  todosJson = []; // Clear todos array
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Save empty todos to localStorage
  showTodos(); // Update todos display (empty)
});
