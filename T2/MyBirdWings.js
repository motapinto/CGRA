/**
* MyBirdWings
* @constructor
* @param scene - Reference to MyScene object
*/

class MyBirdWings extends CGFobject { 
    constructor(scene) {
        super(scene);

        //Attributes
        this.scene = scene;
        this.rot_wings = 0;
        this.rot_wings_ang = (20*Math.PI)/180;
        
        //Objects
        this.wing_left = new MyWings(scene);
        this.wing_right = new MyWings(scene);
    }

    //Wings method that rotates wings
    update(t) {
        let speed_factor = (this.scene.bird.speed / this.scene.bird.max_speed) / 2;
        this.rot_wings = Math.sin(((t/1000 * Math.PI)+Math.PI))/2;
    }

    display() {            
        this.scene.pushMatrix();
            this.scene.translate(0.85, 1.25, 0.8);
            this.scene.rotate(Math.PI/8, 0, 0, 1);
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.scene.rotate(this.rot_wings, 0, 0, 1);
            this.wing_left.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(0, 1, 0.15);
            this.scene.rotate(Math.PI/8, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.rotate(this.rot_wings, 0, 0, 1);
            this.wing_right.display();
        this.scene.popMatrix();
    }

    enableNormalViz() {
        this.wing_left.enableNormalViz();
        this.wing_right.enableNormalViz();
    }

    disableNormalViz() {
        this.wing_left.disableNormalViz();
        this.wing_right.disableNormalViz();
    }
}