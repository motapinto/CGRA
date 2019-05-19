/**
* MyLightning
* @constructor
* @param scene - Reference to MyScene 
* @param LSsystem - Reference to MyLSystem 
*/

class MyLightning extends MyLSystem {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        //auxiliar variables
        this.init_time = 0; 
        this.delta_time = 0;
        this.depth = 0;

        //Modelação Procedimental
        this.axiom = "X";
        this.ruleF = "FF";
        this.ruleX = "F[-X][X]F[-X]+FX";
        this.ruleX1 = "F[-X][X]F[-X]+X" //produção estotástica -> gera lightning diferente a cada generate
        this.LSangle = 25.0;
        this.LSiter = 3;
        this.LSscaleFactor = 0.5;

        //cria o lexico da gramática
        this.initGrammar()

        //inicializada função generate de MyLSystem
        //generate(_axiom, _productions, _angle, _iterations, _scale){
        this.doGenerate = function () {
            this.generate(
                this.axiom,
                {
                    "F": [ this.ruleF ],
                    "X": [  this.rule ]
                }, 
                this.LSangle,
                this.LSiter,
                this.LSscaleFactor
            );
        }

        this.doGenerate(); //gera o novo lightning estocastico

        this.initBuffers();
    }
/*
 *  Crie um método update de MyLightning que em função do tempo decorrido desde o início do
 *  relâmpago (ver ponto seguinte) e do comprimento da sequência defina o número de segmentos
 *  a serem mostrados (depth). ???
 */
    update(t) {        
        this.depth ++; // a cada chamada a função update do MyLightning depth aumenta e mostra mais um segmento (ver ciclo for em display)
    }
/*
 *  Crie um método startAnimation(t) na classe MyLightning que recrie 
 *  o relâmpago (invocando o método iterate() de MyLSystem), 
 *  armazene o tempo de início da animação e inicialize depth.
 */
    startAnimation(t) {
        this.init_time = t;
        this.depth = 0;
        this.LSsystem.iterate();
    }

/*
 *  Crie a função display() em MyLightning, que poderá ser copiado de MyLSystem. Altere esta
 *  função para que ao processar a sequência, só seja feito display das primitivas caso a
 */ 
    display(){
        this.update();
        
        this.scene.pushMatrix();
        this.scene.scale(this.scale, this.scale, this.scale);

        // percorre a cadeia de caracteres -> até this.scale
        for (var i=0; i < this.depth && i < this.axiom.length; ++i){

            // verifica se sao caracteres especiais
            switch(this.axiom[i]){
                case "+":
                    // roda a esquerda
                    this.scene.rotate(this.angle, 0, 0, 1);
                    break;

                case "-":
                    // roda a direita
                    this.scene.rotate(-this.angle, 0, 0, 1);
                    break;

                case "[":
                    // push
                    this.scene.pushMatrix();
                    break;

                case "]":
                    // pop
                    this.scene.popMatrix();
                    break;
                
                case "\\" :
                    //rotação em sentido positivo sobre o eixo dos XX;
                    this.scene.rotate(this.angle, 1, 0, 0);
                
                case "/" :
                    //rotação em sentido negativo sobre o eixo dos XX;
                    this.scene.rotate(-this.angle, 1, 0, 0);
                
                case "^" :
                    //rotação em sentido positivo sobre o eixo dos YY;
                    this.scene.rotate(this.angle, 0, 1, 0);
                
                case "&" :
                    //rotação em sentido negativo sobre o eixo dos YY
                    this.scene.rotate(-this.angle, 1, 0, 0);

                // processa primitiva definida na gramatica, se existir
                default:
                    var primitive=this.grammar[this.axiom[i]];

                    if ( primitive )
                    {
                        primitive.display();
                        this.scene.translate(0, 1, 0);
                    }
                    break;
            }
        }

        this.scene.popMatrix();
    }
}


