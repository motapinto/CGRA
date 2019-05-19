/**
* MyScene
* @constructor
*/

const FRAME_RATE = 60;


class MyScene extends CGFscene {
    constructor() {
        super();

        //this.wireframe = false;
		//this.showShaderCode = false;
        this.selected_lights = 0;
        this.displayAxis = true;
        this.displayNormals = false;
        this.enable_textures = true;
        this.scaleFactor = 1.0;
    }

    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();

        //Background color
        this.gl.clearColor(47/255, 136/255, 213/255, 1.0);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);

        //generate x and z coords for LSPLants
        this.plant_x = [];
        this.plant_z = [];
        for(var i = 0 ; i < 5; i++) {
            this.plant_x[i] = Math.floor((Math.random() * -12) -8); //between 1-10
            this.plant_z[i] = Math.floor((Math.random() * -7) + -0); //between 1-10
        }
        
        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.bird = new MyBird(this, 'bird_face.jpg', 'escamas.jpg', 'wings.jpg', 'eyes.jpg', 'eyes.jpg', 'tail.jpg', 'legs.jpg');
        this.cubemap = new MyCubeMap(this, this.selected_lights, 'day_cubemap.png', 'night_cubemap.png');
        this.house = new MyHouse(this, 4, 8, 'wall.jpg', 'roof.jpg', 'pillar.jpg', 'door.png', 'window.png');
        this.terrain = new MyTerrain(this, 60, 'terrain.jpg', 'heightmap.png', 'altimetry.png'); //scene, z_length, x_length, texture, heightmap, altimetry
        this.lightning = new MyLightning(this);
        this.LSPlant = new MyLSPlant(this);

        //Lights
        this.lights = [this.lights[0], this.lights[1], this.lights[2]];
        this.lightsIDs = { 'Day': 0, 'Night': 1};    
        
        //Time
        this.last_time = 0;
        this.setUpdatePeriod(FRAME_RATE);

    }

    initCameras() {
        this.camera = new CGFcamera(1, 1, 100, vec3.fromValues(25, 15, 29), vec3.fromValues(12, 7, 12));
    }

    initLights() {
        this.setGlobalAmbientLight(0.4, 0.4, 0.4, 1.0);
        
        this.sun_color = this.hexToRgbA('#F3C25F');
        this.lights[0].setPosition(10, 10, 10, 1.0);
        this.lights[0].setDiffuse(this.sun_color[0], this.sun_color[1], this.sun_color[2], 1.0);
        this.lights[0].setSpecular(this.sun_color[0], this.sun_color[1], this.sun_color[2], 1.0);
        this.lights[0].setLinearAttenuation(0.1);
        this.lights[0].enable();
        this.lights[0].setVisible(false);
        this.lights[0].update();

        this.night1_color = this.hexToRgbA('#314C5D');
        this.lights[1].setPosition(10, 10, 10, 1.0);
        this.lights[1].setDiffuse(this.night1_color[0], this.night1_color[1], this.night1_color[2], 1.0);
        this.lights[1].setSpecular(this.night1_color[0], this.night1_color[1], this.night1_color[2], 1.0);
        this.lights[1].setLinearAttenuation(0.1);
        this.lights[1].enable();
        this.lights[1].setVisible(false);
        this.lights[1].update();

        this.night2_color = this.hexToRgbA('#aa5a17');
        this.lights[2].setPosition(8, 2.5, 10, 1.0);
        this.lights[2].setDiffuse(this.night2_color[0], this.night2_color[1], this.night2_color[2], 1.0);
        this.lights[2].setSpecular(this.night2_color[0], this.night2_color[1], this.night2_color[2], 1.0);
        this.lights[2].setLinearAttenuation(0.1);
        this.lights[2].enable();
        this.lights[2].setVisible(false);
        this.lights[2].update();
    }
    
    hexToRgbA(hex)
    {
        var ret;
        //either we receive a html/css color or a RGB vector
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            ret=[
                parseInt(hex.substring(1,3),16).toPrecision()/255.0,
                parseInt(hex.substring(3,5),16).toPrecision()/255.0,
                parseInt(hex.substring(5,7),16).toPrecision()/255.0,
                1.0
            ];
        }
        else
            ret=[
                hex[0].toPrecision()/255.0,
                hex[1].toPrecision()/255.0,
                hex[2].toPrecision()/255.0,
                1.0
            ];
        return ret;
    }

    update(t){
        var delta_time = t - this.last_time; //deltaT
        this.last_time = t; //current time
        this.checkKeys(delta_time);

        //onde faco esta animacao(aqui ou no display do bird?)
        //this.bird.animate(delta_time); //2) animation without keys input
    }

    checkKeys(delta_time) {
        var text="Keys pressed: ";
        var keysPressed = false;

        // Check for key codes e.g. in https://keycode.info/

        if (this.gui.isKeyPressed("KeyW")) {
            text += " W ";
            keysPressed = true;
            this.bird.accelerate("W", delta_time);
        }

        else if (this.gui.isKeyPressed("KeyS")) {
            text += " S ";
            keysPressed = true;
            this.bird.accelerate("S", delta_time);
        } 

        if (this.gui.isKeyPressed("KeyA")) {
            text += " A ";
            keysPressed = true;
            this.bird.turn("A");
        } 

        else if (this.gui.isKeyPressed("KeyD")) {
            text += " D ";
            keysPressed = true;
            this.bird.turn("D");
        } 

        if(this.gui.isKeyPressed("KeyL")) {
            text += " L ";
            keysPressed = true;
            this.lightning.startAnimation();
        }

        if(this.gui.isKeyPressed("")) {
            keysPressed = false;
            this.bird.accelerate("", delta_time);
        }

        if (keysPressed) {
            console.log(text);
        }
        
        this.bird.update(delta_time);
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    updateDayLight(){
        if(this.selected_lights == 1) {
            this.lights[1].update();
        }
        else
            this.lights[0].update();
    }

    display() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.updateProjectionMatrix();
        this.loadIdentity();
        this.applyViewMatrix();
        this.scale(this.scaleFactor,this.scaleFactor,this.scaleFactor);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);

        //Apply default appearance
        this.setDefaultAppearance();

        //Lights management
        for(var i = 0; i <= 2; i++) {
            if(i == this.selected_lights)
                this.lights[i].enable();
            else
                this.lights[i].disable();
            
             if(this.selected_lights == 1) {
                this.lights[2].enable();
                this.cubemap.day_value = 1; 
             }
             else 
                this.cubemap.day_value = 0;

            this.lights[i].update();
       }

        // Draw axis
        if(this.displayAxis) {
            this.axis.display();
        }
        

        if (this.displayNormals) {
            this.house.enableNormalViz();
            this.bird.enableNormalViz();
        }

        else {
            this.house.disableNormalViz();
            this.bird.disableNormalViz();
        }

        if(this.enable_textures) {
            this.enableTextures(true);
        }

        else {
            this.enableTextures(false);
        }

        //LSPlants
        for(var i = 0 ; i < 5; i++) {
            this.pushMatrix();
            this.translate(this.plant_x[i], 3.6, this.plant_z[i]);
            this.scale(2, 2, 2);
            //this.LSPlant.doGenerate(); //
            this.LSPlant.display();
            this.popMatrix();
        }
        
        this.pushMatrix();
        this.translate(0, 5, 0);
        this.scale(0.7, 0.7, 0.7);
        this.bird.display();
        this.popMatrix();
        
        this.cubemap.display();
        this.house.display();
        this.lightning.display();

        this.pushMatrix();
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.scale(60, 60, 60);
		this.terrain.display();
		this.popMatrix();
        // ---- END Primitive drawing section
    }
}