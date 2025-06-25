const form = document.getElementById("login-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const stored = JSON.parse(localStorage.getItem("user"));

  if (!stored) {
    alert("No account found. Please create one.");
    return;
  }

  if (stored.username === username && stored.password === password) {
    localStorage.removeItem("transactions"); // Clear old data
    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials");
  }
});

function createAccount() {
  const username = prompt("Enter new username:");
  const password = prompt("Enter new password:");
  if (username && password) {
    const user = { username, password };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Account created! Please log in.");
  }
}


