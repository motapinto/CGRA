
class MyInterface extends CGFinterface
{
	constructor() {
		super();
	};

	init(application) {

		super.init(application);
		this.gui = new dat.GUI();
		var obj = this;

		this.initKeys();

		this.gui.add(this.scene, 'scaleFactor',0.1, 5.0).name('Scale');
		//this.gui.add(this.scene, 'wireframe').onChange(this.scene.onWireframeChanged.bind(this.scene));
		//this.gui.add(this.scene, 'showShaderCode').name('Show Shader Code').onChange(this.scene.onShaderCodeVizChanged.bind(this.scene));
		this.gui.add(this.scene, 'displayNormals').name("Display normals"); //checkbox
		this.gui.add(this.scene, 'displayAxis').name("Display axis"); //checkbox
		this.gui.add(this.scene, 'enable_textures').name("Disable textures"); //checkbox
		this.gui.add(this.scene, 'selected_lights', this.scene.lightsIDs).name('Selected Light').onChange(this.scene.updateDayLight.bind(this.scene)); //checkbox with bind propriety

		return true;
	}

	initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui=this;
        // disable the processKeyboard function
        this.processKeyboard=function(){};
        // create a named array to store which keys are being pressed
        this.activeKeys={};
    }
       
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code]=true;
    }

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code]=false;
    }

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }
}
