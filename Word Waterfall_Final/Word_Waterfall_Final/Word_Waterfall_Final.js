
/**A3 Sketch
* Inspired by "bit.fall" at MONA, Hobart. Installation by Julius Popp
* text falls down like a waterfall; mouse press disperses points into a new word
* words that remind me of Tasmania/Home
* VSC Used to troubleshoot code and assist in how to achieve certain ideas


* SETUP-->Generate points for 'Home' -->Create Particle-->Particles Fall-->mousePressed()-->
* Chooses New Word-->Particles Move Towards Text Points-->Word is Shown-->Particles Fall Again-->Repeat
*/

// Three different states for each group - Fall, Explode ToTarget
//Global variables

let myFont;
let particles = []; //Partical Array
let numColumns = 60; // number of vertical columns 
let sampleF; // how many points make the text
let currentWord = 'Home';
let fontSize = 450;
let wordList = ['Home','Sea','Wild','Calm','Fresh', 'Slow', 'Roam', 'Crisp', 'Coast', ];

//BLUEPRINT FOR EVERY PARTICLE, EACH PARTICLE BEHAVES INDEPENDENTLY
class Particle { // using individual particles rather than shapes
  constructor(x, y) { // RUNS WHEN NEW PARTICLE IS MADE
    this.baseX = x; // coordinates that form the letters
    this.baseY = y;
    this.reset(); // STARTING MOVEMENT POSITION
  }
reset() { // returning to falling state
    // random starting position snapped to columns
    let colIndex = floor(random(numColumns)); // choose a random column to fall
    let colSpacing = width / numColumns; // calculate space between columns 
    this.columnX = colIndex * colSpacing + colSpacing / 2; // in the middle of columns
    this.x = this.columnX; // starts in the column
    this.y = random(-height, 2); // starts above the screen 
//Velocity 
    this.vx = 0; // horizontal speed
    this.vy = random(2, 5); // vertical / falling speed
    this.size = random(4, 10); // random size
    this.state = 'fall'; // particles begin to fall - controls behaviour
}

  update() { // runs every frame 
  
 // STATE NO.1 - Fall
  
  if (this.state === 'fall') { // falling state
      this.y += this.vy; // moves downwards
  if (this.y > height + 20) { // when particle leaves screen, reset to top of screen
        this.y = random(-200, -50);
        this.x = this.columnX; // snap back to column
        this.vx = 0;
}
} 
 
 // STATE NO.2 - Explode
 
 else if (this.state === 'explode') { // fly outwards using velocity
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.4; // pulls points down
      this.vx *= 0.99; // gradually slow horizontal movement
   if (abs(this.vx) < 0.1 && abs(this.vy) < 0.5) { // ending explosion sequence, when movement becomes small...
        this.state = 'toTarget'; // TextToPoint, points start forming word
 }
 } 
 
 // STATE NO.3 - toTarget
 
 else if (this.state === 'toTarget') { // points make text, using lerp for smoother motion
      this.x = lerp(this.x, this.baseX, 0.05); // lerp means points move 5% closer each frame, horizontally
      this.y = lerp(this.y, this.baseY, 0.08); // 8% closer vertically each frame
   if (dist(this.x, this.y, this.baseX, this.baseY) < 0.5) { // once there, measure distance 
        this.state = 'fall'; // once word made, return to fall state
        this.x = this.columnX;
        this.vy = random(2, 5);
}}}

  draw() {
    fill(255, 255, 255, 100); // semi transparent, white
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
}
}

function preload() {
  myFont = loadFont('data/Graphik-Medium-Trial.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sampleF = 0.1; // point density 
  initializeParticlesForWord(currentWord); // creating points for 'Home'
}

// MAIN DRAW LOOP

function draw() {
  background(10);
  particles.forEach(p => { // loops through all particles
    p.update(); // moves and shows each point
    p.draw();
  });
}

//CENTERING TEXT

function getCenteredTextPoints(word) { // converting text into coordinates 
  const bounds = myFont.textBounds(word, 0, 0, fontSize)// identify width and height
  const x = width / 2 - bounds.w / 2; // center horiztonally
  const y = height / 2 + bounds.h / 2; // center vertically
  return myFont.textToPoints(word, x, y, fontSize, { // turns word into individual particles
    sampleFactor: sampleF,
    simplifyThreshold: 0
  });
}

// THIS FUNCTION MAKES SURE THERE IS ENOUGH PARTICLES FOR EACH WORD

function initializeParticlesForWord(word) { 
  const pts = getCenteredTextPoints(word); // gathers all coordinates

  while (particles.length < pts.length) { //if there aren't enough particles...
    const pt = pts[particles.length];
    particles.push(new Particle(pt.x, pt.y)); // create more particles
  }

  particles.forEach((particle, index) => {
    const pt = pts[index % pts.length];
    particle.baseX = pt.x; // each particle has a destination
    particle.baseY = pt.y;

    if (particle.state === 'fall') {
      particle.x = particle.columnX;
      particle.y = random(-height, height);
}
});
}

function mousePressed() {
  let next = currentWord;
  while (next === currentWord) { // prevents the repeating of the same word
    next = random(wordList);
}
  currentWord = next;

  const newPts = getCenteredTextPoints(currentWord); // coordinates for new word

  setTimeout(() => { // wait 450 miliseconds before reforming
    particles.forEach((particle, index) => {
      const pt = newPts[index % newPts.length];
      particle.baseX = pt.x; // new letter positions
      particle.baseY = pt.y;
      particle.state = 'toTarget'; // points move into new word
    });
  }, 450);
}

//FALLING POINTS/COLUMNS ADJUST WHEN WINDOW RESIZES

function updateParticleColumns() {
  const colSpacing = width / numColumns; // updating spacing calculations
  particles.forEach(particle => {
    const colIndex = floor(random(numColumns));
    particle.columnX = colIndex * colSpacing + colSpacing / 2; // new waterfall coordinates
    if (particle.state === 'fall') {
      particle.x = particle.columnX;
      particle.y = random(-height, height);
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateParticleColumns();
  initializeParticlesForWord(currentWord);
}

function keyPressed() {
  if (key === 's') {
    saveGif('Word_Waterfall',10);
  }
}
