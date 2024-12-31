const canvas = document.getElementById("canvy");
const ctx = canvas.getContext("2d");

const canvasWidth = 800;
const canvasHeight = 550;
const canvasHalfWidth = canvasWidth/2;
const canvasHalfHeight = canvasHeight/2;

const scale = 2;
canvas.width = canvasWidth * 2;
canvas.height = canvasHeight * 2;
var backgroundRefractIndex = 1;
var draw = false;
var mouseIsDown = false;
const levelEditor = new LevelEditor();
const objectEditor = levelEditor.objectEditor;
const objects = levelEditor.objects;
const controller = new Controller();
const description = document.getElementById("description");

const imageURLS = {
	"piggy": ["../images/piggy.png", "../images/piggyhover.png", "../images/piggyselected.png", "../images/piggyhoverdelete.png", "../images/piggy2.png", "../images/piggy2hover.png", "../images/piggy2selected.png", "../images/piggy2hoverdelete.png"]
}
const sprites = {
	"piggy": []
}
const promises = [];
for (const [name, urls] of Object.entries(imageURLS)) {
	for(let i = 0; i<urls.length; i++) {
		let promise1 = new Promise((resolve, reject) => {
			let url = urls[i];
			let img = new Image();
			img.onload = e => resolve([img, name, i]);
			img.onerror = e => reject(url);
			img.src = url;
		});
		promises.push(promise1);
		
		promise1.then(
			(info) => {
				sprites[info[1]][info[2]] = info[0];
				},
			(url) => {
				console.log(url);
				}
		);
	}
}

ctx.scale(scale, scale);

canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";

var mirror = new Mirror(350,350,30,60);
var mirror2 = new Mirror(350,450,30,80);
var piggy = new Piggy(150,150, 0);
var mirror3 = new Mirror(450,250,-20,30);
var mirror4 = new Mirror(200,300,-45,70);
var colorPanel = new ColoredPanel(600,100,0,50, "red", "subtract");
var colorPanel2 = new ColoredPanel(600,150,0,50, "green", "add");
var colorPanel3 = new ColoredPanel(600,200,0,50, "blue", "equal");
var colorPanel4 = new ColoredPanel(600,250,0,50, "cyan", "equal");
var colorPanel5 = new ColoredPanel(600,300,0,50, "magenta", "add");
var colorPanel6 = new ColoredPanel(600,350,0,50, "yellow", "subtract");
var colorPanel7 = new ColoredPanel(200,100,0,50, "green", "subtract");
var colorPanel8 = new ColoredPanel(300,100,0,50, "red", "subtract");
var glass = new TransparentBlock(350, 200, 45, 100, 100);
var flashlight = new Flashlight(100,100,0);

var defaultLevel = [mirror, mirror2, piggy, mirror3, mirror4, colorPanel, colorPanel2, colorPanel3, colorPanel4, colorPanel5, colorPanel6, colorPanel7, colorPanel8, glass, flashlight];

for(let i = 0; i<defaultLevel.length; i++) {
	levelEditor.addObject(defaultLevel[i]);
}

flashlight.toggle(true);
levelEditor.updateFlashlights();

canvas.addEventListener("mousemove", mouseOver);
canvas.addEventListener("click", mouseClick);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mouseleave", mouseExit);
canvas.addEventListener("keydown", keyDown);
canvas.addEventListener("keyup", keyUp);
canvas.addEventListener("mouseenter", mouseEnter);


function switchMode(mode) {

	switchPanel("addPanel");
	
	levelEditor.switchMode(mode);
	let activeButton = document.querySelector(".menubar .active");
	if(activeButton !== null) {
		activeButton.classList.remove("active");
	}

	document.getElementById(mode + "button").classList.add("active");
	
	canvas.focus();

}

function switchPanel(panelID) {
	let currentPanel = document.querySelector(".innerPanel.active");
	currentPanel.classList.remove("active");
	let newPanel = document.getElementById(panelID);
	newPanel.classList.add("active");

	if(panelID == "exportPanel") {
		exportLevel();
		importStatusClear();
	}
}

function setAddObjectType(type, buttony) {
	
	levelEditor.setAddObjectType(type);
	let activeButton = document.querySelector(".button-selection .active");
	let name = document.getElementById("objectName");
	let desc = document.getElementById("objectDescription");
	
	if(activeButton !== null) {
		activeButton.classList.remove("active");
	}

	if(activeButton == buttony) {
		switchMode("edit");
		activeButton = null;
		name.textContent = "";
		objectDescription.textContent = objectDescriptions["Default"];
	} else {
		switchMode("add");
		buttony.classList.add("active");
		description.style.display = "block";
		name.textContent = type;
		objectDescription.textContent = ": " + objectDescriptions[type];
	}

	canvas.focus();

}

function updateLevel() {
	levelEditor.updateFlashlights();
}

function clearLevel() {
	levelEditor.deleteAllObjects();
}

function resetLevel() {
	if(confirm("Are you sure?")) {
		clearLevel();
	}
}

function mouseOver(event) {
	
	let canvasRect = canvas.getBoundingClientRect();
	let mouseX = event.clientX - canvasRect.left;
	let mouseY = event.clientY - canvasRect.top;

	levelEditor.mouseOver(mouseX, mouseY);

	if(mouseIsDown) {
		levelEditor.updateFlashlights();
		draw = true;
	}
	
	previousMouseX = mouseX;
	previousMouseY = mouseY;
}

function mouseClick(event) {
	
	let canvasRect = canvas.getBoundingClientRect();
	let mouseX = event.clientX - canvasRect.left;
	let mouseY = event.clientY - canvasRect.top;
	
	levelEditor.mouseClick(mouseX, mouseY);
	
	levelEditor.updateFlashlights();
	draw = true;
}

function mouseDown(event) {
	
	let canvasRect = canvas.getBoundingClientRect();
	let mouseX = event.clientX - canvasRect.left;
	let mouseY = event.clientY - canvasRect.top;

	levelEditor.mouseDown(mouseX, mouseY);

	levelEditor.updateFlashlights();

	mouseIsDown = true;
	draw = true;
}

function mouseUp(event) {
	levelEditor.mouseUp();
	mouseIsDown = false;
	draw = true;
}


function mouseExit(event) {
	levelEditor.mouseExit();
	mouseIsDown = false;
	draw = true;
}

function mouseEnter(event) {
	if(levelEditor.mode == "add") {
		canvas.focus();
	}
}

function keyDown(event) {
	
	controller.keyDown(event.key);
}

function keyUp(event) {
	
	controller.keyUp(event.key);
}

function drawScreen() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	levelEditor.drawLasers();

	for(let i = 0; i<objects.length; i++) {
		objects[i].drawObject(levelEditor.mode);
	}

	if(objectEditor.hasSelectedObject) {
		objectEditor.draw();
	}
	
	if(levelEditor.objectToAdd !== null && document.activeElement == canvas) {
		ctx.globalAlpha = 0.75;
		levelEditor.objectToAdd.draw();
		ctx.globalAlpha = 1;
	}
	draw = false;
}



function update(timestamp) {
	window.requestAnimationFrame(update);
	
	controller.updateKeysDown();
	
	if(draw) {
		drawScreen();
	}

}

async function start() {
	await Promise.all(promises);
	drawScreen();
	window.requestAnimationFrame(update);
}

start();
