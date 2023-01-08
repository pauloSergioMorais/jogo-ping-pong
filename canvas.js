const canvasEl = document.querySelector('canvas'),
  canvasCtx = canvasEl.getContext('2d'),
  gapX = 10

const mouse = { x: 0, y: 0 }

//campo de ping pong
const field = {
  w: window.innerWidth,
  h: window.innerHeight,
  draw: function () {
    canvasCtx.fillStyle = '#004521'
    canvasCtx.fillRect(0, 0, this.w, this.h)
  },
}
//linha do meio de campo
const fieldLine = {
  w: 15,
  h: field.h,
  draw: function () {
    //estilo de cor das linhas
    canvasCtx.fillStyle = '#ffffff'
    //linha do meio de campo
    canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
  },
}
//linha das raquetes esquerda
const leftPaddle = {
  x: gapX,
  y: 0,
  w: fieldLine.w,
  h: 200,
  _move: function () {
    this.y = mouse.y - this.h / 2
  },
  draw: function () {
    canvasCtx.fillStyle = '#ffffff'
    canvasCtx.fillRect(this.x, this.y, this.w, this.h)

    this._move()
  },
}
//linha das raquetes direita
const rightPaddle = {
  x: field.w - fieldLine.w - gapX,
  y: 0,
  w: fieldLine.w,
  h: 200,
  speed:5,
  _move: function () {
    if (this.y + this.h / 2 < ball.y + ball.r){
      this.y += this.speed
    } else {
      this.y -= this.speed
    }    
  },
  speedUp: function () {
    this.speed += 2
  },
  draw: function () {
    canvasCtx.fillStyle = '#ffffff'
    canvasCtx.fillRect(this.x, this.y, this.w, this.h)

    this._move()
  },
}
// Placar
const score = {
  human: 0,
  computer: 0,
  increaseHuman: function () {
    this.human++
  },
  increaseComputer: function () {
    this.computer++
  },
  draw: function () {
    canvasCtx.font = 'bold 72px Arial'
    canvasCtx.textAlign = 'center'
    canvasCtx.textBaseline = 'top'
    canvasCtx.fillStyle = '#2B8E5B'
    canvasCtx.fillText(this.human, field.w / 4, 50)
    canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50)
  }
}
//desenho da bolinha
const ball = {
  x: field.w / 2,
  y: field.h / 2,
  r: 20,
  //acelerar a bolinha
  speed: 5,
  directionX: 1,
  directionY: 1,
  _calcPosition: function () {
    // verificar se o jogador 1 fez um ponto (x > largura do campo)
    if (this.x > field.w - this.r - rightPaddle.w - gapX) 
      if (
        this.y + this.r > rightPaddle.y &&
        this.y - this.r < rightPaddle.y + rightPaddle.h
      ) {
        // verifica se a raquete direita está na posição y da bola
        //rebare a bola invertendo o sinal de x
        this._reverseX()
      } else {
        // pontuar jogador 1
        score.increaseHuman()
        this._pointUp()
      }
      // verificar se o jogador 2 fez um ponto (x < 0)
      if (this.x < this.r + leftPaddle.w + gapX) {
        //verifica se a raquete esquerda está na posição y da bola
        if (this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h){
          //rebate a bola invertendo o sinal de x
          this._reverseX()
        }else {
          // pontuar jogador 1
          score.increaseComputer()
          this._pointUp()
        }
      }

    //Verifica as laterais superior e inferior do campo
    if (
      (this.y - this.r < 0 && this.directionY < 0) ||
      (this.y > field.h - this.r && this.directionY > 0)
    ) {
      //rebate a bola invertendo o sinal do eixo Y
      this._reverseY()
    }
  },
  _reverseX: function () {
    // 1 * -1 = -1
    // -1 * -1 = 1
    this.directionX *= -1
  },
  _reverseY: function () {
    // 1 * -1 = -1
    // -1 * -1 = 1
    this.directionY *= -1
  },
  //aumentar a velocidade da bolinha 
  _speedUp: function () {
    this.speed += 3
  },
  //inicar a bolinha no meio do campo
  _pointUp: function () {
    this._speedUp()
    rightPaddle.speedUp()
    this.x = field.w / 2
    this.y = field.h / 2
  },
  //mover a bolinha
  _move: function () {
    this.x += this.directionX * this.speed
    this.y += this.directionY * this.speed
  },
  draw: function () {
    canvasCtx.fillStyle = '#3BC47D'
    canvasCtx.beginPath()
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
    canvasCtx.fill()
    //mover a bolinha
    this._calcPosition()
    this._move()
  }
}

function setup() {
  canvasEl.width = canvasCtx.width = field.w
  canvasEl.height = canvasCtx.height = field.h
}

function draw() {
  //campo de ping pong
  field.draw()
  //linha do meio de campo
  fieldLine.draw()
  //linha das raquetes esquerda
  leftPaddle.draw()
  //linha das raquetes direita
  rightPaddle.draw()
  // Placar
  score.draw()
  //desenho da bolinha
  ball.draw()
}

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 100 / 60)
    }
  )
})()

function main() {
  animateFrame(main)
  draw()
}

setup()
main()

canvasEl.addEventListener('mousemove', function (e) {
  mouse.x = e.pageX
  mouse.y = e.pageY
})
