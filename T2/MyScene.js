/**
* MyScene
* @constructor
*/
class MyScene extends CGFscene {
    constructor() {
        super();
    }
    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);
        this.setUpdatePeriod(50);

        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.plane = new Plane(this, 32);
        this.house = new MyHouse(this, 4, 6, 'wall.jpg', 'roof.jpg', 'pillar.jpg', 'door.png', 'window.png'); //constructor(scene, roof_slices, pillar_slices, wall_img, roof_img, pillar_img, door_img, windows_img)
        this.bird = new MyBird(this);

        //Objects connected to MyInterface
        this.scaleFactor = 1.0;
        this.displayNormals = false;
        this.displayAxis = true;
        
        //Other var's
        this.time_val = 0;
    }

    checkKeys(time_var) {
        var text="Keys pressed: ";
        var keysPressed = false;
        // Check for key codes e.g. in https://keycode.info/
        if (this.gui.isKeyPressed("KeyW")) {
            text += " W ";
            keysPressed = true;
            
            this.bird.update_pos("W", time_var);
        }

        if (this.gui.isKeyPressed("KeyS")) {
            text += " S ";
            keysPressed = true;

            this.bird.update_pos("S", time_var);
        }

        else {
            this.bird.update_pos("NULL", time_var);
        }

        if (keysPressed)
            console.log(text);
    }

    update(t){
        var time_var = t - this.time_val; //deltaT
        this.time_val = t; //current time
        
        this.checkKeys(time_var);
    }
        
    initLights() {
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(45, 45, 45), vec3.fromValues(0, 0, 0));
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    display() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.updateProjectionMatrix();
        this.loadIdentity();
        this.applyViewMatrix();

        this.scale(this.scaleFactor,this.scaleFactor,this.scaleFactor);

        // Draw axis
        if(this.displayAxis)
            this.axis.display();
        
        //Apply default appearance
        this.setDefaultAppearance();

        if (this.displayNormals) {
            this.house.enableNormalViz();
        }

        else {
            this.house.disableNormalViz();
        }

        this.pushMatrix();
        this.translate(0, 5, 0);
        this.scale(0.7, 0.7, 0.7);
        this.bird.display();
        this.popMatrix();

        this.pushMatrix();
        //this.house.display();
        this.popMatrix();

        this.pushMatrix();
        this.plane.terrain_text.apply();
        this.rotate(-0.5*Math.PI, 1, 0, 0);
        this.scale(60, 60, 1);
        this.plane.display();
        this.popMatrix();
        // ---- END Primitive drawing section
    }
}