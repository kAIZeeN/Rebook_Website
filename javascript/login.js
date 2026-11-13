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
        if(username === correctusername && password === correctpassword) {
            alert("Login successful!");
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
    if(username === null || username.trim() === "") {
        alert("Please enter your username.");
        return;
        }else {
        if(username === correctusername && password === correctpassword) {
            alert("Login successful!");
        } else {
            alert("Invalid username or password.");
        }
    }
}