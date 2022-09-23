$("#start").click(function () {
    $("#menu").fadeToggle(40);
});

$(function () {
    $(".drag").draggable();
    $(".res").resizable();
});

var activetab = "";

$(".window").not("#taskbar").click(function () {
    $(".window").removeClass("active");
    $(".tbtab").removeClass("active");
    $(this).addClass("active");
    activetab = $(this).attr("id") + "tab";
    console.log(activetab)
    $("#" + activetab).addClass("active");
});

// Clock //

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('time-s').innerHTML =
        h + ":" + m;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

// browser //
function browserload() {
    var url = document.getElementById('browserinput').value;
    url = url.replace(/^http:\/\//, '');
    url = url.replace(/^https:\/\//, '');
    url = "https://" + url;
    document.getElementById('browserframe').src = url;
}
$("#browserinput").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        browserload();
    }
});

$('#browserclose').on("click", function () {
    $('#browser').removeClass("active");
    $('#browser').fadeOut(40);
    $('#browsertab').fadeOut(40);
});

$("#browserbtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#browser").fadeIn(40);
    $('#browser').addClass("active");
    $(".tbtab").removeClass("active");
    $("#browsertab").fadeIn(40);
    $('#browsertab').addClass("active");
});

// welcome //

$('#welcomeclose').on("click", function () {
    $('#welcome').removeClass("active");
    $('#welcome').fadeOut(40);
    $('#welcometab').fadeOut(40);
});

$("#welcomembtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#welcome").fadeIn(40);
    $('#welcome').addClass("active");
    $(".tbtab").removeClass("active");
    $("#welcometab").fadeIn(40);
    $('#welcometab').addClass("active");
});

// calc //
$('#calcclose').on("click", function () {
    $('#calc').removeClass("active");
    $('#calc').fadeOut(40);
    $('#calctab').fadeOut(40);
});

$("#calcbtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#calc").fadeIn(40);
    $('#calc').addClass("active");
    $(".tbtab").removeClass("active");
    $("#calctab").fadeIn(40);
    $('#calctab').addClass("active");
});

// apps //
$('#appsclose').on("click", function () {
    $('#apps').removeClass("active");
    $('#apps').fadeOut(40);
    $('#appstab').fadeOut(40);
});

$("#appsbtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#apps").fadeIn(40);
    $('#apps').addClass("active");
    $(".tbtab").removeClass("active");
    $("#appstab").fadeIn(40);
    $('#appstab').addClass("active");
});



// Game //
$('#snakeclose').on("click", function () {
    $('#snake').removeClass("active");
    $('#snake').fadeOut(40);
    $('#snaketab').fadeOut(40);
});

$("#snakebtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#snake").fadeIn(40);
    $('#snake').addClass("active");
    $(".tbtab").removeClass("active");
    $("#snaketab").fadeIn(40);
    $('#snaketab').addClass("active");
});



var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

var snake = {
    x: 160,
    y: 160,

    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: grid,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    maxCells: 4
};
var apple = {
    x: 192,
    y: 192
};

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
    requestAnimationFrame(loop);

    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count < 8) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // move snake by it's velocity
    snake.x += snake.dx;
    snake.y += snake.dy;

    // wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    // wrap snake position vertically on edge of screen
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // draw apple
    context.fillStyle = 'green';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // draw snake one cell at a time
    context.fillStyle = 'white';
    snake.cells.forEach(function (cell, index) {

        // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // snake ate apple
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;

            // canvas is 400x400 which is 25x25 grids 
            apple.x = getRandomInt(0, 15) * grid;
            apple.y = getRandomInt(0, 15) * grid;
        }

        // check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < snake.cells.length; i++) {

            // snake occupies same space as a body part. reset game
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;

                apple.x = getRandomInt(0, 15) * grid;
                apple.y = getRandomInt(0, 15) * grid;
            }
        }
    });
}



// listen to keyboard events to move the snake
document.addEventListener('keydown', function (e) {
    // prevent snake from backtracking on itself by checking that it's 
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)

    // left arrow key
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

btn1.onclick = function () {
    if (snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
};
btn2.onclick = function () {
    if (snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
};
btn3.onclick = function () {
    if (snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
};
btn4.onclick = function () {
    if (snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
};


// start the game
requestAnimationFrame(loop);


//audio play pause 
function aud_play_pause() {
    var myAudio = document.getElementById("player");
    if (myAudio.paused) {
        myAudio.play();
    } else {
        myAudio.pause();
    }
}
