class EditorButton {
	constructor(editor, located = "topRight", states = [false, true], shape = "rectangle", width = 30, height = 30) {
		this.editor = editor;
		if(shape != "rectangle" && shape != "circle") {
			shape = "rectangle";
		}
		this.shape = shape;
		this.buttonWidth = width;
		this.buttonHeight = height;
		this.buttonRadius = width/2;
		this.located = located;
		this.setDefaultLocation();
		this.absoluteX = this.editor.x + this.buttonX;
		this.absoluteY = this.editor.y + this.buttonY;
		this.hover = false;
		this.state = 0;
		this.states = states;
		this.numStates = this.states.length;
	}

	setDefaultLocation() {
		let x = 0;
		let y = 0;
		if(this.located != "topRight" && this.located != "topLeft" &&
		   this.located != "bottomLeft" && this.located != "bottomRight") {
			  this.located = "topRight";
		}
		if(this.located == "topRight" || this.located == "bottomRight") {
			x = this.editor.rotateCircleDistance;
		}
		if(this.located == "topLeft" || this.located == "bottomLeft") {
			x = -this.editor.rotateCircleDistance - this.buttonWidth;
		}
		if(this.located == "topRight" || this.located == "topLeft") {
			y = -this.editor.rotateCircleDistance - this.buttonHeight;
		}
		if(this.located == "bottomRight" || this.located == "bottomLeft") {
			y = this.editor.rotateCircleDistance;
		}
		
		this.buttonX = x;
		this.buttonY = y;
		this.defaultButtonX = x;
		this.defaultButtonY = y;
	}

	isActive() {
		return this.hover;
	}

	updateLocation() {
		
		this.buttonX = this.defaultButtonX;
		this.buttonY = this.defaultButtonY;
		
		if(this.editor.x + this.defaultButtonX + this.buttonWidth >= canvasWidth - 10) {
			this.buttonX = -this.editor.rotateCircleDistance - this.buttonWidth;
		} else if(this.editor.x + this.defaultButtonX <= 10) {
			this.buttonX = this.editor.rotateCircleDistance;
		}
		
		if(this.editor.y + this.defaultButtonY + this.buttonHeight >= canvasHeight - 10) {
			this.buttonY = -this.editor.rotateCircleDistance - this.buttonHeight;
		} else if(this.editor.y + this.defaultButtonY <= 10) {
			this.buttonY = this.editor.rotateCircleDistance;
		}		
		
		this.absoluteX = this.editor.x + this.buttonX;
		this.absoluteY = this.editor.y + this.buttonY;
		
	}

	mouseOver(mouseX, mouseY) {
		this.hover = this.mouseIntersects(mouseX, mouseY);
	}

	mouseIntersects(mouseX, mouseY) {
		
		if(this.shape == "circle") {
			return Helper.circleContains(mouseX, mouseY, this.absoluteX + this.buttonRadius, this.absoluteY + this.buttonRadius, this.buttonRadius);
		}
		if(this.shape == "rectangle") {
			return Helper.rectContains(mouseX, mouseY, this.absoluteX, this.absoluteY, this.absoluteX + this.buttonWidth, this.absoluteY + this.buttonHeight);
		}
		
	}
	
	mouseClick(mouseX, mouseY) {
		if(this.mouseIntersects(mouseX, mouseY)) {
			this.state++;
			if(this.state >= this.numStates) {
				this.state = 0;
			}
		}
	}
	
	draw() {
		ctx.beginPath();
		if(this.state == 1) {
			ctx.fillStyle = "#00cc00";
			ctx.strokeStyle = "#222222";
		}
		if(this.state == 1 && this.hover) {
			ctx.fillStyle = "#55ee55";
		}
		if(this.state == 0) {
			ctx.strokeStyle = "#555555";
			ctx.fillStyle = "#222222";
		}
		if(this.state == 0 && this.hover) {
			ctx.fillStyle = "#333333";
		}
		if(this.shape == "circle") {
			ctx.arc(this.absoluteX + this.buttonRadius, this.absoluteY + this.buttonRadius, this.buttonRadius, 0, Math.PI*2);
		}
		if(this.shape == "rectangle") {
			ctx.rect(this.absoluteX, this.absoluteX, this.buttonWidth, this.buttonHeight);
		}
		ctx.lineWidth = 6;
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
}

class FlashlightSwitch extends EditorButton {
	constructor(editor, isOn) {
		super(editor, "topRight", [false, true], "rectangle", 30, 30);
		this.editor = editor;
		if(isOn) {
			this.state = 1;
		} else {
			this.state = 0;
		}
	}
	
	mouseClick(mouseX, mouseY) {
		super.mouseClick(mouseX, mouseY);
		this.editor.object.toggle(this.states[this.state]);
	}
	
	draw() {
		ctx.beginPath();
		let isOn = this.state == 1;
		if(isOn) {
			ctx.fillStyle = "#cc0000";
			ctx.strokeStyle = "#222222";
		}
		if(isOn && this.hover) {
			ctx.fillStyle = "#ee5555";
		}
		if(!isOn) {
			ctx.strokeStyle = "#555555";
			ctx.fillStyle = "#222222";
		}
		if(!isOn && this.hover) {
			ctx.fillStyle = "#333333";
		}
		ctx.rect(this.editor.x + this.buttonX, this.editor.y + this.buttonY, this.buttonWidth, this.buttonHeight);
		ctx.lineWidth = 6;
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
}


class ColorButton extends EditorButton {
	constructor(editor, color) {
		super(editor, "topRight", ["red", "green", "blue", "cyan", "magenta", "yellow"], "circle", 30, 30);
		this.editor = editor;
		switch(color) {
			case "red":
				this.state = 0;
				break;
			case "green":
				this.state = 1;
				break;
			case "blue":
				this.state = 2;
				break;
			case "cyan":
				this.state = 3;
				break;
			case "magenta":
				this.state = 4;
				break;
			case "yellow":
				this.state = 5;
			}
	}
	
	mouseClick(mouseX, mouseY) {
		super.mouseClick(mouseX, mouseY);
		this.editor.object.changeColor(this.states[this.state]);
	}
	
	draw() {
		ctx.beginPath();
		ctx.fillStyle = this.states[this.state];
		ctx.arc(this.absoluteX + this.buttonRadius, this.absoluteY + this.buttonRadius, this.buttonRadius, 0, Math.PI*2);
		ctx.lineWidth = 6;
		ctx.fill();
		ctx.closePath();
	}
}