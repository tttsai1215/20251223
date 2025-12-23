// 全域變數設定
let bgImg;
let playerImg;
let bossImg; // 魔王圖片變數
let npc1Img_idle, npc1Img_active;
let npc2Img_idle, npc2Img_active;
let npc3Img_idle, npc3Img_active; 
let npcHintImg_idle, npcHintImg_active; 

let player, npc1, npc2, npc3, npcHint, boss; 
let gameState = 'START'; 
let score = 0;
let gameTime = 120; // 2分鐘
let startTime;
let currentQuestion = null; 
let showHint = false; 
let hintUsed = false; 

// 特效變數
let particles = []; 
let fireworks = []; 
let feedbackMsg = ""; 
let feedbackTimer = 0; 
let shakeAmount = 0; 
let humiliationText = ""; 

// 題目資料庫
let questions = [
  { q: "p5.js 中，只執行一次的設定函式是？", a: "A. draw()", b: "B. setup()", c: "C. loop()", d: "D. create()", ans: "B", hint: "這是程式一開始跑的地方，用來設定畫布大小。" },
  { q: "要設定畫布大小的指令是？", a: "A. resizeCanvas()", b: "B. background()", c: "C. createCanvas()", d: "D. windowSize()", ans: "C", hint: "Create 創造 + Canvas 畫布。" },
  { q: "RGB 顏色模式中，(255, 0, 0) 代表什麼色？", a: "A. 紅色", b: "B. 綠色", c: "C. 藍色", d: "D. 白色", ans: "A", hint: "R 代表 Red，第一個數字是 R。" },
  { q: "下列哪個變數名稱是合法的？", a: "A. 2name", b: "B. var-name", c: "C. myName", d: "D. if", ans: "C", hint: "變數不能以數字開頭，也不能用保留字。" },
  { q: "在 JavaScript 中，宣告變數常用的關鍵字？", a: "A. int", b: "B. let", c: "C. dim", d: "D. float", ans: "B", hint: "現代 JS 常用 let 或 const。" },
  { q: "draw() 函式預設每秒執行幾次？", a: "A. 1次", b: "B. 30次", c: "C. 60次", d: "D. 100次", ans: "C", hint: "通常是 60 fps (影格/秒)。" },
  { q: "要畫一個圓形，應該用哪個指令？", a: "A. rect()", b: "B. line()", c: "C. ellipse()", d: "D. triangle()", ans: "C", hint: "Ellipse 是橢圓的意思。" },
  { q: "background(0) 會產生什麼顏色的背景？", a: "A. 白色", b: "B. 黑色", c: "C. 灰色", d: "D. 透明", ans: "B", hint: "0 代表沒有光，所以是全黑。" },
  { q: "console.log() 的功能是？", a: "A. 畫圖", b: "B. 在控制台印出訊息", c: "C. 彈出視窗", d: "D. 結束程式", ans: "B", hint: "Log 是紀錄的意思，通常用來除錯。" },
  { q: "if (score >= 60) 是什麼意思？", a: "A. 分數等於60", b: "B. 分數小於60", c: "C. 分數大於等於60", d: "D. 分數設定為60", ans: "C", hint: ">= 符號代表大於或等於。" },
  { q: "要產生一個隨機數字，可以用？", a: "A. random()", b: "B. noise()", c: "C. round()", d: "D. abs()", ans: "A", hint: "英文的隨機就是 Random。" },
  { q: "哪一個符號代表「邏輯與」(AND)？", a: "A. ||", b: "B. &&", c: "C. !", d: "D. ==", ans: "B", hint: "兩個 & 符號連在一起。" },
  { q: "for 迴圈通常用來做什麼？", a: "A. 宣告變數", b: "B. 判斷條件", c: "C. 重複執行程式碼", d: "D. 繪製圖形", ans: "C", hint: "當你需要重複做一件事很多次時使用。" },
  { q: "要改變圖形的填滿顏色，用哪個指令？", a: "A. stroke()", b: "B. noFill()", c: "C. fill()", d: "D. color()", ans: "C", hint: "Fill 就是填滿的意思。" },
  { q: "滑鼠的 X 座標變數是？", a: "A. x", b: "B. mouseX", c: "C. mX", d: "D. positionX", ans: "B", hint: "p5.js 內建變數，名稱很直觀，Mouse + X。" },
  { q: "要消除圖形的邊框，使用？", a: "A. noStroke()", b: "B. noFill()", c: "C. stroke(0)", d: "D. clean()", ans: "A", hint: "Stroke 是筆觸/邊框，no 代表不要。" },
  { q: "Array(陣列) 的索引是從多少開始？", a: "A. 1", b: "B. 0", c: "C. -1", d: "D. 隨機", ans: "B", hint: "電腦科學中，計數通常從零開始。" },
  { q: "text('Hello', 50, 50) 的作用是？", a: "A. 在座標(50,50)顯示文字", b: "B. 設定文字大小", c: "C. 讀取文字檔", d: "D. 刪除文字", ans: "A", hint: "這是一個繪製文字的指令。" },
  { q: "keyPressed() 函式什麼時候會執行？", a: "A. 滑鼠按下時", b: "B. 程式開始時", c: "C. 鍵盤按鍵被按下時", d: "D. 隨機執行", ans: "C", hint: "Key 代表鍵盤按鍵。" },
  { q: "哪一種資料型態代表真或假？", a: "A. String", b: "B. Number", c: "C. Boolean", d: "D. Object", ans: "C", hint: "布林值 (Boolean) 只有 True 或 False。" }
];

