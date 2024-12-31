
const ObjectProperties = {
	"Default": {
		"changeable": [
			{"name": "X", "type": "Number"},
			{"name": "Y", "type": "Number"}
		]
	},
	"DefaultRectangle": {
		"changeable": [
			{"name": "X", "type": "Number"},
			{"name": "Y", "type": "Number"},
			{"name": "Half Width", "type": "Number"},
			{"name": "Half Height", "type": "Number"}
		]
	},
	"DefaultCircle": {
		"changeable": [
			{"name": "X", "type": "Number"},
			{"name": "Y", "type": "Number"},
			{"name": "Radius", "type": "Number"}
		]
	},
	"Flashlight": {
		"changeable": [
			{"name": "On or Off", "type": "Button"},
			{"name": "X", "type": "Number"},
			{"name": "Y", "type": "Number"}
		],
		"toggleable": [
			{"name": "isOn", "changeFunction": "toggle", "values": [false, true]},
		]
	},
	"Mirror": {
		"changeable": [
			{"name": "X", "type": "Number"},
			{"name": "Y", "type": "Number"},
			{"name": "Half Width", "type": "Number"},
			{"name": "Half Height", "type": "Number"}
		]
	},
	"Black Box": {
		"changeable": [
			{"name": "X", "type": "Number"},
			{"name": "Y", "type": "Number"},
			{"name": "Half Width", "type": "Number"},
			{"name": "Half Height", "type": "Number"}
		]
	},
	"Colored Panel": {
		"changeable": [
			{"name": "Color", "type": "Button"},
			{"name": "Color Mode", "type": "Button"},
			{"name": "X", "type": "Number"},
			{"name": "Y", "type": "Number"},
			{"name": "Half Width", "type": "Number"},
			{"name": "Half Height", "type": "Number"}
		],
		"toggleable": [
			{"name": "color", "changeFunction": "changeColor", "values": ["red", "green", "blue", "cyan", "magenta", "yellow"]},
			{"name": "colorMode", "changeFunction": "changeColorMode", "values": ["subtract", "add", "equal"]}
		]
	},
	"Transparent Block": {
		"changeable": [
			{"name": "Refractive Index", "type": "Number"},
			{"name": "X", "type": "Number"},
			{"name": "Y", "type": "Number"},
			{"name": "Half Width", "type": "Number"},
			{"name": "Half Height", "type": "Number"}
		]
	},
	"Piggy": {
		"changeable": [
			{"name": "X", "type": "Number"},
			{"name": "Y", "type": "Number"},
			{"name": "Radius", "type": "Number"}
		]
	}
}



class InteractiveObject {
	constructor(type = "Interactive Object", x, y, rotation, diagonal, shape) {
		this.x = x;
		this.y = y;
		this.hover = false;
		this.selected = false;
		this.rotation = rotation * 2*Math.PI / 360;
		if(diagonal == 0) {
			alert("width and height cannot be 0");
		}
		this.diagonal = diagonal;
		this.type = type;
		this.shape = shape;
	}
	
	moveTo(x, y) {
		this.x = x;
		this.y = y;
	}
	
	rotate(angle) {
		this.rotation = angle;
	}
	
	rotateBy(angle) {
		if(this.rotation > Math.PI*2) {
			this.rotation -= Math.PI*2;
		} else if(this.rotation < -Math.PI*2) {
			this.rotation += Math.PI*2;
		}
		this.rotate(this.rotation + angle);
	}
	
	collide(rayX, rayY, rayDirectionX, rayDirectionY, exiting, otherRefractiveIndex) {
		return {"collided": false};
	}

	changeRayColor() {
		return [0, 0, 0];
	}

