function register(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    if(username === null || username.trim() === "" || password === null || password.trim() === "" || email === null || email.trim() === "") {
        alert("Please enter all fields.");
        return;
    } else {
        alert("Registration successful!");
        window.location.href = "login.html";
    }
}

