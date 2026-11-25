function login(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    let correctusername = "user123";
    let correctpassword = "password123"; 
    if(username === null || username.trim() === "") {
        alert("Please enter your username.");
        return;
        }else {
        if(username.toLowerCase() === correctusername && password.toLowerCase() === correctpassword) {
            alert("Login successful!");
            window.location.href = "Homepage.html";
        } else {
            alert("Invalid username or password.");
        }
    }
}

function Adminlogin(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    let correctusername = "admin";
    let correctpassword = "admin123"; 
    if(username.trim() === "") {
        alert("Please enter your username.");
        return;
    }

    if(username.trim().toLowerCase() === correctusername && password.toLowerCase() === correctpassword) {
        alert("Login successful!");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid username or password.");
    }
}