function preload() {
  try {
    bgImg = loadImage('bg.jpg'); 
    playerImg = loadImage('player.png');
    // ★ 這裡開啟了 boss.png 的讀取，請準備好這張圖！
    bossImg = loadImage('boss.png'); 
    
    npc1Img_idle = loadImage('npc1/idle.png');
    npc1Img_active = loadImage('npc1/active.png');
    npc2Img_idle = loadImage('npc2/idle.png');
    npc2Img_active = loadImage('npc2/active.png');
    npc3Img_idle = loadImage('npc3/idle.png');
    npc3Img_active = loadImage('npc3/active.png');
    npcHintImg_idle = loadImage('npchint/idle.png');
    npcHintImg_active = loadImage('npchint/active.png');
  } catch (e) { console.log("圖片讀取錯誤"); }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let i=0; i<20; i++){ particles.push(new Particle()); }
  resetGame();
}

function resetGame() {
  score = 0;
  gameState = 'START';
  fireworks = []; 
  
  // 角色初始化
  player = new Character(width * 0.1, height * 0.5, color(255, 0, 0), 'player'); 
  
  // 魔王初始化
  boss = new Enemy(width - 50, height/2);
  
  // NPC 位置
  npc1 = new NPC(width * 0.3, height * 0.2, color(0, 255, 0), 'question', npc1Img_idle, npc1Img_active);
  npc2 = new NPC(width * 0.7, height * 0.3, color(0, 0, 255), 'question', npc2Img_idle, npc2Img_active);
  npc3 = new NPC(width * 0.5, height * 0.8, color(255, 255, 0), 'question', npc3Img_idle, npc3Img_active);
  
  // 提示大師
  npcHint = new NPC(width - 120, height - 120, color(255, 0, 255), 'hint', npcHintImg_idle, npcHintImg_active);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (npcHint) {
    npcHint.x = width - 120;
    npcHint.y = height - 120;
  }
}

