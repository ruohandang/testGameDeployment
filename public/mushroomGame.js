
//Game properties
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
if (canvas.width  < window.innerWidth)
  {
    canvas.width  = window.innerWidth;
  }

  if (canvas.height < window.innerHeight)
  {
      canvas.height = window.innerHeight;
  }

function drawBackgroud(image){
    let background = new Image();
    background.src = image;
    var pat = ctx.createPattern(background, "repeat");
    ctx.fillStyle = pat;
    ctx.rect(0,0,2500,1800); 
    ctx.fill();
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
var score = 0;

//Survivor
let survivorInfo = {x:canvas.width/2, y:canvas.height/2, speed: 1, lives: 1, hitboxHeight: 37, hitboxWidth: 18, image: './img/pinkOne.png'};


//Bullet
let bulletArr = [];
let bulletInfo = {speed: 2, radius:12, image: './img/mushroomWeapon.png'};

//Monster
let monsterArr = [];
let monsterImageSrcArr = ['./img/Zombie.png', './img/Banshee.png', './img/Cursed armor.png', './img/Ghost.png', './img/Ghoul.png', './img/Lich.png', './img/Monster.png', './img/Skeleton.png'];
let monsterInfo = {x:canvas.width/2, y:canvas.height/2, speed: 0.8, hitboxHeight: 30, hitboxWidth: 25, image: null};

function keyDownHandler(e){
  if(e.key == "d" || e.key == "ArrowRight"){
      rightPressed = true;
  }
  else if (e.key == "a" || e.key == "ArrowLeft"){
      leftPressed = true;
  }
  else if (e.key == "w" || e.key == "ArrowUp"){
      upPressed = true;
  }
  else if (e.key == "s" || e.key == "ArrowDown"){
      downPressed = true;
  }
}


function keyUpHandler(e){
  if(e.key == "d" || e.key == "ArrowRight"){
      rightPressed = false;
  }
  else if (e.key == "a" || e.key == "ArrowLeft"){
      leftPressed = false;
  }
  else if (e.key == "w" || e.key == "ArrowUp"){
      upPressed = false;
  }
  else if (e.key == "s" || e.key == "ArrowDown"){
      downPressed = false;
  }
}

function Survivor(){
  this.x = survivorInfo.x;
  this.y = survivorInfo.y;
  this.speed = survivorInfo.speed;
  this.lives = survivorInfo.lives;
  this.hitboxHeight = survivorInfo.hitboxHeight;
  this.hitboxWidth = survivorInfo.hitboxWidth;
  this.image = survivorInfo.image;
}




function Bullet(){
  this.speed = bulletInfo.speed;
  this.radius = bulletInfo.radius;
  this.image = bulletInfo.image;
  this.x = survivor.x;
  this.y = survivor.y;
  this.dx = 1;
  this.dy = 1;
}

function Monster(){
  this.x = monsterInfo.x;
  this.y = monsterInfo.y;
  this.speed = monsterInfo.speed;
  this.lives = monsterInfo.lives;
  this.hitboxHeight = monsterInfo.hitboxHeight;
  this.hitboxWidth = monsterInfo.hitboxWidth;
  this.image = monsterInfo.image;
}

function addBullet(){
  let currMonster = monsterArr[0];
  let newBullet = new Bullet();

  if(currMonster != null){
    newBullet.dx = -newBullet.speed * (currMonster.x - survivor.x)/
      Math.pow(Math.pow(currMonster.x - survivor.x, 2) + Math.pow(currMonster.y - survivor.y, 2),0.5);

    newBullet.dy = -newBullet.speed * (currMonster.y - survivor.y)/
      Math.pow(Math.pow(currMonster.x - survivor.x, 2) + Math.pow(currMonster.y - survivor.y, 2),0.5) ;
  }

  bulletArr.push(newBullet);
}

function addMonster(){
  const newMonster = new Monster();
  
  //generate random EDGE position for the new monster
  let repMax = canvas.width*2 + canvas.height*2;
  let randPos = Math.random()*repMax;
  if(randPos < canvas.width){
    newMonster.x = randPos;
    newMonster.y = 0;
  }
  else if(randPos < canvas.width + canvas.height){
    newMonster.x = canvas.width;
    newMonster.y = randPos-canvas.width;
  }
  else if(randPos < canvas.width*2 + canvas.height){
    newMonster.x = randPos - canvas.width - canvas.height;
    newMonster.y = canvas.height;
  }
  else{
    newMonster.x = 0;
    newMonster.y = randPos - canvas.width*2 - canvas.height;
  }

  let type = monsterImageSrcArr.length;
  let newImage = monsterImageSrcArr[Math.floor(Math.random()*type)];
  newMonster.image = newImage;
  monsterArr.push(newMonster);
}



function drawSurvivor(){
  let survivorImage = new Image();
  survivorImage.src = survivor.image;
  ctx.beginPath();
  ctx.drawImage(survivorImage, survivor.x, survivor.y);
  ctx.closePath();
  

  if(rightPressed){
    survivor.x += survivor.speed;
    if(survivor.x> canvas.width){
      survivor.x = 0;
    }
  }

  if(leftPressed){
    survivor.x -= survivor.speed;
      if(survivor.x < 0){
        survivor.x = canvas.width;
      }
  }

  if(upPressed){
    survivor.y -= survivor.speed;
    if(survivor.y <0){
      survivor.y = canvas.height;
    }
  }

  if(downPressed){
    survivor.y += survivor.speed;
    if(survivor.y>canvas.height){
      survivor.y = 0;
    }
  }
}

function drawBullets(){
//draw current bullets
  ctx.beginPath();

  //remove out of screen bullets
  for(let i=0; i<bulletArr.length; i++){
    const currBullet = bulletArr[i];
    if(currBullet.x < 0 || currBullet.x > canvas.length 
      || currBullet.y <0 || currBullet.y > canvas.height){
        bulletArr.splice(i, 1);
      }
  }

  //detect bullet and monster collision
  for(let i=0; i<monsterArr.length; i++){
    const currMonster = monsterArr[i];
    for(let j=0; j<bulletArr.length; j++){
      const currBullet = bulletArr[j];
        if(currMonster.x + currMonster.hitboxWidth/2 >= currBullet.x - currBullet.radius &&
        currMonster.x - currMonster.hitboxWidth/2 <= currBullet.x + currBullet.radius &&
        currMonster.y + currMonster.hitboxHeight/2 >= currBullet.y - currBullet.radius &&
        currMonster.y - currMonster.hitboxHeight/2 <= currBullet.y + currBullet.radius){
          score++;
          document.getElementById("score").innerHTML = score;
          monsterArr.splice(i, 1);
          bulletArr.splice(j,1);
        }
    }
  }

  //draw the rest, valid bullets
  //then update the bullets locations
  for(let j=0; j<bulletArr.length; j++){
    const currBullet = bulletArr[j];
    let bulletImage = new Image();
    bulletImage.src = currBullet.image;
    ctx.drawImage(bulletImage, currBullet.x, currBullet.y);

    //update location
    currBullet.x -= currBullet.dx;
    currBullet.y -= currBullet.dy;
  }
  ctx.closePath();
}

function drawMonsters(){
  ctx.beginPath();

  // remove out of screen monsters
  for(let i=0; i<monsterArr.length; i++){
    const currMonster = monsterArr[i];
    if(currMonster.x + 2*currMonster.hitboxWidth< 0 || currMonster.x - 2*currMonster.hitboxWidth> canvas.length 
      || currMonster.y + 2*currMonster.hitboxHeight<0 || currMonster.y - 2*currMonster.hitboxHeight> canvas.height){
        monsterArr.splice(i, 1);
      }      
    
  }

  //detect collision between survivor and monster
  for(let i=0; i<monsterArr.length; i++){
    const currMonster = monsterArr[i];
    
      if(currMonster.x + currMonster.hitboxWidth/2 >= survivor.x - survivor.hitboxWidth/2 &&
      currMonster.x - currMonster.hitboxWidth/2 <= survivor.x + survivor.hitboxWidth/2 &&
      currMonster.y + currMonster.hitboxHeight/2 >= survivor.y- survivor.hitboxHeight/2 &&
      currMonster.y - currMonster.hitboxHeight/2 <= survivor.y + survivor.hitboxHeight/2){
        //decrease live and remove all monsters
        survivor.lives--;
        monsterArr.splice(0, monsterArr.length);
        if(survivor.lives<=0){
          alert("Game Over, and your score is: " + score);
          document.location.reload();
          clearInterval(interval);
        }
      }
  }

  //draw the monsters and update their position
  for(let j=0; j<monsterArr.length; j++){
    const currMonster = monsterArr[j];
    let currMonsterImage = new Image();
    currMonsterImage.src = currMonster.image;
    ctx.drawImage(currMonsterImage, currMonster.x, currMonster.y);

    //update location
    currMonster.x -= currMonster.speed*(currMonster.x-survivor.x)/Math.pow(Math.pow(currMonster.x-survivor.x,2) + Math.pow(currMonster.y - survivor.y, 2), 0.5)
    
    currMonster.y -= currMonster.speed*(currMonster.y-survivor.y)/Math.pow(Math.pow(currMonster.x-survivor.x,2) + Math.pow(currMonster.y - survivor.y, 2), 0.5)
  }
  ctx.closePath();
}

function drawLives(){
  ctx.beginPath();
  ctx.font = "20px Courier";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Lives: " + survivor.lives, 20, 20);
  ctx.closePath();
}

function drawScore(){
  ctx.beginPath();
  ctx.font = "20px Courier";
  ctx.fillStyle = "#ffffff"; 
  ctx.fillText("Score: " + score, canvas.width-130, 20);
  ctx.closePath();
}



function drawFram(){
  drawBackgroud('./img/forest.png');
  drawSurvivor();
  drawBullets();
  drawMonsters();
  drawLives();
  drawScore();
  isFinished();
}

//Initialization
let survivor = new Survivor();


//run game
// let interval = setInterval(drawFram, 10);
// setInterval(addBullet, 500);
// setInterval(addMonster, 450);