	drawPath() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.diagonal, 0, Math.PI*2);
		ctx.closePath();
	}

	drawObject(mode = "edit") {
		if(this.hover || this.selected) {
			this.drawOutline(mode, 10);
		}
		this.draw();
	}

	draw(fillColor = "#ff90ff", strokeColor = "#ff00ff", fillStrokeOrder = 1, strokeWidth = 4) {
		
		ctx.fillStyle = fillColor;
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = strokeWidth;
		this.drawPath();
		
		if(fillStrokeOrder == -1) {
			ctx.fill();
			ctx.stroke();
		} else {
			ctx.stroke();
			ctx.fill();
		}
	}
	
	drawOutline(mode, strokeWidth, color = "default") {
		
		this.drawPath();
		
		if(color == "default") {
			if(this.hover && mode == "edit") {
				ctx.strokeStyle = "white";
			} else if(this.hover && mode == "delete") {
				ctx.strokeStyle = "red";
			} else {
				ctx.strokeStyle = "rgba(161, 233, 255, 0.8)";
			}
		} else {
			ctx.strokeStyle = color;
		}
		
		ctx.lineWidth = strokeWidth;
		ctx.stroke();

	}
	
	mouseOver(mouseX, mouseY) {
		if(!this.hover && this.pointIntersects(mouseX, mouseY)) {
			this.hover = true;
		} else if(this.hover && !this.pointIntersects(mouseX, mouseY)) {
			this.hover = false;
		}
		return this.hover;
	}
	
	mouseClick(mouseX, mouseY) {
		if(this.pointIntersects(mouseX, mouseY)) {
			this.selected = true;
			return true;
		}
	}
	
	pointIntersects(x, y) {
		
		return Helper.circleContains(x, y, this.x, this.y, this.diagonal);
		
	}
	
	exportData() {
		return {
			"type": this.type,
			"type": this.type,
			"x": this.x,
			"y": this.y,
			"rotation": this.rotation,
			"diagonal": this.diagonal,
			"shape": this.shape
		};
	}

}

class RectangularObject extends InteractiveObject {
	constructor(type = "Rectangular Object", x, y, rotation, halfWidth, halfHeight) {
		super(type, x, y, rotation, Math.sqrt(halfWidth * halfWidth + halfHeight * halfHeight), "Rectangle");
		this.unMouseX = 0;
		this.unMouseY = 0;
		this.maxHalfWidth = canvasHalfWidth + 20;
		this.maxHalfHeight = canvasHalfHeight + 20;
		this.minHalfWidth = 25;
		this.minHalfHeight = 5;

		if(halfWidth > this.maxHalfWidth) {
			halfWidth = this.maxHalfWidth;
		}
		if(halfWidth < this.minHalfWidth) {
			halfWidth = this.minHalfWidth;
		}

		if(halfHeight > this.maxHalfHeight) {
			halfHeight = this.maxHalfHeight;
		}
		if(halfHeight < this.minHalfHeight) {
			halfHeight = this.minHalfHeight;
		}

		this.halfWidth = halfWidth;
		this.halfHeight = halfHeight;
		this.longSide = Math.max(this.halfWidth, this.halfHeight);
		this.corners = [[0, 0] [1, 0], [1, 1], [0, 1]];
		
		if(halfWidth == 0 || halfHeight == 0) {
			alert("width and height cannot be 0");
		}
		this.cornerAngle = Math.atan(halfHeight/halfWidth);
		this.createCorners();
		
	}
	
	createCorners() {
		let x1 = Math.cos(this.rotation + this.cornerAngle) * this.diagonal;
		let y1 = Math.sin(this.rotation + this.cornerAngle) * this.diagonal;
		let x2 = Math.cos(this.rotation - this.cornerAngle) * this.diagonal;
		let y2 = Math.sin(this.rotation - this.cornerAngle) * this.diagonal;
		
		this.corners = [[x1, y1], [x2, y2], [-x1, -y1], [-x2, -y2]];
	}
	
	resizeBy(dw, dh) {
		this.resize(this.halfWidth+dw, this.halfHeight+dh);
	}
	
