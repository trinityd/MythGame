let gameDivID = 'canvas';
let canvasWidth = 600;
let canvasHeight = 400;

function preload() {
	boarImg = loadImage('Assets/Pics/boar.png');
	arrowImg = loadImage('Assets/Pics/arrow.png');
	headRightImg = loadImage('Assets/Pics/headRight.png');
	headLeftImg = loadImage('Assets/Pics/headLeft.png');
	appleImg = loadImage('Assets/Pics/apple.png');
}

function setup() {
	$('#' + gameDivID).width(canvasWidth);
	$('#' + gameDivID).height(canvasHeight);
	let canvas = createCanvas(canvasWidth, canvasHeight);
	canvas.parent(gameDivID);

	// Minigame 1
	healthBar = new Rectangle(width/2, 20, totalHP, 30, 'green', true);
	boar = new Rectangle(width/2 + random(- 10, 10), height/2 + random(-10, 10), boarImg.width, boarImg.height, 'black');
	boarxvel = random(3, 5);
	boaryvel = random(3, 5);

	// Minigame 2
	headImg = headRightImg;

	mainMenu();
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Rectangle {
	constructor(x, y, width, height, color, fill=false) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.fill = fill;
	}

	show() {
		if(this.fill) {
			fill(this.color);
		}
		else {
			noFill();
			stroke(this.color);
		}
		rect(this.x, this.y, this.width, this.height);
		noStroke();
		noFill();
	}

	contains(x, y) {
		return x >= this.x - this.width/2 && x < this.x + this.width/2 && y >= this.y - this.height/2 && y < this.y + this.height/2;
	}
}

class Thing {
	constructor(point, img, width=200, height=200, rect=0)
	{
		this.point = point;
		this.img = img;
		this.width = width;
		this.height = height;
		this.hit = true;
		this.checked = false;
		this.rect = rect;
		this.offscreen = false;
	}

	updateRect() {
		this.rect.x = this.point.x + this.img.width/2;
		this.rect.y = this.point.y + this.img.height/2;
	}

	show() {
		image(this.img, this.point.x, this.point.y, this.width, this.height);
		if(this.rect != 0) this.updateRect();
	}

	resize(perc) {
		this.width *= perc;
		this.height *= perc;
	}

	reset() {
		this.width = arrowImg.width;
		this.height = arrowImg.height;
	}
}

let inMainMenu = true;
let options;
let gameSelected = -1;
let wonGames = [false, false, false];
function mainMenu() {
	inMainMenu = true;
	gameSelected = -1;
	loadingGame = true;
	rectMode(CORNER);
	let mainMenuColor = '#C4BCAB';
	fill(mainMenuColor);
	let mainMenuBox = rect(0, 0, width, height);

	textSize(height/15);
	textStyle(BOLD);
	textAlign(CENTER);
	textFont('AncientGeek');
	fill('black');
	text('Perform three labors to\n be forgiven for your crimes,\n young Hercules.', width/2, height/6);

	rectMode(CENTER);
	noFill();
	let optionWidth = 160;
	let optionHeight = 40;
	let numOptions = 3
	let optionSpacing = 10 + optionHeight;
	options = []
	for(let i = 0; i < 3; i++) {
		options.push(new Rectangle(width/2, height/2 + i*optionSpacing, optionWidth, optionHeight, 'black'));
		options[i].show();
	}

	textStyle(BOLD);
	textAlign(CENTER);
	textFont('AncientGeek');
	fill('black');

	let offset = optionHeight/6;
	textSize(optionHeight/2);
	text('Poo Cleaning', options[0].x, options[0].y + offset);
	textSize(optionHeight/2.2);
	text('Boar Capturing', options[1].x, options[1].y + offset);
	textSize(optionHeight/2.2);
	text('Apple Stealing', options[2].x, options[2].y + offset);
	for(let i = 0; i < 3; i++) {
		if(wonGames[i]) {
			fill('green');
			textSize(optionHeight);
			text('✓', options[i].x + options[i].width/2, options[i].y);
		}
	}
}

function keyPressed() {
	if(keyCode === ESCAPE) {
		mainMenu();
	}
	else if(keyCode === BACKSPACE) {
		winGame(gameSelected);
	}
	else if(gameSelected == 0) {
		if(keyCode === ENTER) {
			checkDoneClearing();
		}
	}
}

function mousePressed() {
	if(inMainMenu) {
		for(let i = 0; i < options.length; i++) {
			if(options[i].contains(mouseX, mouseY)) {
				gameSelected = i;
				inMainMenu = false;
				startGame(gameSelected);
				break;
			}
		}
	}
	else if(gameSelected == 1) {
		shootArrow(mouseX - 15, mouseY - 15);
	}
	else if(gameSelected == 2) {
		if(headImg != headRightImg) stealApple(mouseX, mouseY);
	}
}

function startGame(idx) {
	if(idx == 0) {
		background(137, 81, 8);
	}
	else if(idx == 1) {
		shot = 0;
		background(255);
		boarImg.resize(100, 0);
		boar.width = boarImg.width-10;
		boar.height = boarImg.height-10;
	}
	else if(idx == 2) {
		applesStolen = 0;
		appleImg.resize(80, 0);
		for(let i = 0; i < 20; i++) {
			let x = random(200, width-appleImg.width);
			let y = random(height-appleImg.height);
			apples.push(new Thing(new Point(x, y), appleImg, appleImg.width, appleImg.height, new Rectangle(x + appleImg.width/2, y + appleImg.width/2, appleImg.width, appleImg.height, 'black')));
		}
		rotateHead();
	}
}

function winGame(idx) {
	if(idx == 1) arrows = [];
	else if(idx == 2) apples = [];
	if(idx >= 0) wonGames[idx] = true;
	mainMenu();
}

function draw() {
	if(gameSelected == 0) {
		if(mouseIsPressed) {
			fill(8, 105, 137);
			ellipse(mouseX, mouseY, 60);
		}
	}
	else if(gameSelected == 1) {
		updateMinigame1();
	}
	else if(gameSelected == 2) {
		updateMinigame2();
	}
}