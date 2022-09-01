const boxes = [...document.querySelectorAll('.box')];
let mainBox = document.querySelector('.main-box');
let countBoxes = mainBox.firstElementChild.childElementCount;
const msg = document.querySelector('#msg');
const start = document.querySelector('#start button');
const movesteps = document.querySelector('#start span');
const hrText = document.querySelector('#timer #hr');
const minText  = document.querySelector('#timer #min');
const secText  = document.querySelector('#timer #sec');
let startgame = false, endgame = false, isBoxActive = false;
let lastbox = null, boxsize = null;
let moves = 0, hr = 0, min = 0, sec = 0;
let runTime;

start.addEventListener('click', () => {
    if (endgame) {restart();}
    startgame = true;
    start.classList.add('inactive');
    start.innerText = 'Playing....';
    timer();
});

function addActive(box) { box.firstElementChild.firstElementChild.classList.add('active'); }
function delActive(box) { box.firstElementChild.firstElementChild.classList.remove('active'); }
function clickedBox(box) { clickedbox = box.id; return box.id; }
function lastBox(box) { lastbox = box.id; }
function childrenCount(box) { return box.firstElementChild.childElementCount; }
function boxSize(box) { boxsize = box.firstElementChild.firstElementChild.dataset.size; }

function processing() {
    boxes.forEach(box => {
        box.addEventListener('click', function() {
            if (startgame && !endgame) {
                if (clickedBox(this) === lastbox) {
                    if (childrenCount(this) > 0) {
                        delActive(this)
                        lastbox = null;
                        isBoxActive = false;
                    }
                } else {
                    if (!isBoxActive) {
                        if (childrenCount(this) > 0) {                        
                            addActive(this);
                            lastBox(this)
                            boxSize(this)
                            isBoxActive = true;
                        }
                    } else {
                        moveRules(box);
                    }
                }
            }
        });
    });
}
processing();

function moveRules(box) {
    if (childrenCount(box) > 0) { 
        if (boxsize > box.firstElementChild.firstElementChild.dataset.size) {
            showMsg("You can't put the small one on the big one");
        } else {
            moveBox(box);
        }
    } else {
        moveBox(box);
    }
}

function moveBox(box) {
    if (childrenCount(box) > 0) {
        insertAfter(document.querySelector(`#${lastbox}`).firstElementChild.firstElementChild, box.firstElementChild.firstElementChild)
    } else {
        box.firstElementChild.appendChild(document.querySelector(`#${lastbox}`).firstElementChild.firstElementChild);
    }
    delActive(box)
    isBoxActive = false;
    boxsize = null;
    lastbox = null;
    moves = moves + 1;
    moveSetps(moves);
    isWin(box);
}

function moveSetps(value) { movesteps.innerText = value; }
function insertAfter(el, referenceNode) { referenceNode.parentNode.insertBefore(el, referenceNode); }

function isWin(box) {
    if (box.id != mainBox.id) {
        if (childrenCount(box) === countBoxes) {
            endgame = true;
            clearInterval(runTime);
            start.innerText = 'Restart';
            start.classList.remove('inactive');
            showMsg('You Win', false)
        } 
    }
}

function showMsg(messege, time = true) {
    msg.innerText = messege;
    msg.style.opacity = '1';
    if (time) {        
        setTimeout(() => {
            msg.innerText = "";
            msg.style.opacity = '0';
        }, 2000);
    }
}

function restart() {
    mainBox.classList.remove('main-box');
    mainBox = document.querySelector(`#${clickedbox}`);
    mainBox.classList.add('main-box')  
    countBoxes = mainBox.firstElementChild.childElementCount;
    startgame = true, endgame = false, isBoxActive = false;
    lastbox = null, boxsize = null;
    moves = 0;
    moveSetps(moves);
    start.innerText = 'Playing....';
    showMsg('', false);
    msg.style.opacity = '0';
    hrText.innerText = '00 :';
    minText.innerText = '00 :';
    secText.innerText = '00';
    sec = 0; min = 0; hr = 0;
}

function timer() {
    runTime = setInterval(() => {
        sec++;
        if  (sec > 59) {
            sec = 0;
            min++;
        }
        if (min > 59) {
            min = 0;
            hr++;
        }
        hrText.innerText = `${zero(hr)} :`;
        minText.innerText = `${zero(min)} :`;
        secText.innerText = `${zero(sec)}`;
    }, 1000);
}

function zero(value) { return value < 10 ? `0${value}` : `${value}`; }