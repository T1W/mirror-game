class LevelEditor {
	constructor() {
		this.mode = "edit"; /* edit, add, delete*/
		this.objects = [];
		this.objectEditor = new ObjectEditor();
		this.objectEditorLite = new ObjectEditorLite();
		this.currentEditor = this.objectEditor;
		this.objectSelected = null;
		this.objectHovered = null;
		this.addObjectType = "Mirror";
		this.objectToAdd = null;
		this.backgroundRefractIndex = 1;
		this.deletedObjects = [];
		this.flashlights = [];
		this.piggies = [];
		this.dragDelete = false;
	}

	switchMode(mode) {
		this.mode = mode;
		draw = true;

		if(mode == "edit") {
			this.currentEditor = this.objectEditor;
		}
		if(mode == "add") {
			this.createAddObject();
			this.currentEditor = this.objectEditorLite;
		} else if(this.objectEditorLite.hasSelectedObject) {
			this.objectEditorLite.unselectObject();
			this.objectToAdd = null;
		}
	}
	
	setAddObjectType(type) {
		this.addObjectType = type;
		draw = true;

		if(this.mode == "add") {
			this.createAddObject();
		}
	}
	
	createAddObject() {
		switch(this.addObjectType) {
			case "Mirror":
				this.objectToAdd = new Mirror(canvasHalfWidth,canvasHalfHeight);
				break;
			case "Colored Panel":
				this.objectToAdd = new ColoredPanel(canvasHalfWidth,canvasHalfHeight);
				break;
			case "Flashlight":
				this.objectToAdd = new Flashlight(canvasHalfWidth,canvasHalfHeight);
				break;
			case "Transparent Block":
				this.objectToAdd = new TransparentBlock(canvasHalfWidth,canvasHalfHeight);
				break;
			case "Black Box":
				this.objectToAdd = new BlackBox(canvasHalfWidth,canvasHalfHeight);
				break;
			case "Piggy":
				this.objectToAdd = new Piggy(canvasHalfWidth,canvasHalfHeight);
				break;
			default:
				this.objectToAdd = new Mirror(canvasHalfWidth,canvasHalfHeight,30,80);
		}
		
		this.objectEditorLite.selectObject(this.objectToAdd);
	}
	
	addObject(object, index = -1) {
		if(index>=0) {
			this.objects.splice(index, 0, object);
		} else {
			this.objects.push(object);
		}
		
		if(object.type == "Flashlight") {
			this.flashlights.push(object);
		}
		
		if(object.type == "Piggy") {
			this.piggies.push(object);
		}
	}
	
	deleteObject(object) {
		let index = this.objects.indexOf(object);

		if(index>=0) {
			this.deletedObjects.push([object, index]);
			this.objects.splice(index, 1);
		}
		
		if(object.type == "Flashlight") {
			let index2 = this.flashlights.indexOf(object);

			if(index2>=0) {
				this.flashlights.splice(index2, 1);
			}
		}
		
		if(object.type == "Piggy") {
			let index2 = this.piggies.indexOf(object);

			if(index2>=0) {
				this.piggies.splice(index2, 1);
			}
		}
	}

	deleteAllObjects() {
		this.unselectObject();
		this.objects.length = 0;
		this.flashlights.length = 0;
		this.piggies.length = 0;
		this.deletedObjects.length = 0;
		draw = true;
	}
	
	alignObject45Degrees() {
		if(this.mode == "edit" || this.mode == "add") {
			this.currentEditor.align45Degrees();
			this.updateFlashlights();
			draw = true;
		}
	}
	
	rotateObjectBy(angle) {
		if(this.mode == "edit" || this.mode == "add") {
			this.currentEditor.rotateBy(angle);
			this.updateFlashlights();
			draw = true;
		}
	}
	
	resizeObjectBy(dw, dh) {
		if(this.mode == "edit" || this.mode == "add") {
			this.currentEditor.resizeBy(dw, dh);
			this.updateFlashlights();
			draw = true;
		}
	}
	
	toggleProperty(number, steps) {
		if(this.mode == "edit" || this.mode == "add") {
			this.currentEditor.toggleProperty(number, steps);
			this.updateFlashlights();
			draw = true;
		}
	}
	
	toggleDragDelete() {
		if(this.mode == "delete") {
			this.dragDelete = !this.dragDelete;
		}
	}
	
	mouseOver(mouseX, mouseY) {
		if(this.mode == "edit") {
			this.mouseOverEditMode(mouseX, mouseY);
		}
		if(this.mode == "add") {
			this.mouseOverAddMode(mouseX, mouseY);
		}
		if(this.mode == "delete") {
			this.mouseOverDeleteMode(mouseX, mouseY);
		}
	}
	
	mouseOverEditMode(mouseX, mouseY) {
		if(this.objectEditor.hasSelectedObject) {	
			this.objectEditor.mouseOver(mouseX, mouseY);
			draw = true;
		}
	
		if(!this.objectEditor.isActive()) {
			this.hoverTopObject(mouseX, mouseY);
		} else {
			if(this.objectHovered !== null && this.objectHovered != this.objectEditor.object) {
				this.objectHovered.hover = false;
			}
		}
	}

	hoverTopObject(mouseX, mouseY) {
		for(let i = this.objects.length-1; i>=0; i--) {
			if(this.objects[i].mouseOver(mouseX, mouseY)) {
				if(this.objectHovered !== null && this.objectHovered !== this.objects[i]) {
					this.objectHovered.hover = false;
				}
				this.objectHovered = objects[i];
				break;
			}
		}
		draw = true;
	}
	
	mouseOverAddMode(mouseX, mouseY) {
		if(this.objectEditorLite.hasSelectedObject) {	
			this.objectEditorLite.moveTo(mouseX, mouseY);
			draw = true;
		}
	}
	
	mouseOverDeleteMode(mouseX, mouseY) {
		if(this.dragDelete && mouseIsDown) {	
			this.mouseClickDeleteMode(mouseX, mouseY);
		}
		this.hoverTopObject(mouseX, mouseY);
	}
	
	mouseClick(mouseX, mouseY) {
		if(this.mode == "edit") {
			this.mouseClickEditMode(mouseX, mouseY);
		}
		if(this.mode == "add") {
			this.mouseClickAddMode(mouseX, mouseY);
		}
		if(this.mode == "delete") {
			this.mouseClickDeleteMode(mouseX, mouseY);
		}
	}
	
	mouseClickAddMode(mouseX, mouseY) {
		this.addObject(this.objectToAdd);
		let previousObject = this.objectToAdd;
		switch(this.addObjectType) {
			case "Mirror":
				this.objectToAdd = new Mirror(mouseX,mouseY,previousObject.rotation * 360 / (2*Math.PI),previousObject.halfWidth);
				break;
			case "Colored Panel":
				this.objectToAdd = new ColoredPanel(mouseX,mouseY,previousObject.rotation * 360 / (2*Math.PI),previousObject.halfWidth,
				previousObject.color,previousObject.colorMode);
				break;
			case "Flashlight":
				this.objectToAdd = new Flashlight(mouseX,mouseY,previousObject.rotation * 360 / (2*Math.PI));
				break;
			case "Transparent Block":
				this.objectToAdd = new TransparentBlock(mouseX,mouseY,previousObject.rotation * 360 / (2*Math.PI),previousObject.halfWidth,previousObject.halfHeight,previousObject.refractiveIndex);
				break;
			case "Black Box":
				this.objectToAdd = new BlackBox(mouseX,mouseY,previousObject.rotation * 360 / (2*Math.PI),previousObject.halfWidth,previousObject.halfHeight);
				break;
			case "Piggy":
				this.objectToAdd = new Piggy(mouseX,mouseY,previousObject.rotation * 360 / (2*Math.PI),previousObject.radius);
				break;
			default:
				this.objectToAdd = new Mirror(mouseX,mouseY,30,80);
		}
		
		this.objectEditorLite.selectObject(this.objectToAdd);
		
	}
	
	mouseClickEditMode(mouseX, mouseY) {
		if(this.objectEditor.hasSelectedObject) {	
			this.objectEditor.mouseClick(mouseX, mouseY);
		}
		
		if(!this.objectEditor.isActive() && this.objectSelected !== null) {
			let selectSuccess = this.objectSelected.mouseClick(mouseX, mouseY);
			if(selectSuccess) {
				if(this.objectEditor.object == this.objectSelected) {
					this.objectEditor.unselectObject();
					this.objectSelected = null;
					return;
				}
				this.objectEditor.selectObject(this.objectSelected);
				this.objectSelected = null;
				return;
			}
		}
		
		this.objectSelected = null;
	}
	
	mouseClickDeleteMode(mouseX, mouseY) {
		for(let i = this.objects.length-1; i>=0; i--) {
			if(this.objects[i].mouseOver(mouseX, mouseY)) {
				if(this.objects[i] == this.objectEditor.object) {
					this.objectEditor.unselectObject();
				}
				this.deleteObject(this.objects[i]);
				this.mouseOverDeleteMode(mouseX, mouseY);
				break;
			}
		}
	}
	
	mouseDown(mouseX, mouseY) {
		if(this.mode == "edit") {
			this.mouseDownEditMode(mouseX, mouseY);
		}
		
	}
	
	mouseDownEditMode(mouseX, mouseY) {
		if(this.objectEditor.hasSelectedObject) {		
			this.objectEditor.mouseDown(mouseX, mouseY);
		}

		if(!this.objectEditor.isActive()) {
			for(let i = 0; i<this.objects.length; i++) {
				let hoverOver = this.objects[i].pointIntersects(mouseX, mouseY);
				if(hoverOver) {
					this.objectSelected = this.objects[i];
				}
			}
		}
	}
	
	mouseUp() {
		if(this.mode == "edit") {
			this.mouseUpEditMode();
		}
		
	}
	
	mouseUpEditMode() {
		this.objectEditor.dragMoveCircle = false;
		this.objectEditor.dragRotateCircle = false;
	}
	
	mouseExit() {
		if(this.mode == "edit") {
			this.cancelHoverDrag();
		}
		
	}
	
	cancelHoverDrag() {
		if(this.objectEditor.hasSelectedObject) {
			this.objectEditor.dragMoveCircle = false;
			this.objectEditor.hoverMoveCircle = false;
			this.objectEditor.dragRotateCircle = false;
			this.objectEditor.hoverRotateCircle = false;
			this.objectEditor.object.hover = false;
		}
		if(this.objectHovered !== null) {
			this.objectHovered.hover = false;
			this.objectHovered = null;
		}
		
	}
	
	unselectObject() {
		this.objectEditor.unselectObject();
	}

	updateFlashlights() {
		for(let i = 0; i<this.piggies.length; i++) {
			this.piggies[i].resetColor();
		}
		for(let i = 0; i<this.flashlights.length; i++) {
			this.flashlights[i].laser.updatePath(this.objects);
		}
	}
	
	drawLasers() {
		for(let i = 0; i<this.flashlights.length; i++) {
			this.flashlights[i].laser.draw();
		}
	}
}