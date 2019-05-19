/**
* MyBird
* @constructor
* @param scene - Reference to MyScene object
*/

class MyBird extends CGFobject { //"Unit House" with height equal to 1
    constructor(scene, face_text, body_text, wings_text, nose_text, eyes_text, tail_text, legs_text) {
        super(scene);
        
        this.scene = scene;
        this.face_text = face_text;
        this.body_text = body_text;
        this.wings_text = wings_text;
        this.nose_text = nose_text;
        this.eyes_text = eyes_text;
        this.tail_text = tail_text;
        this.legs_text = legs_text;

        this.face = new MySemiSphere(scene, 20, 0.6, 5); //scene, slices, radius, stacks
        this.body = new MyPrism(scene, 10, 1, 0.4); //scene, slices, height, radius
        this.wings = new MyBirdWings(scene);
        this.nose = new MyPyramid(scene, 4, 1, 1); //scene, slices, height, radius
        this.eyes = new MyUnitCubeQuad(scene, eyes_text, body_text, body_text);
        this.tail = new MyBirdTail(scene, 4);
        this.legs = new MyBirdLegs(scene, 0.5);

        //Initial position
        this.x = -20;
        this.y = 10;
        this.z = 10;
        //speed parameters
        this.speed = 0;
        this.min_speed = -0.04;
        this.max_speed = 0.04;
        this.acceleration = 0.0000005;
        //direction parameters
        this.direction_angle = 0;
        this.turn_speed = 0.2; //constant
        this.ar_resistance = 0.2; //???how to use real physics model
        this.angle_change = (5*Math.PI) / 180; //5º (degrees)
        this.down = false;

        this.setTextures();
    }

    //Sets bird textures and materials
    setTextures() {
        this.face_material = new CGFappearance(this.scene);
        this.face_material.setAmbient(0.8,0.8,0.8, 1.0);
        this.face_material.setDiffuse(0.65,0.65,0.65, 1.0);
        this.face_material.setSpecular(0.2,0.2, 0.2, 1.0);
        this.face_material.setShininess(10.0);
        this.face_material.loadTexture('images/' + this.face_text);
        this.face_material.setTextureWrap('REPEAT', 'REPEAT');

        this.body_material = new CGFappearance(this.scene);
        this.body_material.setAmbient(0.8,0.8,0.8, 1.0);
        this.body_material.setDiffuse(0.65,0.65,0.65, 1.0);
        this.body_material.setSpecular(0.2,0.2, 0.2, 1.0);
        this.body_material.setShininess(10.0);
        this.body_material.loadTexture('images/' + this.body_text);
        this.body_material.setTextureWrap('REPEAT', 'REPEAT');

        this.wings_material = new CGFappearance(this.scene);
        this.wings_material.setAmbient(0.7,0.7,0.7, 1.0);
        this.wings_material.setDiffuse(0.55,0.55,0.55, 1.0);
        this.wings_material.setSpecular(0.4,0.4,0.4, 1.0);
        this.wings_material.setShininess(10.0);
        this.wings_material.loadTexture('images/' + this.wings_text);
        this.wings_material.setTextureWrap('REPEAT', 'REPEAT');

        var nose_color = this.hexToRgbA('#F0CB11');
        this.nose_material = new CGFappearance(this.scene);
        this.nose_material.setAmbient(nose_color[0],nose_color[1],nose_color[2], 1.0);
        this.nose_material.setDiffuse(nose_color[0],nose_color[1],nose_color[2], 1.0);
        this.nose_material.setSpecular(nose_color[0], nose_color[1], nose_color[2], 1.0);
        this.nose_material.setShininess(10.0);
    }

    //Changes bird speed
    accelerate(key, delta_time) {
        if(key == "W") {
            this.speed += this.speed + this.acceleration * delta_time; //v = v0 + at
            if(this.speed > this.max_speed)
                this.speed = this.max_speed;

        }

        else if(key == "S") {
            this.speed += this.speed - this.acceleration * delta_time; //v = v0 - at
            if(this.speed < this.min_speed)
                this.speed = this.min_speed;
        }

        else {
            this.speed = 0;
        }
    }

    //Changes bird direction angle
    turn(key) {    
        if(key == "A") {
            this.direction_angle += this.angle_change;
        }

        else if(key == "D") {
            this.direction_angle -= this.angle_change; 
        }
    }

    //Updates birds coordinates - usar mateizes rotacao !?
    update(delta_time) {
        this.x += this.speed*Math.cos(delta_time)*delta_time + 0.5*this.acceleration*delta_time*delta_time; //x = x0 + v0t + 0.5*a*t^2
        this.z += this.speed*Math.sin(delta_time)*delta_time + 0.5*this.acceleration*delta_time*delta_time;//z = z0 + v0t + 0.5*a*t^2
        
        //basic animation without movement (up and down) and wing movement (2)
        // if(this.down) {
        //     this.down = false;
        //     this.y -= 1;
        // }
        // else {
        //     this.down = true;
        //     this.y += 1
        // }

        //checking for limits
        if(this.x >= 30) //inverter se chegar limites
            this.x = 30;
        else if(this.x <= -30)
            this.x = -30;
        if(this.z >= 30)
            this.z = 30;
        else if(this.z <= -30)
            this.z = -30;
    }

    complete_anim(delta_time) {
        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(this.direction_angle, 0, 1, 0);//está mal
    }

    display() {
        //move and rotate method and basic animation (ex 2 and 3)
        this.complete_anim(this.delta_time);

        //face
        this.scene.pushMatrix();
        this.face_material.apply();
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
        this.face.enableNormalViz();
        this.body.enableNormalViz();
        this.wings.enableNormalViz();
        this.nose.enableNormalViz();
        this.eyes.enableNormalViz();
        this.tail.enableNormalViz();
        this.legs.enableNormalViz();
    }

    disableNormalViz() {
        this.face.disableNormalViz();
        this.body.disableNormalViz();
        this.wings.disableNormalViz();
        this.nose.disableNormalViz();
        this.eyes.disableNormalViz();
        this.tail.disableNormalViz();
        this.legs.disableNormalViz();
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