	resize(halfWidth, halfHeight) {
		if(halfWidth < this.minHalfWidth) {
			halfWidth = this.minHalfWidth;
		}
		if(halfWidth > this.maxHalfWidth) {
			halfWidth = this.maxHalfWidth;
		}
		if(halfHeight < this.minHalfHeight) {
			halfHeight = this.minHalfHeight;
		}
		if(halfHeight > this.maxHalfHeight) {
			halfHeight = this.maxHalfHeight;
		}
		this.halfWidth = halfWidth;
		this.halfHeight = halfHeight;
		this.diagonal = Math.sqrt(halfWidth * halfWidth + halfHeight * halfHeight);
		this.cornerAngle = Math.atan(halfHeight/halfWidth);
		this.createCorners();
		
	}
	
	rotate(angle) {
		this.rotation = angle;
		this.createCorners();
	}
	
	collide(rayInfo) {
		let closestDistance = -1;
		let closestIntersection;
		let segmentPoint1;
		let segmentPoint2;
		for(let i = 0; i<4; i++) {
			let point1 = [this.corners[i][0]+this.x, this.corners[i][1]+this.y];
			let point2 = [this.corners[(i+1)%4][0]+this.x, this.corners[(i+1)%4][1]+this.y];
			let intersection = Helper.rayIntersectsSegment([rayInfo.rayX, rayInfo.rayY], [rayInfo.rayDirectionX, rayInfo.rayDirectionY], point1, point2);
			if(intersection[0]) {
				let distance = Helper.distanceSquared(rayInfo.rayX, rayInfo.rayY, intersection[1][0], intersection[1][1]);
				if(distance > 1 && (closestDistance == -1 || distance<closestDistance)) {
					closestDistance = distance;
					closestIntersection = intersection[1];
					segmentPoint1 = point1;
					segmentPoint2 = point2;
				}
			}
		}
		if(closestDistance != -1) {
			let directionInfo = this.changeRayDirection(rayInfo, segmentPoint1, segmentPoint2);
			return {"collided": true, "x": closestIntersection[0], "y": closestIntersection[1], "dx": directionInfo.direction[0], "dy": directionInfo.direction[1], "color": this.changeRayColor(), "reflected": directionInfo.reflected};
		}
		return {"collided": false};
	}

	changeRayDirection(rayInfo, segmentPoint1, segmentPoint2) {
		
		return {"direction": [0, 0], "reflected": false};
	}

	drawPath() {
		ctx.beginPath();
		ctx.moveTo(this.corners[0][0]+this.x, this.corners[0][1]+this.y);
		for(let i = 1; i<=3; i++) {
			ctx.lineTo(this.corners[i][0]+this.x, this.corners[i][1]+this.y);
		}
		
		ctx.closePath();
	}
	
	pointIntersects(x, y) {
		
		if(y > this.y + this.diagonal || y < this.y - this.diagonal ||
		x > this.x + this.diagonal || x < this.x - this.diagonal) {
			return false;
		}

		let relX = x - this.x;
		let relY = y - this.y;
		let angle;
		
		if(relX == 0) {
			angle = Math.PI/2;
		} else {
			angle = Math.atan(relY / relX);
		}
		
		let pointDistance = Math.sqrt(relX * relX + relY * relY);
		
		let unrotateX = Math.cos(angle - this.rotation) * pointDistance;
		let unrotateY = Math.sin(angle - this.rotation) * pointDistance;
		this.unMouseX = unrotateX;
		this.unMouseY = unrotateY;
		
		return Helper.rectContains(unrotateX, unrotateY, -this.halfWidth, -this.halfHeight, this.halfWidth, this.halfHeight);
		
	}
	
	/* Test/debug thing for checking mouseover */
	drawGhost() {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.fillRect(this.x-this.halfWidth, this.y - this.halfHeight, this.halfWidth*2, this.halfHeight*2);
		ctx.closePath();
		
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.arc(this.unMouseX+this.x, this.unMouseY+this.y, 3, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
		
	}
	
	exportData() {
		return {
			"type": this.type,
			"type": this.type,
			"x": this.x,
			"y": this.y,
			"rotation": this.rotation,
			"halfWidth": this.halfWidth,
			"halfHeight": this.halfHeight
		};
	}

}

class CircularObject extends InteractiveObject {
	constructor(type = "Circular Object", x, y, rotation, radius) {
		super(type, x, y, rotation, radius, "Circle");
		this.maxRadius = 200;
		this.minRadius = 25;
		
		if(radius > this.maxRadius) {
			radius = this.maxRadius;
		}
		if(radius < this.minRadius) {
			radius = this.minRadius;
		}

		this.radius = radius;

	}
	
