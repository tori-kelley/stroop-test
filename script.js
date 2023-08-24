const homeScreen = document.querySelector("#home");
const navRecord = document.querySelector(".nav-item:nth-child(2)");
const navPlay = document.querySelector(".nav-item:nth-child(3)");
const directions = document.querySelector("#directions");
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username-input");
const playingPage = document.querySelector("#playing");
const colors = ["red","orange", "yellow", "green", "blue", "purple"];
const answerKey = {
    r: "red",
    o: "orange",
    y: "yellow",
    g: "green",
    b: "blue",
    p: "purple"
}
let count = 0;
let currentColor = null;
const header = document.querySelector("#header");
let startTime = null;


function giveDirections() {
    directions.classList.remove("hide");
    homeScreen.classList.add("hide");
}

function startNewGame(e) {
    e.preventDefault();
    const username = usernameInput.value;
    directions.classList.add("hide");
    playingPage.classList.remove("hide");
    document.addEventListener("keydown", verifyKey);
    gamePlay();
}

function gamePlay() {
    startTime = new Date();
    showNextHeader();
}

function showNextHeader() {
    if (count < 5) {
        currentColor = colors[Math.floor(Math.random() * 6)];
        header.textContent = currentColor;
        header.classList = currentColor;
        return false;
    }
    else {
        return true;
    }
}

function verifyKey(e) {
    const pressedKey = e.key;
    if (answerKey.hasOwnProperty(pressedKey) && answerKey[pressedKey] === currentColor) {
        count++;
        console.log("Correct!");
    } else {
        console.log("Incorrect!");
    }
    let status = showNextHeader()
    if (status) {
        endGame();
    }
}

function endGame() {
    const endTime = new Date();
    const totalTime = Math.abs(startTime - endTime)/1000;
    console.log(totalTime);
}

//Event Listeners 
navPlay.addEventListener("click", giveDirections);
usernameForm.addEventListener("submit", startNewGame);