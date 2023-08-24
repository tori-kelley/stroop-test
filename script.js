const homeScreen = document.querySelector("#home");
const navRecord = document.querySelector(".nav-item:nth-child(2)");
const navPlay = document.querySelector(".nav-item:nth-child(3)");
const directions = document.querySelector("#directions");
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username-input");
const playingPage = document.querySelector("#playing");
const finishPage = document.querySelector("#finishPage");
const recordsPage = document.querySelector("#recordsPage");
const returnBtn = document.querySelector("#return");
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
const displayTime = document.querySelector("#dispTime");
let startTime = null;
let mixed = null;


function giveDirections() {
    directions.classList.remove("hide");
    homeScreen.classList.add("hide");
}

function startNewGame(e) {
    e.preventDefault();
    mixed = document.querySelector("#switch").checked;

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
        let index = Math.floor(Math.random() * 6);
        currentColor = colors[index];
        if (mixed) {
            let colorExcludedArr = colors.slice(0,index).concat(colors.slice(index+1));
            let newColor = colorExcludedArr[Math.floor(Math.random() * 5)];
            header.textContent = newColor;
            header.classList = currentColor;
        }
        else {
            header.textContent = currentColor;
            header.classList = currentColor;
        }
        return false;
    }
    else {
        currentColor = null;
        return true;
    }
}

function verifyKey(e) {
    const pressedKey = e.key;
    if (currentColor) {
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
    return
}

function endGame() {
    const username = usernameInput.value;
    const endTime = new Date();
    const totalTime = Math.abs(startTime - endTime)/1000;
    addRecordToStorage(totalTime, username);
    playingPage.classList.add("hide");
    finishPage.classList.remove("hide");
    displayTime.textContent = `Your time is ${totalTime} seconds! Noice.`;
}

function goHome(e) {
    finishPage.classList.add("hide");
    homeScreen.classList.remove("hide");
}

//base code for local storage operations from Udemy shopping list project
//https:// www.udemy.com/course/modern-javascript-from-the-beginning/learn/lecture/37192472#overview
function addRecordToStorage(time, username) {
    let recordsFromStorage = getRecordsFromStorage();

    //add new item to array
    if (mixed) {
        recordsFromStorage.mixed.push({"user": username, "time": time}); 
    }
    else {
        recordsFromStorage.matched.push({"user": username, "time": time}); 
    }
    //convert to json string and set to local storage
    localStorage.setItem('records',JSON.stringify(recordsFromStorage));
}

function getRecordsFromStorage() {
    let recordsFromStorage;

    if (localStorage.getItem("records") === null) {
        recordsFromStorage = {
            matched:[],
            mixed:[]
        };
    }
    else {
        recordsFromStorage = JSON.parse(localStorage.getItem("records"));
    }
    return recordsFromStorage;
}

function showRecords() {
    homeScreen.classList.add("hide");
    recordsPage.classList.remove("hide");
    let recordsFromStorage = getRecordsFromStorage();
    

}

//Event Listeners 
navPlay.addEventListener("click", giveDirections);
navRecord.addEventListener("click", showRecords);
usernameForm.addEventListener("submit", startNewGame);
returnBtn.addEventListener("click", goHome);