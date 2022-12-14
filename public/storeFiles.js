var currName;
var flag = false; // new user in local storage
var isPause = false;

// game start, initial user's info
let interval = null;

function start() {
  initMes();
  //run game
  interval = setInterval(drawFram, 10);
  setInterval(addBullet, 500);
  setInterval(addMonster, 450);
}

function initMes() {
  var message_child = {};
  var historyMessage = JSON.parse(localStorage.getItem("messageStorage"));
  currName = prompt("Please input your name: ");
  if (currName != null && currName != "") {
    document.getElementById("name").innerHTML = currName;
  }
  if (historyMessage != null) {
    for (let i = 0; i < historyMessage.length; i++) {
      if (historyMessage[i].name === currName) {
        flag = true;
        document.getElementById("highScore").innerHTML =
          historyMessage[i].score;
      }
    }
  }

  if (!flag) {
    message_child.name = currName;
    message_child.score = 0;
    if (historyMessage == null) {
      historyMessage = new Array();
    }
    historyMessage.push(message_child);
    localStorage.setItem("messageStorage", JSON.stringify(historyMessage));
  }
}
// game over, update the local storage
function updateMes() {
  var historyMessage = JSON.parse(localStorage.getItem("messageStorage"));
  for (var i = 0; i < historyMessage.length; i++) {
    if (historyMessage[i].name == currName) {
      if (score > historyMessage[i].score) {
        historyMessage[i].score = score;
        document.getElementById("highScore").innerHTML = score;
      }
      localStorage.setItem("messageStorage", JSON.stringify(historyMessage));
      return;
    }
  }
}

function pause() {
  if (document.getElementById("name").textContent.trim() !== "") {
    if (isPause) {
      interval = setInterval(drawFram, 10);
      isPause = false;
      document.getElementById("pause").innerHTML = "Pause";
    } else {
      clearInterval(interval);
      interval = null;
      isPause = true;
      document.getElementById("pause").innerHTML = "Start";
    }
  }
}

function isFinished() {
  if (survivor.lives <= 0) {
    updateMes();
  }
}