function draw() {
  push();
  if (shakeAmount > 0) {
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
    shakeAmount *= 0.9; 
  }

  // 背景
  if (bgImg) {
    image(bgImg, 0, 0, width, height);
  } else { 
    background(200, 230, 255); 
    fill(194, 178, 128); noStroke(); rect(0, height*0.2, width, height); 
  }

  // 背景粒子
  for(let p of particles){ p.update(); p.display(); }

  // 煙火
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) fireworks.splice(i, 1);
  }

  // 狀態機
  if (gameState === 'START') {
    drawStartScreen();
  } else if (gameState === 'PLAYING') {
    playGame();
  } else if (gameState === 'QUESTION') {
    drawQuestionScreen();
    // 答題時魔王顯示，讓他被凍住或看著你
    if(boss) boss.display(); 
  } else if (gameState === 'WIN') {
    drawWinScreen();
    if (frameCount % 15 === 0) { 
        fireworks.push(new Firework(random(width), height));
        if(frameCount % 30 === 0) shakeAmount = 2;
    }
  } else if (gameState === 'LOSE') {
    drawLoseScreen();
  }

  // 答題回饋
  if (feedbackTimer > 0) {
    drawFeedback();
    feedbackTimer--;
  }
  
  pop(); 
}

// --- 遊戲邏輯 ---

function playGame() {
  let elapsed = (millis() - startTime) / 1000;
  let remaining = gameTime - elapsed;
  if (remaining <= 0) gameLose("時間到了！");

  player.move(); player.display(); player.restrict();
  
  // 魔王 AI
  boss.update(player);
  boss.display();
  
  // 檢查被抓到
  if (boss.checkCollision(player)) {
     gameLose("被抓到了！");
  }

  npc1.update(player);
  npc2.update(player);
  npc3.update(player);
  npcHint.update(player);

  drawUI(remaining);

  if (score >= 5 && remaining > 0) gameState = 'WIN';
}

function gameLose(reason) {
  gameState = 'LOSE';
  let insults = ["太慢了吧！", "嫩！", "腳麻跑不動？", "快逃啊！", "笑死 0.0"];
  humiliationText = reason + "\n" + random(insults);
}

// --- 繪圖函式 ---

function drawUI(remaining) {
  push();
  fill(0, 180); noStroke(); rect(width - 180, 20, 160, 70, 15); 
  fill(255); textAlign(LEFT, TOP); textSize(20); textStyle(BOLD);
  let m = floor(remaining / 60); let s = floor(remaining % 60);
  text("⏳ 時間: " + nf(m, 2) + ":" + nf(s, 2), width - 165, 30);
  if(score >= 0) fill(100, 255, 100); else fill(255, 100, 100); 
  text("🏆 分數: " + score, width - 165, 60);
  pop();
}

function drawFeedback() {
  push();
  translate(width/2, height/2 - 100);
  let scaleSize = 1 + sin(frameCount * 0.5) * 0.2;
  scale(scaleSize);
  textAlign(CENTER, CENTER); textSize(80); textStyle(BOLD); stroke(0); strokeWeight(8); 
  if (feedbackMsg.includes("對")) fill(50, 255, 50); else fill(255, 50, 50); 
  text(feedbackMsg, 0, 0);
  pop();
}

function drawQuestionScreen() {
  fill(0, 0, 0, 200); rect(0, 0, width, height); 
  let boxW = 600; let boxH = 450; let boxX = width/2 - boxW/2; let boxY = height/2 - boxH/2;

  push();
  fill(255); stroke(50); strokeWeight(4); rect(boxX, boxY, boxW, boxH, 20); 
  noStroke(); fill(50); textAlign(CENTER, TOP); textSize(28); textStyle(BOLD);
  text("❓ 問題挑戰", width/2, boxY + 30);
  stroke(200); strokeWeight(2); line(boxX + 20, boxY + 70, boxX + boxW - 20, boxY + 70); noStroke();

  textAlign(LEFT, TOP); textSize(22); fill(0);
  text(currentQuestion.q, boxX + 50, boxY + 90, boxW - 100); 
  
  textSize(20); fill(80); let optY = boxY + 180;
  text(currentQuestion.a, boxX + 80, optY); text(currentQuestion.b, boxX + 80, optY + 40);
  text(currentQuestion.c, boxX + 80, optY + 80); text(currentQuestion.d, boxX + 80, optY + 120);
  
  fill(200, 50, 50); textSize(18); textAlign(CENTER);
  text("請按鍵盤 A / B / C / D 作答", width/2, boxY + 350);

  fill(0, 100, 200); text("💡 按 'H' 鍵請求提示 (扣1分)", width/2, boxY + 380);

  if (showHint) {
    fill(255, 140, 0); textStyle(BOLD); text("提示: " + currentQuestion.hint, width/2, boxY + 420);
  }
  pop();
}

