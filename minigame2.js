// Minigame 2
let headRightImg;
let headLeftImg;
let headImg;
let appleImg;
let apples = [];
let applesStolen;
let shot;

function updateMinigame2() {
	background(255);
	image(headImg, 0, height/2);
	if(apples.length == 0) winGame(2);
	for(let i = apples.length-1; i >= 0; i--) {
		if(apples[i].stolen) {
			if(!apples[i].offscreen && !moveThing(apples[i], apples[i].vector)) {
				apples[i].offscreen = true;
				applesStolen++;
				if(applesStolen == apples.length) {
					winGame(2);
					return;
				}
			}
		}
		apples[i].show();
	}
}

function rotateHead() {
	if(headImg == headRightImg) {
		headImg = headLeftImg;
	}
	else {
		headImg = headRightImg;
	}
	if(!inMainMenu) setTimeout(rotateHead, random(500, 2500))
}

function stealApple(x, y) {
	for(let i = 0; i < apples.length; i++) {
		if(apples[i].rect.contains(x, y)) {
			apples[i].stolen = true;
			push();
			translate(apples[i].point.x, apples[i].point.y);
			apples[i].vector = createVector(10, 0).rotate(random(TWO_PI));
			pop();
		}
	}
}

function moveThing(thing, vector) {
	if(thing.point.x+thing.width >= 0 && thing.point.x-thing.width < width && thing.point.y+thing.height >= 0 && thing.point.y-thing.height < height) {
		thing.point.x += vector.x;
		thing.point.y += vector.y;
		return true;
	}
	else {
		return false;
	}
}