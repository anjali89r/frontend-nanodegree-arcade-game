// Enemies our player must avoid
var Enemy = function(xAxis, yAxis) {
    this.sprite = 'images/enemy-bug.png';
    this.x= xAxis;
    this.y = yAxis;
    this.speed =  Math.floor((Math.random() * 130)) + 100;
};

//update enemy's position. dt is the time delta between ticks
Enemy.prototype.update = function(dt) {
    // multiplying any movement by the dt parameter
    // ensures the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 505) {
        this.x = 0;
        this.speed =  Math.floor((Math.random() * 100)) + 100;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Score class - increases by 100 if the player reaches on water, decreases by 50 when collided by bug
var Score = function() {
    this.x = 400;
    this.y = 580;
    this.score = 0;
}
 //referred from mdn docs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText
Score.prototype.render = function() {
    ctx.font = '30px serif';
    ctx.fillStyle = '#FFEB3B';
    ctx.textAlign = 'right';
    ctx.fillText('Score: ' + this.score, this.x, this.y);
};
let score = new Score();

//Player class
var Player = function(playerXaxis, playerYaxis) {
    this.sprite = 'images/char-boy.png';
    this.x = playerXaxis;
    this.y = playerYaxis;
}

//method implemented for detecting collision by checking the difference between the distance of the player and bug: hyp2 = x2 + y2
Player.prototype.collisionDetection = function(enemyBug) {
    let xAxisDiff = enemyBug.x - this.x;
    let yAxisDiff = enemyBug.y - this.y;
    let distanceDiff = Math.sqrt((xAxisDiff * xAxisDiff) + (yAxisDiff * yAxisDiff));
    if (distanceDiff < 50) {
        return true;
    }
    else {
        return false;
    }
}
//reset method brings back the player to its starting position
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 405;
}

//method to see if player collided with any of the enemies and reducing the score
Player.prototype.checkCollission = function() {
    for (let enemy of allEnemies) {
        if (this.collisionDetection(enemy)) {
            this.y = 405;
            score.score -= 50;
            return true;
        }
    }
}

//check for collission to update
Player.prototype.update = function() {
    this.checkCollission();
}
//method for moving player as per the keyPress.
Player.prototype.handleInput = function (keyPress) {

    if (keyPress === 'left' && this.x > 0) {
        this.x -= 101;
    }

    if (keyPress === 'right' && this.x < 400) {
        this.x += 101;
    }

    if (keyPress === 'up' && this.y > -10) {
        this.y -= 83;
    }

    if (keyPress === 'down' && this.y < 405) {
        this.y += 83;
    }
//player reaches on top of water increases score by 100
    if (this.y <= -10) {
        score.score += 100;
        let actualThis = this;
        setTimeout(function () {
            actualThis.reset();
            score.score = 0;
        }, 900);

    }
    if (this.y > 430) {
            this.reset();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiating objects.

let enemyOne = new Enemy(((Math.random() * 275) + 45), 140);
let enemyTwo = new Enemy(((Math.random() * 140) + 35), 220);
let enemyThree = new Enemy(((Math.random() * 315) + 15), 300);
let enemyFour = new Enemy(((Math.random() * 215) + 25), 70);
let allEnemies = [enemyOne, enemyTwo, enemyThree, enemyFour];
let player = new Player(200, 405);


// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
