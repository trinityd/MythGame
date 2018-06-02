// Minigame 0
function checkDoneClearing() {
	loadPixels();
	let count = 0;
	for(let i = 0; i < pixels.length; i += 40) {
		if(red(pixels[i]) == 8) {
			count++;
		}
	}

	let perc = count / pixels.length*40;
	if(perc >= .099) {
		winGame(0);
	}
}