let placar;
let textoInicio = "Pressione Enter para Começar";

function exibirTextoInicio() {
  fill(255);
  textAlign(CENTER);
  textSize(24);
  text(textoInicio, width / 2, height / 2);
}

function keyPressed() {
  if (!jogo.rodando && keyCode === ENTER) {
    jogo.iniciar();
  }
}

class Placar {
  constructor() {
    this.pontosP1 = 0;
    this.pontosP2 = 0;
    this.tamanhoFonte = 24;
  }

  exibir() {
    textAlign(CENTER);
    textSize(this.tamanhoFonte);
    fill(255);
    text("Jogador 1: " + this.pontosP1, width / 4, this.tamanhoFonte);
    text("Jogador 2: " + this.pontosP2, (3 * width) / 4, this.tamanhoFonte);
  }

  atualizar(p) {
    if (p == 1) {
      this.pontosP1++;
    } else if (p == 2) {
      this.pontosP2++;
    }
  }
}

class Bola {
  constructor(jogo) {
    this.posicaoX = width / 2;
    this.posicaoY = height / 2;
    this.velocidadeX = random([-5, -3, 3, 5]);
    this.velocidadeY = random([-5, -3, 3, 5]);
    this.diametro = 20;
    this.jogo = jogo;
  }

  centralizar() {
    this.posicaoX = width / 2;
    this.posicaoY = height / 2;
  }

  desenhar() {
    circle(this.posicaoX, this.posicaoY, this.diametro);
  }

  movimentar() {
    this.posicaoX += this.velocidadeX;
    this.posicaoY += this.velocidadeY;
  }

  checarBordas() {
      if (this.posicaoX - this.diametro / 2 <= 0) {
        this.jogo.parar();
        this.jogo.pontuar(2);
        jogo.rodando = false; 
      } else if (this.posicaoX + this.diametro / 2 >= width) {
        this.jogo.parar();
        this.jogo.pontuar(1);
        jogo.rodando = false;
      }

    if (this.posicaoY - this.diametro / 2 <= 0) {
      this.velocidadeY *= -1;
    }
    if (this.posicaoY + this.diametro / 2 >= height) {
      this.velocidadeY *= -1;
    }
  }
  checarColisaoPlayer(jogador) {
    this.ymenor = jogador.posicaoY;
    this.ymaior = jogador.posicaoY + jogador.altura;

    if (jogador.id == 1) {
      this.xreferencia = jogador.posicaoX + jogador.largura;

      if (
        this.posicaoX - this.diametro / 2 <= this.xreferencia &&
        this.posicaoX - this.diametro / 2 > 0
      ) {
        if (this.posicaoY >= this.ymenor && this.posicaoY <= this.ymaior) {
          this.velocidadeX *= -1;
        }
      }
    } else if (jogador.id == 2) {
      this.xreferencia = jogador.posicaoX;

      if (
        this.posicaoX + this.diametro / 2 >= this.xreferencia &&
        this.posicaoX < width
      ) {
        if (this.posicaoY >= this.ymenor && this.posicaoY <= this.ymaior) {
          this.velocidadeX *= -1;
        }
      }
    }
  }
}

class Jogador {
  constructor(tipoJ) {
    this.id = tipoJ;
    this.altura = 60;
    this.largura = 20;

    if (this.id == 1) {
      this.posicaoX = 0;
    } else if (this.id == 2) {
      this.posicaoX = width - this.largura;
    }
    this.posicaoY = height / 2;
    this.velocidadeY = 10;
  }

  movimentar() {
    if (this.id == 1) {
      if (keyIsDown(SHIFT)) {
        if (this.posicaoY > 0) {
          this.posicaoY -= this.velocidadeY;
        } else {
          this.posicaoY = 0;
        }
      }
      if (keyIsDown(CONTROL)) {
        this.posicaoY += this.velocidadeY;
        if (this.posicaoY + this.altura > height) {
          this.posicaoY = height - this.altura;
        }
      }
    } else if (this.id == 2) {
      if (keyIsDown(UP_ARROW)) {
        if (this.posicaoY > 0) {
          this.posicaoY -= this.velocidadeY;
        } else {
          this.posicaoY = 0;
        }
      }
      if (keyIsDown(DOWN_ARROW)) {
        this.posicaoY += this.velocidadeY;
        if (this.posicaoY + this.altura > height) {
          this.posicaoY = height - this.altura;
        }
      }
    }
  }

  desenhar() {
    rect(this.posicaoX, this.posicaoY, this.largura, this.altura);
  }
}

class Jogo {
  constructor() {
    this.rodando = false;
    this.pontosP1 = 0;
    this.pontosP2 = 0;
  }

  parar() {
    this.rodando = false;
  }

  iniciar() {
    this.bola.centralizar();
    this.zerarPontos();
    this.rodando = true;
  }

  pontuar(p) {
    if (p == 1) {
      this.pontosP1++;
      placar.atualizar(1); 
    } else if (p == 2) {
      this.pontosP2++;
      placar.atualizar(2); 
    }
    print("Pontos p1:" + this.pontosP1 + " /Pontos p2:" + this.pontosP2);
  }

  zerarPontos() {
    this.pontosP1 = this.pontosP2 = 0;
  }

  setarBola(bola) {
    this.bola = bola;
  }
}



function setup() {
  createCanvas(1000, 1000);
  jogo = new Jogo();
  bola1 = new Bola(jogo);
  jogador1 = new Jogador(1);
  jogador2 = new Jogador(2);

  jogo.setarBola(bola1);

  placar = new Placar();
}

function draw() {
  background(0, 0, 255);

  placar.exibir();

  jogador1.desenhar();
  jogador2.desenhar();

  if (jogo.rodando == true) {
    bola1.desenhar();
    bola1.movimentar();
    bola1.checarBordas();
    jogador1.movimentar();
    jogador2.movimentar();
    bola1.checarColisaoPlayer(jogador1);
    bola1.checarColisaoPlayer(jogador2);
  } else {
    exibirTextoInicio();
  } 
  }

