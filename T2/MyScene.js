/**
* MyScene
* @constructor
*/

const FRAME_RATE = 60;

class MyScene extends CGFscene {
    constructor() {
        super();

        this.displayNormals = false;
        this.selected_lights = 0;
        this.displayAxis = true;
        this.scaleFactor = 1.0;
        this.speedFactor = 1.0;
    }

    init(application) {
        super.init(application);
        this.initCameras();

        //Background color
        this.gl.clearColor(1, 1, 1, 1.0);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);

        //yellow material -> for lightning
        var yellow = this.hexToRgbA('#FFFF00');
        this.material = new CGFappearance(this);
        this.material.setAmbient(yellow[0], yellow[1], yellow[2], 1.0);
        this.material.setDiffuse(yellow[0], yellow[1], yellow[2], 1.0);
        this.material.setSpecular(yellow[0], yellow[1], yellow[2], 1.0);
		this.material.setShininess(10.0);

        //LSPlants
        this.LSPlant = new MyLSPlant(this);
        this.plants_axiom = [];
        this.num_plants = 6;

        for(let i = 0 ; i < this.num_plants; i++) {
            this.plants_axiom[i] = this.LSPlant.axiom;
            this.LSPlant.axiom = "X";
            this.LSPlant.iterate();
        }

        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.tree_branch = new MyBranch(this, 20, 2, 0.15);
        this.bird = new MyBird(this, 'bird_face.jpg', 'escamas.jpg', 'wings.jpg', 'eyes.jpg', 'eyes.jpg', 'tail.jpg', 'legs.jpg', undefined);
        this.cubemap = new MyCubeMap(this, 60, this.selected_lights, 'day_cubemap.png', 'night_cubemap.png');
        this.house = new MyHouse(this, 4, 8, 'wall.jpg', 'roof.jpg', 'pillar.jpg', 'door.png', 'window.png');
        this.lightning = new MyLightning(this);
        this.cloud = new MyCloud(this, 20, 2, 10);
        this.river = new MyRiver(this, 5, 'waterTex.jpg', 'waterMap.jpg');
        this.terrain = new MyTerrain(this, 60, 'terrain.jpg', 'heightmap.png', 'altimetry.png'); //scene, z_length, x_length, texture, heightmap, altimetry

        //Lights var's
        this.lights = [this.lights[0], this.lights[1], this.lights[2]];
        this.lightsIDs = { 'Day': 0, 'Night': 1};  
        
        //Time var's
        this.last_time = Date.now(); //num of ms
        this.delta_time = 0;
        this.total_time = 0;
        this.update_period = 50; // can be changed
        this.setUpdatePeriod(this.update_period);

