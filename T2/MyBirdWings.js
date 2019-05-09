/**
* MyBirdWings
* @constructor
* @param scene - Reference to MyScene object
*/

/*A casa deverá ter até 3 unidades de lado, colocada a menos de 8 unidades de distância da origem (de
forma a ser vísivel com a inicialização da cena).*/


class MyBirdWings extends CGFobject { //"Unit House" with height equal to 1
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.wing_plane = new MyQuad(scene);
        this.wing_inclined = new MyTriangle(scene);
    }

    display() {

            //wing_plane left
            this.scene.pushMatrix();
            this.scene.translate(0.2, 1, 0.2);
            this.scene.rotate(-0.4*Math.PI, 1, 0, 0);
            this.wing_plane.display();
            this.scene.popMatrix();

            //wing_plane right
            this.scene.pushMatrix();
            this.scene.translate(0.2, 1, 0.8);
            this.scene.rotate(0.4*Math.PI, 1, 0, 0);
            this.wing_plane.display();
            this.scene.popMatrix();

            //wing_inclined left
            this.scene.pushMatrix();
            this.scene.translate(0.2, 1.31, -0.74);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.wing_inclined.display();
            this.scene.popMatrix();

            //wing_inclined right
            this.scene.pushMatrix();
            this.scene.translate(0.2, 1.31, 1.75);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.wing_inclined.display();
            this.scene.popMatrix();
    }


    enableNormalViz() {
        this.body.enableNormalViz();
    }

    disableNormalViz() {
        this.body.disableNormalViz();
    }
}