function drawStartScreen() {
  background(30, 30, 60);
  textAlign(CENTER, CENTER); textSize(40); fill(255); textStyle(BOLD);
  let floatY = sin(frameCount * 0.05) * 10;
  text("🔥 程式設計：絕地大逃殺", width/2, height/3 + floatY);
  textSize(18); textStyle(NORMAL); textLeading(30); 
  text("【遊戲規則】\n1. 閃避魔王的追擊！被抓到就輸了！\n2. 尋找 NPC 回答問題，答對可讓魔王「凍結」5秒\n3. 答題時魔王會暫停，請把握機會\n4. 滿 5 分即可過關", width/2, height/2 + 20);
  
  let btnScale = 1 + sin(frameCount * 0.1) * 0.05; 
  push(); translate(width/2, height/2 + 150); scale(btnScale);
  fill(200, 50, 50); rectMode(CENTER); rect(0, 0, 180, 50, 25);
  fill(255); textSize(24); text("挑戰開始", 0, 0); pop();
}

function drawWinScreen() {
  fill(0, 0, 0, 50); rect(0, 0, width, height); 
  textAlign(CENTER, CENTER); textSize(60); textStyle(BOLD); fill(255, 215, 0); stroke(0); strokeWeight(4);
  let zoom = 1 + sin(frameCount * 0.1) * 0.1;
  push(); translate(width/2, height/2 - 50); scale(zoom); text("🎉 存活成功！", 0, 0); pop();
  fill(255); noStroke(); textSize(30); text("最終分數: " + score, width/2, height/2 + 60);
  fill(0, 255, 255); textSize(20); text("- 按下空白鍵再玩一次 -", width/2, height/2 + 120);
}

function drawLoseScreen() {
  background(50, 0, 0); 
  randomSeed(frameCount - (frameCount % 1000)); 
  textSize(80);
  for(let i=0; i<40; i++){
      fill(255, 255, 255, 50); text("👎", random(width), random(height));
  }
  textAlign(CENTER, CENTER); textSize(100); textStyle(BOLD); fill(255, 0, 0); stroke(255); strokeWeight(5);
  let shakeX = random(-5, 5); let shakeY = random(-5, 5);
  text(humiliationText, width/2 + shakeX, height/2 - 50 + shakeY);
  fill(255); noStroke(); textSize(30); text("最終分數: " + score, width/2, height/2 + 150);
  fill(200); textSize(20); text("- 按空白鍵重新做人 -", width/2, height/2 + 200);
}

// --- 控制與互動 ---
function mousePressed() {
  if (gameState === 'START') {
    if (dist(mouseX, mouseY, width/2, height/2 + 150) < 100) {
      gameState = 'PLAYING'; startTime = millis(); score = 0;
    }
  }
}

function keyPressed() {
  if (gameState === 'WIN' || gameState === 'LOSE') {
    if (key === ' ') { resetGame(); gameState = 'START'; return; }
  }
  if (gameState === 'QUESTION') {
    let k = key.toUpperCase();
    if (k === 'H') {
      if (!showHint) { showHint = true; if (!hintUsed) { score -= 1; hintUsed = true; } }
    }
    if (['A', 'B', 'C', 'D'].includes(k)) {
      if (k === currentQuestion.ans) {
        score += 2; 
        feedbackMsg = "答對了！凍結魔王！❄️"; 
        feedbackTimer = 90; shakeAmount = 10; 
        boss.freeze(300); // 凍結 300 幀 (約 5 秒)
        for(let i=0; i<8; i++) { fireworks.push(new Firework(random(width), height)); } 
      } else {
        score -= 1; 
        feedbackMsg = "答錯了！魔王暴走！🔥"; 
        feedbackTimer = 60; shakeAmount = 5; 
        boss.unfreeze();
      }
      gameState = 'PLAYING'; 
    }
  } else if (gameState === 'PLAYING') {
    if (key === ' ') { checkInteraction(); }
  }
}

