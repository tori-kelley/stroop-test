const homeScreen = document.querySelector("#home");
const navAbout = document.querySelector("#nav").firstElementChild;
console.log(navAbout);
const navRecord = document.querySelector(".nav-item:nth-child(2)");
const navPlay = document.querySelector(".nav-item:nth-child(3)");
const aboutPage = document.querySelector("#aboutPage");
const directionsPage = document.querySelector("#directions");
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username-input");
const playingPage = document.querySelector("#playing");
const finishPage = document.querySelector("#finishPage");
const recordsPage = document.querySelector("#recordsPage");
const returnBtns = document.getElementsByClassName("returnHome");
const colors = ["red", "purple", "blue", "green", "yellow", "orange"];
const answerKey = {
    r: "red",
    o: "orange",
    y: "yellow",
    g: "green",
    b: "blue",
    p: "purple"
}
let correctCount = 0;
let wrongCount = 0;
let currentColor = null;
const header = document.querySelector("#header");
const displayTime = document.querySelector("#dispTime");
let startTime = null;
let mixed = null;
let mixedList = document.querySelector("#mixedList");
let matchedList = document.querySelector("#matchedList");
const pageList = [aboutPage, directionsPage, playingPage, finishPage, recordsPage];
let colorCount = -1;

function showAbout() {
    aboutPage.classList.remove("hide");
    homeScreen.classList.add("hide");
}

function giveDirections() {
    directionsPage.classList.remove("hide");
    homeScreen.classList.add("hide");
}

function startNewGame(e) {
    e.preventDefault();
    if (usernameInput.value == "") {
        alert("Please add a name, dude!");
        return;
    }
    //reset count in case this isn't their first game
    correctCount = 0;
    wrongCount= 0;
    mixed = document.querySelector("#switch").checked;

    directionsPage.classList.add("hide");
    playingPage.classList.remove("hide");
    document.addEventListener("keydown", verifyKey);
    gamePlay();
}

function gamePlay() {
    startTime = new Date();
    showNextHeader();
}

function showNextHeader() {
    if (correctCount < 25) {
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
            correctCount++;
            console.log("Correct!");
        } else {
            wrongCount++;
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
    const accuracy = Math.round(100*correctCount/(correctCount+ wrongCount));
    addRecordToStorage(totalTime, username, accuracy);
    playingPage.classList.add("hide");
    finishPage.classList.remove("hide");
    displayTime.textContent = `Your time is ${totalTime} seconds, and your answers were ${accuracy}% accurate! Noice.`;
}

function goHome() {
    for (let page of pageList) {
        page.classList.add("hide");
    }
    homeScreen.classList.remove("hide");
}

//base code for local storage operations from Udemy shopping list project
//https:// www.udemy.com/course/modern-javascript-from-the-beginning/learn/lecture/37192472#overview
function addRecordToStorage(time, username, accuracy) {
    let recordsFromStorage = getRecordsFromStorage();

    //add new item to array
    if (mixed) {
        recordsFromStorage.mixed.push({"user": username, "time": time, "accuracy": accuracy}); 
    }
    else {
        recordsFromStorage.matched.push({"user": username, "time": time, "accuracy": accuracy}); 
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
    console.log(recordsFromStorage);
    mixedList.innerHTML = "";
    matchedList.innerHTML = "";
    addListEntries(recordsFromStorage["mixed"], mixedList);
    addListEntries(recordsFromStorage["matched"], matchedList);
}

function addListEntries (arr, parent) {
    let sortedArr = sortArr(arr);
    for (let entry of sortedArr) {
        let li = document.createElement("li");
        li.classList.add(getNextColor());
        li.appendChild(document.createTextNode(`${entry.user}: ${entry.time} with ${entry.accuracy}% accuracy`));
        parent.appendChild(li);
    }
}

function getNextColor() {
    colorCount = (colorCount + 1) % 6;
    return colors[colorCount];
}

function sortArr(arr) {
    let timesList = arr.map(obj => obj.time);
    timesList.sort((a, b) => a - b);
    let newArr = [];
    for (time of timesList) {
        let obj = arr.find(entry => entry.time === time);
        newArr.push(obj);
    }
    return newArr;
}

function deleteRecord(record, source) {
    let time = record.textContent.slice(record.textContent.indexOf(":") + 2, indexOf("with") - 1);
    record.remove();
    removeRecordFromStorage(time, source);
}

function deleteRecordWarning(e) {
    let source = (e.currentTarget.id == "mixedList") ? "mixed" : "matched";
    if (confirm("Are you sure you want to remove this entry?")) {
        deleteRecord(e.target, source);
    }
}

function removeRecordFromStorage(time, source) {
    let recordsFromStorage = getRecordsFromStorage();
    for (let obj of recordsFromStorage[source]) {
        if (obj.time == time){
            recordsFromStorage[source].splice(recordsFromStorage[source].indexOf(obj), 1);
            break;
        }
    }

    localStorage.setItem('records',JSON.stringify(recordsFromStorage));
}

//Event Listeners 
navAbout.addEventListener("click", showAbout);
navPlay.addEventListener("click", giveDirections);
navRecord.addEventListener("click", showRecords);
usernameForm.addEventListener("submit", startNewGame);
Array.from(returnBtns).forEach(function(returnBtn) {
    returnBtn.addEventListener('click', goHome);
  });
Array.from([mixedList, matchedList]).forEach(function(list) {
    list.addEventListener('dblclick', deleteRecordWarning);
  });