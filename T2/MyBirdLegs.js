/**
* MyBirdLegs
* @constructor
* @param scene - Reference to MyScene object
*/

/*A casa deverá ter até 3 unidades de lado, colocada a menos de 8 unidades de distância da origem (de
forma a ser vísivel com a inicialização da cena).*/


class MyBirdLegs extends CGFobject { //"Unit House" with height equal to 1
    constructor(scene, dist_legs) {
        super(scene);
        this.scene = scene;
        this.dist_legs = dist_legs;

        this.leg = new MyCylinder(scene, 20, 0.5, 0.08); //scene, slices, height, radius
        this.foot = new MyPyramid(scene, 4, 0.5, 0.12);//scene, slices, height, radius
    }

    display() {

            //leg_left
            this.scene.pushMatrix();
            this.leg.display();
            this.scene.popMatrix();
            
            //foot_left
            this.scene.pushMatrix();
            this.scene.translate(0, 0.1, 0);
            this.scene.rotate(-0.65*Math.PI, 0, 0, 1);
            this.foot.display();
            this.scene.popMatrix();
            
            //leg_right
            this.scene.pushMatrix();
            this.scene.translate(0, 0, this.dist_legs);
            this.leg.display();
            this.scene.popMatrix();
            //foot_right
            this.scene.pushMatrix();
            this.scene.translate(0, 0.1, this.dist_legs);
            this.scene.rotate(-0.65*Math.PI, 0, 0, 1);
            this.foot.display();
            this.scene.popMatrix();
    }   


    enableNormalViz() {
        this.body.enableNormalViz();
    }

    disableNormalViz() {
        this.body.disableNormalViz();
    }
}