function checkInteraction() {
  let npcs = [npc1, npc2, npc3, npcHint];
  for (let npc of npcs) {
    if (dist(player.x, player.y, npc.x, npc.y) < 150) {
      if (npc.type === 'question') {
        triggerQuestion(); player.x -= 30; 
      } else if (npc.type === 'hint') {
        alert("🔮 提示大師：\n按下 'H' 鍵，我會用心電感應給你提示！\n(代價是扣 1 分喔)");
      }
    }
  }
}

function triggerQuestion() {
  let idx = floor(random(questions.length)); currentQuestion = questions[idx];
  gameState = 'QUESTION'; showHint = false; hintUsed = false;
}

// --- 類別設計 ---

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1.2; 
    this.freezeTimer = 0;
    this.size = 100;
  }
  
  update(player) {
    if (this.freezeTimer > 0) {
      this.freezeTimer--;
      return; 
    }
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let angle = atan2(dy, dx);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // ★ 冰封特效邏輯 ★
    if (this.freezeTimer > 0) {
      // 1. 冰青色濾鏡 (Tint)
      tint(100, 200, 255); 
      
      // 2. 顫抖掙扎效果
      translate(random(-2, 2), random(-2, 2));
      
      // 顯示圖片或預設圖
      if (typeof bossImg !== 'undefined' && bossImg) {
        imageMode(CENTER);
        image(bossImg, 0, 0, this.size, this.size);
      } else {
        fill(100, 100, 255);
        ellipse(0, 0, this.size);
      }
      
      // 3. 繪製銳利的冰刺 (覆蓋在上面)
      noTint();
      stroke(255, 255, 255, 200);
      strokeWeight(3);
      fill(200, 240, 255, 120); // 半透明冰晶色
      
      // 畫幾個隨機的冰刺三角形
      beginShape();
      vertex(-this.size/2, -this.size/2);
      vertex(0, -this.size * 0.8);
      vertex(this.size/2, -this.size/2);
      vertex(this.size * 0.2, 0);
      endShape(CLOSE);
      
      beginShape();
      vertex(-this.size/2, this.size/2);
      vertex(-this.size * 0.7, 0);
      vertex(-this.size/2, -this.size/2);
      endShape(CLOSE);

      // 4. 冰封文字
      noStroke();
      fill(0, 255, 255);
      textAlign(CENTER);
      textSize(20);
      text("❄️ FROZEN ❄️", 0, -this.size/2 - 10);
      
    } else {
      // 正常追擊狀態
      noTint(); // 確保沒有顏色殘留
      let pulse = 1 + sin(frameCount * 0.2) * 0.1;
      scale(pulse);
      
      if (typeof bossImg !== 'undefined' && bossImg) {
        imageMode(CENTER);
        image(bossImg, 0, 0, this.size, this.size);
      } else {
        noStroke();
        for(let r = this.size; r > 0; r -= 10){
          fill(255, 0, 0, 50); ellipse(0, 0, r + random(-5, 5));
        }
        fill(0); ellipse(-20, -10, 10); ellipse(20, -10, 10); 
        noFill(); stroke(0); strokeWeight(3); arc(0, 20, 40, 20, PI, TWO_PI); 
      }
    }
    pop();
  }
  
  checkCollision(player) {
    if (this.freezeTimer > 0) return false;
    let d = dist(this.x, this.y, player.x, player.y);
    return d < (this.size/2 + 40); 
  }
  
  freeze(duration) { this.freezeTimer = duration; }
  unfreeze() { this.freezeTimer = 0; }
}

class Particle {
  constructor() {
    this.x = random(width); this.y = random(height);
    this.size = random(2, 6); this.speedX = random(-0.5, 0.5); this.speedY = random(-0.5, 0.5);
    this.alpha = random(50, 150);
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if(this.x < 0) this.x = width; if(this.x > width) this.x = 0;
    if(this.y < 0) this.y = height; if(this.y > height) this.y = 0;
  }
  display() { noStroke(); fill(255, 255, 255, this.alpha); ellipse(this.x, this.y, this.size); }
}