	resizeBy(dr) {
		this.resize(this.radius+dr);
	}
	
	resize(radius) {
		if(radius < this.minRadius) {
			radius = this.minRadius;
		}
		if(radius > this.maxRadius) {
			radius = this.maxRadius;
		}
		this.radius = radius;
		this.diagonal = radius;
		
	}
	
	collide(rayInfo) {
		let closestDistance = -1;
		let closestIntersection;
		for(let i = 0; i<4; i++) {
			let intersection = Helper.rayIntersectsCircle([rayInfo.rayX, rayInfo.rayY], [rayInfo.rayDirectionX, rayInfo.rayDirectionY], this.x, this.y, this.radius);
			if(intersection[0]) {
				let distance = Helper.distanceSquared(rayInfo.rayX, rayInfo.rayY, intersection[1][0], intersection[1][1]);
				if(distance > 1 && (closestDistance == -1 || distance<closestDistance)) {
					closestDistance = distance;
					closestIntersection = intersection[1];
				}
			}
		}
		if(closestDistance != -1) {
			let directionInfo = this.changeRayDirection(rayInfo, closestIntersection[1][0], closestIntersection[1][1]);
			return {"collided": true, "x": closestIntersection[0], "y": closestIntersection[1], "dx": directionInfo.direction[0], "dy": directionInfo.direction[1], "color": this.changeRayColor(), "reflected": directionInfo.reflected};
		}
		return {"collided": false};
	}

	changeRayDirection(rayInfo, intersectionX, intersectionY) {
		
		return {"direction": [0, 0], "reflected": false};
	}

	drawPath() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();
	}
	
	pointIntersects(x, y) {
		
		return Helper.circleContains(x, y, this.x, this.y, this.radius);
		
	}

	exportData() {
		return {
			"type": this.type,
			"x": this.x,
			"y": this.y,
			"rotation": this.rotation,
			"radius": this.radius
		};
	}
	
}


class Flashlight extends RectangularObject {
	constructor(x = 50, y = 50, rotation = 0, isOn = false) {
		super("Flashlight", x, y, rotation, 27, 18);
		this.isOn = isOn;
		this.laser = new Laser(this, Math.cos(this.rotation), Math.sin(this.rotation));
	}
	
	toggle(isOn) {
		this.isOn = isOn;
		if(isOn) {
			this.laser.updatePath(objects);
		}
	}
	
	resizeBy(dx, dy) {
		return;
	}
	
	resize(halfWidth, halfHeight) {
		return;
	}
	
	rotate(angle) {
		super.rotate(angle);
		this.laser.rotate(this.rotation);
		
	}
	
	moveTo(x, y) {
		super.moveTo(x, y);
		this.laser.changeStartCoords(x, y);
	}
	
	collide(rayInfo) {
		return {"collided": false};
	}
	
	draw() {
		super.draw("#b38df7", "#7e55c8");
	}

	exportData() {
		return {
			"type": this.type,
			"x": this.x,
			"y": this.y,
			"rotation": this.rotation,
			"isOn": this.isOn
		};
	}

}

class Mirror extends RectangularObject {
	constructor(x = 50, y = 50, rotation = 0, halfWidth = 50, halfHeight = 5) {
		super("Mirror", x, y, rotation, halfWidth, halfHeight);
	}
	
