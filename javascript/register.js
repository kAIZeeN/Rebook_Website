function register(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if(username === null || username.trim() === "" || password === null || password.trim() === "") {
        alert("Please enter both username and password.");
        return;
    } else {
        alert("Registration successful!");
        window.location.href = "login.html";
    }
}