class Firework {
  constructor(x, y) {
    this.hu = random(255); this.firework = new FireworkParticle(x, y, this.hu, true);
    this.exploded = false; this.particles = [];
  }
  done() { return (this.exploded && this.particles.length === 0); }
  update() {
    if (!this.exploded) {
      this.firework.applyForce(createVector(0, 0.2)); this.firework.update();
      if (this.firework.vel.y >= 0) { this.exploded = true; this.explode(); }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(createVector(0, 0.1)); this.particles[i].update();
      if (this.particles[i].done()) { this.particles.splice(i, 1); }
    }
  }
  explode() {
    for (let i = 0; i < 150; i++) { 
      let p = new FireworkParticle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
      this.particles.push(p);
    }
  }
  show() { if (!this.exploded) this.firework.show(); for (let i = 0; i < this.particles.length; i++) this.particles[i].show(); }
}

class FireworkParticle {
  constructor(x, y, hu, firework) {
    this.pos = createVector(x, y); this.firework = firework; this.lifespan = 255; this.hu = hu; this.acc = createVector(0, 0);
    if (this.firework) { this.vel = createVector(0, random(-15, -10)); } else { this.vel = p5.Vector.random2D(); this.vel.mult(random(2, 12)); }
  }
  applyForce(force) { this.acc.add(force); }
  update() { if (!this.firework) { this.vel.mult(0.95); this.lifespan -= 2; } this.vel.add(this.acc); this.pos.add(this.vel); this.acc.mult(0); }
  done() { return this.lifespan < 0; }
  show() {
    colorMode(HSB); noStroke();
    if (!this.firework) { fill(this.hu, 255, 255, this.lifespan); ellipse(this.pos.x, this.pos.y, random(4, 8)); } else { fill(this.hu, 255, 255); ellipse(this.pos.x, this.pos.y, 8); }
    colorMode(RGB);
  }
}

class Character {
  constructor(x, y, c, type) {
    this.x = x; this.y = y; this.c = c; this.type = type; this.speed = 4; 
  }
  move() {
    if (keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW)) this.y += this.speed;
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
  }
  restrict() {
    this.x = constrain(this.x, 60, width - 60); this.y = constrain(this.y, 60, height - 60);
  }
  display() {
    let floatY = sin(frameCount * 0.1) * 3; 
    if (typeof playerImg !== 'undefined' && playerImg) {
      imageMode(CENTER); image(playerImg, this.x, this.y + floatY, 120, 120); imageMode(CORNER);
    } else {
      fill(this.c); noStroke(); ellipse(this.x, this.y + floatY, 60, 60);
    }
  }
}

class NPC {
  constructor(x, y, c, type, imgIdle, imgActive) {
    this.x = x; this.y = y; this.c = c; this.type = type;
    this.imgIdle = imgIdle; this.imgActive = imgActive; this.isNearby = false;
  }
  update(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    this.isNearby = (d < 150); this.display();
    if (this.isNearby) {
      fill(255); stroke(0); strokeWeight(1);
      rect(this.x - 50, this.y - 100, 100, 30, 10); 
      fill(0); noStroke(); textAlign(CENTER, CENTER); textSize(14);
      text("空白鍵對話", this.x, this.y - 85);
    }
  }
  display() {
    imageMode(CENTER);
    let currentImg = this.isNearby ? this.imgActive : this.imgIdle;
    let floatY = sin(frameCount * 0.08 + this.x) * 3; 
    if (typeof currentImg !== 'undefined' && currentImg) {
      let scaleSize = this.isNearby ? 140 : 120;
      image(currentImg, this.x, this.y + floatY, scaleSize, scaleSize); 
    } else {
      fill(this.c); rect(this.x - 30, this.y - 30 + floatY, 60, 80);
    }
    imageMode(CORNER);
  }
}