	changeRayDirection(rayInfo, segmentPoint1, segmentPoint2) {
		
		let rayDirectionX = rayInfo.rayDirectionX;
		let rayDirectionY = rayInfo.rayDirectionY;
		
		let mirrorAngle;
		if(segmentPoint2[0]-segmentPoint1[0] == 0) {
			mirrorAngle = Math.PI/2;
		} else {
			mirrorAngle = Math.atan((segmentPoint2[1]-segmentPoint1[1])/(segmentPoint2[0]-segmentPoint1[0]));
		}
		let rayAngle;
		if(Math.abs(rayDirectionX) < 0.01) {
			rayAngle = Math.PI/2 * Math.sign(rayDirectionY);
		} else {
			rayAngle = Math.atan(rayDirectionY/rayDirectionX);
			if(rayDirectionX<0) {
				rayAngle = Math.PI+rayAngle;
			}
		}
		
		let newAngle = rayAngle-mirrorAngle;
		newAngle = Math.PI*2 - newAngle;
		newAngle+=mirrorAngle;
		
		return {"direction": [Math.cos(newAngle), Math.sin(newAngle)], "reflected": true};
	}
	
	draw() {
		super.draw("#cccccc", "#555555");
	}

	exportData() {
		return {
			"type": this.type,
			"x": this.x,
			"y": this.y,
			"rotation": this.rotation,
			"halfWidth": this.halfWidth,
			"halfHeight": this.halfHeight
		};
	}

}


class BlackBox extends RectangularObject {
	constructor(x = 50, y = 50, rotation = 0, halfWidth = 50, halfHeight = 30) {
		super("Black Box", x, y, rotation, halfWidth, halfHeight);
	}
	
	changeRayDirection(rayInfo, segmentPoint1, segmentPoint2) {
		
		return {"direction": [0, 0], "reflected": false};
	}
	
	draw() {
		super.draw("#555555", "#222222");
	}

	exportData() {
		return {
			"type": this.type,
			"x": this.x,
			"y": this.y,
			"rotation": this.rotation,
			"halfWidth": this.halfWidth,
			"halfHeight": this.halfHeight
		};
	}

}

class ColoredPanel extends RectangularObject {
	
	constructor(x = 50, y = 50, rotation = 0, halfWidth = 50, color = "green", colorMode = "subtract", halfHeight = 5) {
		super("Colored Panel", x, y, rotation, halfWidth, halfHeight);
		this.color = color;
		if(colorMode != "subtract" && colorMode != "add" && colorMode != "equal") {
			colorMode = "subtract";
		}
		this.colorMode = colorMode;
	}
	
	changeColor(newColor) {
		this.color = newColor;
	}
	
	changeColorMode(newColorMode) {
		this.colorMode = newColorMode;
	}
	
	changeRayDirection(rayInfo, segmentPoint1, segmentPoint2) {
		return {"direction": [rayInfo.rayDirectionX, rayInfo.rayDirectionY], "reflected": false};
	}
	
	changeRayColor() {
		if(this.colorMode == "subtract") {
			switch(this.color) {
				case "red":
					return [0,-1,-1];
				case "green":
					return [-1,0,-1];
				case "blue":
					return [-1,-1,0];
				case "cyan":
					return [-1,0,0];
				case "magenta":
					return [0,-1,0];
				case "yellow":
					return [0,0,-1];
			}
		}
		if(this.colorMode == "equal") {
			switch(this.color) {
				case "red":
					return [1,-1,-1];
				case "green":
					return [-1,1,-1];
				case "blue":
					return [-1,-1,1];
				case "cyan":
					return [-1,1,1];
				case "magenta":
					return [1,-1,1];
				case "yellow":
					return [1,1,-1];
			}
		}
		if(this.colorMode == "add") {
			switch(this.color) {
				case "red":
					return [1,0,0];
				case "green":
					return [0,1,0];
				case "blue":
					return [0,0,1];
				case "cyan":
					return [0,1,1];
				case "magenta":
					return [1,0,1];
				case "yellow":
					return [1,1,0];
			}
		}
	}
	
