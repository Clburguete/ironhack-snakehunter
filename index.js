function Game(options) {
    this.colourPalette = [{
      board: "#020104",
      snake: "#46413b",
      obstacles:"#bebab4",
      food: "#f7f7f6"
    },
    {
      board: "#020104",
      snake: "#46413b",
      obstacles:"#bebab4",
      food: "#f7f7f6"
    },
    {
      board: "#020104",
      snake: "#46413b",
      obstacles:"#bebab4",
      food: "#f7f7f6"
    },
    {
      board: "#020104",
      snake: "#46413b",
      obstacles:"#bebab4",
      food: "#f7f7f6"
    },

    ];
    this.level = 1;
    this.rows = options.rows;
    this.columns = options.columns;
    this.snake = options.snake;
    this.food = undefined;
    this.obstacles = [];
    //this.drawSnake();
    this.paintBoard();
    this.generateFood();
    this.drawFood();
    this.start();
    this.keyControls();
    this.generateObstacles();

}
Game.prototype.paintBoard = function() {
    for (var rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        for (var columnIndex = 0; columnIndex < this.columns; columnIndex++) {
            $(".container").append($("<div>")
                .addClass("cell board")
                .attr("data-row", rowIndex)
                .attr("data-col", columnIndex)
            );
        }
    }
};
Game.prototype.drawSnake = function() {
    this.snake.body.forEach(function(position, index) {
        var selector = '[data-row="' + position.row + '"][data-col="' + position.column + '"]';
        $(selector).addClass("snake");
    });
};
Game.prototype.generateFood = function() {
    do {
        this.food = {
            row: Math.floor(Math.random() * this.rows),
            column: Math.floor(Math.random() * this.columns)
        };
    } while (this.snake.foodCollisions(this.food));
};
Game.prototype.drawFood = function() {
    var selector = "[data-row='" + this.food.row + "'][data-col='" + this.food.column + "']";
    $(selector).addClass("food");
};
Game.prototype.clearFood = function() {
    $(".food").removeClass("food");
    this.food = undefined;
};
Game.prototype.start = function(){
  this.setLevel();
};
Game.prototype.setLevel = function(levelChanged) {
  if (this.level >=10) {
    alert('Looks like we got a lazy hunter...Player 1 won!');
    this.stop();
  }
  var levelSpeed = parseInt(500/this.level);
  if (!this.intervalId) {
    if (levelChanged) {
      clearInterval(this.currentLevel);
    }
    this.currentLevel = setInterval(this.update.bind(this), levelSpeed);
  }
};
Game.prototype.update = function() {
    this.snake.moveForward(this.rows, this.columns);

    if (this.snake.hasEatenFood(this.food)) {
        this.level++;
        this.setLevel(true);
        this.snake.grow();
        this.clearFood();
        this.generateFood();
        this.drawFood();
    }
    if (this.snake.collisions(this.obstacles)) {
        alert('Game Over');
        this.stop();
    }
    if (this.snake.cannibal()) {
        alert('Game Over');
        this.stop();
    }
    this.clearSnake();
    this.drawSnake();

};
Game.prototype.clearSnake = function() {
    $('.snake').removeClass('snake');
};
Game.prototype.keyControls = function() {
    $('body').on('keydown', function(e) {
        switch (e.keyCode) {
            case 38: // arrow up
                this.snake.goUp();
                break;
            case 40: // arrow down
                this.snake.goDown();
                break;
            case 37: // arrow left
                this.snake.goLeft();
                break;
            case 39: // arrow right
                this.snake.goRight();
                break;
        }
    }.bind(this));
};
//generate obstacles, if minimum radius
Game.prototype.generateObstacles = function() {
    var that = this;
    $(".cell.board").on("click", function(e) {
        var obstacleDataset = e.currentTarget.dataset;
        var snakeHead = that.snake.body[0];
        if (obstacleDataset.row - snakeHead.row >= 8 || obstacleDataset.col - snakeHead.column >= 8) {

            $(e.currentTarget).addClass("obstacle");
            that.obstacles.push({
                row: obstacleDataset.row,
                column: obstacleDataset.col
            });
        }
    });

};
Game.prototype.stop = function(){
  if (this.intervalId){
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }
};

var newGame;


$(document).ready(function() {
    var serpiente = new Snake();
    newGame = new Game({
        rows: 30,
        columns: 50,
        snake: serpiente
    });
});