        this.initLights();
    }

    initCameras() {
        this.camera = new CGFcamera(1, 1, 200, vec3.fromValues(40, 80, 40), vec3.fromValues(12, 7, 12));
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

        let lightning_color = this.hexToRgbA('#ffffff');
        this.lights[2].setAmbient(lightning_color[0], lightning_color[1], lightning_color[2], 1.0);
        this.lights[2].setDiffuse(lightning_color[0], lightning_color[1], lightning_color[2], 1.0);
        this.lights[2].setSpecular(lightning_color[0], lightning_color[1], lightning_color[2], 1.0);
        this.lights[2].setLinearAttenuation(0.1);
        this.lights[2].disable();
        this.lights[2].setVisible(false);
        this.lights[2].update();
    }
    
    hexToRgbA(hex) {
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
        //deltaT in each call to update method
        this.delta_time = t - this.last_time;
        //updates last_time to current time
        this.last_time = t; 
        //store total_time 
        this.total_time += this.delta_time;
        //check for keys input
        this.checkKeys(t); 
        //Updates birds coordinates 
        this.bird.update(t);
        //tries to pick a tree branch
        if(this.bird.to_pick) {
            this.bird.pick();
        }     
        //tries to drop tree branch
        if(this.bird.to_drop) {
            this.bird.drop();
        }
        //Moves cloud
        this.cloud.move();   
        //updates Lightning depth
        if(this.lightning.draw) {
            this.lightning.update(t);
        }
        this.river.update(t);
    }

    checkKeys(t) {
        // Check for key codes e.g. in https://keycode.info/

        if (this.gui.isKeyPressed("KeyW")) {
            this.bird.accelerate("W");
        }

        else if (this.gui.isKeyPressed("KeyS")) {
            this.bird.accelerate("S");
        } 

        if (this.gui.isKeyPressed("KeyA")) {
            this.bird.turn("A");
        } 

        else if (this.gui.isKeyPressed("KeyD")) {
            this.bird.turn("D");
        } 

        if (this.gui.isKeyPressed("KeyR")) {
            this.bird.init();
        } 

        if(this.gui.isKeyPressed("KeyP")) {
            //"activate" function bird.pick() or bird.drop() both called in update of MyScene
            if(this.bird.branch == undefined) {
                this.bird.to_pick = true;
            }
    
            else {
                this.bird.to_drop = true;
            }
            //starts descending
            this.bird.descending = true;
        }

        if(!this.lightning.draw && this.gui.isKeyPressed("KeyL")) {
            this.lightning.startAnimation(t);
            this.lightning.axiom = "X";
            this.lightning.iterate();
        }
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
        
        this.lights[2].update();
    }

    display() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.updateProjectionMatrix();
        this.loadIdentity();
        this.applyViewMatrix();
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        //Apply default appearance
        this.setDefaultAppearance();

        //Lights management
        for(var i = 0; i < 2; i++) {
            if(i == this.selected_lights)
                this.lights[i].enable();
            else
                this.lights[i].disable();
            
             if(this.selected_lights == 1) 
                this.cubemap.day_value = 1;             
             else 
                this.cubemap.day_value = 0;
            
            this.lights[i].update();
       }

        // Show axis checkbox
        if(this.displayAxis) {
            this.axis.display();
        }
        
        //Show normals checkbox
        if (this.displayNormals) {
            this.house.enableNormalViz();
            this.bird.enableNormalViz();
        }
        else {
            this.house.disableNormalViz();
            this.bird.disableNormalViz();
        }

        //show LSPlants 
        for(var i = 0 ; i < 2; i++) {
            for(var j = 0; j < 3; j++) {
                this.pushMatrix();
                    this.translate(4*i-18, 0, 3*j-5-2*i);
                    this.scale(2, 2, 2);
                    this.LSPlant.axiom = this.plants_axiom[i+j] ;
                    this.LSPlant.display();
                this.popMatrix();
            }
        }
        
        //Show bird and changes to bird coordinates based on movement methods
        this.pushMatrix();
            this.translate(this.bird.x, this.bird.y , this.bird.z);
            this.rotate(-this.bird.direction_angle, 0, 1, 0);
            this.scale(0.8, 0.8, 0.8);
            this.scale(this.scaleFactor,this.scaleFactor,this.scaleFactor);
            this.bird.display();
        this.popMatrix();

        //Show terrain
        this.pushMatrix();
            this.translate(0, -4.7, 0);
            this.rotate(-Math.PI/2, 1, 0, 0);
            this.terrain.display();
        this.popMatrix();
        
        //Displays cubemap
        this.pushMatrix();
            this.translate(-30, 0, -30);
            //this.cubemap.display();
        this.popMatrix();

        this.pushMatrix();
            this.translate(12, 0, -7);
            this.house.display();
        this.popMatrix();

        this.pushMatrix();
            this.scale(50, 1, 50)
            this.translate(0, -3.1, 0);
            this.rotate(-Math.PI/2, 1, 0, 0);
            this.river.display();
        this.popMatrix();

        //Draws branch when it is not with the bird
        if(this.bird.branch == undefined) {
            this.pushMatrix();
                this.translate(this.tree_branch.x, this.tree_branch.y, this.tree_branch.z);
                this.rotate(-Math.PI/2, 1, 0, 0);
                this.tree_branch.display();
            this.popMatrix();
        }
        
        //Draws a cloud and moves it accordingly to it's move method
        this.pushMatrix();
            this.lights[2].setPosition(this.cloud.x + this.cloud.size/2, this.cloud.y-this.cloud.size/2, this.cloud.z + this.cloud.size/2 - 1, 1.0);
            this.translate(this.cloud.x, this.cloud.y, this.cloud.z);
            this.cloud.display();
        this.popMatrix();

        //Lightning display based on cloud position
        if(this.lightning.draw) {
            this.pushMatrix();
                this.lights[2].enable();
                this.lights[2].update();
                this.material.apply();
                this.translate(this.cloud.x + this.cloud.size/2, this.cloud.y, this.cloud.z + this.cloud.size/2);
                this.rotate(Math.PI, 1, 0, 0);
                this.scale(1, 0.5, 1);
                this.lightning.display();
            this.popMatrix();
        }
        else {
            this.lights[2].disable();
            this.lights[2].update();
        }
        // ---- END Primitive drawing section
    }
}
