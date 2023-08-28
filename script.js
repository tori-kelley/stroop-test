//variable definitions
const homeScreen = document.querySelector("#home");
const navAbout = document.querySelector("#nav").firstElementChild;
const navRecord = document.querySelector(".nav-item:nth-child(2)");
const navPlay = document.querySelector(".nav-item:nth-child(3)");
const navPsychedelic = document.querySelector("#nav-psychedelic");
const aboutPage = document.querySelector("#aboutPage");
const recordsPage = document.querySelector("#recordsPage");
let mixedList = document.querySelector("#mixedList");
let matchedList = document.querySelector("#matchedList");
const directionsPage = document.querySelector("#directions");
const psychedelicDirections = document.querySelector("#psychedelic-directions")
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username-input");
const form = document.querySelector(".form-control");
const playingPage = document.querySelector("#playing");
const header = document.querySelector("#header");
const finishPage = document.querySelector("#finishPage");
const displayTime = document.querySelector("#dispTime");
const playBtns = document.getElementsByClassName("play-btn");
const returnBtns = document.getElementsByClassName("returnHome");
const pageList = [aboutPage, directionsPage, playingPage, finishPage, recordsPage];
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
let colorCount = -1;
let currentColor = null;
let startTime = null;
let mixed = null;
let psychedelic = null;


function showAbout() {
    aboutPage.classList.remove("hide");
    homeScreen.classList.add("hide");
}

//base code for local storage operations based on Udemy shopping list project
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

function getNextColor() {
    colorCount = (colorCount + 1) % 6;
    return colors[colorCount];
}

function deleteRecord(record, source) {
    // trying to isolate the time by starting after the : and stopping before it gets to the accuracy
    let time = record.textContent.slice(record.textContent.indexOf(":") + 2, record.textContent.indexOf("with") - 1);
    //removes from DOM
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

function giveDirections() {
    directionsPage.classList.remove("hide");
    homeScreen.classList.add("hide");
    if (psychedelic) {
        psychedelicDirections.classList.remove("hide");
        form.classList.add("hide");
    }
}

function startNewGame(e) {
    e.preventDefault();
    if (usernameInput.value == "" && !psychedelic) {
        alert("Please add a name, dude!");
        return;
    }
    //reset count in case this isn't their first game
    correctCount = 0;
    wrongCount= 0;
    //flag for if play mode is mixed or matched
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

function chooseRandomColor(arr) {
    let index = Math.floor(Math.random() * arr.length);
    let rest = arr.slice();
    let color = rest.splice(index , 1);
    return [color, rest];
}

function showNextHeader() {
    if (correctCount < 25) {
        const [color, rest] = chooseRandomColor(colors);
        currentColor = color[0];
        //for matched
        if (!mixed && !psychedelic) {
            header.textContent = currentColor;
            header.classList = currentColor;
        }
        else {
            let [secondColor, remainder] = chooseRandomColor(rest);
            header.textContent = secondColor;
            //for psychedelic
            if (psychedelic) {
                let [thirdColor, leftover] = chooseRandomColor(remainder);
                header.classList = (currentColor+ " " + thirdColor + "-bg");
            }
            //for mixed
            else {
                header.classList = currentColor;
            }
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
    //makes sure that there's something to verify
    if (currentColor) {
        //if it's in the answer key and it corresponds w the right color
        if (answerKey.hasOwnProperty(pressedKey) && answerKey[pressedKey] === currentColor) {
            correctCount++;
        } 
        else {
            wrongCount++;
        }
        //returns true when the correct count == 25, i.e. the game is over
        let status = showNextHeader();
        if (status) {
            endGame();
        }
    }
    return
}

function endGame() {
    const username = usernameInput.value;
    const endTime = new Date();
    const totalTime = Math.abs(startTime - endTime) / 1000;
    const accuracy = Math.round(100 * correctCount / (correctCount + wrongCount));
    if (!psychedelic) {
        addRecordToStorage(totalTime, username, accuracy);
    }
    playingPage.classList.add("hide");
    finishPage.classList.remove("hide");
    displayTime.textContent = `Your time is ${totalTime} seconds, and your answers were ${accuracy}% accurate! Noice.`;
}

function goHome() {
    for (let page of pageList) {
        page.classList.add("hide");
    }
    if (psychedelic) {
        psychedelic = null;
        psychedelicDirections.classList.add("hide");
        form.classList.remove("hide");
    }
    homeScreen.classList.remove("hide");
}

function startPsychedelic() {
    psychedelic = true;
    giveDirections();
}

//Event Listeners 
navAbout.addEventListener("click", showAbout);
navPlay.addEventListener("click", giveDirections);
navRecord.addEventListener("click", showRecords);
navPsychedelic.addEventListener("click", startPsychedelic);
usernameForm.addEventListener("submit", startNewGame);
//event listeners for return buttons
Array.from(returnBtns).forEach(function(returnBtn) {
    returnBtn.addEventListener('click', goHome);
  });
//event listeners for play buttons
Array.from(playBtns).forEach(function(playBtn) {
    playBtn.addEventListener('click', startNewGame);
  });
//event listeners for both record lists
Array.from([mixedList, matchedList]).forEach(function(list) {
    list.addEventListener('dblclick', deleteRecordWarning);
  });