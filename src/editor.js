class ObjectEditorLite {
	constructor() {
		this.object = null;
		this.hasSelectedObject = false;
		this.toggleableProperties = [];
		this.toggleablePropertyStates = [];
	}
	
	selectObject(object) {
		this.hasSelectedObject = true;
		this.object = object;
		
		this.rotation = this.object.rotation;
		
		this.setToggleableProperties(object);
		
		this.x = object.x;
		this.y = object.y;
	}
	
	
	unselectObject() {
		if(!this.hasSelectedObject || this.object === null) {
			return;
		}
		this.hasSelectedObject = false;
		this.object = null;
	}
	
	moveTo(newX, newY) {
		if(newX < 0) {
			newX = 0;
		}
		if(newY < 0) {
			newY = 0;
		}
		if(newX > canvasWidth) {
			newX = canvasWidth;
		}
		if(newY > canvasHeight) {
			newY = canvasHeight;
		}
		this.x = newX;
		this.y = newY;
		this.object.moveTo(newX, newY);
		
	}
	
	resize(halfWidth, halfHeight) {
		if(this.hasSelectedObject) {
			if(this.object.shape == "Rectangle") {
				this.object.resize(halfWidth, halfHeight);
			} else if(this.object.shape == "Circle"){
				this.object.resize(Math.max(halfWidth, halfHeight));
			}
			this.rotateCircleDistance = Math.min(130, this.object.diagonal + 30);
			this.rotateCircleX = this.rotateCircleDistance * Math.cos(this.rotation);
			this.rotateCircleY = this.rotateCircleDistance * Math.sin(this.rotation);
		}
	}
	
	resizeBy(dw, dh) {
		if(this.hasSelectedObject) {
			if(this.object.shape == "Rectangle") {
				this.resize(this.object.halfWidth+dw, this.object.halfHeight+dh);
			} else if(this.object.shape == "Circle"){
				let dr = Math.abs(dw) > Math.abs(dh) ? dw : dh;
				this.resize(this.object.radius+dr, 0);
			}
		}
	}
	
	rotate(angle) {
		if(this.hasSelectedObject) {
			this.rotation = angle;
			this.object.rotate(angle);
		}
	}
	
	rotateBy(angle) {
		if(this.rotation > Math.PI*2) {
			this.rotation -= Math.PI*2;
		} else if(this.rotation < -Math.PI*2) {
			this.rotation += Math.PI*2;
		}
		this.rotate(this.rotation + angle);
	}
	
	align45Degrees() {
		this.rotate(Helper.align45Degrees(this.rotation));
	}
	
	setToggleableProperties(object) {
		this.toggleableProperties = [];
		this.toggleablePropertyStates = [];
		if(ObjectProperties[object.type] === undefined) {
			alert("object type does not exist");
			return;
		}
		if(ObjectProperties[object.type].toggleable !== undefined) {
			
			this.toggleableProperties = ObjectProperties[object.type].toggleable;
			for(let i = 0; i < this.toggleableProperties.length; i++) {
				let property = this.toggleableProperties[i];
				let value = object[property.name];
				this.toggleablePropertyStates[i] = 0;
				for(let j = 0; j<property.values.length; j++) {
					if(value == property.values[j]) {
						this.toggleablePropertyStates[i] = j;
					}
				}
			}
		}
	}
	
	toggleProperty(number, steps) {
		if(!this.hasSelectedObject) {
			return;
		}
		if(this.toggleableProperties.length <= number || number < 0) {
			return;
		}
		let newState = this.toggleablePropertyStates[number] + steps;
		let values = this.toggleableProperties[number].values;
		let valueCount = this.toggleableProperties[number].values.length;
		if(newState >= valueCount) {
			newState = newState % valueCount;
		} else if(newState < 0) {
			newState = newState % valueCount + valueCount;
		}
		this.toggleablePropertyStates[number] = newState;
		let changeFunction = this.toggleableProperties[number].changeFunction;
		this.object[changeFunction](values[newState]);
	}
}

class ObjectEditor extends ObjectEditorLite {
	constructor() {
		super();
		this.hoverMoveCircle = false;
		this.hoverRotateCircle = false;
		this.hoverBigRotateCircle = false;
		this.dragMoveCircle = false;
		this.dragRotateCircle = false;
		this.moveCircleRadius = 15;
		this.rotateCircleRadius = 12;
		this.bigRotateCircleThickness = 8;
		this.rotateCircleX = 0;
		this.rotateCircleY = 0;
		this.rotateCircleDistance = 0;
		this.buttons = null;
	}
	
	isActive() {
		let buttonsActive = false;
		if(this.buttons != null) {
			buttonsActive = this.buttons.isActive();
		}
		return this.dragMoveCircle || this.dragRotateCircle || this.hoverMoveCircle || this.hoverRotateCircle || this.hoverBigRotateCircle || buttonsActive;
	}
	
	selectObject(object) {
		if(this.hasSelectedObject && this.object != object) {
			this.object.selected = false;
		}
		
		super.selectObject(object);
		this.rotateCircleDistance = Math.min(130, this.object.diagonal + 30);
		this.rotateCircleX = this.rotateCircleDistance * Math.cos(this.object.rotation);
		this.rotateCircleY = this.rotateCircleDistance * Math.sin(this.object.rotation);
		
		if(object.type == "Flashlight") {
			this.buttons = new FlashlightSwitch(this, object.isOn);
		} else if(object.type == "Colored Panel") {
			this.buttons = new ColorButton(this, object.color);
		} else {
			this.buttons = null;
		}
	}
	
	unselectObject() {
		if(!this.hasSelectedObject || this.object === null) {
			return;
		}
		this.hasSelectedObject = false;
		this.object.selected = false;
		this.object = null;
	}
	
