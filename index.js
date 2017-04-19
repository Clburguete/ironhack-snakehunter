function Game(options) {


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
Game.prototype.start = function() {
    this.setLevel();
};

Game.prototype.setLevel = function(levelChanged) {
    if (this.level >= 10) {
        alert('Looks like we got a lazy hunter...Player 1 won!');
        this.stop();
    }
    var levelSpeed = parseInt(500 / this.level);
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
        this.clearObstacles();
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
Game.prototype.foodObstacles = function(obstacle) {
    var food = this.food;
    var isPossible = true;
    for (var i = obstacle.row - 3; i < obstacle.row + 3; i++) {
        for (var j = obstacle.col - 3; j < obstacle.col + 3; j++) {
            isPossible = false;
        }
    }
    return isPossible;
};
//generate obstacles, if minimum radius from snake & food
Game.prototype.generateObstacles = function() {
    var that = this;
    $(".cell.board").on("click", function(e) {
        var obstacleDataset = e.currentTarget.dataset;
        var snakeHead = that.snake.body[0];
        //  if ((this.food.row - obstacleDataset.row <= 4 || obstacleDataset.row - this.food.row >= 4) && (this.food.column - obstacleDataset.col <= 4 || obstacleDataset.col - this.food.column >= 4)) {

        if (that.food.row != obstacleDataset.row && that.food.column != obstacleDataset.col) {


            if (that.snake.direction == "right" || that.snake.direction == "down") {
                if (obstacleDataset.row - snakeHead.row >= 4 || obstacleDataset.col - snakeHead.column >= 4) {

                    $(e.currentTarget).addClass("obstacle");
                    that.obstacles.push({
                        row: obstacleDataset.row,
                        column: obstacleDataset.col
                    });
                }
            } else if (that.snake.direction == "left" || that.snake.direction == "up") {
                if (snakeHead.row - obstacleDataset.row >= 4 || snakeHead.column - obstacleDataset.col >= 4) {

                    $(e.currentTarget).addClass("obstacle");
                    that.obstacles.push({
                        row: obstacleDataset.row,
                        column: obstacleDataset.col
                    });
                }
            }
        }

    });

};
Game.prototype.clearObstacles = function() {
    $(".obstacle").removeClass("obstacle");
    this.obstacles = [];
};
Game.prototype.restart = function() {
    this.paintBoard();
    this.generateFood();
    this.drawFood();
    this.start();
    this.keyControls();
    this.generateObstacles();

};
Game.prototype.stop = function() {

    clearInterval(this.currentLevel);
    $(".container").remove();
    $("body").append("<div class='restart'></div>");
    $(".restart").append("<div class ='play'>PLAY AGAIN</div>");

    $(".restart").click(function() {
        location.reload();
    });

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