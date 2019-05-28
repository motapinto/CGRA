/**
* MyBird
* @constructor
* @param scene - Reference to MyScene object
*/

class MyCloud extends CGFobject { //"Unit House" with height equal to 1
    constructor(scene, slices, radius, stacks) {
        super(scene);

        this.scene = scene;
        this.cloud = new MyUnitCubeQuad(this.scene);

        this.size = 8;

        this.init();
    }

    init() {
        this.x = 0;
        this.y = 25;
        this.z = 0;
        //Movement var's
        this.parametric_radius = 3;
        this.mov_counter = 0;
    }

    move() {
        //basis: http://jwilson.coe.uga.edu/EMAT6680Fa06/Crumley/writeup10/Parametric.html
        //Moves trough parametric equations in a butterfly type movement circle
        this.mov_counter += ((Math.PI/1000) * this.scene.delta_time/20) * this.scene.speedFactor;

        this.x = this.parametric_radius * Math.sin(this.mov_counter)*[Math.exp(Math.cos(this.mov_counter)) - 
                 2*Math.cos(4*this.mov_counter) - Math.pow((Math.sin(this.mov_counter/12)), 5)];

        this.z = this.parametric_radius * Math.cos(this.mov_counter)*[Math.exp(Math.cos(this.mov_counter)) - 
                 2*Math.cos(4*this.mov_counter) - Math.pow((Math.sin(this.mov_counter/12)), 5)];
    }

    display() {
        //display cloud
        this.scene.pushMatrix();
            this.scene.scale(this.size, 1, this.size);
            this.cloud.display();
        this.scene.popMatrix();
    }
}