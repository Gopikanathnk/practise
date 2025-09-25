
// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // JSON file with users
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Optional: log requests
server.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`, req.body);
  next();
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server running at http://localhost:${PORT}`);
});

let url = "http://localhost:3000/users";
let editUserId = null; // Track the user being edited

// Fetch data on load
async function fetchData() {
  try {
    let response = await axios.get(url);
    displayUserData(response.data);
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}
fetchData();

let userForm = document.getElementById("userForm");
userForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let username = document.getElementById("name").value;
  let userage = document.getElementById("age").value;
  let usercourse = document.getElementById("course").value;
  let userphone = document.getElementById("phone").value;

  if (editUserId) {
    // Update existing user
    EditUser(editUserId, username, userage, usercourse, userphone);
    editUserId = null;
    document.querySelector("button[type='submit']").textContent = "Submit";
  } else {
    // Add new user
    addUser(username, userage, usercourse, userphone);
  }

  userForm.reset();
});

// Add new user
async function addUser(name, age, course, phone) {
  try {
    await axios.post(url, { name, age, course, phone });
    fetchData(); 
  } catch (error) {
    console.log("Error adding user:", error);
  }
}

// Update existing user
async function EditUser(id, name, age, course, phone) {
  try {
    await axios.put(`${url}/${id}`, { name, age, course, phone });
    fetchData(); 
  } catch (error) {
    console.log("Error updating user:", error);
  }
}

// Delete user
async function deleteUser(id) {
  try {
    await axios.delete(`${url}/${id}`);
    fetchData(); 
  } catch (error) {
    console.log("Error deleting user:", error);
  }
}

// Display table with Edit & Delete buttons
function displayUserData(users) {
  let tbody = document.getElementById("userTableBody");
  tbody.innerHTML = ""; 

  users.forEach((user, index) => {
    let tr = document.createElement("tr");

    // Sr.No
    let tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;
    tr.appendChild(tdIndex);

    // Name
    let tdName = document.createElement("td");
    tdName.textContent = user.name;
    tr.appendChild(tdName);

    // Age
    let tdAge = document.createElement("td");
    tdAge.textContent = user.age;
    tr.appendChild(tdAge);

    // Course
    let tdCourse = document.createElement("td");
    tdCourse.textContent = user.course;
    tr.appendChild(tdCourse);

    // Phone
    let tdPhone = document.createElement("td");
    tdPhone.textContent = user.phone;
    tr.appendChild(tdPhone);

    // Action buttons
    let tdAction = document.createElement("td");

    // Edit button
    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.addEventListener("click", () => {
      document.getElementById("name").value = user.name;
      document.getElementById("age").value = user.age;
      document.getElementById("course").value = user.course;
      document.getElementById("phone").value = user.phone;

      editUserId = user.id;
      document.querySelector("button[type='submit']").textContent = "Update";
    });
    tdAction.appendChild(editBtn);

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete";
    deleteBtn.addEventListener("click", () => {
      deleteUser(user.id);
    });
    tdAction.appendChild(deleteBtn);

    tr.appendChild(tdAction);
    tbody.appendChild(tr);
  });
}