	moveTo(newX, newY) {
		super.moveTo(newX, newY);
		
		if(this.buttons !== null) {
			this.buttons.updateLocation();
		}
		
	}
	
	resize(halfWidth, halfHeight) {
		if(this.hasSelectedObject) {
			super.resize(halfWidth, halfHeight);
			this.rotateCircleDistance = Math.min(130, this.object.diagonal + 30);
			this.rotateCircleX = this.rotateCircleDistance * Math.cos(this.rotation);
			this.rotateCircleY = this.rotateCircleDistance * Math.sin(this.rotation);
		}
	}
	
	rotate(angle) {
		if(this.hasSelectedObject) {
			super.rotate(angle);
			this.rotateCircleX = this.rotateCircleDistance * Math.cos(this.object.rotation);
			this.rotateCircleY = this.rotateCircleDistance * Math.sin(this.object.rotation);
		}
	}
	
	toggleProperty(number, steps) {
		super.toggleProperty(number, steps);
		this.updateButtonStates();
	}
	
	updateButtonStates() {
		if(this.object.type == "Flashlight") {
			this.buttons.state = this.toggleablePropertyStates[0];
		} else if(this.object.type == "Colored Panel") {
			this.buttons.state = this.toggleablePropertyStates[0];
		}
	}
	
	mouseRotate(mouseX, mouseY) {
		let relMouseX = mouseX - this.x;
		let relMouseY = mouseY - this.y;
		let angle;
		
		if(relMouseX == 0) {
			angle = relMouseY < 0 ? -Math.PI/2 : Math.PI/2;
		} else {
			angle = Math.atan(relMouseY / relMouseX);
			if(relMouseX < 0) {
				angle = Math.PI + angle;
			}
		}
		
		this.rotate(angle);
		
	}
	
	mouseOver(mouseX, mouseY) {
		
		if(this.dragMoveCircle) {
			this.moveTo(mouseX, mouseY);
		} else if(this.dragRotateCircle) {
			this.mouseRotate(mouseX, mouseY);
		}

		if(this.buttons !== null) {
			this.buttons.mouseOver(mouseX, mouseY);
		}

		this.mouseIntersectsCircles(mouseX, mouseY);
		
	}
	
	mouseDown(mouseX, mouseY) {
		if(!mouseIsDown) {
			if(objectEditor.mouseIntersectsMoveCircle(mouseX, mouseY)) {
				objectEditor.dragMoveCircle = true;
			}
			if(objectEditor.mouseIntersectsRotateCircles(mouseX, mouseY)) {
				objectEditor.dragRotateCircle = true;
			}
		}
	}
	
	mouseClick(mouseX, mouseY) {
		if(this.mouseIntersectsRotateCircles(mouseX, mouseY)) {
			this.mouseRotate(mouseX, mouseY);
		}
		
		if(this.buttons !== null) {
			if(this.buttons.mouseClick(mouseX, mouseY));
		}
	}
	
	mouseIntersectsCircles(mouseX, mouseY) {
		
		if(!this.hasSelectedObject || this.object === null) {
			return false;
		}
		
		return this.mouseIntersectsMoveCircle(mouseX, mouseY) || this.mouseIntersectsRotateCircles(mouseX, mouseY);
		
	}
	
	mouseIntersectsMoveCircle(mouseX, mouseY) {

		if(!this.hasSelectedObject || this.object === null) {
			return false;
		}
		
		let moveCircleX = this.x;
		let moveCircleY = this.y;
		
		if(Helper.circleContains(mouseX, mouseY, moveCircleX, moveCircleY, this.moveCircleRadius)) {
			this.hoverMoveCircle = true;
			return true;
		} else {
			this.hoverMoveCircle = false;
		}
		
	}
	
	mouseIntersectsRotateCircles(mouseX, mouseY) {

		if(!this.hasSelectedObject || this.object === null) {
			return false;
		}

		if(Helper.circleContains(mouseX, mouseY, this.rotateCircleX + this.x, this.rotateCircleY + this.y, this.rotateCircleRadius)) {
			this.hoverRotateCircle = true;
			return true;
		}

		let bigRotateCircleRadius1 = this.rotateCircleDistance - this.bigRotateCircleThickness/2;
		let bigRotateCircleRadius2 = this.rotateCircleDistance + this.bigRotateCircleThickness/2;
		
		if(Helper.ringContains(mouseX, mouseY, this.x, this.y, bigRotateCircleRadius1, bigRotateCircleRadius2)) {
			this.hoverRotateCircle = true;
			return true;
		}
		
		this.hoverRotateCircle = false;
		
		return false;
		
	}
	
	draw() {
		ctx.beginPath();
		ctx.fillStyle = "#4fc1ff";
		ctx.strokeStyle = "#0084ff";
		if(this.hoverMoveCircle) {
			ctx.fillStyle = "#8fd7ff";
		}
		ctx.lineWidth = 3;
		ctx.arc(this.x, this.y, this.moveCircleRadius, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.strokeStyle = "rgba(57, 196, 106, 0.5)";
		if(this.hoverRotateCircle) {
			ctx.strokeStyle = "rgba(57, 196, 106, 0.6)";
		}
		ctx.lineWidth = this.bigRotateCircleThickness;
		ctx.arc(this.x, this.y, this.rotateCircleDistance, 0, Math.PI*2);
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.fillStyle = "#90e371";
		if(this.hoverRotateCircle) {
			ctx.fillStyle = "#ccf7a6";
		}
		ctx.strokeStyle = "#41b536";
		ctx.lineWidth = 3;
		ctx.arc(this.rotateCircleX + this.x, this.rotateCircleY + this.y, this.rotateCircleRadius, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
		if(this.buttons !== null) {
			this.buttons.draw();
		}
	}
}