	draw() {
		if(this.colorMode == "subtract") {
			switch(this.color) {
				case "red":
					super.draw("rgba(255,0,0,0.4)", "rgba(255,0,0,0.8)");
					break;
				case "green":
					super.draw("rgba(0,255,0,0.4)", "rgba(0,255,0,0.8)");
					break;
				case "blue":
					super.draw("rgba(0,0,255,0.4)", "rgba(0,0,255,0.8)");
					break;
				case "cyan":
					super.draw("rgba(0,255,255,0.4)", "rgba(0,255,255,0.8)");
					break;
				case "magenta":
					super.draw("rgba(255,0,255,0.4)", "rgba(255,0,255,0.8)");
					break;
				case "yellow":
					super.draw("rgba(255,255,0,0.4)", "rgba(255,255,0,0.8)");
					break;
			}
		}
		if(this.colorMode == "equal") {
			switch(this.color) {
				case "red":
					super.draw("rgba(255,0,0,0.6)", "rgba(255,0,0,0.4)");
					break;
				case "green":
					super.draw("rgba(0,255,0,0.6)", "rgba(0,255,0,0.4)");
					break;
				case "blue":
					super.draw("rgba(0,0,255,0.6)", "rgba(0,0,255,0.4)");
					break;
				case "cyan":
					super.draw("rgba(0,255,255,0.6)", "rgba(0,255,255,0.4)");
					break;
				case "magenta":
					super.draw("rgba(255,0,255,0.6)", "rgba(255,0,255,0.4)");
					break;
				case "yellow":
					super.draw("rgba(255,255,0,0.6)", "rgba(255,255,0,0.4)");
					break;
			}
		}
		if(this.colorMode == "add") {
			switch(this.color) {
				case "red":
					super.draw("rgba(255,192,192,0.95)", "rgba(255,128,128,0.8)", -1);
					break;
				case "green":
					super.draw("rgba(192,255,192,0.95)", "rgba(128,255,128,0.8)", -1);
					break;
				case "blue":
					super.draw("rgba(192,192,255,0.95)", "rgba(128,128,255,0.8)", -1);
					break;
				case "cyan":
					super.draw("rgba(192,255,255,0.95)", "rgba(128,255,255,0.8)", -1);
					break;
				case "magenta":
					super.draw("rgba(255,192,255,0.95)", "rgba(255,128,255,0.8)", -1);
					break;
				case "yellow":
					super.draw("rgba(255,255,192,0.95)", "rgba(255,255,128,0.8)", -1);
					break;
			}
		}
		
	}

	exportData() {
		return {
			"type": this.type,
			"x": this.x,
			"y": this.y,
			"rotation": this.rotation,
			"halfWidth": this.halfWidth,
			"halfHeight": this.halfHeight,
			"color": this.color,
			"colorMode": this.colorMode
		};
	}
	
}

class TransparentBlock extends RectangularObject {
	
	constructor(x = 50, y = 50, rotation = 0, halfWidth = 50, halfHeight = 50, refractiveIndex = 1.5) {
		super("Transparent Block", x, y, rotation, halfWidth, halfHeight);
		this.refractiveIndex = refractiveIndex;
	}
	
	
	changeRayDirection(rayInfo, segmentPoint1, segmentPoint2) {
		
		let rayDirectionX = rayInfo.rayDirectionX;
		let rayDirectionY = rayInfo.rayDirectionY;
		let exiting = rayInfo.exiting;
		let otherRefractiveIndex = rayInfo.otherRefractiveIndex;
		let reflected = false;
		
		let mirrorAngle;
		if(segmentPoint2[1]-segmentPoint1[1] == 0) {
			mirrorAngle = Math.PI/2;
		} else {
			mirrorAngle = Math.atan(-(segmentPoint2[0]-segmentPoint1[0])/(segmentPoint2[1]-segmentPoint1[1]));
		}
		let rayAngle;
		if(Math.abs(rayDirectionX) < 0.01) {
			rayAngle = Math.PI/2 * Math.sign(rayDirectionY);
		} else {
			rayAngle = Math.atan(rayDirectionY/rayDirectionX);
			if(rayDirectionX<0) {
				rayAngle = Math.PI+rayAngle;
			}
		}
		
		rayAngle = rayAngle - mirrorAngle;
		
		let indexRatio;
		if(exiting) {
			
			indexRatio = otherRefractiveIndex/this.refractiveIndex;
		} else {
			indexRatio = this.refractiveIndex/otherRefractiveIndex;
		}

		let sinOtherAngle = Math.sin(rayAngle)/indexRatio;
		let otherAngle;
		if(sinOtherAngle > 1 || sinOtherAngle < -1) {
			otherAngle = Math.PI - rayAngle;
			reflected = true;
		} else {
			otherAngle = Math.asin(sinOtherAngle);
		
			if(Math.cos(rayAngle) < 0) {
				otherAngle = -otherAngle + Math.PI;
			}
		}
		
		otherAngle = otherAngle + mirrorAngle;
		
		return {"direction": [Math.cos(otherAngle), Math.sin(otherAngle)], "reflected": reflected};
	}
	
