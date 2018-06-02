// Minigame 1
let arrows = [];
let healthBar;
let totalHP = 300;
let boarImg;
let boar;
let boarxvel, boaryvel;
let arrowImg;

function updateMinigame1() {
	background(255);
	healthBar.show();
	image(boarImg, boar.x - boarImg.width/2, boar.y - boarImg.height/2);
	moveBoar();
	showArrows();
}

function moveBoar() {
	boar.x += boarxvel;
	boar.y += boaryvel;
	if(boar.x <= 0 || boar.x >= width) boarxvel*=-1;
	if(boar.y <= 0 || boar.y >= height) boaryvel*=-1;
}

function shootArrow(x, y) {
	if(shot >= 10) {
		arrows[0].reset();
		arrows.shift();
	}
	else shot++;
	arrows.push(new Thing(new Point(x,y), arrowImg));
}

function showArrows() {
	for(let i = 0; i < arrows.length; i++) {
		if(arrows[i].width >= 30) arrows[i].resize(.95);
		else if(arrows[i].hit && !arrows[i].checked && boar.contains(arrows[i].point.x, arrows[i].point.y)) {
			healthBar.width -= totalHP/6;
			arrows[i].checked = true;
			if(healthBar.width <= 10) {
				winGame(1);
				return;
			}
		}
		else arrows[i].hit = false;
		arrows[i].show();
	}
}