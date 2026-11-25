const signupForm = document.querySelector(".signup-form");

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const password = signupForm.elements.password.value;
  const confirmPassword = signupForm.elements["confirm-password"].value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    signupForm.elements["confirm-password"].focus();
    return;
  }

  const users = JSON.parse(localStorage.getItem("rebook-registered-users") || "[]");
  const username = signupForm.elements.username.value.trim();
  const email = signupForm.elements.email.value.trim();
  const duplicate = users.some((user) =>
    user.username.toLowerCase() === username.toLowerCase()
    || user.email.toLowerCase() === email.toLowerCase()
  );

  if (duplicate) {
    alert("That username or email is already registered.");
    return;
  }

  users.push({
    username,
    email,
    registeredAt: new Date().toISOString().slice(0, 10)
  });
  localStorage.setItem("rebook-registered-users", JSON.stringify(users));

  alert("Registration successful!");
  window.location.href = "login.html";
});
