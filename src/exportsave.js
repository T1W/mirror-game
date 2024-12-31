function getLevelExport() {
	let objectExport = [];
	for(let i = 0; i<objects.length; i++) {
		objectExport.push(objects[i].exportData());
	}
	return objectExport;
}

function exportLevel() {
	document.getElementById("exportData").value = JSON.stringify(getLevelExport());
}

function importLevel() {
	let levelData;
	try {
		levelData = JSON.parse(document.getElementById("importData").value);
	} catch (error) {
		importError("Error with data format");
		console.error(error);
		return;
	}
	
	try {
		importLevelData(levelData);
	} catch (error) {
		importError("Error importing data");
		console.error(error);
		return;
	}
	
	importSuccess();
	
	updateLevel();
}

function importError(error) {
	let importStatus = document.getElementById("importStatus");
	importStatus.classList.remove("success");
	importStatus.classList.add("error");
	importStatus.textContent = error;
}

function importSuccess() {
	let importStatus = document.getElementById("importStatus");
	importStatus.classList.add("success");
	importStatus.classList.remove("error");
	importStatus.textContent = "Successfully imported";
}

function importStatusClear() {
	let importStatus = document.getElementById("importStatus");
	importStatus.classList.remove("success");
	importStatus.classList.remove("error");
	importStatus.textContent = "";
}

function importLevelData(levelData) {
	clearLevel();
	for(let i = 0; i<levelData.length; i++) {
		importObject(levelData[i]);
	}
}

function importObject(data) {
	let object;
	switch(data.type) {
		case "Interactive Object":
			object = new InteractiveObject(data.type, data.x, data.y, data.rotation, data.diagonal, data.shape);
			break;
		case "Rectangular Object":
			object = new RectangularObject(data.type, data.x, data.y, data.rotation, data.halfWidth, data.halfHeight);
			break;
		case "Circular Object":
			object = new CircularObject(data.type, data.x, data.y, data.rotation, data.radius);
			break;
		case "Flashlight":
			object = new Flashlight(data.x, data.y, data.rotation, data.isOn);
			break;
		case "Mirror":
			object = new Mirror(data.x, data.y, data.rotation, data.halfWidth, data.halfHeight);
			break;
		case "Black Box":
			object = new BlackBox(data.x, data.y, data.rotation, data.halfWidth, data.halfHeight);
			break;
		case "Colored Panel":
			object = new ColoredPanel(data.x, data.y, data.rotation, data.halfWidth, data.color, data.colorMode, data.halfHeight);
			break;
		case "Transparent Block":
			object = new TransparentBlock(data.x, data.y, data.rotation, data.halfWidth, data.halfHeight, data.refractiveIndex);
			break;
		case "Piggy":
			object = new Piggy(data.x, data.y, data.rotation, data.radius);
			break;
	}
	/* Degrees are used while creating objects, but radians are stored
	   This is to avoid unit conversion */
	object.rotate(data.rotation);
	levelEditor.addObject(object);
}