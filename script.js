    // Tamanho do grid
    const gridSpace = 30;

    // Declarando variáveis
    let fallingPiece;
    let gridPieces = [];
    let lineFades = [];
    let gridWorkers = [];

    // Pontuação
    let currentScore = 0;
    let currentLevel = 0;
    let linesCleared = 0;

    // Parâmetros de tempo para o jogo
    let ticks = 0;
    let updateEvery = 15;
    let updateEveryCurrent = 15;
    let fallSpeed = gridSpace * 0.5;
    let pauseGame = false;
    let gameOver = false;

    // Definindo arestas do grid
    const gameEdgeLeft = 150;
    const gameEdgeRight = 450;

    // Definindo as cores das peças
    const colors = [
    "#dca3ff",
    "#ff90a0",
    "#80ffb4",
    "#ff7666",
    "70b3f5",
    "b2e77d",
    "ffd700",
    ];

    // Funçao de inicialização chamada no inicio
    function setup() {
    createCanvas(600, 540);

    // Inicializando peça caindo
    fallingPiece = new Piece();
    fallingPiece.resetPiece();

    //Selecionando a fonte
    textFont("Press Start 2P");
    }

    // Função de desenho chamada a cada frame
    function draw() {
    // define cores usadas no jogo
    const colorDark = "#0d0d0d";
    const colorLight = "#304550";
    const colorBackground = "#e1eeb0";

    //Define a cor de fundo
    background(colorBackground);

    // Desenha o lado direito de informação do grid
    FileList(25);
    noStroke();
    rect(gameEdgeRight, 0, 150, height);

    // Desenha o lado direito de informação do grid
    rect(0, 0, gameEdgeLeft, height);

    // Desenha o retangulo com a pontuação
    fill(colorBackground);
    rect(450, 80, 150, 70);

    //Desenha a proxima de retangulo com a proxima peça
    rect(460, 405, 130, 130);

    //Desenha o retangulo do proximo nivel
    rect(460, 210, 130, 60, 5, 5);

    //Desenha as linhas do rentangulo
    rect(460, 280, 130, 60, 5, 5);

    //Desenha linhas de pontuação
    fill(colorLight);
    rect(450, 82, 150, 20);
    rect(450, 110, 150, 4);
    rect(450, 140, 150, 4);

    //Desenha o interior do banner de pontuação
    strokeWeight(3);
    noFill();
    stroke(colorLight);
    rect(465, 65, 120, 25, 5, 5);

    ///Desenha a peça no interior do retangulo
    stroke(colorLight);
    rect(465, 410, 120, 120, 5, 5);

    //Desenha o nivel do interio do retangulo
    rect(465, 215, 120, 50, 5, 5);

    //Desenha a linha do interior do retangulo
    rect(465, 285, 120, 50, 5, 5);

    //Desenha a informaçao
    fill(25);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text("PONTOS", 525, 85);
    text("NIVEL", 525, 238);
    text("LINHAS", 525, 308);

    //Escreve as informações
    textSize(24);
    textAlign(RIGHT);
    text(currentScore, 560, 135);
    text(currentLevel, 560, 260);
    text(linesCleared, 560, 330);

    // Desenha borda do jogo
    stroke(colorDark);
    line(gameEdgeRight, 0, gameEdgeRight, height);

    //Mostra a peça caindo
    fallingPiece.show();

    //Acelera a peça caindo se a tecla para baixo for pressionada
    if (keyIsDown(DOWN_ARROW)) {
        updateEvery = 2;
    } else {
        updateEvery = updateEveryCurrent;
    }

    //Atualiza o jogo
    if (!pauseGame) {
        ticks++;
        if (ticks >= updateEvery) {
        ticks = 0;
        fallingPiece.fall(fallSpeed);
        }
    }

    //Mostra as peças no grid
    for (let i = 0; i < gridPieces.length; i++) {
        gridPieces[i].show();
    }

    //Mostra as linhas sendo apagadas
    for (let i = 0; i < lineFades.length; i++) {
        lineFades[i].show();
    }

    //processa o grid workers
    if (gridWorkers.length > 0) {
        gridWorkers[0].work();
    }

    //Explica o controles
    textAlign(CENTER);
    fill(255);
    noStroke();
    textSize(14);
    text("Controles:\n↑\n← ↓ →\n", 75, 155);
    text("Esquerda e direita:\nMove de um lado para o outro", 75, 230);
    text("Cima:\nRodar a peça", 75, 280);
    text("Baixo:\nCair mais rapido", 75, 330);
    text("R:\nReiniciar o jogo", 75, 380);

    //Mostra a tela de game over
    if (gameOver) {
        fill(colorDark);
        textSize(54);
        textAlign(CENTER);
        text("GAME OVER", 300, 270);
    }

    //....
    strokeWeight(3);
    stroke("304550");
    noFill();
    rect(0, 0, width, height);
    }

    // Função de controle de tecla
    function keyPressed() {
    if (keycode === 82) {
        //Reinicia o jogo
        resetGame();
    }
    if (!pauseGame) {
        if (keyCode === LEFT_ARROW) {
        fallingPiece.move(-1);
        } else if (keyCode === RIGHT_ARROW) {
        fallingPiece.move(RIGHT_ARROW);
        }
        if (keyCode === UP_ARROW) {
        fallingPiece.input(UP_ARROW);
        }
    }
    // if(keyCode === LEFT_ARROW){
    //     fallingPiece.move(-1);
    // } else if(keyCode === RIGHT_ARROW){
    //     fallingPiece.move(1);
    // } else if(keyCode === UP_ARROW){
    //     fallingPiece.rotate();
    // } else if(key === 'r'){
    //     restartGame();
    // } else if(key === 'p'){
    //     pauseGame = !pauseGame;
    // }
    }

    // Peça caindo
    class PlayPiece {
    constructor() {
        this.pos = createVector(0, 0);
        this.rotation = 0;
        this.nextPieceType = Math.floor(Math.random() * 7);
        this.nextPieces = [];
        this.pieceType = 0;
        this.pieces = [];
        this.orientation = [];
        this.fallen = false;
    }

    nextPiece() {
        this.nextPieceType = pseudoRandom(this.pieceType);
        this.nextPieces = [];

        const points = orientPoints(this.nextPieceType, 0);
        let xx = 525,
        yy = 490;
        if (
        this.nextPieceType !== 0 &&
        this.nextPieceType !== 3 &&
        this.nextPieceType !== 5
        ) {
        xx += gridSpace / 2;
        }

        if (this.nextPieceType == 5) {
        xx -= gridSpace / 2;
        }

        for (let i = 0; i < 4; i++) {
        this.nextPieces.push(
            new Square(
            xx + points[i][0] * gridSpace,
            yy + points[i][1] * gridSpace,
            this.nextPieceType
            )
        );
        }
    }

    //Faz a peça cair
    fall(amount) {
        if (!this.futureCollision(0, amount, this.rotation)) {
        this.addPos(0, amount);
        this.fallen = true;
        } else {
        if (!this.fallen) {
            pauseGame = true;
            gameOver = true;
        } else {
            this.commitShape();
        }
        }
    }

    //Reseta a peça atual
    resetPiece() {
        this.rotation = 0;
        this.fallen = false;
        this.pos.x = 330;
        this.pos.y = -60;

        this.pieceType = this.nextPieceType;

        this.nextPiece();
        this.newPoints();
    }

    //Gera os pontos para a peça atual
    newPoints(){
        const points = orientPoints(this.pieceType, this.rotation);
        this.orientation = points;
        this.pieces = [];

        for (let i = 0; i < points.length; i++) {
            this.pieces.push(new Square(this.pos.x + points[i][0] * gridSpace, this.pos.y + points[i][1] * gridSpace, this.pieceType));
        }
    }

    //Atualiza a posição da peça
    updatePoints() {
        if (this.pieces){
            const points = orientPoints(this.pieceType, this.rotation);
            this.orientation = points;
            for (let i = 0; i < 4; i++) {
                this.pieces[i].pos.x = this.pos.x + points[i][0] * gridSpace;
                this.pieces[i].pos.y = this.pos.y + points[i][1] * gridSpace;
            }
        }
    }

    //Adiciona uma posição offset na peça 
    addPos(x, y){
        this.pos.x += x;
        this.pos.y += y;

        if(this.pieces){
            for(let i = 0; i < 4; i++){
                this.pieces[i].pos.x += x;
                this.pieces[i].pos.y += y;
            }
        }
    }

    //Checa se tem uma colisão futura
    futureCollision(x, y, rotation){
        let xx, yy, points = 0;
        if(rotation !== this.rotation){
            points = orientPoints(this.pieceType, rotation);
        } 

        for (let i = 0; i < this.pieces.length; i++){
            if(points){
                xx = this.pos.x + points[i][0] * gridSpace;
                yy = this.pos.y + points[i][1] * gridSpace;
            }else{
                xx = this.pieces[i].pos.x + x;
                yy = this.pieces[i].pos.y + y;
            }
            if(xx < gameEdgeLeft || xx >= gameEdgeRight || yy >= height){
                return true;
            }
        }
    }
}
