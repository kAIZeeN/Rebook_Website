function register(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    let correctusername = "";
    let correctpassword = ""; 
    if(username === null || username.trim() === "") {
        alert("Please enter your username.");
        return;
        }else {
        if(username === correctusername && password === correctpassword) {
            alert("Register successful!");
        } else {
            alert("Invalid username or password.");
        }
    }
}

