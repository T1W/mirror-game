

class Controller {
	
	constructor() {
		this.keysDown = {};
		this.mouseButtonsDown = {"Mouse1": false, "Mouse2": false, "Mouse3": false, "Mouse4": false, "Mouse5": false};
		this.controls = {
			"Select": "Mouse1",
			"Drag": "Mouse1",
			"AddMode": "1",
			"EditMode": "2",
			"DeleteMode": "3",
			"RotateCCW": "q",
			"RotateCW": "e",
			"RotateCCW45": "Q",
			"RotateCW45": "E",
			"Align45Degrees": "r",
			"ChangeProperty1": "l",
			"ChangeProperty2": "k",
			"ChangeProperty1Back": "L",
			"ChangeProperty2Back": "K",
			"IncreaseHeight": "w",
			"IncreaseWidth": "d",
			"DecreaseHeight": "s",
			"DecreaseWidth": "a",
			"MoveLeft": "ArrowLeft",
			"MoveUp": "ArrowUp",
			"MoveRight": "ArrowRight",
			"MoveDown": "ArrowDown",
			"ToggleDragDelete": "D",
		};
	}
	
	checkForDuplicates(control, key) {
		for (let [name, key1] of Object.entries(this.controls)) {
			if(key == key1) {
				if(control == "Drag" && name == "Select" ||
				control == "Select" && name == "Drag") {
					continue;
				}
				return true;
			}
		}
		return false;
	}
	
	setKey(control, key) {
		this.controls[control] = key;
	}
	
	keyDown(key) {
		this.keysDown[key] = true;
		this.controlEvent(key);
	}
	
	keyUp(key) {
		this.keysDown[key] = false;
	}
	
	controlEvent(key) {
		if(key == this.controls["AddMode"]) {
			switchMode("add");
		}
		
		if(key == this.controls["EditMode"]) {
			switchMode("edit");
		}
		
		if(key == this.controls["DeleteMode"]) {
			switchMode("delete");
		}
		
		if(key == this.controls["Align45Degrees"]) {
			levelEditor.alignObject45Degrees();
		}
		
		if(key == this.controls["RotateCCW45"]) {
			levelEditor.rotateObjectBy(-Math.PI/4);
		}
		
		if(key == this.controls["RotateCW45"]) {
			levelEditor.rotateObjectBy(Math.PI/4);
		}
		
		if(key == this.controls["IncreaseHeight"]) {
			levelEditor.resizeObjectBy(0, 5);
		}
		
		if(key == this.controls["IncreaseWidth"]) {
			levelEditor.resizeObjectBy(5, 0);
		}
		
		if(key == this.controls["DecreaseHeight"]) {
			levelEditor.resizeObjectBy(0, -5);
		}
		
		if(key == this.controls["DecreaseWidth"]) {
			levelEditor.resizeObjectBy(-5, 0);
		}
		
		if(key == this.controls["ChangeProperty1"]) {
			levelEditor.toggleProperty(0, 1);
			draw = true;
		}
		
		if(key == this.controls["ChangeProperty1Back"]) {
			levelEditor.toggleProperty(0, -1);
			draw = true;
		}
		
		if(key == this.controls["ChangeProperty2"]) {
			levelEditor.toggleProperty(1, 1);
			draw = true;
		}
		
		if(key == this.controls["ChangeProperty2Back"]) {
			levelEditor.toggleProperty(1, -1);
			draw = true;
		}
		
		if(key == this.controls["ToggleDragDelete"]) {
			levelEditor.toggleDragDelete();
		}
	}
	
	updateKeysDown() {
		if(this.keysDown[this.controls["RotateCCW"]]) {
			levelEditor.rotateObjectBy(-Math.PI/180);
		}
		if(this.keysDown[this.controls["RotateCW"]]) {
			levelEditor.rotateObjectBy(Math.PI/180);
		}
	}
	
	translateMouse(event) {
		let number;
		switch (event.button) {
			case 0:
				number = 1;
				break;
			case 1:
				number = 3;
				break;
			case 2:
				number = 2;
				break;
			case 3:
				number = 4;
				break;
			case 4:
				number = 5;
				break;
		}
		
		let translatedMouse = "Mouse" + number;
		if(event.shiftKey) {
			translatedMouse += "Shift+";
		}
		
		return translatedMouse;
	}
}