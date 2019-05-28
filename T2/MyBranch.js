/**
* MyBranch
* @constructor
* @param scene - Reference to MyScene object
* @param slices - slices of cone
* @param height - cone height
* @param radius - radius of cone base
*/

class MyBranch extends CGFobject {
    constructor(scene, slices, height, radius) {
        super(scene);
        this.scene = scene;

        this.slices = slices;
        this.radius = radius;
        this.height = height;

        //Position parameters
        this.init_x = 5;
        this.init_y = radius;
        this.init_z = 10;

        this.cilinder = new MyCylinder(scene, slices, height, radius);
        
        var brown = this.scene.hexToRgbA('#be935a');
        this.material = new CGFappearance(scene);
        this.material.setAmbient(brown[0],brown[1],brown[2], 1.0);
        this.material.setDiffuse(brown[0],brown[1],brown[2], 1.0);
        this.material.setSpecular(brown[0], brown[1], brown[2], 1.0);
        this.material.setShininess(10.0);

        this.init();
        this.initBuffers();
    }

    init() {
        this.x = this.init_x;
        this.y = this.init_y;
        this.z = this.init_z;
    }

    display() {
        this.scene.pushMatrix();
            this.material.apply();
            this.cilinder.display();
        this.scene.popMatrix();
    }
}