	draw() {
		super.draw("rgba(148, 212, 242,0.2)", "rgba(58, 170, 222,0.8)");
		
	}

	exportData() {
		return {
			"type": this.type,
			"x": this.x,
			"y": this.y,
			"rotation": this.rotation,
			"halfWidth": this.halfWidth,
			"halfHeight": this.halfHeight,
			"refractiveIndex": this.refractiveIndex
		};
	}

}


class Piggy extends CircularObject {
	constructor(x = 50, y = 50, rotation = 0, radius = 30) {
		super("Piggy", x, y, rotation, radius);
		this.radius = radius;
		this.color = [0,0,0];
		this.isHit = false;
	}

	resetColor() {
		this.color = [0,0,0];
		this.isHit = false;
	}
	
	changeColor(color) {
		this.isHit = true;
		
		for(let i = 0; i<3; i++) {
			let c = Math.min(1,this.color[i]+color[i]);
			this.color[i] = c;
		}
	}

	changeRayDirection(rayInfo, intersectionX, intersectionY) {
		
		return {"direction": [0, 0], "reflected": false};
	}

	drawPath() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();
	}
	
	drawGlow(mode) {
		ctx.beginPath();
		let gradient = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius+40);

		let strength = 0.6;
		if(mode == "delete" && this.hover) {
			strength = 0.4;
		}

		gradient.addColorStop(0,"rgba(" + this.color[0]*255 + ", " + this.color[1]*255 + ", " + this.color[2]*255 + "," + strength + ")");
		gradient.addColorStop(1, "rgba(" + this.color[0]*255 + ", " + this.color[1]*255 + ", " + this.color[2]*255 + ",0)");

		ctx.fillStyle = gradient;
		ctx.arc(this.x, this.y, this.radius+60, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}
	
	chooseImage(mode) {
		let offset = 0;
		if(this.selected) {
			offset = 2;
		}
		if(this.hover) {
			offset = 1;
			if(mode == "delete") {
				offset = 3;
			}
		}
		if(this.isHit) {
			return sprites.piggy[4+offset];
		} else {
			return sprites.piggy[offset];
		}
	}
	
	drawObject(mode = "edit") {
		this.draw(mode);
	}
	
	draw(mode) {
		if(this.isHit) {
			this.drawGlow(mode);
		}
		
		let imageWidth = this.radius*3;
		
		ctx.setTransform(2, 0, 0, 2, this.x*2, this.y*2);
		ctx.rotate(this.rotation);
		
		ctx.drawImage(this.chooseImage(mode), -imageWidth/2, -imageWidth/2, imageWidth, imageWidth);
		ctx.setTransform(scale, 0, 0, scale, 0, 0);


	}
	
	pointIntersects(x, y) {
		
		return Helper.circleContains(x, y, this.x, this.y, this.radius);
		
	}

	exportData() {
		return {
			"type": this.type,
			"x": this.x,
			"y": this.y,
			"rotation": this.rotation,
			"radius": this.radius
		};
	}
	
}