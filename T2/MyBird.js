/**
* MyBird
* @constructor
* @param scene - Reference to MyScene object
*/

/*A casa deverá ter até 3 unidades de lado, colocada a menos de 8 unidades de distância da origem (de
forma a ser vísivel com a inicialização da cena).*/


class MyBird extends CGFobject { //"Unit House" with height equal to 1
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.face = new MySemiSphere(scene, 20, 0.6, 5); //scene, slices, radius, stacks
        this.body = new MyPrism(scene, 10, 1, 0.4); //scene, slices, height, radius
        this.wings = new MyBirdWings(scene);
        this.nose = new MyPyramid(scene, 4, 1, 1); //scene, slices, height, radius
        this.eyes = new MyUnitCubeQuad(scene, 'eyes.jpg', 'escamas.jpg', 'escamas.jpg');
        this.tail = new MyBirdTail(scene, 4);
        this.legs = new MyBirdLegs(scene, 0.5);

        this.x = 0;
        this.y = 0;
        this.z = 3;

        this.speed = 0;
        this.min_speed = -0.04;
        this.max_speed = 0.04;
        this.acceleration = 0.000000005;

        this.face_material = new CGFappearance(scene);
        this.face_material.setAmbient(0.8,0.8,0.8, 1.0);
        this.face_material.setDiffuse(0.65,0.65,0.65, 1.0);
        this.face_material.setSpecular(0.2,0.2, 0.2, 1.0);
        this.face_material.setShininess(10.0);
        this.face_material.loadTexture('images/escamas.jpg');
        this.face_material.setTextureWrap('REPEAT', 'REPEAT');

        this.body_material = new CGFappearance(scene);
        this.body_material.setAmbient(0.8,0.8,0.8, 1.0);
        this.body_material.setDiffuse(0.65,0.65,0.65, 1.0);
        this.body_material.setSpecular(0.2,0.2, 0.2, 1.0);
        this.body_material.setShininess(10.0);
        this.body_material.loadTexture('images/escamas.jpg');
        this.body_material.setTextureWrap('REPEAT', 'REPEAT');

        this.wings_material = new CGFappearance(scene);
        this.wings_material.setAmbient(0.7,0.7,0.7, 1.0);
        this.wings_material.setDiffuse(0.55,0.55,0.55, 1.0);
        this.wings_material.setSpecular(0.4,0.4,0.4, 1.0);
        this.wings_material.setShininess(10.0);
        this.wings_material.loadTexture('images/wings.jpg');
        this.wings_material.setTextureWrap('REPEAT', 'REPEAT');

        var nose_color = this.hexToRgbA('#F0CB11');
        this.nose_material = new CGFappearance(scene);
        this.nose_material.setAmbient(nose_color[0],nose_color[1],nose_color[2], 1.0);
        this.nose_material.setDiffuse(nose_color[0],nose_color[1],nose_color[2], 1.0);
        this.nose_material.setSpecular(nose_color[0], nose_color[1], nose_color[2], 1.0);
        this.nose_material.setShininess(10.0);

    }

    update_pos(direction, time_var) {
        if(direction == "W") {
            this.speed += this.speed + this.acceleration * time_var; //v = v0 + at
            if(this.speed > this.max_speed)
                this.speed = this.max_speed;

        }
        else if(direction == "S") {
            this.speed += this.speed - this.acceleration * time_var; //v = v0 - at
            if(this.speed < this.min_speed)
                this.speed = this.min_speed;
        }
        else {
            this.speed = 0;
        }

        this.x += this.speed*time_var + 0.5*this.acceleration*time_var; //x = x0 + v0t + 0.5*a*t^2
        this.z += this.speed*time_var + 0.5*this.acceleration*time_var;//z = z0 + v0t + 0.5*a*t^2

        if(this.x >= 30)
            this.x = 30;
        else if(this.x <= -30)
            this.x = -30;
        if(this.z >= 30)
            this.z = 30;
        else if(this.z <= -30)
            this.z = -30;
    }

    move() {
        if(this.speed != 0)
            this.scene.translate(this.x, 0, this.y);
    }

    display() {
        //move method
        this.move();

        //face
        this.scene.pushMatrix();
        this.body_material.apply();
        this.scene.translate(1.5, 1.1, 0.5);
        this.scene.scale(2, 1, 1);
        this.scene.rotate(0.15*Math.PI, 0, 0, 1);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.face.display();
        this.scene.popMatrix();

        //body
        this.scene.pushMatrix();
        this.body_material.apply();
        this.scene.translate(0, 0.35, 0.5);
        this.scene.rotate(-0.35*Math.PI, 0, 0, 1);
        this.scene.scale(1, 1.8, 1);
        this.body.display();
        this.scene.popMatrix();

        //wings
        this.scene.pushMatrix();
        this.wings_material.apply();
        this.scene.translate(0.3, -0.4, 0);
        this.scene.rotate(0.15*Math.PI, 0, 0, 1);
        this.wings.display();
        this.scene.popMatrix();

        //eyes
        this.scene.pushMatrix();
        this.scene.translate(1.9, 1.1, 0.15);
        this.scene.scale(0.3, 0.3, 0.1);
        this.eyes.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.9, 1.1, 0.75);
        this.scene.scale(0.3, 0.3, 0.1);
        this.eyes.display();
        this.scene.popMatrix();
        
        //nose
        this.scene.pushMatrix();
        this.nose_material.apply();
        this.scene.translate(2.6, 1.25, 0.5);
        this.scene.scale(0.14, 0.14, 0.14);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.nose.display();
        this.scene.popMatrix();
        
        //tail
        this.scene.pushMatrix();
        this.body_material.apply();
        this.scene.translate(-0.8, 0, 0.5);
        this.scene.scale(1, 1, 0.8);
        this.tail.display();
        this.scene.popMatrix();

        //legs
        this.scene.pushMatrix();
        this.scene.translate(0.3, -0.4, 0.2);
        this.scene.scale(1.3, 1.3, 1.3);
        this.legs.display();
        this.scene.popMatrix();
    }

    enableNormalViz() {
        this.body.enableNormalViz();
        this.wings.enableNormalViz();
        this.nose.enableNormalViz();
        this.eyes.enableNormalViz();
        this.tail.enableNormalViz();
    }

    disableNormalViz() {
        this.body.disableNormalViz();
        this.wings.disableNormalViz();
        this.nose.disableNormalViz();
        this.eyes.disableNormalViz();
        this.tail.disableNormalViz();
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
}