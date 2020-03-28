let food, w, h;
let dx, dy;

// Start Game
let start = false;
let startBtn;
let startMsg = "PANDEMIC SIMULATOR\n\nA virus is on the loose!\n\nCollect all of the toilet paper for some reason!";

// Game Over
let endGame = false;
let restartBtn;

// Restart
let restart = false;

// Assets - Emoji
let cart = "🛒";
let toiletPaper = "🧻";
let flu = "🦠";
let emojiSize = 80;

// Ghost variables
let gx;
let gy;
let easing = 0.005;

// Score
let score = 0;
let m1 = "Well done! Your selfishness has ensured others will go without!";
let m2 = "What a brainless amount of toilet paper! Good job!";
let m3 = "Great work! You panic bought like an idiot!";
let m4 = "Superb! Now the elderly and those most vulnerable will perish!";
let winMsg = [m1, m2, m3, m4];

let s1 = "You are what you wipe!";
let s2 = "You must be stopped! Your details have been sent to the police!";
let s3 = "You're social status is now on par with a registered sex offender!";
let savageMsg = [s1, s2, s3];

// Sound
let soundFX;
let soundBtn;
let playSound = false;
let soundEmoji = playSound ? "🔈" : "🔇";
let fartArray;
let f1, f2, f3, f4, f5;
let cough;
let squelch;


function preload() {
  soundFormats("mp3");
  soundFX = loadSound("./sound/Escape");
  f1 = loadSound("./sound/fart_1");
  f2 = loadSound("./sound/fart_2");
  f3 = loadSound("./sound/fart_3");
  f4 = loadSound("./sound/fart_4");
  f5 = loadSound("./sound/fart_5");
  cough = loadSound("./sound/cough");
  squelch = loadSound("./sound/squelch");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  fartArray = [f1, f2, f3, f4, f5];

  soundBtn = createButton(soundEmoji);
  soundBtn.class("btn sound");
  soundBtn.position(width / 2 - soundBtn.size().width / 2, height / 6 + 325);

  startBtn = createButton("Start Hoarding!");
  startBtn.class("btn");
  startBtn.position(width / 2 - startBtn.size().width / 2, height / 6 + 225);

  gx = width - emojiSize / 2;
  gy = height - emojiSize / 2;

  dx = emojiSize / 2;
  dy = emojiSize / 2;
  w = floor(width - emojiSize / 2);
  h = floor(height - emojiSize / 2);
  foodLocation();
}

function foodLocation() {
  let x = floor(random(emojiSize / 2, w));
  let y = floor(random(emojiSize / 2, h));
  food = createVector(x, y);
}

function draw() {
  background(0);

  startBtn.mousePressed(begin);

  textSize(30);
  fill(255);
  text("🧻 " + score, width/2, 30);  

  textSize(emojiSize);
  textAlign(CENTER, CENTER);
  text(cart, dx, dy);

  if (start || restart) {
    if (mouseX <= 0) {
      dx = emojiSize / 2;
    } else if (mouseX >= width) {
      dx = width - emojiSize / 2;
    } else {
      dx = mouseX;
    }

    if (mouseY <= 0) {
      dy = emojiSize / 2;
    } else if (mouseY >= height) {
      dy = height - emojiSize / 2;
    } else {
      dy = mouseY;
    }
  }

  textSize(emojiSize);
  textAlign(CENTER, CENTER);
  text(toiletPaper, food.x, food.y);

  eat(dx, dy);

  ghost();

  gameStart();

  gameOver(dx, dy, gx, gy);
}

function eat(mx, my) {
  if (mx + emojiSize / 2 >= food.x - emojiSize / 2 &&
    mx - emojiSize / 2 < food.x + emojiSize / 2 &&
    my + emojiSize / 2 >= food.y - emojiSize / 2 &&
    my - emojiSize / 2 < food.y + emojiSize / 2) {

    if(playSound) {
      random(fartArray).play();
    }

    foodLocation();
    easing += 0.002;
    score++;
  }
}

function ghost() {
  if (start || restart) {
    let targetX = mouseX;
    let dx = targetX - gx;
    gx += dx * easing;

    let targetY = mouseY;
    let dy = targetY - gy;
    gy += dy * easing;
  }

  textSize(emojiSize);
  textAlign(CENTER, CENTER);
  text(flu, gx, gy);
}

function gameStart() {
  if (!start && !restart) {
    rectMode(CENTER);
    fill(0);
    rect(width / 2, height / 2, width, height);
    textSize(30);
    fill(255);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    text(startMsg, width / 2, height / 6, width, height / 2);

    soundBtn.mousePressed(toggleSound);
  }
}

function begin() {
  if (!endGame) {
    start = true;
    noCursor();
    startBtn.remove();
    soundBtn.hide();
  }
}

function gameOver(mx, my, gx, gy) {
  if (mx + emojiSize / 2 - 10 >= gx - emojiSize / 2 + 10 &&
    mx - emojiSize / 2 + 10 < gx + emojiSize / 2 - 10 &&
    my + emojiSize / 2 - 10 >= gy - emojiSize / 2 + 10 &&
    my - emojiSize / 2 + 10 < gy + emojiSize / 2 - 10) {

    start = false;
    endGame = true;

    if(playSound) {
      squelch.play();
      cough.play(); 
    }

    rectMode(CENTER);
    fill(0);
    rect(width / 2, height / 2, width, height);
    textSize(50);
    fill(255);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 6);
    textSize(30);
    text("YOUR SCORE: " + score, width / 2, height / 6 + 60);
    
    if(score <= 10) {
      text("Do you want to survive this pandemic or not?!", width / 2, height / 6 + 120);
    }
    else if(score > 10 && score <= 24) {
      text("Hmm, you only collected a rational amount of toilet paper.", width / 2, height / 6 + 120);
    }
    else if(score > 24 && score <= 50) {
      text(random(winMsg), width / 2, height / 6 + 120);
    } 
    else {
      text(random(savageMsg), width / 2, height / 6 + 120);
    }

    cursor(ARROW);
    noLoop();

    restartBtn = createButton("Try Again");
    restartBtn.class("btn");
    restartBtn.position(width / 2 - restartBtn.size().width / 2, height / 6 + 225);
    restartBtn.mousePressed(restartGame);

    soundBtn.show();
  }
}

function restartGame() {
  restart = true;
  restartBtn.remove();
  soundBtn.hide();
  easing = 0.005;
  score = 0;

  gx = width - emojiSize / 2;
  gy = height - emojiSize / 2;

  dx = emojiSize / 2;
  dy = emojiSize / 2;
  w = floor(width - emojiSize);
  h = floor(height - emojiSize);
  foodLocation();
  endGame = false;
  loop();
}

function toggleSound() {
  playSound = !playSound;

  if(playSound) {
    soundBtn.html("🔈");
    soundFX.loop();
  } else {
    soundBtn.html("🔇");
    soundFX.stop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}