const homeScreen = document.querySelector("#home");
const navItems = document.querySelectorAll(".nav-item");
const navRecord = navItems[1];
const navPlay = navItems[2];
const directions = document.querySelector("#directions");
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username-input")

function giveDirections() {
    directions.classList.remove("hide");
    homeScreen.classList.add("hide");
}

function startNewGame(e) {
    e.preventDefault();
    const username = usernameInput.value;
    console.log(username);
}





//Event Listeners 
navPlay.addEventListener("click", giveDirections);
usernameForm.addEventListener("submit", startNewGame);