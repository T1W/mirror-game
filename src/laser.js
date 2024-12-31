class Laser {
	constructor(flash_light, dx, dy) {
		this.flashlight = flash_light;
		this.offset = flash_light.halfWidth;
		this.startCoords = [0, 0];
		this.rotation = 0;
		this.changeStartCoords();
		this.dx = dx;
		this.dy = dy;
		this.path = [];
		this.reachedLimit = false;
		this.bounceCount = 0;
		this.inGlass = false;
		this.refractiveObjectsIntersected = [];
	}
	
	rotate(rotation) {
		this.rotation = rotation;
		this.dx = Math.cos(rotation);
		this.dy = Math.sin(rotation);
		
		this.changeStartCoords();
	}
	
	changeStartCoords() {
		let newX = this.flashlight.x + this.offset * Math.cos(this.rotation);
		let newY = this.flashlight.y + this.offset * Math.sin(this.rotation);
		this.startCoords = [newX, newY, [1,1,1]];
	}
	
	color() {
		if(this.path.length==0) {
			return [1,1,1];
		} else {
			return this.path[this.path.length-1][2];
		}
	}
	
	updatePath(objectList) {
		if(!this.flashlight.isOn) {
			return;
		}
		this.path = [];
		this.dx = Math.cos(this.rotation);
		this.dy = Math.sin(this.rotation);
		this.checkInsideObjects(this.startCoords, objectList);
		for(let i = 0; i<200; i++) {
			if(!this.searchForCollisions(objectList)) {
				break;
			}
		}
		this.endPath();
		this.bounceCount = this.path.length - 1;
	}

	endPath() {
		let endCoords;
		if(this.path.length == 0){
			endCoords = this.startCoords;
		} else {
			endCoords = this.path[this.path.length-1];
		}
		this.path.push([endCoords[0] + this.dx * 5000, endCoords[1] + this.dy * 5000, endCoords[2]]);
	}

	searchForCollisions(objectList) {
		let startCoords = this.path[this.path.length-1];
		if(this.path.length == 0){
			startCoords = this.startCoords;
		}
		let closestCollision;
		let closestDistance = -1;
		let closestObject;
		let collisionInfo;
		for(let object of objectList) {
			let rayInfo = {"rayX": startCoords[0], "rayY": startCoords[1], "rayDirectionX": this.dx, "rayDirectionY": this.dy, "exiting": this.inGlass, "otherRefractiveIndex": 1};
			collisionInfo = object.collide(rayInfo);
			if(collisionInfo.collided) {
				let distance = Helper.distanceSquared(startCoords[0], startCoords[1], collisionInfo.x, collisionInfo.y);
				if(distance > 1 && (closestDistance == -1 || distance < closestDistance)) {
					closestDistance = distance;
					closestCollision = collisionInfo;
					closestObject = object;
				}
			}
		}

		if(closestDistance != -1) {
			if(closestObject.type == "Transparent Block") {
				this.checkRefractiveObjects(closestObject, closestCollision.reflected);
			}
			if(closestObject.type == "Piggy") {
				closestObject.changeColor(this.color());
			}
			let newColor = this.changeColor(closestCollision.color);
			/* black */
			if(newColor.every(value => value == 0)) {
				closestCollision.dx = 0;
				closestCollision.dy = 0;
			}
			this.path.push([closestCollision.x, closestCollision.y, newColor]);
			this.dx = closestCollision.dx;
			this.dy = closestCollision.dy;
			return true;
		}
		return false;
	}
	
	checkInsideObjects(startCoords, objectList) {
		this.refractiveObjectsIntersected = [];
		for(let i = 0; i<objectList.length; i++) {
			let obj = objectList[i];
			if(obj.type == "Transparent Block") {
				if(obj.pointIntersects(startCoords[0], startCoords[1])) {
					this.refractiveObjectsIntersected.push({"object": obj, "layer": i});
				}
			}
		}
		if(this.refractiveObjectsIntersected.length > 0) {
			this.inGlass = true;
		} else {
			this.inGlass = false;
		}
	}
	
	checkRefractiveObjects(obj, reflected) {
		if(reflected) {
			return;
		} else {
			this.inGlass = !this.inGlass;
		}
	}
	
	changeColor(color) {
		let previousColor = [1,1,1];
		if(this.path.length>0) {
			previousColor = this.path[this.path.length-1][2];
		}
		let newColor =  [0,0,0];
		for(let i = 0; i<3; i++) {
			let c = previousColor[i]+color[i];
			if(c<0) {
				c = 0;
			}
			if(c>1) {
				c = 1;
			}
			newColor[i] = c;
		}
		
		return newColor;
	}
	
	draw() {
		if(!this.flashlight.isOn) {
			return;
		}
		ctx.strokeStyle = "white";
		ctx.lineWidth = 4;
		ctx.miterLimit = 2;
		let previousCoords = [this.flashlight.x, this.flashlight.y];
		for(let i=0; i<this.path.length; i++) {
			let coords = this.path[i];
			let color;
			if(i==0) {
				color = [1,1,1];
			} else {
				color = this.path[i-1][2];
			}
			ctx.beginPath();
			ctx.moveTo(previousCoords[0], previousCoords[1]);
			ctx.strokeStyle = "rgb(" + color[0]*255 + ", " + color[1]*255 + ", " + color[2]*255 + ")";
			ctx.lineTo(coords[0], coords[1]);
			ctx.stroke();
			previousCoords = coords;
		}
	}
}